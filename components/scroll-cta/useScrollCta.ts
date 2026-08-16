import { useEffect } from "react";
import { ACTIVE_PALETTES, INACTIVE_PALETTE, TEXT_CYCLE_TIMING } from "./config";
import { createAnimationStepsFsm } from "./core/animation-steps-fsm";
import { applyPalette } from "./core/palette";
import { createScrollStage } from "./core/scroll-stage";
import { LANDED } from "./core/states";
import { createTextCycle } from "./core/text-cycle";
import styles from "./scroll-cta.module.css";
import type { UseScrollCtaOptions } from "./types";

/**
 * The assembly point, and the only place that knows a state drives a
 * behaviour. Each module below is deaf to the others: the flight reports a
 * state, the stage reports a zone, the palette paints, the cycle turns.
 *
 * The button reaches its card and its stand-in through the DOM rather than
 * through props, so nothing above it has to become a client component.
 */
export const useScrollCta = ({
  buttonRef,
  cyclingText,
}: UseScrollCtaOptions) => {
  useEffect(() => {
    const button = buttonRef.current;
    const card = button?.closest<HTMLElement>("[data-scroll-cta-card]");
    const ghost = card?.querySelector<HTMLElement>("[data-scroll-cta-ghost]");
    const slot = button?.querySelector<HTMLElement>(
      "[data-scroll-cta-cycling-text]",
    );
    if (!button || !card || !ghost || !slot) return;

    /* Before the flight: building the cycle locks the slot to its widest
       word, and the flight measures the button that slot is part of */
    const cycle = createTextCycle({
      slot,
      words: cyclingText,
      variantClassName: styles.variant,
      timing: TEXT_CYCLE_TIMING,
    });

    const stage = createScrollStage(ACTIVE_PALETTES.length);
    const flight = createAnimationStepsFsm({ card, button, ghost });
    let landed = false;

    const paint = () => {
      applyPalette(
        button,
        landed ? ACTIVE_PALETTES[stage.index()] : INACTIVE_PALETTE,
      );
    };

    stage.onChange(paint);
    flight.onChange((state) => {
      const arrived = state === LANDED;
      /* Written every time: the stylesheet holds the button back until it is
         true, so it has to be false again the moment the walk resumes */
      button.dataset.landed = String(arrived);
      if (arrived === landed) return;
      landed = arrived;
      if (landed) {
        cycle.start();
      } else {
        cycle.stop();
      }
      paint();
    });

    return () => {
      flight.stop();
      stage.stop();
      cycle.stop();
    };
  }, [buttonRef, cyclingText]);
};
