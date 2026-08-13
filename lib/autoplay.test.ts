import { afterEach, describe, expect, it, vi } from "vitest";
import { type AutoplayReport, createAutoplay } from "./autoplay";

// Vitest runs in jsdom, whose HTMLVideoElement has no playback engine at all:
// play() is "not implemented". The unit under test is the decision logic, so a
// fake element that can reject on demand and replay events is both enough and
// more honest than a half-real one.
const createFakeVideo = () => {
  const listeners = new Map<string, Set<() => void>>();
  let playOutcome: () => Promise<void> = () => Promise.resolve();

  const fake = {
    paused: true,
    muted: false,
    defaultMuted: false,
    playsInline: false,
    autoplay: false,
    error: null,
    playCallCount: 0,
    attributes: new Map<string, string>(),

    play() {
      fake.playCallCount += 1;
      return playOutcome();
    },
    setAttribute(name: string, value: string) {
      fake.attributes.set(name, value);
    },
    addEventListener(type: string, listener: () => void) {
      const set = listeners.get(type) ?? new Set<() => void>();
      set.add(listener);
      listeners.set(type, set);
    },
    removeEventListener(type: string, listener: () => void) {
      listeners.get(type)?.delete(listener);
    },

    // ---- test helpers, not part of the element surface
    rejectPlayWith(name: string) {
      const error = new Error(`${name} (fake)`);
      error.name = name;
      playOutcome = () => Promise.reject(error);
    },
    resolvePlay() {
      playOutcome = () => Promise.resolve();
    },
    dispatch(type: string) {
      for (const listener of [...(listeners.get(type) ?? [])]) listener();
    },
    listenerCount() {
      let total = 0;
      for (const set of listeners.values()) total += set.size;
      return total;
    },
  };
  return fake;
};

type FakeVideo = ReturnType<typeof createFakeVideo>;

const asElement = (fake: FakeVideo) => fake as unknown as HTMLVideoElement;

// Three microtask turns: play() rejects on the first, the library's handler
// runs on the second, and any state it emits settles on the third.
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

const hidePage = () => {
  const spy = vi.spyOn(document, "visibilityState", "get");
  spy.mockReturnValue("hidden");
  return () => spy.mockReturnValue("visible");
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createAutoplay", () => {
  it("asks for playback right away and confirms only on the playing event", async () => {
    const video = createFakeVideo();
    const reports: AutoplayReport[] = [];
    const autoplay = createAutoplay();

    const session = autoplay.ensurePlaying(asElement(video), (report) =>
      reports.push(report),
    );
    await flush();

    expect(video.playCallCount).toBe(1);
    expect(session.getReport().state).toBe("starting");

    video.paused = false;
    video.dispatch("playing");
    expect(session.getReport()).toEqual({
      state: "playing",
      reason: null,
      attempts: 1,
    });
    expect(reports.map((report) => report.state)).toEqual([
      "starting",
      "playing",
    ]);
    autoplay.destroy();
  });

  it("forces muted and inline before every attempt", () => {
    const video = createFakeVideo();
    const autoplay = createAutoplay();

    autoplay.ensurePlaying(asElement(video));

    expect(video.muted).toBe(true);
    expect(video.defaultMuted).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(video.attributes.get("webkit-playsinline")).toBe("");
    autoplay.destroy();
  });
});

describe("play() rejection handling", () => {
  it("reports NotAllowedError as blocked and unblocks on a user gesture", async () => {
    const video = createFakeVideo();
    video.rejectPlayWith("NotAllowedError");
    const blockedChanges: boolean[] = [];
    const autoplay = createAutoplay({
      onBlockedChange: (blocked) => blockedChanges.push(blocked),
    });

    const session = autoplay.ensurePlaying(asElement(video));
    await flush();

    expect(session.getReport()).toEqual({
      state: "blocked",
      reason: "NotAllowedError",
      attempts: 1,
    });
    expect(autoplay.isBlocked()).toBe(true);
    expect(blockedChanges).toEqual([true]);

    video.resolvePlay();
    document.dispatchEvent(new Event("pointerdown"));
    await flush();

    expect(video.playCallCount).toBe(2);
    video.paused = false;
    video.dispatch("playing");
    expect(autoplay.isBlocked()).toBe(false);
    expect(blockedChanges).toEqual([true, false]);
    autoplay.destroy();
  });

  it("ignores AbortError, arms no gesture listener and retries on the next canplay", async () => {
    const video = createFakeVideo();
    video.rejectPlayWith("AbortError");
    const documentListener = vi.spyOn(document, "addEventListener");
    const autoplay = createAutoplay();

    const session = autoplay.ensurePlaying(asElement(video));
    await flush();

    expect(session.getReport().state).toBe("starting");
    expect(autoplay.isBlocked()).toBe(false);
    expect(documentListener.mock.calls.map(([type]) => type)).not.toContain(
      "pointerdown",
    );

    video.resolvePlay();
    video.dispatch("canplay");
    expect(video.playCallCount).toBe(2);
    autoplay.destroy();
  });

  it("reports any other rejection as failed without arming a gesture", async () => {
    const video = createFakeVideo();
    video.rejectPlayWith("NotSupportedError");
    const documentListener = vi.spyOn(document, "addEventListener");
    const autoplay = createAutoplay();

    const session = autoplay.ensurePlaying(asElement(video));
    await flush();

    expect(session.getReport()).toEqual({
      state: "failed",
      reason: "NotSupportedError",
      attempts: 1,
    });
    expect(autoplay.isBlocked()).toBe(false);
    expect(documentListener.mock.calls.map(([type]) => type)).not.toContain(
      "pointerdown",
    );
    autoplay.destroy();
  });
});

