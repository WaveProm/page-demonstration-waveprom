import { VIEWPORT_GUTTER_IN_PX } from "../config";
import type { ButtonSeatHandle, ButtonSeatOptions, Waypoint } from "../types";

/**
 * Owns the button's physical relationship to its card: whether it is sitting
 * in the layout or flying free, and the measurements that describe the seat.
 * Knows nothing about states, legs or scroll.
 *
 * Flying means leaving the card's subtree entirely. The card carries a
 * backdrop filter, and a filtered ancestor becomes the containing block for
 * its fixed descendants, so a fixed button inside it would be positioned
 * against the card rather than the viewport. Moving the node to the body is
 * the only way out.
 */

/** Inline properties this module owns, cleared when the button sits down. */
const SEAT_STYLES = ["position", "left", "top", "width", "height", "transform"];

export const createButtonSeat = ({
  card,
  button,
  ghost,
}: ButtonSeatOptions): ButtonSeatHandle => {
  let seatOffset: Waypoint = { x: 0, y: 0 };
  let anchorDocTop = 0;
  let freeWidth = 0;
  let released = false;

  /*
   * The free state opens a gap between the copy and the chevrons, so the
   * width it wants is the copy plus that gap. Put the button in its free
   * state, measure, and put it back, all between two paints so nothing shows.
   * The transition has to be suppressed or the read returns the gap the
   * button is leaving rather than the one it is heading for.
   */
  const measureFreeWidth = () => {
    const inlineWidth = button.style.width;
    button.dataset.measuring = "true";
    button.dataset.flight = "free";
    button.style.width = "max-content";
    const content = Math.ceil(button.getBoundingClientRect().width);
    button.style.width = inlineWidth;
    button.dataset.flight = released ? "free" : "seated";
    button.removeAttribute("data-measuring");
    return Math.min(content, innerWidth - VIEWPORT_GUTTER_IN_PX * 2);
  };

  /** The ghost stands in the seat once the button leaves it. */
  const anchor = () => (released ? ghost : button);

  const measure = () => {
    const cardBox = card.getBoundingClientRect();
    const anchorBox = anchor().getBoundingClientRect();
    seatOffset = {
      x: anchorBox.left - cardBox.left,
      y: anchorBox.top - cardBox.top,
    };
    anchorDocTop = anchorBox.top + scrollY;
    freeWidth = measureFreeWidth();
    if (released) {
      button.style.width = `${freeWidth}px`;
    }
  };

  const release = () => {
    if (released) return;
    const seat = button.getBoundingClientRect();
    freeWidth = measureFreeWidth();
    ghost.hidden = false;
    Object.assign(button.style, {
      position: "fixed",
      left: "0px",
      top: "0px",
      width: `${seat.width}px`,
      height: `${seat.height}px`,
    });
    document.body.append(button);
    released = true;

    /* One painted frame at the seated size, so width and padding have a
       value to morph away from */
    requestAnimationFrame(() => {
      if (!released) return;
      button.dataset.flight = "free";
      button.style.width = `${freeWidth}px`;
    });
  };

  const restore = () => {
    if (!released) return;
    released = false;
    ghost.before(button);
    ghost.hidden = true;
    for (const property of SEAT_STYLES) {
      button.style.removeProperty(property);
    }
    button.dataset.flight = "seated";
  };

  measure();

  return {
    release,
    restore,
    measure,
    isReleased: () => released,
    seatOffset: () => seatOffset,
    anchorDocTop: () => anchorDocTop,
    freeWidth: () => freeWidth,
  };
};
