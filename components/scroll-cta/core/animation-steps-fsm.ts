import { ANIMATION_STEPS } from "../config";
import type {
  AnimationStepsFsmHandle,
  AnimationStepsFsmOptions,
  Waypoint,
} from "../types";
import { createButtonSeat } from "./button-seat";
import { BUTTON_STATES, isHeldByHand, leavesCard, SEATED } from "./states";
import { readTargetState } from "./target-state";
import { readWaypoints } from "./waypoints";

/**
 * Walks the button between the states declared in states.ts, one at a time.
 *
 * The machine owns three things and nothing else: which state is current,
 * which state the world asks for, and how to travel one leg. Everything a leg
 * does to the page is delegated - the seat handles leaving and rejoining the
 * card, waypoints work out where a state parks.
 */

const translate = (point: Waypoint) => `translate(${point.x}px, ${point.y}px)`;

export const createAnimationStepsFsm = ({
  card,
  button,
  ghost,
}: AnimationStepsFsmOptions): AnimationStepsFsmHandle => {
  const seat = createButtonSeat({ card, button, ghost });
  const listeners: ((state: number) => void)[] = [];

  let state = SEATED;
  let animating = false;

  const waypointAt = (index: number) =>
    readWaypoints({
      card: card.getBoundingClientRect(),
      seatOffset: seat.seatOffset(),
      width: seat.freeWidth(),
      height: button.offsetHeight,
    })[index];

  const place = (point: Waypoint) => {
    button.style.transform = translate(point);
  };

  const settle = (next: number) => {
    state = next;
    animating = false;
    if (BUTTON_STATES[state].inCard) {
      seat.restore();
    }
    for (const listen of listeners) {
      listen(state);
    }
    advance();
  };

  const advance = () => {
    const target = readTargetState(seat.anchorDocTop());
    if (animating || target === state) return;

    const next = state + Math.sign(target - state);
    const from = waypointAt(state);

    if (leavesCard(state, next)) {
      seat.release();
      /* Pinned exactly where it was sitting, so the takeoff shows no jump */
      place(from);
    }

    const to = waypointAt(next);
    /* A leg keeps its own timing whichever way it is travelled */
    const leg = ANIMATION_STEPS[Math.max(state, next) - 1];

    animating = true;
    place(to);
    const flight = button.animate(
      [{ transform: translate(from) }, { transform: translate(to) }],
      { duration: leg.durationInMs, easing: leg.easingCurve },
    );
    flight.onfinish = () => settle(next);
  };

  const onResize = () => {
    seat.measure();
    if (isHeldByHand(state)) {
      place(waypointAt(state));
    }
  };

  advance();
  addEventListener("scroll", advance, { passive: true });
  addEventListener("resize", onResize);

  return {
    state: () => state,
    onChange: (listen) => {
      listeners.push(listen);
      listen(state);
    },
    stop: () => {
      removeEventListener("scroll", advance);
      removeEventListener("resize", onResize);
      for (const flight of button.getAnimations()) {
        flight.cancel();
      }
      /* React owns the card, not the body: hand the button back before it
         unmounts, or it is orphaned in the document */
      seat.restore();
    },
  };
};
