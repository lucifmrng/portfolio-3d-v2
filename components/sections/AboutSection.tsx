"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function AboutSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger reveal on the lines as the section enters.
      gsap.from("[data-about-line]", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-screen w-full flex items-center"
      aria-label="About"
    >
      <div className="px-8 md:px-16 max-w-2xl ml-auto mr-8 md:mr-32">
        <p
          data-about-line
          className="text-plum-glow text-sm tracking-[0.3em] uppercase mb-8"
        >
          About
        </p>
        <h2
          data-about-line
          className="text-3xl md:text-5xl font-display font-medium text-bone leading-tight tracking-tight"
        >
          I design and build digital products at the intersection of motion,
          interaction, and clarity.
        </h2>
        <p data-about-line className="text-bone-dim text-base md:text-lg mt-8 leading-relaxed">
          Five years shipping production frontends for fintech, travel, and
          developer tools. Comfortable down at the canvas and shader level,
          equally at home in a design system meeting.
        </p>
        <p data-about-line className="text-bone-dim text-base md:text-lg mt-4 leading-relaxed">
          Most of my best work doesn&apos;t make it into a portfolio — it&apos;s
          inside someone else&apos;s product, doing the thing the user expected
          to be hard but wasn&apos;t.
        </p>
      </div>
    </section>
  );
}
