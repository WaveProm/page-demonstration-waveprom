"use client";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

// The weight of the scroll. The wheel no longer moves the page by itself: it
// moves a target, and the page runs after that target a little behind on every
// frame, which is what reads as mass. The scroll underneath stays the native
// one, so sticky elements and the scroll listeners of the page know nothing
// about it. Lenis is the engine behind Locomotive Scroll v5, with its defaults.
//
// Touch is left to the browser: on a phone the thumb already is the weight.
//
// A reader who asked for less motion gets the browser's scroll as it is.

// EVERY number the feel is made of.
const SCROLL = {
  lerp: 0.1, // share of the distance to the target covered on each frame
  wheelMultiplier: 1, // how far one wheel notch moves the target
};

const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: SCROLL.lerp,
      wheelMultiplier: SCROLL.wheelMultiplier,
      autoRaf: true,
    });
    return () => lenis.destroy();
  }, []);

  return null;
};

export default SmoothScroll;
