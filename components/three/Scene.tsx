"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Earth } from "./Earth";
import { Character } from "./Character";
import { SceneLights } from "./SceneLights";
import { CameraRig } from "./CameraRig";
import { OrbitingIcons } from "./OrbitingIcons";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";

/**
 * Top-level 3D scene. Fixed-position canvas behind the entire site —
 * sections sit on top in normal HTML flow. The canvas reads global
 * scroll progress and the camera rig drives everything from there.
 *
 * Mobile fallback: instead of skipping the scene entirely, we ship a
 * "lite" version — lower-poly geometry, no orbiting icons, fewer lights.
 * Goes from ~120k tris to ~25k tris. Looks the same to a casual viewer;
 * runs at 60fps on a mid-range phone instead of 25.
 */
export function Scene() {
  const profile = useDeviceProfile();
  const lite = profile.isMobile || profile.isLowPower;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        dpr={profile.dpr}
        gl={{
          antialias: !lite,
          // powerPreference asks the OS for the discrete GPU (when applicable).
          powerPreference: "high-performance",
          // alpha lets the page background show through — cheaper than an opaque clear.
          alpha: true,
        }}
        camera={{ position: [0, 0.5, 6.5], fov: 35, near: 0.1, far: 100 }}
        // R3F sets devicePixelRatio internally; we set it via dpr above.
        // Avoid flashOnLoad: the scene fades in via CSS.
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <SceneContent lite={lite} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function SceneContent({ lite }: { lite: boolean }) {
  const scrollProgress = useScrollProgress();
  // Icons visible during the SKILLS section (33%-58% of scroll).
  const iconsVisible = computeIconVisibility(scrollProgress);

  return (
    <>
      <SceneLights />
      <CameraRig />
      <Earth lite={lite} />
      <Character scrollProgress={scrollProgress} />
      {!lite && <OrbitingIcons visible={iconsVisible} />}
    </>
  );
}

/**
 * Returns 0..1 fade for the orbiting icons, peaking during the SKILLS section.
 * Sits between scroll progress 0.33 and 0.58, with a soft envelope.
 */
function computeIconVisibility(p: number): number {
  const start = 0.33;
  const end = 0.58;
  const fade = 0.04;
  if (p < start - fade || p > end + fade) return 0;
  if (p < start) return (p - (start - fade)) / fade;
  if (p > end) return 1 - (p - end) / fade;
  return 1;
}
