/*
 * autoplay - making a muted background video actually play, or saying why not.
 *
 * WHAT THIS MODULE IS FOR
 * This page carries eight full screen 4K videos, muted, looping, that must
 * start on their own as the visitor scrolls. Chrome and Firefox start them
 * without being asked twice. WebKit does not, and the rejected promise
 * returned by play() is the ONLY place it ever says so: no error event, no
 * console warning, paused stays true and the frame stays frozen. A page that
 * calls play() and moves on shows a still image to an entire platform without
 * ever knowing it. This module turns that silence into a state the rest of the
 * application can read and act on.
 *
 * The WebKit policies every answer here is built on - what the permission
 * requires, why a user gesture is the only key and why it only turns inside
 * the handler's own call stack, why a hidden tab is not a refusal - live in
 * the `auto-start-video-on-webkit` skill. That skill is the source of truth for the
 * browser behaviour, this file only implements it.
 *
 * THE API
 *   createAutoplay({ onBlockedChange })          -> controller
 *   controller.prepare(element)                  -> muted and inline, before the source
 *   controller.ensurePlaying(element, onReport)  -> session, retries until it plays
 *   controller.isBlocked()                       -> true while the browser refuses
 *   controller.destroy()                         -> stops every session, removes every listener
 *   session.stop() / session.getReport()         -> both idempotent
 * prepare() sets the attribute reflections React never sets, so call it before
 * the source is attached. Every attempt calls it again, because attaching a
 * source is exactly when the element can be reset under us.
 * ensurePlaying is idempotent per element: a second call re-attempts on the
 * session already in place instead of stacking a second set of listeners.
 * Call stop() before pausing an element on purpose, otherwise the pause event
 * reads as an interruption and is answered with a retry.
 *
 * WHAT COUNTS AS AN ANSWER
 * A resolved play() is not proof of playback. The playing event is: it alone
 * confirms the state, clears the blocked flag and resets the attempt budget.
 * AbortError is not a failure but hls.js attaching, detaching or switching a
 * source, so it is ignored and the media events of the new source drive the
 * next attempt. NotAllowedError becomes "blocked" and arms the gesture unlock.
 * Anything else becomes "failed".
 * Nothing is attempted while the page is hidden: visibilitychange makes that
 * attempt later, and pageshow covers the iOS back-forward cache.
 *
 * NO TIMERS
 * Every retry is triggered by a real event: canplay and loadeddata (the media
 * became playable), pause (something took playback away), visibilitychange,
 * pageshow, a user gesture. Buffer starvation (stalled, waiting) is
 * deliberately not one: replaying an empty buffer changes nothing, the
 * streaming layer owns that. Media-event retries are capped by
 * MAX_ATTEMPTS_WITHOUT_PROGRESS between two confirmed playing events, so an
 * element the browser keeps pausing cannot spin. A gesture or a return to the
 * foreground is new information rather than a blind retry, so it always
 * attempts and resets the budget.
 *
 * THE INVARIANT
 * No amount of retrying starts a video WebKit has decided not to start, and
 * this module never pretends otherwise. What it guarantees is that the refusal
 * is never silent: the state becomes "blocked", onBlockedChange(true) fires,
 * and the application owes the visitor a visible affordance whose tap doubles
 * as the gesture that unlocks every video on the page.
 */

export type AutoplayState =
  "idle" | "starting" | "playing" | "blocked" | "failed";

export type AutoplayReport = {
  state: AutoplayState;
  // DOMException name when the browser said no, null otherwise.
  reason: string | null;
  attempts: number;
};

export type AutoplaySession = {
  stop: () => void;
  getReport: () => AutoplayReport;
};

export type AutoplayController = {
  prepare: (element: HTMLVideoElement) => void;
  ensurePlaying: (
    element: HTMLVideoElement,
    onReport?: (report: AutoplayReport) => void,
  ) => AutoplaySession;
  isBlocked: () => boolean;
  destroy: () => void;
};

