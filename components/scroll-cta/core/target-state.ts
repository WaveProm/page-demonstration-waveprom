import { ANIMATION_STEPS, START_ANIMATION_BOUNDARY } from "../config";
import { SEATED } from "./states";

/**
 * Turns the world into the state the button ought to be in. Reads scroll,
 * writes nothing.
 *
 * The sequence arms late on purpose: the button scrolls away with the page
 * like any other element, and only wakes up once its top edge reaches the
 * boundary line. Each further leg is armed by a little more scroll past it.
 */

const armScroll = (anchorDocTop: number) =>
  Math.max(0, anchorDocTop - START_ANIMATION_BOUNDARY * innerHeight);

export const readTargetState = (anchorDocTop: number) => {
  const past = scrollY - armScroll(anchorDocTop);
  if (past <= 0) return SEATED;
  return ANIMATION_STEPS.filter(
    (leg) => past >= leg.offsetInViewports * innerHeight,
  ).length;
};
