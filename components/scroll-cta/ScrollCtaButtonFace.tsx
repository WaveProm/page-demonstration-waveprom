import { ScrollCtaChevrons } from "./ScrollCtaChevrons";
import styles from "./scroll-cta.module.css";
import type { ScrollCtaFaceProps } from "./types";

/**
 * Everything inside the button, and the shell both wearers put around it.
 *
 * The live button and the stand-in left in the card render the same face from
 * here, so they cannot drift apart. That drift is not hypothetical: the
 * earlier version cloned the node and had to strip its attributes by hand.
 */
export const BUTTON_SHELL =
  "relative flex h-10 w-full items-center px-4 text-[15px] font-normal no-underline";

export const ScrollCtaButtonFace = ({
  text,
  cyclingText,
}: ScrollCtaFaceProps) => (
  <>
    <span className="relative flex items-center">
      <span className="whitespace-nowrap">{text}&nbsp;</span>
      {/* The slot is locked to the widest word once measured, so a long one
          must never wrap inside it */}
      <span className="relative h-5.5" data-scroll-cta-cycling-text>
        <span className={styles.variant}>{cyclingText[0]}</span>
      </span>
    </span>

    <ScrollCtaChevrons />
  </>
);
