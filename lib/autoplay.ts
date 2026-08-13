/*
 * autoplay - making a muted background video actually play, or saying why not.
 *
 * THE PROBLEM
 * This page carries eight full screen 4K videos, muted, looping, that must
 * start on their own as the visitor scrolls. Chrome and Firefox start them
 * without being asked twice. WebKit does not, and the rejected promise
 * returned by play() is the ONLY place it ever says so: no error event, no
 * console warning, paused stays true and the frame stays frozen. A page that
 * calls play() and moves on shows a still image to an entire platform without
 * ever knowing it. This module turns that silence into a state the rest of the
 * application can read and act on.
 *
 * THE POLICIES, AND WHY EACH ANSWER WORKS
 *
 * 1. Muted and inline are conditions of the permission, not decorations.
 *    WebKit grants unattended playback to an element that is muted AND inline
 *    when it evaluates the request, and it re-evaluates on every source
 *    attach. React sets the muted PROPERTY and never the attribute, so an
 *    element re-read from its attributes can come back unmuted. prepare() sets
 *    defaultMuted, which IS the attribute reflection, plus playsInline and the
 *    legacy webkit-playsinline that in-app WebViews still read. Call it before
 *    the source is attached; every attempt calls it again, because attaching a
 *    source is exactly when the element can be reset under us.
 *
 * 2. Low Power Mode blocks everything, muted video included.
 *    Nothing exposes it to script. The refusal arrives as a rejected promise
 *    named NotAllowedError, identical to the per-site "Auto-Play: Never"
 *    setting of Safari on macOS. Both get the same answer, because WebKit
 *    itself makes no distinction: a user gesture. See 4.
 *
 * 3. A hidden tab is not a refusal, it is a "not now".
 *    Safari does not start playback in a background tab and pauses it when the
 *    device locks. Calling play() there spends an attempt and can report a
 *    refusal that is not one, so an attempt made while the page is hidden is
 *    not made at all: visibilitychange makes it. That same listener is what
 *    restarts a video the lock screen paused, and pageshow covers the iOS
 *    back-forward cache, which restores a page with its video paused.
 *
 * 4. A gesture is the only key, and it turns only while the hand is on it.
 *    WebKit carries the user activation through the SYNCHRONOUS call stack of
 *    the handler. Await anything first and the activation is gone, so the
 *    gesture handler here calls play() inline, with no promise in between, on
 *    every waiting element at once: one tap anywhere unlocks the whole page.
 *    Those listeners are armed only after a NotAllowedError has actually been
 *    seen, so a page the browser never refused pays nothing for them.
 *
 * 5. AbortError is normal, not a failure.
 *    "The play() request was interrupted by a new load request" is what hls.js
 *    attaching, detaching or switching a source looks like from here. It is
 *    ignored: the media events of the new source drive the next attempt.
 *
 * 6. play() resolving is not proof of playback.
 *    The playing event is. It alone confirms the state, clears the blocked
 *    flag and resets the attempt budget.
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
 * THE API
 *   createAutoplay({ onBlockedChange })          -> controller
 *   controller.prepare(element)                  -> muted and inline, before the source
 *   controller.ensurePlaying(element, onReport)  -> session, retries until it plays
 *   controller.isBlocked()                       -> true while the browser refuses
 *   controller.destroy()                         -> stops every session, removes every listener
 *   session.stop() / session.getReport()         -> both idempotent
 * ensurePlaying is idempotent per element: a second call re-attempts on the
 * session already in place instead of stacking a second set of listeners.
 * Call stop() before pausing an element on purpose, otherwise the pause event
 * reads as an interruption and is answered with a retry.
 *
 * WHAT REMAINS IRREDUCIBLE
 * No amount of retrying starts a video WebKit has decided not to start. Low
 * Power Mode and "Auto-Play: Never" are user decisions and the only key is a
 * gesture this library cannot fabricate. What it does guarantee is that the
 * refusal is never silent: the state becomes "blocked", onBlockedChange(true)
 * fires, and the application owes the visitor a visible affordance whose tap
 * doubles as the gesture that unlocks every video on the page. Nor is there
 * any way to learn WHY the browser refused: NotAllowedError is all WebKit ever
 * says.
 */

export type AutoplayState =
  | "idle"
  | "starting"
  | "playing"
  | "blocked"
  | "failed";

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