// Three attempts that never reach `playing` mean the refusal is structural,
// not transient: further media events would only spin.
const MAX_ATTEMPTS_WITHOUT_PROGRESS = 3;

const MEDIA_RETRY_EVENTS = ["canplay", "loadeddata", "pause"] as const;
const GESTURE_EVENTS = ["pointerdown", "touchend", "keydown"] as const;
// Capture phase: a handler that stops propagation must not be able to hide the
// one gesture that unlocks the page. Passive because nothing here is cancelled.
const GESTURE_LISTENER_OPTIONS = { capture: true, passive: true } as const;

type InternalSession = {
  element: HTMLVideoElement;
  onReport?: (report: AutoplayReport) => void;
  state: AutoplayState;
  reason: string | null;
  attempts: number;
  attemptsSinceProgress: number;
  stopped: boolean;
  detachMediaListeners: () => void;
};

const documentOrNull = () =>
  typeof document === "undefined" ? null : document;
const windowOrNull = () => (typeof window === "undefined" ? null : window);
const isPageHidden = () => documentOrNull()?.visibilityState === "hidden";

const errorName = (error: unknown) =>
  error instanceof Error ? error.name : String(error);

const prepareElement = (element: HTMLVideoElement) => {
  element.muted = true;
  element.defaultMuted = true; // the attribute reflection, re-read on every source attach
  element.playsInline = true;
  element.setAttribute("webkit-playsinline", ""); // legacy iOS WebViews read this one
  element.autoplay = true;
};

const snapshot = (session: InternalSession): AutoplayReport => ({
  state: session.state,
  reason: session.reason,
  attempts: session.attempts,
});

