"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const PROJECTS = [
  {
    title: "Aether Travel",
    blurb: "Booking platform with realtime price updates and motion-driven UX.",
    tag: "2024 · Lead Frontend",
  },
  {
    title: "Forge Studio",
    blurb: "Browser-based 3D modeling tool. Custom WebGL renderer.",
    tag: "2023 · Senior Eng",
  },
  {
    title: "Pulse Banking",
    blurb: "Mobile-first banking app. Component library used by 4 squads.",
    tag: "2023 · Frontend",
  },
  {
    title: "Halcyon Health",
    blurb: "Patient-facing scheduling. WCAG AA compliance, 60fps everywhere.",
    tag: "2022 · Eng Lead",
  },
];

export function ProjectsSection() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scroll-pin: section pins, content slides horizontally
      // as the user scrolls vertically. Classic GSAP technique.
      const trackEl = track.current;
      if (!trackEl) return;

      // Distance to scroll = trackWidth - viewportWidth
      const scrollDistance = () => trackEl.scrollWidth - window.innerWidth;

      gsap.to(trackEl, {
        x: () => -scrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.from("[data-project-card]", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
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
      className="relative h-screen w-full overflow-hidden"
      aria-label="Projects"
    >
      <div className="absolute top-16 left-8 md:left-16 z-10">
        <p className="text-plum-glow text-sm tracking-[0.3em] uppercase">
          Selected work
        </p>
      </div>

      <div
        ref={track}
        className="flex h-full items-center gap-8 pl-8 pr-32 md:pl-16 will-change-transform"
        style={{ width: "max-content" }}
      >
        {PROJECTS.map((p, i) => (
          <article
            key={p.title}
            data-project-card
            className="
              relative flex-shrink-0
              w-[80vw] md:w-[40vw] lg:w-[32vw] h-[60vh]
              rounded-2xl p-8 md:p-10
              bg-white/[0.03] backdrop-blur-md
              border border-white/[0.08]
              flex flex-col justify-between
              transition-colors duration-500
              hover:border-plum/30
            "
          >
            <span className="text-7xl md:text-8xl font-display font-medium text-bone-dim/30 leading-none">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-2xl md:text-3xl font-display font-medium text-bone tracking-tight mb-3">
                {p.title}
              </h3>
              <p className="text-bone-dim text-sm md:text-base leading-relaxed mb-6">
                {p.blurb}
              </p>
              <p className="text-xs tracking-[0.25em] uppercase text-bone-dim/60">
                {p.tag}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
