"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Lenis + GSAP ScrollTrigger integration.
 *
 * The trap most tutorials fall into: they wire `lenis.on('scroll', ScrollTrigger.update)`
 * but never tell ScrollTrigger that Lenis is the scroller. ScrollTrigger then
 * reads window.scrollY directly, which Lenis transforms — so triggers fire
 * at the wrong positions. The fix is `scrollerProxy` + `ticker` integration.
 *
 * What we set up here, in order:
 *   1. Create the Lenis instance with a calm easing curve.
 *   2. Drive Lenis from GSAP's RAF (one ticker, not two).
 *   3. Tell ScrollTrigger to ask Lenis for scroll position.
 *   4. Disable lag smoothing — it interferes with Lenis's own smoothing.
 *
 * Respects prefers-reduced-motion: bypasses Lenis entirely so the OS
 * setting is honored, not just the visuals.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Honor the user's preference: native scroll, no smooth interpolation.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      // Premium feel: long, slow lerp. 0.08–0.12 is the sweet spot.
      lerp: 0.1,
      // Mouse wheel feels wrong if too sensitive. 1 is default; 0.9 mellows it.
      wheelMultiplier: 0.9,
      // Touch on mobile gets default native behavior — overriding causes bugs.
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Drive Lenis from GSAP's ticker. Single source of truth for time.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0); // Lenis smooths; lagSmoothing fights it.

    // Tell ScrollTrigger that Lenis owns the scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    // First refresh after Lenis is wired so triggers measure correctly.
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
