"use client";

import { useEffect, useState } from "react";

export interface DeviceProfile {
  isMobile: boolean;
  isLowPower: boolean;
  reducedMotion: boolean;
  // Render dpr clamp: high-DPI phones tank the GPU at native 3x resolution.
  dpr: [number, number];
}

/**
 * Detect device capability. We don't need exact specs — just enough signal
 * to decide between "full scene" and "lighter scene." The conservative
 * approach: trust nothing, ship light by default on touch.
 */
export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>({
    isMobile: false,
    isLowPower: false,
    reducedMotion: false,
    dpr: [1, 2],
  });

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Crude signal: ≤4 cores OR ≤4GB device memory (when reported) → low power.
    // navigator.deviceMemory is non-standard but supported by Chromium/most Android.
    const cores = navigator.hardwareConcurrency ?? 8;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const isLowPower = cores <= 4 || memory <= 4;

    setProfile({
      isMobile,
      isLowPower,
      reducedMotion,
      // Cap DPR aggressively on mobile: a 3x retina phone at native res
      // is the difference between 60fps and 25fps.
      dpr: isMobile ? [1, 1.5] : [1, 2],
    });
  }, []);

  return profile;
}
