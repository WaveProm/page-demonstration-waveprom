import { cn } from "@/lib/utils";

/**
 * A line break only a wide screen reads.
 *
 * Where a line is cut is a decision taken at one width. A phone that keeps
 * that decision inherits an orphan, so these breaks exist above md and nowhere
 * else. The breaks that carry the shape of the copy, the blank line between
 * two paragraphs and the items of a list, stay plain `br` and hold at every
 * width.
 *
 * inline rather than block, because a br that is not laid out inline takes no
 * part in the line it was written to break.
 */
export const DesktopBreak = ({ className }: { className?: string }) => (
  <br className={cn("hidden md:inline", className)} />
);

export default DesktopBreak;
