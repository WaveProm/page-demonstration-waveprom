import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Who it was made for, and in what trade. Lighter, so it recedes.
 *
 * Every term of the clamp is the headline's own, multiplied by 0.825, which is
 * the ratio the two were validated at. The hierarchy therefore holds at every
 * width by construction rather than by two tables agreeing with each other.
 */
export const SectionByline = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p
    className={cn(
      "mt-2 text-[clamp(1.13rem,0.4rem+3.11vw,1.65rem)] text-gray-400 leading-none",
      className,
    )}
  >
    {children}
  </p>
);
