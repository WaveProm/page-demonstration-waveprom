import type { ReactNode, RefObject } from "react";

/* Shared vocabulary ---------------------------------------------------- */

/** Which of the two fixed inks stays readable on a given palette. */
export type Ink = "dark" | "light";

/**
 * One colour state of the button. `core` is the glow at the bottom centre of
 * the ellipse, `edge` is what fills outward from it. `ink` is decided once,
 * here, against `edge`, because that is the colour the copy actually sits on.
 */
export type Palette = {
  name: string;
  core: string;
  edge: string;
  ink: Ink;
};

/**
 * One leg of the flight. `offsetInViewports` is the extra scroll that arms
 * this leg once the boundary has been crossed. A leg keeps its own timing
 * whichever way it is travelled.
 */
export type AnimationStep = {
  offsetInViewports: number;
  durationInMs: number;
  easingCurve: string;
};

/** How fast the rotating half of the copy turns over. */
export type TextCycleTiming = {
  intervalInMs: number;
  fadeInMs: number;
};

/* Module contracts ------------------------------------------------------ */

export type TextCycleOptions = {
  slot: HTMLElement;
  words: string[];
  /** Class the stylesheet hangs the crossfade on. */
  variantClassName: string;
  timing: TextCycleTiming;
};

export type TextCycleHandle = {
  start: () => void;
  stop: () => void;
};

export type ScrollStageHandle = {
  index: () => number;
  onChange: (listen: (index: number) => void) => void;
  stop: () => void;
};

/** A resting position of the button, in viewport coordinates. */
export type Waypoint = {
  x: number;
  y: number;
};

/** One row of the state table: does the card own the button's position. */
export type ButtonState = {
  inCard: boolean;
};

export type WaypointGeometry = {
  card: DOMRect;
  /** Where the button sits inside the card, measured from the card's corner. */
  seatOffset: Waypoint;
  /** The size the button is heading for, not the one it is leaving. */
  width: number;
  height: number;
};

export type ButtonSeatOptions = {
  card: HTMLElement;
  button: HTMLElement;
  /** Stands in the seat while the button is away. */
  ghost: HTMLElement;
};

export type ButtonSeatHandle = {
  release: () => void;
  restore: () => void;
  measure: () => void;
  isReleased: () => boolean;
  seatOffset: () => Waypoint;
  /** Document offset of whatever currently occupies the seat. */
  anchorDocTop: () => number;
  freeWidth: () => number;
};

export type AnimationStepsFsmOptions = ButtonSeatOptions;

export type AnimationStepsFsmHandle = {
  state: () => number;
  onChange: (listen: (state: number) => void) => void;
  stop: () => void;
};

/* Public API ------------------------------------------------------------ */

/**
 * The whole call to action: the invariant phrase, the words that rotate after
 * it, and where a click goes. Everything is a plain value, so the card that
 * renders this can stay a server component.
 */
export type UseScrollCtaOptions = {
  buttonRef: RefObject<HTMLAnchorElement | null>;
  cyclingText: string[];
};

export type ScrollCtaFaceProps = {
  text: string;
  cyclingText: string[];
};

export type ScrollCtaButtonProps = ScrollCtaFaceProps & {
  href: string;
};

/** The card takes the same copy, with the two wording fields defaulted. */
export type ScrollCtaCardProps = {
  children: ReactNode;
  href: string;
  text?: string;
  cyclingText?: string[];
  className?: string;
};
