"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Global scroll progress (0..1 across the entire document).
 * Read this from the 3D scene to drive camera and character motion.
 *
 * Why a hook + global state instead of per-section triggers in the 3D scene:
 *   The 3D scene runs in its own RAF (R3F's useFrame). If each section
 *   sets up its own ScrollTrigger that pokes at scene state, you fight
 *   yourself: triggers fire in DOM-event order, not frame order. One
 *   global value, sampled inside useFrame, gives you smooth interpolation.
 */

let _progress = 0;
const _listeners = new Set<(p: number) => void>();

if (typeof window !== "undefined") {
  // Set up exactly one ScrollTrigger that owns the progress value.
  // Wait for next tick so ScrollTrigger registration in providers completes.
  queueMicrotask(() => {
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        _progress = self.progress;
        _listeners.forEach((fn) => fn(_progress));
      },
    });
  });
}

export function getScrollProgress(): number {
  return _progress;
}

export function useScrollProgress(): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    _listeners.add(setP);
    setP(_progress);
    return () => {
      _listeners.delete(setP);
    };
  }, []);
  return p;
}
