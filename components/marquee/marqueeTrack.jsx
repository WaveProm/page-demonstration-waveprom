"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./marqueeTrack.module.css";

export const MarqueeTrack = ({ children, duration, gap, direction }) => {
  const trackRef = useRef(null);
  const setRef = useRef(null);
  const containerRef = useRef(null);
  const frameRef = useRef(null);
  const [copies, setCopies] = useState(2);

  // biome-ignore lint/correctness/useExhaustiveDependencies: gap is not read here, it is watched: changing it changes the width of a set, and the count has to be taken again
  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    containerRef.current = track.parentElement;
    const computeCopies = () => {
      const set = setRef.current;
      const container = containerRef.current;

      if (!set || !container || set.scrollWidth === 0) return;

      const min = Math.ceil((container.clientWidth * 2) / set.scrollWidth);
      const nextCopies = Math.max(2, min % 2 === 0 ? min : min + 1);

      setCopies(nextCopies);
    };

    const scheduleComputeCopies = () => {
      if (frameRef.current !== null)
        window.cancelAnimationFrame(frameRef.current);

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        computeCopies();
      });
    };

    computeCopies();

    const ro = new ResizeObserver(scheduleComputeCopies);

    if (containerRef.current) ro.observe(containerRef.current);
    if (setRef.current) ro.observe(setRef.current);

    return () => {
      if (frameRef.current !== null)
        window.cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, [gap]);

  return (
    <div
      ref={trackRef}
      className={`${styles.marqueeTrack} flex w-max`}
      data-direction={direction}
      style={{ "--marquee-duration": duration, "--marquee-gap": gap }}
    >
      {/* A copy is told from the next by its rank and nothing else, so the
          rank is the value the track maps over, and the key it carries. */}
      {Array.from({ length: copies }, (_, index) => index).map((rank) => (
        <div
          key={`copy-${rank}`}
          ref={rank === 0 ? setRef : undefined}
          aria-hidden={true}
          inert={rank > 0 ? true : undefined}
          className="flex shrink-0 items-center gap-(--marquee-gap) pe-(--marquee-gap)"
        >
          {children}
        </div>
      ))}
    </div>
  );
};
