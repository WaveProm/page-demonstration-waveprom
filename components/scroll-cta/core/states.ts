import type { ButtonState } from "../types";

/**
 * The button's resting positions, in order. The walk is always one state at a
 * time, so every leg joins two neighbours and a fast flick cannot cut a
 * corner.
 *
 * `inCard` is declared per state rather than inferred from the index: it says
 * the card owns the button's position, so nothing has to be placed by hand.
 */
export const BUTTON_STATES: ButtonState[] = [
  /* seated  in the card, part of the flow */
  { inCard: true },
  /* lowered dropped straight down to the bottom of the viewport */
  { inCard: false },
  /* landed  slid across to the centre */
  { inCard: false },
];

export const SEATED = 0;
export const LANDED = BUTTON_STATES.length - 1;

/** True while the button has to be placed by hand rather than by the card. */
export const isHeldByHand = (state: number) => !BUTTON_STATES[state].inCard;

/** True on the leg that takes the button out of the card's layout. */
export const leavesCard = (from: number, to: number) =>
  BUTTON_STATES[from].inCard && !BUTTON_STATES[to].inCard;
