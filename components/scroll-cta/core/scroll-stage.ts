import type { ScrollStageHandle } from "../types";

/**
 * Slices the scrollable range into equal stages and reports which one the
 * page is in. Knows nothing about what a stage selects.
 *
 * The index it reports is always one of the count it was given. A caller
 * reads a table with it, and a table has nothing outside its bounds.
 */
export const createScrollStage = (count: number): ScrollStageHandle => {
  const listeners: ((index: number) => void)[] = [];
  let index = 0;

  /*
   * The scrollable range, not the document height: the last stage would
   * otherwise begin past the end of the scroll and never be reached.
   */
  const scrollableRange = () =>
    document.documentElement.scrollHeight - innerHeight;

  /*
   * The scroll position is not bounded by the range it is measured against.
   * Safari WebKit reports it outside that range for the whole of its elastic
   * overscroll, negative at the top and past the end at the bottom.
   * An overshoot is read as the end it overshot.
   */
  const scrollProgress = () => {
    const range = scrollableRange();
    if (range <= 0) return 0;
    return Math.min(Math.max(scrollY / range, 0), 1);
  };

  const update = () => {
    /* Only the last pixel of the range reaches count, and it belongs to the
       stage before it */
    const next = Math.min(count - 1, Math.floor(scrollProgress() * count));
    if (next === index) return;
    index = next;
    for (const listen of listeners) {
      listen(index);
    }
  };

  update();
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update);

  return {
    index: () => index,
    onChange: (listen) => {
      listeners.push(listen);
      listen(index);
    },
    stop: () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    },
  };
};
