"use client";
import { type ReactNode, useEffect, useRef } from "react";
import { heroFrame } from "@/lib/hero-timeline";

// The runway the hero is crossed on: the first screen stops being a backdrop
// and becomes a surface the page goes through, and the copy is what is on the
// other side.
//
// Scroll driven, and never scroll jacking. The wheel is left alone, the page
// scrolls exactly the height it declares, and the animation is nothing but a
// reading of where that scroll is. This component holds no state and paints
// no style of its own: it measures, asks lib/hero-timeline.ts for the frame,
// and writes it into the custom properties app/globals.css consumes.

// Tailwind's md, which the runway height below switches on too.
const DESKTOP = "(min-width: 48rem)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const DESKTOP_MAX_SCALE = 8;
// A portrait phone already crops the frame to a quarter of its width, so the
// desktop ceiling would land it inside a single block of pixels.
const MOBILE_MAX_SCALE = 4;
// A zoom of that size is a vestibular trigger, so a reader who asked for less
// motion is given a ceiling of one: same timeline, same darkness, same copy,
// and an image that stays where it is.
const STILL_MAX_SCALE = 1;

type HeroPortalProps = {
  surface: ReactNode;
  children: ReactNode;
};

const HeroPortal = ({ surface, children }: HeroPortalProps) => {
  const portalRef = useRef<HTMLElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const portal = portalRef.current;
    const runway = runwayRef.current;
    if (!portal || !runway) return;

    const desktop = window.matchMedia(DESKTOP);
    const still = window.matchMedia(REDUCED_MOTION);
    let pendingFrame = 0;

    const maxScale = () => {
      if (still.matches) return STILL_MAX_SCALE;
      return desktop.matches ? DESKTOP_MAX_SCALE : MOBILE_MAX_SCALE;
    };

    const paint = () => {
      pendingFrame = 0;
      // Measured from the section rather than read off scrollY: the runway is
      // whatever height the stylesheet gives it, and a page that grows above
      // the hero one day changes nothing here.
      const runwayHeight = runway.getBoundingClientRect().height;
      const travelled = -portal.getBoundingClientRect().top;
      const frame = heroFrame(
        runwayHeight > 0 ? travelled / runwayHeight : 0,
        maxScale(),
      );

      portal.style.setProperty("--hero-ui-opacity", `${frame.uiOpacity}`);
      portal.style.setProperty("--hero-ui-events", frame.uiEvents);
      portal.style.setProperty("--hero-scale", `${frame.scale}`);
      portal.style.setProperty("--hero-filter", frame.filter);
      portal.style.setProperty("--hero-copy-opacity", `${frame.copyOpacity}`);
      portal.style.setProperty("--hero-copy-events", frame.copyEvents);
    };

    // One frame per painted frame, whatever the scroll fires.
    const schedule = () => {
      if (!pendingFrame) pendingFrame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    desktop.addEventListener("change", schedule);
    still.addEventListener("change", schedule);

    return () => {
      if (pendingFrame) cancelAnimationFrame(pendingFrame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      desktop.removeEventListener("change", schedule);
      still.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <section ref={portalRef} className="hero-portal relative bg-black">
      {surface}

      {/* Pulled back over the surface by the negative margin the surface
          carries, so the copy scrolls on the video instead of after it. */}
      <div className="relative z-10">
        <div ref={runwayRef} className="h-[150vh] md:h-[200vh]" />
        <div className="hero-copy">{children}</div>
      </div>
    </section>
  );
};

export default HeroPortal;
