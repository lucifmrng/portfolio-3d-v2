"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const TIMELINE = [
  { year: "2024", role: "Lead Frontend Engineer", org: "Aether" },
  { year: "2023", role: "Senior Engineer", org: "Forge Studio" },
  { year: "2022", role: "Engineering Lead", org: "Halcyon Health" },
  { year: "2020", role: "Frontend Engineer", org: "Northwind Labs" },
  { year: "2019", role: "Junior Engineer", org: "Studio Twelve" },
];

export function ExperienceSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Vertical line draws as user scrolls.
      gsap.from("[data-timeline-line]", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 60%",
          end: "bottom 60%",
          scrub: 1,
        },
      });

      // Each row reveals as it crosses the midpoint.
      gsap.utils.toArray<HTMLElement>("[data-timeline-row]").forEach((el) => {
        gsap.from(el, {
          x: -30,
          opacity: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative min-h-screen w-full flex items-center"
      aria-label="Experience"
    >
      <div className="px-8 md:px-16 max-w-3xl">
        <p className="text-plum-glow text-sm tracking-[0.3em] uppercase mb-12">
          Timeline
        </p>

        <div className="relative pl-8">
          <div
            data-timeline-line
            className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-plum-glow via-plum to-transparent"
          />
          <ul className="space-y-12">
            {TIMELINE.map((entry) => (
              <li
                key={entry.year + entry.org}
                data-timeline-row
                className="relative"
              >
                <span className="absolute -left-[33px] top-2 w-2 h-2 rounded-full bg-plum-glow shadow-[0_0_12px_2px_rgba(138,79,232,0.6)]" />
                <p className="text-xs tracking-[0.25em] uppercase text-bone-dim mb-1">
                  {entry.year}
                </p>
                <h3 className="text-xl md:text-2xl font-display font-medium text-bone tracking-tight">
                  {entry.role}
                </h3>
                <p className="text-bone-dim text-base mt-1">{entry.org}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
