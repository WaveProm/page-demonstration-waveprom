import { cn } from "@/lib/utils";
import { BUTTON_CYCLING_TEXT, BUTTON_TEXT } from "./config";
import { ScrollCtaButton } from "./ScrollCtaButton";
import { ScrollCtaGhost } from "./ScrollCtaGhost";
import type { ScrollCtaCardProps } from "./types";

/**
 * The shell. Holds whatever the caller puts in it, and seats the button as a
 * full-bleed footer. Stays a server component: the client boundary is the
 * button alone, which finds this card through its data attribute rather than
 * through a context that would drag the boundary up here.
 */
export const ScrollCtaCard = ({
  children,
  href,
  text = BUTTON_TEXT,
  cyclingText = BUTTON_CYCLING_TEXT,
  className,
}: ScrollCtaCardProps) => (
  <div
    className={cn(
      "relative w-[min(360px,78vw)] rounded-2xl border-white/15 border-y bg-white/[0.07] backdrop-blur-[14px]",
      className,
    )}
    data-scroll-cta-card
  >
    {children}
    <ScrollCtaButton cyclingText={cyclingText} href={href} text={text} />
    <ScrollCtaGhost cyclingText={cyclingText} text={text} />
  </div>
);
