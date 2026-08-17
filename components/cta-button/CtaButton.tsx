import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./cta-button.module.css";

type CtaButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * A plain link wearing the scroll CTA's face. No card seats it, nothing moves
 * it, and it holds no state, so it stays a server component.
 */
export const CtaButton = ({ href, children, className }: CtaButtonProps) => (
  <a
    className={cn(
      styles.button,
      // Padding rather than a height, and shrink-0 with it : sat in a flex
      // column whose height is the viewport, a fixed height is still a
      // shrinkable one, and the pill was being squashed.
      // No gap between the copy and the chevrons: a gap is a hard minimum, and
      // stretched to the width of the card above it the pill had none to give,
      // so the chevrons were pushed out of their own background. ml-auto pins
      // them to the right edge whatever width the button is given.
      "relative flex w-full max-w-[431px] shrink-0 items-center px-4 py-2.5 font-normal text-[16px] no-underline",
      className,
    )}
    href={href}
  >
    <span className="whitespace-nowrap">{children}</span>

    {/* Plural on purpose: the three read as one direction, and no single one
        of them carries anything on its own. */}
    <span
      aria-hidden="true"
      className="ml-auto flex gap-0.5 pl-3.5 font-light text-[18px] leading-none"
    >
      <span className={styles.chevron}>&rsaquo;</span>
      <span className={styles.chevron}>&rsaquo;</span>
      <span className={styles.chevron}>&rsaquo;</span>
    </span>
  </a>
);
