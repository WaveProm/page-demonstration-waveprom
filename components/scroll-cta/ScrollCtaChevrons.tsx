import styles from "./scroll-cta.module.css";

/**
 * Plural on purpose: the glow crossing the three is one gesture, and the
 * stagger that produces it is an nth-child rule on this group. A single
 * chevron has no behaviour of its own to own.
 */
export const ScrollCtaChevrons = () => (
  <span
    aria-hidden="true"
    className="ml-auto flex gap-0.5 pl-3.5 font-light text-[18px] leading-none"
  >
    <span className={styles.chevron}>&rsaquo;</span>
    <span className={styles.chevron}>&rsaquo;</span>
    <span className={styles.chevron}>&rsaquo;</span>
  </span>
);
