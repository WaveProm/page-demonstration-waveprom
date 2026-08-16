import type { AnimationStep, Palette, TextCycleTiming } from "./types";

/*
 * Everything tunable that JavaScript reads. Sizes, radii and the timings of
 * CSS-driven transitions live in scroll-cta.module.css instead, so each value
 * has exactly one home.
 */

/** Viewport fraction the button's top edge must reach to arm the sequence. */
export const START_ANIMATION_BOUNDARY = 0.75;

/**
 * Distance the flying pill keeps from the edges of the viewport. A trajectory
 * constant, not a style: it is never applied as a CSS property, only used to
 * work out where the pill stops.
 */
export const VIEWPORT_GUTTER_IN_PX = 20;

export const ANIMATION_STEPS: AnimationStep[] = [
  /* Straight down. Keeping the horizontal position is the point: a sideways
     hop of a few dozen pixels reads as a glitch, not as motion. */
  {
    offsetInViewports: 0,
    durationInMs: 100,
    easingCurve: "cubic-bezier(0.32, 0, 0.67, 0)",
  },
  /* Then across to the centre, accelerating and braking hard */
  {
    offsetInViewports: 0.04,
    durationInMs: 150,
    easingCurve: "cubic-bezier(0.5, 0, 0.1, 1)",
  },
];

/**
 * Worn until the button lands. Kept in step with the `initial-value` of
 * --scroll-cta-core and --scroll-cta-edge, which paint the first frame.
 */

export const INACTIVE_PALETTE: Palette = {
  name: "inactive",
  core: "#f2f2f7",
  edge: "#c7c7cc",
  ink: "dark",
};

/** One per stage of the scroll, in order. Their count is the stage count. */

export const ACTIVE_PALETTES: Palette[] = [
  { name: "sunrise", core: "#ffbea8", edge: "#acc9e2", ink: "dark" },
  { name: "daytime", core: "#dbeeff", edge: "#114879", ink: "light" },
  { name: "sunset", core: "#dd8b70", edge: "#1e2334", ink: "light" },
  { name: "night", core: "#2b3d61", edge: "#0b1220", ink: "light" },
];

export const TEXT_CYCLE_TIMING: TextCycleTiming = {
  intervalInMs: 2000,
  fadeInMs: 400,
};

export const BUTTON_TEXT = "Je veux + de";
export const BUTTON_CYCLING_TEXT = ["clients", "temps", "notoriété"];