export const createAutoplay = ({
  onBlockedChange,
}: {
  onBlockedChange?: (blocked: boolean) => void;
} = {}): AutoplayController => {
  const sessions = new Map<HTMLVideoElement, InternalSession>();
  let blocked = false;
  let gestureArmed = false;
  let globalListenersAttached = false;

  const setBlocked = (next: boolean) => {
    if (blocked === next) return;
    blocked = next;
    onBlockedChange?.(next);
  };

  const setState = (
    session: InternalSession,
    state: AutoplayState,
    reason: string | null = null,
  ) => {
    if (session.state === state && session.reason === reason) return;
    session.state = state;
    session.reason = reason;
    session.onReport?.(snapshot(session));
  };

  const confirmPlaying = (session: InternalSession) => {
    session.attemptsSinceProgress = 0;
    setState(session, "playing");
    setBlocked(false);
  };

  const handleAccepted = (session: InternalSession) => {
    // A resolved promise says the request was accepted, not that frames move.
    // Only an element already unpaused can be claimed here; otherwise the
    // `playing` event remains the confirmation.
    if (!session.stopped && !session.element.paused) confirmPlaying(session);
  };

  const handleRejected = (session: InternalSession, error: unknown) => {
    if (session.stopped) return;
    const name = errorName(error);
    if (name === "AbortError") return;
    if (name !== "NotAllowedError") {
      setState(session, "failed", name);
      return;
    }
    armGestureUnlock();
    setBlocked(true);
    setState(session, "blocked", name);
  };

  const attemptPlay = (session: InternalSession) => {
    if (session.stopped || isPageHidden()) return;
    if (!session.element.paused) return;
    session.attempts += 1;
    session.attemptsSinceProgress += 1;
    prepareElement(session.element);
    setState(session, "starting");
    // No readiness gate: play() on an element without data is a pending
    // request the browser honours as soon as it can buffer, whereas waiting
    // for canplay widens the window in which a user activation expires.
    const started: Promise<void> | undefined = session.element.play();
    // Pre-promise play() (some in-app WebViews): media events are then the
    // only confirmation available.
    if (!started) return;
    void started.then(
      () => handleAccepted(session),
      (error: unknown) => handleRejected(session, error),
    );
  };

  const retryFromMediaEvent = (session: InternalSession) => {
    if (session.attemptsSinceProgress >= MAX_ATTEMPTS_WITHOUT_PROGRESS) return;
    attemptPlay(session);
  };

  const retryFromUserSignal = (session: InternalSession) => {
    session.attemptsSinceProgress = 0;
    attemptPlay(session);
  };

  const retryEverySession = () => {
    for (const session of sessions.values()) retryFromUserSignal(session);
  };

  const onForeground = () => {
    if (isPageHidden()) return;
    retryEverySession();
  };

  // The next three are `function` declarations because they form a cycle:
  // arming needs the handler, the handler disarms, and handleRejected above
  // reaches the arming.
  function onGesture() {
    disarmGestureUnlock();
    // Inline, no await above this line: WebKit only honours a play() made
    // inside the gesture's own call stack.
    retryEverySession();
  }

  function armGestureUnlock() {
    const doc = documentOrNull();
    if (!doc || gestureArmed) return;
    gestureArmed = true;
    for (const type of GESTURE_EVENTS) {
      doc.addEventListener(type, onGesture, GESTURE_LISTENER_OPTIONS);
    }
  }

  function disarmGestureUnlock() {
    const doc = documentOrNull();
    if (!doc || !gestureArmed) return;
    gestureArmed = false;
    for (const type of GESTURE_EVENTS) {
      doc.removeEventListener(type, onGesture, GESTURE_LISTENER_OPTIONS);
    }
  }

  const attachGlobalListeners = () => {
    if (globalListenersAttached) return;
    globalListenersAttached = true;
    documentOrNull()?.addEventListener("visibilitychange", onForeground);
    windowOrNull()?.addEventListener("pageshow", onForeground);
  };

  const detachGlobalListeners = () => {
    if (!globalListenersAttached) return;
    globalListenersAttached = false;
    documentOrNull()?.removeEventListener("visibilitychange", onForeground);
    windowOrNull()?.removeEventListener("pageshow", onForeground);
    disarmGestureUnlock();
  };

  const attachMediaListeners = (session: InternalSession) => {
    const { element } = session;
    const onPlaying = () => confirmPlaying(session);
    const onRetry = () => retryFromMediaEvent(session);
    const onError = () =>
      setState(session, "failed", `MediaError:${element.error?.code ?? 0}`);
    element.addEventListener("playing", onPlaying);
    element.addEventListener("error", onError);
    for (const type of MEDIA_RETRY_EVENTS)
      element.addEventListener(type, onRetry);
    session.detachMediaListeners = () => {
      element.removeEventListener("playing", onPlaying);
      element.removeEventListener("error", onError);
      for (const type of MEDIA_RETRY_EVENTS) {
        element.removeEventListener(type, onRetry);
      }
    };
  };

  const stopSession = (session: InternalSession) => {
    if (session.stopped) return;
    session.stopped = true;
    session.detachMediaListeners();
    sessions.delete(session.element);
    if (sessions.size === 0) detachGlobalListeners();
  };

  const sessionHandle = (session: InternalSession): AutoplaySession => ({
    stop: () => stopSession(session),
    getReport: () => snapshot(session),
  });

  const startSession = (
    element: HTMLVideoElement,
    onReport?: (report: AutoplayReport) => void,
  ) => {
    const session: InternalSession = {
      element,
      onReport,
      state: "idle",
      reason: null,
      attempts: 0,
      attemptsSinceProgress: 0,
      stopped: false,
      detachMediaListeners: () => {},
    };
    sessions.set(element, session);
    attachMediaListeners(session);
    attachGlobalListeners();
    attemptPlay(session);
    return session;
  };

  return {
    prepare: prepareElement,

    ensurePlaying(element, onReport) {
      const existing = sessions.get(element);
      if (!existing) return sessionHandle(startSession(element, onReport));
      // The caller that asked last is the one listening.
      if (onReport) existing.onReport = onReport;
      attemptPlay(existing);
      return sessionHandle(existing);
    },

    isBlocked: () => blocked,

    destroy() {
      for (const session of [...sessions.values()]) stopSession(session);
      detachGlobalListeners();
    },
  };
};
