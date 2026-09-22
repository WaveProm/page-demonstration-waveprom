"use client";
import { type ReactNode, useEffect, useRef } from "react";
import { BrightnessBar } from "@/components/brightness-bar/BrightnessBar";
import { cn } from "@/lib/utils";

const UNVEIL = {
  barShownAt: 0.15,
  veilGoneAt: 0.85,
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const spanProgress = (progress: number, from: number, to: number) =>
  clamp01((progress - from) / (to - from));

const pointerEvents = (opacity: number) => (opacity === 0 ? "none" : "auto");

type HeroUnveilProps = {
  children: ReactNode;
};

const HeroUnveil = ({ children }: HeroUnveilProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const surface = surfaceRef.current;
    if (!root || !surface) return;

    let pendingFrame = 0;
    let paintedProgress = Number.NaN;

    const paint = () => {
      pendingFrame = 0;
      const rootRect = root.getBoundingClientRect();
      const runway = rootRect.height - surface.getBoundingClientRect().height;
      const progress = clamp01(runway > 0 ? -rootRect.top / runway : 0);
      if (progress === paintedProgress) return;
      paintedProgress = progress;

      const veilOpacity = 1 - spanProgress(progress, 0, UNVEIL.veilGoneAt);
      const barOpacity =
        spanProgress(progress, 0, UNVEIL.barShownAt) *
        (1 - spanProgress(progress, UNVEIL.veilGoneAt, 1));

      root.style.setProperty("--unveil-veil-opacity", `${veilOpacity}`);
      root.style.setProperty(
        "--unveil-veil-events",
        pointerEvents(veilOpacity),
      );
      root.style.setProperty("--brightness-opacity", `${barOpacity}`);
      root.style.setProperty("--brightness-level", `${1 - veilOpacity}`);
    };

    const schedule = () => {
      if (!pendingFrame) pendingFrame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "lg:h-[calc(100vh+10vh)]",
        "[&_[data-veil]]:opacity-[var(--unveil-veil-opacity,1)]",
        "[&_[data-veil]]:[pointer-events:var(--unveil-veil-events,auto)]",
      )}
    >
      <div ref={surfaceRef} className="relative lg:sticky lg:top-0">
        {children}

        <BrightnessBar className="-translate-x-1/2 absolute top-7 left-[round(50%,1px)] hidden h-3 w-24 lg:flex" />
      </div>
    </div>
  );
};

export default HeroUnveil;
