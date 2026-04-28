"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title fade-in on mount, but anchored to scroll for the fade-out.
      gsap.from("[data-hero-title]", {
        y: 40,
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        delay: 0.4,
      });
      gsap.from("[data-hero-sub]", {
        y: 20,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.7,
      });
      // Fade content out as user scrolls past — keeps the 3D scene cleaner.
      gsap.to("[data-hero-content]", {
        opacity: 0,
        y: -40,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative h-screen w-full flex items-center"
      aria-label="Hero"
    >
      <div data-hero-content className="px-8 md:px-16 max-w-3xl">
        <p
          data-hero-sub
          className="text-bone-dim text-sm tracking-[0.3em] uppercase mb-6"
        >
          Frontend · 3D · Motion
        </p>
        <h1
          data-hero-title
          className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-bone leading-[0.95] tracking-tight"
        >
          Building
          <br />
          <span className="text-plum-glow">interfaces</span>
          <br />
          worth
          <br />
          remembering.
        </h1>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-bone-dim animate-fade-in">
        <span className="text-xs tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-bone-dim to-transparent" />
      </div>
    </section>
  );
}
