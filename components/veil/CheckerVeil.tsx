import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * A checkerboard of solid squares, alternating transparent and opaque, laid
 * over whatever is under it. It takes light out of an image without touching
 * its colours, and leaves a grain the eye reads as depth rather than as a
 * filter.
 *
 * One conic-gradient tiled at twice the square: two quarters coloured, two
 * quarters left open, which is a checker and not a grid of lines.
 *
 * Ported from the same veil in minotaures-de-martigny, kept to its own API.
 */

type CheckerVeilProps = {
  square?: number;
  color?: string;
  strength?: number;
  className?: string;
  style?: CSSProperties;
};

export const CheckerVeil = ({
  square = 2,
  color = "0, 0, 0",
  strength = 0.7,
  className,
  style,
}: CheckerVeilProps) => {
  const tint = `rgba(${color}, ${strength})`;
  const tile = square * 2;

  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `conic-gradient(${tint} 0 25%, transparent 25% 50%, ${tint} 50% 75%, transparent 75% 100%)`,
        backgroundSize: `${tile}px ${tile}px`,
        ...style,
      }}
    />
  );
};

export default CheckerVeil;
