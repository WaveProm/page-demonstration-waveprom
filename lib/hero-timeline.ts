// The keyframes of the hero portal, as a pure function of one number.
//
// Nothing here knows about the scroll, an event or a tween. A frame depends on
// progress and on nothing else, which is what makes the way back up free: the
// state at 0.42 is the same state whichever direction the page arrived from.

type PointerEvents = "auto" | "none";

export type HeroFrame = {
  uiOpacity: number;
  uiEvents: PointerEvents;
  scale: number;
  filter: string;
  copyOpacity: number;
  copyEvents: PointerEvents;
};

// The timeline, in the order the screen plays it.
const UI_EXIT_ENDS = 0.15;
const ZOOM_ENDS = 0.7;
const RESIDUAL_ENDS = 0.88;

// What the image is left at once the page has gone through it. Measured on the
// master rather than picked: the hero is a sunny facade whose darkest zone
// still peaks at 190 of luma, and 0.18 takes that peak down to 34.
const RESIDUAL_BRIGHTNESS = 0.18;
// Screen pixels. A filter is applied before the transform that follows it, so
// the radius written here is divided by the scale about to multiply it.
const RESIDUAL_BLUR_PX = 24;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// Where progress sits inside one span of the timeline, 0 before it, 1 after.
const spanProgress = (progress: number, from: number, to: number) =>
  clamp01((progress - from) / (to - from));

// Fast first and settled at the end, which is how a layer leaves a screen.
const easeOut = (value: number) => 1 - (1 - value) ** 3;

// An invisible layer takes no clicks.
const pointerEvents = (opacity: number): PointerEvents =>
  opacity === 0 ? "none" : "auto";

// none rather than an identity filter: a filter is a rendering pass, and the
// hero holds this state for the whole first screen of the page.
const residualFilter = (residual: number, scale: number) => {
  if (residual === 0) return "none";
  const brightness = 1 - residual * (1 - RESIDUAL_BRIGHTNESS);
  const blurPx = (residual * RESIDUAL_BLUR_PX) / scale;
  return `brightness(${brightness.toFixed(3)}) blur(${blurPx.toFixed(2)}px)`;
};

export const heroFrame = (progress: number, maxScale: number): HeroFrame => {
  const timeline = clamp01(progress);
  // Exponential, because a linear scale is read as a zoom slowing down.
  const scale = maxScale ** spanProgress(timeline, UI_EXIT_ENDS, ZOOM_ENDS);
  const uiOpacity = 1 - easeOut(spanProgress(timeline, 0, UI_EXIT_ENDS));
  const copyOpacity = easeOut(spanProgress(timeline, RESIDUAL_ENDS, 1));

  return {
    uiOpacity,
    uiEvents: pointerEvents(uiOpacity),
    scale,
    filter: residualFilter(
      spanProgress(timeline, ZOOM_ENDS, RESIDUAL_ENDS),
      scale,
    ),
    copyOpacity,
    copyEvents: pointerEvents(copyOpacity),
  };
};
