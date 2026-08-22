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
  brightnessIn: 0.02, // progress where the brightness bar has come in
  brightnessGone: 0.12, // progress where the brightness bar has left
  zoomIn: 0.14, // progress where the zoom ruler has taken its place
  zoomEnd: 0.52, // progress where the image stops growing
  zoomGone: 0.56, // progress where the zoom ruler has left
  fadeStart: 0.45, // progress where the surface starts going out
  fadeEnd: 0.7, // progress where it is gone and the ground is bare
  revealStart: 0.7, // progress where the section behind comes out of that ground
  revealEnd: 0.9, // progress where it is all the way there
};

// The ruler under the zoom factor: what one tick is worth, what one tall tick
// is worth, and how much room each tick gets. The ruler spans the whole dive,
// 1 to DIVE.zoom, so its length follows from these and from nothing else.
const RULER = {
  tick: 0.05, // zoom factor from one tick to the next
  major: 0.25, // zoom factor from one tall tick to the next
  pitch: 6, // px from one tick to the next
  inset: 4, // px before the first tick and after the last
};
const rulerSpan = ((DIVE.zoom - 1) / RULER.tick) * RULER.pitch;

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
  const zoomRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dive = diveRef.current;
    const runwayElement = runwayRef.current;
    const zoomLabel = zoomRef.current;
    if (!dive || !runwayElement || !zoomLabel) return;

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

      // Nothing over the hero at rest, and one readout at a time. The bar
      // comes in with the first scroll and leaves the moment the UI has; the
      // ruler takes its place once it is gone, and leaves the moment the image
      // has stopped growing.
      const brightnessOpacity =
        spanProgress(progress, 0, DIVE.brightnessIn) *
        (1 - spanProgress(progress, DIVE.uiGone, DIVE.brightnessGone));
      const zoomOpacity =
        spanProgress(progress, DIVE.brightnessGone, DIVE.zoomIn) *
        (1 - spanProgress(progress, DIVE.zoomEnd, DIVE.zoomGone));
      // The cursor reads the scale itself, not the progress, so the ruler and
      // the number never disagree with the image.
      const zoomed = (scale - 1) / (DIVE.zoom - 1);
      const zoomLabelText = `${scale.toFixed(2)}X`;
      if (zoomLabel.textContent !== zoomLabelText) {
        zoomLabel.textContent = zoomLabelText;
      }
      const behind = easeOut(
        spanProgress(progress, DIVE.revealStart, DIVE.revealEnd),
      );

      dive.style.setProperty("--dive-ui-opacity", `${uiOpacity}`);
      dive.style.setProperty("--dive-ui-events", pointerEvents(uiOpacity));
      dive.style.setProperty(
        "--dive-brightness-opacity",
        `${brightnessOpacity}`,
      );
      dive.style.setProperty("--dive-zoom", `${zoomed}`);
      dive.style.setProperty("--dive-zoom-opacity", `${zoomOpacity}`);
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

          {/* Two readouts over the hero, the way a camera shows them, one at a
              time in the same place. The anchor sits on a whole pixel: half of
              an odd screen is half a pixel, and a four-pixel bar on a half
              pixel is a blurred bar. Each readout is an even number of pixels
              wide, so centring it on that anchor keeps it whole. */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-5 left-[round(50%,1px)] h-3 text-white md:top-7"
            style={
              {
                "--ruler-pitch": `${RULER.pitch}px`,
                "--ruler-major": `${(RULER.major / RULER.tick) * RULER.pitch}px`,
                "--ruler-inset": `${RULER.inset}px`,
                "--ruler-span": `${rulerSpan}px`,
              } as CSSProperties
            }
          >
            {/* Brightness, as wide as the ruler that follows it. The mask over
                the video and the words on it go out as the reader scrolls in,
                and this is the bar filling up to that. */}
            <div
              className={cn(
                styles.brightness,
                styles.rulerWide,
                "-translate-x-1/2 absolute inset-y-0 left-0 flex items-center",
              )}
            >
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/25">
                <div
                  className={cn(
                    styles.brightnessFill,
                    "h-full rounded-full bg-white",
                  )}
                />
              </div>
            </div>

            {/* Zoom. A straight ruler from 1 to the zoom of the dive, a tick
                every twentieth, a tall one every quarter, a cursor riding it
                as the image grows, and the factor to two places hung off its
                right end, so the ruler itself sits where the bar sat. */}
            <div
              className={cn(
                styles.zoom,
                styles.zoomRuler,
                styles.rulerWide,
                "-translate-x-1/2 absolute inset-y-0 left-0",
              )}
            >
              <div
                className={cn(
                  styles.zoomCursor,
                  "-translate-x-1/2 absolute top-0 h-3 w-0.5 bg-white",
                )}
              />
              <span
                ref={zoomRef}
                className="absolute top-1/2 left-full ml-2 w-9 -translate-y-1/2 font-medium text-[11px] leading-none tabular-nums"
              >
                1.00X
              </span>
            </div>
          </div>
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
