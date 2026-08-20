"use client";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import styles from "./hero-dive.module.css";

// The dive. The hero is pinned, the image comes at the reader from the centre,
// and it goes out on the way in. Behind it there is the next section, black.
//
// Scroll driven, never scroll jacking: the wheel is left alone, the page
// scrolls the height it declares, and every value below is a reading of where
// that scroll is. So the way back up replays the way down with no code of its
// own.

// The four numbers the movement is made of. Everything else follows.
const MAX_SCALE = 4;
const UI_OUT_ENDS = 0.15;
const ZOOM_ENDS = 0.85;
const FADE_STARTS = 0.65;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// Where progress sits inside one span of the movement, 0 before it, 1 after.
const spanProgress = (progress: number, from: number, to: number) =>
  clamp01((progress - from) / (to - from));

// Leaves the rest, holds one speed in the middle, sets down at the end.
const easeInOut = (value: number) => value * value * (3 - 2 * value);

// An invisible layer takes no clicks.
const pointerEvents = (opacity: number) => (opacity === 0 ? "none" : "auto");

// The speed of the whole thing, and the only knob that changes it: the scroll
// distance the dive costs. Shorter is faster, and every keyframe above follows
// on its own, because they are fractions of this length and not of a duration.
const DEFAULT_RUNWAY = "120vh";

type HeroDiveProps = {
  surface: ReactNode;
  children: ReactNode;
  runway?: string;
};

const HeroDive = ({
  surface,
  children,
  runway = DEFAULT_RUNWAY,
}: HeroDiveProps) => {
  const diveRef = useRef<HTMLDivElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dive = diveRef.current;
    const runwayElement = runwayRef.current;
    if (!dive || !runwayElement) return;

    let pendingFrame = 0;

    const paint = () => {
      pendingFrame = 0;
      // Read off the section rather than off scrollY: an elastic overscroll
      // hands out a position outside the range, and the clamp eats it.
      const runwayHeight = runwayElement.getBoundingClientRect().height;
      const travelled = -dive.getBoundingClientRect().top;
      const progress = clamp01(runwayHeight > 0 ? travelled / runwayHeight : 0);

      // Exponential, because a linear scale is read as a zoom slowing down.
      const scale =
        MAX_SCALE ** easeInOut(spanProgress(progress, UI_OUT_ENDS, ZOOM_ENDS));
      const uiOpacity = 1 - spanProgress(progress, 0, UI_OUT_ENDS);
      const opacity = 1 - spanProgress(progress, FADE_STARTS, 1);

      dive.style.setProperty("--dive-ui-opacity", `${uiOpacity}`);
      dive.style.setProperty("--dive-ui-events", pointerEvents(uiOpacity));
      dive.style.setProperty("--dive-scale", `${scale}`);
      dive.style.setProperty("--dive-opacity", `${opacity}`);
      dive.style.setProperty("--dive-events", pointerEvents(opacity));
      // What the section behind reads to know it has the screen to itself.
      dive.style.setProperty("--dive-arrived", progress === 1 ? "1" : "0");
    };

    // One update per painted frame, whatever the scroll fires.
    const schedule = () => {
      if (!pendingFrame) pendingFrame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={diveRef}
      className={styles.dive}
      style={{ "--dive-runway": runway } as CSSProperties}
    >
      <div className={styles.surface}>{surface}</div>

      {/* Pulled back up over the surface by the margin the surface carries, so
          the section arrives behind the video instead of after it. */}
      <div className={styles.behind}>
        <div ref={runwayRef} className={styles.runway} />
        {children}
      </div>
    </div>
  );
};

export default HeroDive;
