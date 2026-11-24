import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./cta-button.module.css";

type CtaButtonProps = {
  children: ReactNode;
  className?: string;
} & ({ href: string } | { type: "submit" });

export const CtaButton = ({
  children,
  className,
  ...target
}: CtaButtonProps) => {
  const face = cn(
    styles.button,
    "relative flex w-full max-w-[431px] shrink-0 items-center px-4 py-2.5 font-normal text-[16px] no-underline",
    className,
  );
  const content = (
    <>
      <span className="whitespace-nowrap">{children}</span>
      <span
        aria-hidden="true"
        className="ml-auto flex gap-0.5 pl-3.5 font-light text-[18px] leading-none"
      >
        <span className={styles.chevron}>&rsaquo;</span>
        <span className={styles.chevron}>&rsaquo;</span>
        <span className={styles.chevron}>&rsaquo;</span>
      </span>
    </>
  );

  return "href" in target ? (
    <a className={face} href={target.href}>
      {content}
    </a>
  ) : (
    <button className={face} type="submit">
      {content}
    </button>
  );
};
