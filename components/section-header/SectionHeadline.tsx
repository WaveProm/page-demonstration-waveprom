import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The hook. One sentence, at the size the section is read from.
 *
 * The size is clamped rather than fixed, because a rem alone does not know how
 * wide the screen is. The floor is what the longest headline in the page needs
 * to hold two lines on a 375 px phone, measured in WebKit; the ceiling is the
 * size that was validated. Above lg the breakpoint takes over.
 */
export const SectionHeadline = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <h2
    className={cn(
      "max-w-5xl font-medium text-[clamp(1.375rem,0.49rem+3.77vw,2rem)] text-gray-600 leading-none tracking-tight lg:max-w-none lg:text-4xl",
      className,
    )}
  >
    {children}
  </h2>
);
