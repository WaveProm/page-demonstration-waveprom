"use client";
import Image from "next/image";
import { type ReactNode, useEffect, useRef } from "react";
import { parallaxOffset } from "@/lib/parallax";
import { cn } from "@/lib/utils";

// A black lid rising over the screen, a phone on it with the page already
// running on its glass, and a scroll that walks the reader into it.
//
// The phone and the page are locked to each other: the page is laid out at its
// real width and painted small enough to fill the glass, so growing one is
// shrinking the distance to the other. When the passage ends the page is back
// at its own scale, in its own box, with its top edge at the top of the screen,
// and the frame has left. No second copy, nothing to hand over.
//
// On the way up the two are not quite locked: the page climbs a little faster
// than the lid, which reads as the page scrolling on the phone as the phone
// comes up, rather than as one flat block rising.

// EVERY number the passage is made of. The zoom is not among them: it is
// whatever it takes for the glass to reach the edges of the screen, which only
// the browser knows.
const WINDOW = {
  runway: 45, // vh of scroll the dive costs once the lid has taken the screen
  landing: 12, // vh of the page's own ground left above it when the dive ends
  climbRate: 1.15, // how fast the page climbs next to the lid, 1 being together
  lockEnds: 0.75, // progress where the page has reached its own scale and box
  // A hair past the edges of the screen, so no edge of the glass survives the
  // rounding and draws itself as a line across the page.
  coverSlack: 1.02,
  lines: 0.35, // how much black each line of the glass holds at rest
  linesGone: 0.8, // progress where the glass has cleared to the page
  wordsGone: 0.4, // progress where the line above the phone has left
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const spanProgress = (progress: number, from: number, to: number) =>
  clamp01((progress - from) / (to - from));

// Leaves the rest, holds one speed in the middle, sets down at the end.
const easeInOut = (value: number) => value * value * (3 - 2 * value);

type PhoneWindowProps = {
  className?: string;
  children: ReactNode;
};

const PhoneWindow = ({ className, children }: PhoneWindowProps) => {
  const passageRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const clearRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLParagraphElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const passage = passageRef.current;
    const pinRange = pinRef.current;
    const phone = phoneRef.current;
    const frame = frameRef.current;
    const glass = glassRef.current;
    const clear = clearRef.current;
    const words = wordsRef.current;
    const page = pageRef.current;
    if (!passage || !pinRange || !phone || !frame) return;
    if (!glass || !clear || !words || !page) return;

    let pendingFrame = 0;

    const paint = () => {
      pendingFrame = 0;
      const top = passage.getBoundingClientRect().top;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // offset sizes, not the rect: the glass is inside a scaled layer, and
      // what is needed here is the box it was laid out at.
      const fit = glass.offsetWidth / screenWidth;

      // The dive: the pin box is one screen plus the runway, so the runway is
      // whatever that box is taller than the screen by.
      const runway = pinRange.getBoundingClientRect().height - screenHeight;
      const progress = clamp01(runway > 0 ? -top / runway : 0);
      const locking = easeInOut(spanProgress(progress, 0, WINDOW.lockEnds));

      // The climb, from the lid showing at the bottom of the screen to the lid
      // taking it. The page runs ahead of the lid by a share of that climb, and
      // the dive then blends the lead out, because the page has to be in its
      // own box when the dive ends.
      const climbed = clamp01((screenHeight - top) / screenHeight);
      const lead =
        parallaxOffset(climbed * screenHeight, WINDOW.climbRate) *
        (1 - locking);

      // One movement read twice. The page goes from the size that fills the
      // glass to its own, and the phone goes from its own size to whatever
      // keeps its glass on the page.
      const pageScale = fit + (1 - fit) * locking;

      // Past the lock the page is home and only the frame keeps going, until
      // the part of the glass it does not reach into is past all four edges
      // of the screen. The phone scales about the centre of the screen, so
      // each edge moves away from that centre in proportion to its distance,
      // and the scale that carries the nearest one out is the largest of the
      // four ratios.
      const clearTop = frame.offsetTop + clear.offsetTop;
      const clearLeft = frame.offsetLeft + clear.offsetLeft;
      const clearBottom = clearTop + clear.offsetHeight;
      const clearRight = clearLeft + clear.offsetWidth;
      const midX = screenWidth / 2;
      const midY = screenHeight / 2;
      const cover =
        Math.max(
          midY / (midY - clearTop),
          (screenHeight - midY) / (clearBottom - midY),
          midX / (midX - clearLeft),
          (screenWidth - midX) / (clearRight - midX),
        ) * WINDOW.coverSlack;
      const phoneScale =
        pageScale / fit +
        (cover - 1 / fit) * spanProgress(progress, WINDOW.lockEnds, 1);

      page.style.transform = `translateY(${lead}px) scale(${pageScale})`;
      phone.style.transform = `scale(${phoneScale})`;
      glass.style.setProperty(
        "--glass-lines",
        `${WINDOW.lines * (1 - spanProgress(progress, 0, WINDOW.linesGone))}`,
      );
      words.style.opacity = `${1 - spanProgress(progress, 0, WINDOW.wordsGone)}`;
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
    // Black, because the lid is opaque. Clipped, because the page running
    // ahead of the lid during the climb is cut at the lid's top edge rather
    // than shown over the section before it. Clip and not hidden: hidden would
    // make this box the scroller the pin is held by, and the pin would die.
    <div
      ref={passageRef}
      className="relative overflow-clip bg-black border-t border-white/20"
    >
      {/* The pin: this box is one screen plus the runway, and the negative
          margin keeps it out of the flow so the page starts where it starts. */}
      <div
        ref={pinRef}
        style={{
          height: `calc(100vh + ${WINDOW.runway}vh)`,
          marginBottom: `calc((100vh + ${WINDOW.runway}vh) * -1)`,
        }}
      >
        <div className="pointer-events-none sticky top-0 z-10 h-screen overflow-hidden">
          <div
            ref={phoneRef}
            className="absolute inset-0 flex items-center justify-center px-3 will-change-transform"
          >
            {/* Centred on its own, with the line hung above it rather than
                stacked with it: the zoom that ends the passage is read off the
                glass being in the middle of the screen. The portrait phone is
                capped by its height, 80vh of it, so that line keeps a place
                on the screen. */}
            <div
              ref={frameRef}
              className="relative w-full max-w-[39.5vh] lg:w-[72%] lg:max-w-none"
            >
              {/* One element, both blacks: its shadow hides the page all around
                  the phone, its own background is the glass. The glass is
                  scanlines, one line of black in every three, which is what a
                  screen looks like up close, and the zoom grows the lines with
                  the screen. The script writes only how much black they hold. */}
              <div
                ref={glassRef}
                className="absolute inset-[2.39%_5.52%] rounded-[13.6%/6.3%] bg-[image:repeating-linear-gradient(rgb(0_0_0/var(--glass-lines,0))_0_1px,transparent_1px_3px)] shadow-[0_0_0_100vmax_#000] lg:inset-[5.52%_2.39%] lg:rounded-[6.3%/13.6%]"
              />
              {/* The glass minus the camera island, which sits on it: 7.25% of
                  the frame from the top in portrait, from the right in
                  landscape, measured off the PNGs. Nothing is painted here, it
                  is the box the zoom has to carry past the screen. */}
              <div
                ref={clearRef}
                className="absolute inset-[8%_5.52%_2.39%] lg:inset-[5.52%_8%_5.52%_2.39%]"
              />

              <Image
                src="/phones/bg-transparent-landscape.png"
                alt=""
                width={2936}
                height={1450}
                quality={100}
                sizes="72vw"
                className="relative hidden w-full lg:block"
              />
              <Image
                src="/phones/bg-transparent-portrait.png"
                alt=""
                width={1450}
                height={2936}
                quality={100}
                sizes="100vw"
                className="relative w-full lg:hidden"
              />

              <p
                ref={wordsRef}
                className="absolute inset-x-0 bottom-full mb-6 text-center font-medium text-[1.05rem] text-white leading-snug tracking-tight md:text-6xl"
              >
                Découvrez nos réalisations phares.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The page itself, at its real width and painted small enough to fill
          the glass. The space above it is the runway plus the landing: the
          dive scrolls the page up by exactly the runway, so when it ends what
          is above the page's own top edge is the landing and nothing else.
          Never shorter than the pin box: a page that ran out before the dive
          had ended would end the document with the frame still on it. */}
      <div
        ref={pageRef}
        className={cn(
          "relative z-0 origin-top will-change-transform",
          className,
        )}
        style={{
          paddingTop: `${WINDOW.runway + WINDOW.landing}vh`,
          minHeight: `calc(100vh + ${WINDOW.runway}vh)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PhoneWindow;
