import { cn } from "@/lib/utils";

type BrightnessBarProps = {
  className?: string;
};

export const BrightnessBar = ({ className }: BrightnessBarProps) => (
  <div
    aria-hidden
    className={cn(
      "pointer-events-none flex items-center opacity-[var(--brightness-opacity,0)]",
      className,
    )}
  >
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/25">
      <div className="h-full w-[calc(var(--brightness-level,0)*100%)] rounded-full bg-white" />
    </div>
  </div>
);
