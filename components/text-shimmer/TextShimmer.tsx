import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./text-shimmer.module.css";

type TextShimmerProps = {
  children: ReactNode;
  className?: string;
};

export const TextShimmer = ({ children, className }: TextShimmerProps) => (
  <span className={cn(styles.shimmer, className)}>{children}</span>
);
