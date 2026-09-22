import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import styles from "./partner-mark.module.css";

type PartnerMarkProps = {
  file: string;
  name: string;
  width: number;
  height: number;
  className?: string;
};

export const PartnerMark = ({
  file,
  name,
  width,
  height,
  className,
}: PartnerMarkProps) => (
  <span
    role="img"
    aria-label={name}
    className={cn(styles.mark, "block bg-current", className)}
    style={
      {
        "--partner-mark": `url(/logotypes/${file})`,
        "--partner-mark-ratio": `${width} / ${height}`,
      } as CSSProperties
    }
  />
);
