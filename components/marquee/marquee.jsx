// This textbook demonstrates how to build a component you drop into another project as-is by leveraging a self-contained folder (component + colocated CSS module) whose config stays external (props / children) — the component holds zero client data, and that decoupling is exactly what makes it transferable.

import { cn } from "@/lib/utils";
import { MarqueeTrack } from "./marqueeTrack";

const config = {
  gap: "var(--space-xl)",
  duration: "40s",
  direction: "left",
  fade: true,
};

const fadeMask =
  "[mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]";

export const Marquee = ({ children, className, ...options }) => {
  const { gap, duration, direction, fade } = { ...config, ...options };

  return (
    <div className={cn("overflow-x-hidden", fade && fadeMask, className)}>
      <MarqueeTrack gap={gap} duration={duration} direction={direction}>
        {children}
      </MarqueeTrack>
    </div>
  );
};
