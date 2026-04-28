"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const SKILLS = [
  { name: "TypeScript", level: "Daily driver" },
  { name: "React / Next.js", level: "5+ years" },
  { name: "Three.js / R3F", level: "Production work" },
  { name: "GSAP / Motion", level: "Cinematic UI" },
  { name: "Design systems", level: "Tokens to ship" },
  { name: "WebGL shaders", level: "Comfortable" },
];

export function SkillsSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-skill]", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          end: "top 20%",
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
      aria-label="Skills"
    >
      <div className="px-8 md:px-16 max-w-4xl text-center">
        <p className="text-plum-glow text-sm tracking-[0.3em] uppercase mb-8">
          Toolkit
        </p>
        <h2 className="text-3xl md:text-5xl font-display font-medium text-bone leading-tight tracking-tight mb-16">
          The instruments I reach for first.
        </h2>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-10 text-left">
          {SKILLS.map((skill) => (
            <li
              key={skill.name}
              data-skill
              className="group cursor-default"
            >
              <p className="text-xl md:text-2xl text-bone font-medium tracking-tight transition-colors duration-500 group-hover:text-plum-glow">
                {skill.name}
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-bone-dim mt-1">
                {skill.level}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
