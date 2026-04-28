"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks normalized mouse position in [-1, 1] x [-1, 1]. Read from a ref
 * inside useFrame to avoid React re-renders on every mousemove.
 *
 * Touch devices: returns the last position, defaults to (0, 0). The
 * character won't track on touch — that's fine, it just stays neutral.
 */
export function useMouseRef() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return mouse;
}
