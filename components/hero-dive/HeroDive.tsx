"use client";
import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./hero-dive.module.css";

// The dive. The hero is pinned, the image comes at the reader from the centre,
// it goes out in a fade, and the section behind settles into place with its
// words. One movement, read from the scroll from end to end: no timer, no
// transition, nothing that plays on its own. Scrolling back up replays it
// backwards without a line of code of its own.

// EVERY number the movement is made of. Nothing about it is decided anywhere
// else.
const DIVE = {
  runway: "70vh", // scroll to play the whole animation, first keyframe to last
  zoom: 1.75, // how far the hero image is pushed toward the reader
  overlap: "35vh", // how far the section behind is pulled up under the runway
  uiGone: 0.1, // progress where the hero UI has finished leaving
  zoomEnd: 0.52, // progress where the image stops growing
  fadeStart: 0.45, // progress where the surface starts going out
  fadeEnd: 0.7, // progress where it is gone and the ground is bare
  revealStart: 0.7, // progress where the section behind comes out of that ground
  revealEnd: 0.9, // progress where it is all the way there
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// Where progress sits inside one span of the movement, 0 before it, 1 after.
const spanProgress = (progress: number, from: number, to: number) =>
  clamp01((progress - from) / (to - from));

// Leaves the rest, holds one speed in the middle, sets down at the end.
const easeInOut = (value: number) => value * value * (3 - 2 * value);

// All of its brake at the end: what a thing coming to rest does.
const easeOut = (value: number) => 1 - (1 - value) ** 3;

// An invisible layer takes no clicks.
const pointerEvents = (opacity: number) => (opacity === 0 ? "none" : "auto");

type HeroDiveProps = {
  surface: ReactNode;
  children: ReactNode;
};

const HeroDive = ({ surface, children }: HeroDiveProps) => {
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

      const uiOpacity = 1 - spanProgress(progress, 0, DIVE.uiGone);
      const opacity = 1 - spanProgress(progress, DIVE.fadeStart, DIVE.fadeEnd);
      // Exponential, because a linear scale is read as a zoom slowing down.
      const scale =
        DIVE.zoom **
        easeInOut(spanProgress(progress, DIVE.uiGone, DIVE.zoomEnd));
      const behind = easeOut(
        spanProgress(progress, DIVE.revealStart, DIVE.revealEnd),
      );

      dive.style.setProperty("--dive-ui-opacity", `${uiOpacity}`);
      dive.style.setProperty("--dive-ui-events", pointerEvents(uiOpacity));
      dive.style.setProperty("--dive-scale", `${scale}`);
      dive.style.setProperty("--dive-opacity", `${opacity}`);
      dive.style.setProperty("--dive-events", pointerEvents(opacity));
      dive.style.setProperty("--dive-behind-opacity", `${behind}`);
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
      className={cn(styles.dive, "relative bg-black")}
      style={
        {
          "--dive-runway": DIVE.runway,
          "--dive-overlap": DIVE.overlap,
        } as CSSProperties
      }
    >
      <div className={styles.pinRange}>
        <div className={cn(styles.surface, "sticky top-0 z-10 h-screen")}>
          {surface}
        </div>
      </div>

      <div className="relative z-0">
        <div ref={runwayRef} className={styles.runway} />

        {/* Pulled up under the runway, so its top edge has crossed the top of
            the screen well before it is shown: what dissolves in is a full
            screen, never a section with an edge on it. */}
        <div className={styles.behind}>{children}</div>
      </div>
    </div>
  );
};

export default HeroDive;
