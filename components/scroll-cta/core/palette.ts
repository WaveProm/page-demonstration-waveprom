import type { Palette } from "../types";

/**
 * Paints one palette onto the button. Which palette, and when, is decided
 * elsewhere: this only knows how to put one on.
 *
 * The ink travels with the palette rather than being computed from it, so a
 * given background always gets the same text colour.
 */

const CORE_TOKEN = "--scroll-cta-core";
const EDGE_TOKEN = "--scroll-cta-edge";

export const applyPalette = (button: HTMLElement, palette: Palette) => {
  button.style.setProperty(CORE_TOKEN, palette.core);
  button.style.setProperty(EDGE_TOKEN, palette.edge);
  button.dataset.ink = palette.ink;
};
