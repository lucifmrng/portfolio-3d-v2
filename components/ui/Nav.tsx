"use client";

import { useEffect, useState } from "react";

/**
 * Minimalist nav. Fades in once past the hero and fades out at the bottom.
 * Drives entirely off scroll position read at intervals — no IntersectionObserver
 * needed for something this simple, no listeners on every frame.
 */
export function Nav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Visible after 60% of one viewport, hidden in the last 5% of the page.
      setVisible(y > window.innerHeight * 0.6 && y < max * 0.95);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`
        fixed top-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-8
        px-6 py-3 rounded-full
        bg-white/[0.04] backdrop-blur-md
        border border-white/[0.06]
        transition-all duration-700 cinematic
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
      `}
    >
      <a href="#" className="text-bone text-sm font-medium tracking-tight">
        ◇
      </a>
      <span className="w-px h-4 bg-white/10" />
      {["About", "Work", "Contact"].map((label) => (
        <a
          key={label}
          href={`#${label.toLowerCase()}`}
          className="text-bone-dim hover:text-bone text-sm tracking-tight transition-colors duration-500"
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
