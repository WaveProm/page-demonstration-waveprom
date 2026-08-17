import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The two lines every partner section opens on: the hook, then who it was made
 * for and in what trade.
 *
 * No config and no data: each section writes its own words between the tags,
 * because a header held in a table is a header you have to leave the section to
 * read. What is standardised here is the shape, never the wording.
 */
export const SectionHeader = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => <header className={cn("mb-12", className)}>{children}</header>;