describe("retry triggers", () => {
  it("makes no attempt while the page is hidden and catches up on visibilitychange", () => {
    const showPage = hidePage();
    const video = createFakeVideo();
    const autoplay = createAutoplay();

    autoplay.ensurePlaying(asElement(video));
    expect(video.playCallCount).toBe(0);

    showPage();
    document.dispatchEvent(new Event("visibilitychange"));
    expect(video.playCallCount).toBe(1);
    autoplay.destroy();
  });

  it("answers an unrequested pause, then stops after the attempt budget", () => {
    const video = createFakeVideo();
    const autoplay = createAutoplay();

    autoplay.ensurePlaying(asElement(video)); // attempt 1
    video.dispatch("pause"); // attempt 2
    video.dispatch("pause"); // attempt 3
    video.dispatch("pause"); // budget spent, no attempt
    video.dispatch("pause");
    expect(video.playCallCount).toBe(3);

    // Returning to the page is new information, not a blind retry: the budget
    // starts over.
    window.dispatchEvent(new Event("pageshow"));
    expect(video.playCallCount).toBe(4);
    autoplay.destroy();
  });

  it("resets the budget once playback is confirmed", () => {
    const video = createFakeVideo();
    const autoplay = createAutoplay();

    autoplay.ensurePlaying(asElement(video));
    video.dispatch("pause");
    video.dispatch("pause");

    video.paused = false;
    video.dispatch("playing");
    video.paused = true;
    video.dispatch("pause");
    expect(video.playCallCount).toBe(4);
    autoplay.destroy();
  });

  it("never asks an element that is already playing", () => {
    const video = createFakeVideo();
    const autoplay = createAutoplay();

    autoplay.ensurePlaying(asElement(video));
    video.paused = false;
    video.dispatch("canplay");
    expect(video.playCallCount).toBe(1);
    autoplay.destroy();
  });
});

describe("listeners and idempotence", () => {
  it("removes every element listener on stop and goes quiet afterwards", () => {
    const video = createFakeVideo();
    const autoplay = createAutoplay();

    const session = autoplay.ensurePlaying(asElement(video));
    expect(video.listenerCount()).toBeGreaterThan(0);

    session.stop();
    expect(video.listenerCount()).toBe(0);

    video.dispatch("pause");
    document.dispatchEvent(new Event("visibilitychange"));
    expect(video.playCallCount).toBe(1);
    autoplay.destroy();
  });

  it("removes the document and window listeners once the last session stops", () => {
    const removedFromDocument = vi.spyOn(document, "removeEventListener");
    const removedFromWindow = vi.spyOn(window, "removeEventListener");
    const autoplay = createAutoplay();

    const session = autoplay.ensurePlaying(asElement(createFakeVideo()));
    session.stop();

    expect(removedFromDocument.mock.calls.map(([type]) => type)).toContain(
      "visibilitychange",
    );
    expect(removedFromWindow.mock.calls.map(([type]) => type)).toContain(
      "pageshow",
    );
    autoplay.destroy();
  });

  it("disarms the gesture listeners when everything stops", async () => {
    const video = createFakeVideo();
    video.rejectPlayWith("NotAllowedError");
    const removedFromDocument = vi.spyOn(document, "removeEventListener");
    const autoplay = createAutoplay();

    autoplay.ensurePlaying(asElement(video));
    await flush();
    autoplay.destroy();

    const removed = removedFromDocument.mock.calls.map(([type]) => type);
    expect(removed).toContain("pointerdown");
    expect(removed).toContain("touchend");
    expect(removed).toContain("keydown");

    video.resolvePlay();
    document.dispatchEvent(new Event("pointerdown"));
    expect(video.playCallCount).toBe(1);
  });

  it("re-attempts without stacking listeners when called twice on one element", () => {
    const video = createFakeVideo();
    const autoplay = createAutoplay();

    autoplay.ensurePlaying(asElement(video));
    const listenersAfterFirst = video.listenerCount();
    const second = autoplay.ensurePlaying(asElement(video));

    expect(video.listenerCount()).toBe(listenersAfterFirst);
    expect(video.playCallCount).toBe(2);
    expect(second.getReport().attempts).toBe(2);
    autoplay.destroy();
  });

  it("survives stop and destroy being called twice", () => {
    const video = createFakeVideo();
    const autoplay = createAutoplay();

    const session = autoplay.ensurePlaying(asElement(video));
    session.stop();
    session.stop();
    autoplay.destroy();
    autoplay.destroy();

    expect(video.listenerCount()).toBe(0);
    expect(session.getReport().state).toBe("starting");
  });
});
