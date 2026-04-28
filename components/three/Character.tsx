"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMouseRef } from "@/hooks/useMouseRef";

/**
 * Stylized humanoid character built from primitives.
 *
 * Design choices, in case you want to tweak:
 *   - Slight forward lean of the torso reads as "alert" without animation.
 *   - Head is sphere-shape but slightly squashed vertically — feels less
 *     like an emoji.
 *   - Arms are short capsule stubs, intentionally non-articulated. Adding
 *     elbows/hands without proper rigging makes it look uncanny.
 *   - One emissive accent (chest dot) gives the silhouette a focal point.
 *
 * Idle behavior:
 *   - Vertical bob (breath cycle, ~2.5s)
 *   - Subtle whole-body sway tied to scroll progress (passed via prop)
 *   - Head tracks cursor with damped follow
 *
 * Materials are MeshStandardMaterial with low-saturation purples — the
 * character should read as silhouetted against the Earth, not compete.
 */
export function Character({
  position = [3, -0.8, 0],
  scrollProgress = 0,
}: {
  position?: [number, number, number];
  scrollProgress?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Mesh>(null);
  const mouse = useMouseRef();

  // Materials shared across parts — minor performance win, also visual cohesion.
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#B8A4D9",
        roughness: 0.4,
        metalness: 0.15,
      }),
    [],
  );
  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1A1024",
        roughness: 0.6,
        metalness: 0.2,
      }),
    [],
  );
  const glowMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8A4FE8",
        emissive: "#8A4FE8",
        emissiveIntensity: 1.5,
        roughness: 0.3,
      }),
    [],
  );

  // Damped values for smooth interpolation. Read from refs inside useFrame
  // to avoid React state thrash.
  const damp = useRef({ headY: 0, headX: 0, sway: 0, breath: 0 });

  useFrame((state, delta) => {
    if (!root.current || !head.current || !torso.current) return;

    const t = state.clock.elapsedTime;

    // Breathing — scale torso vertically ~1% on a 2.5s cycle.
    damp.current.breath = Math.sin(t / 1.25) * 0.008;
    torso.current.scale.y = 1 + damp.current.breath;

    // Body bob.
    root.current.position.y = position[1] + Math.sin(t / 1.5) * 0.04;

    // Body sway tied to scroll — small angular drift gives the figure
    // a sense that it's reacting to the journey, not just standing.
    const targetSway = scrollProgress * 0.3 - 0.15;
    damp.current.sway += (targetSway - damp.current.sway) * delta * 2;
    root.current.rotation.z = damp.current.sway * 0.1;

    // Head tracks cursor — damped lerp toward mouse direction.
    const targetX = mouse.current.x * 0.5;
    const targetY = mouse.current.y * 0.3;
    damp.current.headX += (targetX - damp.current.headX) * delta * 4;
    damp.current.headY += (targetY - damp.current.headY) * delta * 4;
    head.current.rotation.y = damp.current.headX;
    head.current.rotation.x = damp.current.headY;
  });

  return (
    <group ref={root} position={position}>
      {/* Torso — slightly forward-leaning capsule */}
      <mesh ref={torso} position={[0, 0.5, 0]} rotation={[-0.05, 0, 0]} material={bodyMat}>
        <capsuleGeometry args={[0.18, 0.45, 6, 16]} />
      </mesh>

      {/* Chest accent — single emissive dot, the silhouette's focal point */}
      <mesh position={[0, 0.55, 0.18]} material={glowMat}>
        <sphereGeometry args={[0.025, 16, 16]} />
      </mesh>

      {/* Head group — rotated independently to track cursor */}
      <group ref={head} position={[0, 1.05, 0]}>
        <mesh material={bodyMat} scale={[1, 0.92, 1]}>
          <sphereGeometry args={[0.18, 32, 24]} />
        </mesh>
        {/* Visor — the only "feature" on the face. Non-symmetric edges read futuristic. */}
        <mesh position={[0, 0.02, 0.13]} rotation={[0.1, 0, 0]} material={accentMat}>
          <boxGeometry args={[0.22, 0.06, 0.08]} />
        </mesh>
      </group>

      {/* Shoulders / arm stubs */}
      <mesh position={[-0.22, 0.55, 0]} rotation={[0, 0, 0.15]} material={bodyMat}>
        <capsuleGeometry args={[0.07, 0.35, 6, 12]} />
      </mesh>
      <mesh position={[0.22, 0.55, 0]} rotation={[0, 0, -0.15]} material={bodyMat}>
        <capsuleGeometry args={[0.07, 0.35, 6, 12]} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.08, -0.05, 0]} material={bodyMat}>
        <capsuleGeometry args={[0.08, 0.45, 6, 12]} />
      </mesh>
      <mesh position={[0.08, -0.05, 0]} material={bodyMat}>
        <capsuleGeometry args={[0.08, 0.45, 6, 12]} />
      </mesh>

      {/* Base ring — visual anchor, hints "standing on something" */}
      <mesh position={[0, -0.42, 0]} material={accentMat}>
        <torusGeometry args={[0.22, 0.012, 12, 32]} />
      </mesh>
    </group>
  );
}
