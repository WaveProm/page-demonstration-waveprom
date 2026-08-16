import type { TextCycleHandle, TextCycleOptions } from "../types";

/**
 * Rotates the second half of the copy. Knows nothing about scroll: it is
 * started and stopped from outside.
 *
 * Each word is its own element so the outgoing and incoming ones can overlap
 * during the blur crossfade. The visible one carries data-hidden="false".
 */

/** No interval running. setInterval never returns 0, so it reads as absent. */
const NO_TIMER = 0;

export const createTextCycle = ({
  slot,
  words,
  variantClassName,
  timing,
}: TextCycleOptions): TextCycleHandle => {
  let index = 0;
  let timer = NO_TIMER;

  const mount = (word: string, hidden: boolean) => {
    const variant = document.createElement("span");
    variant.className = variantClassName;
    variant.dataset.hidden = String(hidden);
    variant.textContent = word;
    slot.append(variant);
    return variant;
  };

  /* Lock the slot to the widest word, so the button never resizes mid-cycle */
  const lockWidth = () => {
    const probe = mount("", false);
    /* A variant is absolute and fills its slot, so it would measure the slot
       we are about to size. Put the probe back in flow to measure the text. */
    probe.style.position = "static";
    probe.style.width = "max-content";
    probe.style.visibility = "hidden";
    const widths = words.map((word) => {
      probe.textContent = word;
      return probe.getBoundingClientRect().width;
    });
    probe.remove();
    slot.style.width = `${Math.ceil(Math.max(...widths))}px`;
  };

  const reset = () => {
    index = 0;
    slot.replaceChildren();
    return mount(words[0], false);
  };

  lockWidth();
  let current = reset();

  const swap = () => {
    index = (index + 1) % words.length;
    const outgoing = current;
    const incoming = mount(words[index], true);
    current = incoming;

    /* One painted frame in the hidden state, or nothing transitions */
    requestAnimationFrame(() => {
      incoming.dataset.hidden = "false";
    });
    outgoing.dataset.hidden = "true";
    setTimeout(() => outgoing.remove(), timing.fadeInMs);
  };

  return {
    start: () => {
      if (timer !== NO_TIMER) return;
      timer = window.setInterval(swap, timing.intervalInMs);
    },
    stop: () => {
      window.clearInterval(timer);
      timer = NO_TIMER;
      current = reset();
    },
  };
};
