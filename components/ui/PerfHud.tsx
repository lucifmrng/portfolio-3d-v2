"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A small, toggleable performance HUD. Press 'p' to show/hide. Off by default.
 *
 * Why a custom one and not Stats.js: we only want fps + a few numbers, not
 * Stats.js's full overlay. The custom version stays in our typography.
 *
 * Sampling: rAF loop, exponential moving average over ~30 frames so the
 * number doesn't twitch. Only mounts a ticker when visible.
 */
export function PerfHud() {
  const [visible, setVisible] = useState(false);
  const [fps, setFps] = useState(60);
  const lastT = useRef(performance.now());
  const ema = useRef(60);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "p" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setVisible((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const dt = now - lastT.current;
      lastT.current = now;
      const instant = 1000 / Math.max(dt, 0.001);
      // EMA with alpha=0.06 — settles in ~50 frames.
      ema.current = ema.current * 0.94 + instant * 0.06;
      setFps(Math.round(ema.current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  if (!visible) return null;

  const bad = fps < 45;
  const meh = fps < 55;

  return (
    <div className="fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 text-xs font-mono tabular-nums">
      <span className={bad ? "text-red-400" : meh ? "text-amber-300" : "text-emerald-300"}>
        {fps} fps
      </span>
      <span className="text-bone-dim ml-2">press p to hide</span>
    </div>
  );
}
