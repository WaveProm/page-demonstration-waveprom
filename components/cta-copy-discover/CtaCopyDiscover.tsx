import { cn } from "@/lib/utils";
import styles from "./cta-copy-discover.module.css";

type CtaCopyDiscoverProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * The scroll CTA's detached frame, worn by a button that never detaches. It
 * stands on its own four corners, at full strength, with the gap the flying
 * one only ever wears once it has landed.
 *
 * A server component, because nothing here reacts to anything : no palette to
 * follow, no word to turn over, no seat to leave.
 */
export const CtaCopyDiscover = ({
  href,
  children,
  className,
}: CtaCopyDiscoverProps) => (
  <a
    className={cn(
      styles.button,
      "relative flex h-10 w-fit items-center gap-14 px-4 font-normal text-[15px] no-underline",
      className,
    )}
    href={href}
  >
    <span className="whitespace-nowrap">{children}</span>

    {/* Plural on purpose: the glow crossing the three is one gesture, and the
        stagger that produces it is an nth-child rule on this group. */}
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
