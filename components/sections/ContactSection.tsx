"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function ContactSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-contact-line]", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-screen w-full flex items-center justify-center"
      aria-label="Contact"
    >
      <div className="px-8 md:px-16 max-w-3xl text-center">
        <p
          data-contact-line
          className="text-plum-glow text-sm tracking-[0.3em] uppercase mb-8"
        >
          Get in touch
        </p>
        <h2
          data-contact-line
          className="text-4xl md:text-6xl lg:text-7xl font-display font-medium text-bone leading-[0.95] tracking-tight mb-12"
        >
          Have something
          <br />
          worth building?
        </h2>

        <div data-contact-line className="flex flex-col items-center gap-6">
          <a
            href="mailto:hello@example.com"
            className="
              group relative inline-flex items-center gap-3
              px-8 py-4 rounded-full
              bg-plum text-bone font-medium tracking-wide
              transition-all duration-500 cinematic
              hover:bg-plum-glow
              shadow-[0_0_40px_-8px_rgba(108,43,217,0.5)]
              hover:shadow-[0_0_60px_-4px_rgba(138,79,232,0.7)]
            "
          >
            <span>Start a conversation</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              className="transition-transform duration-500 group-hover:translate-x-1"
              aria-hidden
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <div className="flex gap-8 text-sm text-bone-dim mt-4">
            <a href="#" className="hover:text-bone transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-bone transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-bone transition-colors">
              Read.cv
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
