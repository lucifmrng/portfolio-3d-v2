"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the plugin synchronously when this module loads in the browser.
// SmoothScrollProvider also registers it — registration is idempotent, so
// doing it twice is safe. Doing it zero times is what was breaking us.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

let _progress = 0;
const _listeners = new Set<(p: number) => void>();
let _initialized = false;

function initialize() {
  if (_initialized) return;
  if (typeof window === "undefined") return;
  if (typeof document === "undefined") return;

  _initialized = true;
  ScrollTrigger.create({
    trigger: document.documentElement,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => {
      _progress = self.progress;
      _listeners.forEach((fn) => fn(_progress));
    },
  });
}

export function getScrollProgress(): number {
  return _progress;
}

export function useScrollProgress(): number {
  const [p, setP] = useState(0);

  useEffect(() => {
    // Initialize on first hook usage rather than at module load. By the time
    // a component is mounted and effects run, the DOM is ready and any other
    // ScrollTrigger setup has finished.
    initialize();
    _listeners.add(setP);
    setP(_progress);
    return () => {
      _listeners.delete(setP);
    };
  }, []);

  return p;
}
