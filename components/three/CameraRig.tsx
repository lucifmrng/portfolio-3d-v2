"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getScrollProgress } from "@/hooks/useScrollProgress";

/**
 * Cinematic camera. Six keyframes mapped to scroll progress 0..1, one per
 * section. We use Catmull-Rom splines for both position and look-at target
 * so motion never feels segmented at section boundaries.
 *
 * Why splines instead of section-snapping: snapping reads as a slideshow.
 * Awwwards-tier sites move continuously; the camera is always going
 * somewhere even when the user pauses scrolling. Splines through 6 points
 * give us that effortlessly.
 *
 * Tuning: positions placed by hand, not on a circle. The character lives
 * roughly at (3, -0.8, 0); Earth at (0, -0.4, 0); we want the camera to
 * dance between them.
 */

// Keyframes in the form [position, lookAt] for sections 0..5.
const KEYFRAMES: Array<{ pos: [number, number, number]; look: [number, number, number] }> = [
  // 0 — HERO: medium-wide, character on right, Earth dominant
  { pos: [0, 0.5, 6.5], look: [1.5, 0, 0] },
  // 1 — ABOUT: closer in, Earth becomes a backdrop
  { pos: [2, 0.3, 4.5], look: [3, 0, 0] },
  // 2 — SKILLS: pull back and up, Earth centered for orbiting icons
  { pos: [0, 1.5, 7], look: [0, -0.4, 0] },
  // 3 — PROJECTS: side angle, more horizontal
  { pos: [-3, 0, 5], look: [0, 0, 0] },
  // 4 — EXPERIENCE: low angle, dramatic
  { pos: [0, -1.2, 5.5], look: [0, 0.5, 0] },
  // 5 — CONTACT: calm wide shot, character & Earth balanced
  { pos: [0.5, 0.2, 7], look: [1.5, -0.2, 0] },
];

// Convert keyframes to spline curves for smooth interpolation.
const positionCurve = new THREE.CatmullRomCurve3(
  KEYFRAMES.map((k) => new THREE.Vector3(...k.pos)),
  false,
  "catmullrom",
  0.5,
);
const lookCurve = new THREE.CatmullRomCurve3(
  KEYFRAMES.map((k) => new THREE.Vector3(...k.look)),
  false,
  "catmullrom",
  0.5,
);

export function CameraRig() {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const t = getScrollProgress();
    // Sample the curves at scroll progress.
    positionCurve.getPoint(t, targetPos.current);
    lookCurve.getPoint(t, targetLook.current);

    // Damped lerp on top of the spline. ScrollTrigger sometimes fires in
    // bursts; the lerp smooths those bursts into continuous motion.
    // Frame-rate independent: convert delta to a 0..1 lerp factor.
    const k = 1 - Math.exp(-delta * 4);
    camera.position.lerp(targetPos.current, k);
    currentLook.current.lerp(targetLook.current, k);
    camera.lookAt(currentLook.current);
  });

  return null;
}
