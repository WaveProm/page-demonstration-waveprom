import { cn } from "@/lib/utils";

/*
 * A rule, in either direction. Base classes first, `className` last, so the
 * caller always wins: colour, thickness and length are all overridable from
 * where the separator is used.
 */

type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export const Separator = ({
  orientation = "horizontal",
  className,
}: SeparatorProps) => (
  <hr
    className={cn(
      "m-0 shrink-0 border-0 bg-gray-200 my-6",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className,
    )}
  />
);
