"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { BUTTON_SHELL, ScrollCtaButtonFace } from "./ScrollCtaButtonFace";
import styles from "./scroll-cta.module.css";
import type { ScrollCtaButtonProps } from "./types";
import { useScrollCta } from "./useScrollCta";

/**
 * The live button, and the whole client boundary of this component. The card
 * above it and whatever the caller puts inside stay on the server.
 */
export const ScrollCtaButton = ({
  href,
  text,
  cyclingText,
}: ScrollCtaButtonProps) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  useScrollCta({ buttonRef, cyclingText });

  return (
    <a
      className={cn(styles.button, BUTTON_SHELL, "data-[flight=free]:gap-14")}
      data-flight="seated"
      data-ink="dark"
      data-scroll-cta-button
      href={href}
      ref={buttonRef}
    >
      <ScrollCtaButtonFace cyclingText={cyclingText} text={text} />
    </a>
  );
};
