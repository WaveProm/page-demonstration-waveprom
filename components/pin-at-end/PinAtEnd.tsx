"use client";
import { type ReactNode, useEffect, useRef } from "react";

// Lets its content scroll for its whole length, then freezes it exactly when
// its bottom edge reaches the bottom of the screen.
//
// Sticky with a negative top: 100svh minus the height of the block. The
// trigger is therefore precisely "bottom edge = bottom of the viewport", and
// the freeze is the browser's own, on the compositor. No scroll listener, no
// fixed/absolute switch that would jump a frame, no re-render. The only script
// is measuring the height and writing --pin-top.
//
// Ported from the same component in minotaures-de-martigny.
const PinAtEnd = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      element.style.setProperty(
        "--pin-top",
        `calc(100svh - ${Math.round(element.offsetHeight)}px)`,
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "sticky", top: "var(--pin-top, 0px)" }}
    >
      {children}
    </div>
  );
};

export default PinAtEnd;
