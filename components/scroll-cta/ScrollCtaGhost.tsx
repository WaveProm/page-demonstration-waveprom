import { cn } from "@/lib/utils";
import { BUTTON_SHELL, ScrollCtaButtonFace } from "./ScrollCtaButtonFace";
import styles from "./scroll-cta.module.css";
import type { ScrollCtaFaceProps } from "./types";

/**
 * Holds the seat while the button is away, so the card keeps its height and
 * the reader can see where the button came from. Hidden until then.
 *
 * A span rather than a link, inert and hidden from the accessibility tree:
 * there is only ever one real call to action on the page.
 */
export const ScrollCtaGhost = ({ text, cyclingText }: ScrollCtaFaceProps) => (
  <span
    aria-hidden="true"
    className={cn(styles.button, styles.ghost, BUTTON_SHELL)}
    data-scroll-cta-ghost
    hidden
    inert
  >
    <ScrollCtaButtonFace cyclingText={cyclingText} text={text} />
  </span>
);
