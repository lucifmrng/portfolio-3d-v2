"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A small constellation of geometric "skill icons" orbiting the Earth.
 * Each icon is a primitive shape — no SVG-to-mesh conversion, no icon
 * fonts. The name labels live in HTML overlays (see HtmlLabels.tsx) so
 * they stay crisp at any scale.
 *
 * Visibility is faded based on scroll progress: icons appear during the
 * SKILLS section (~35-50% scroll) and fade otherwise.
 */

interface OrbitingItem {
  shape: "diamond" | "hexagon" | "ring" | "torus" | "cube";
  radius: number;
  speed: number;
  inclination: number;
  phase: number;
  scale: number;
}

const ITEMS: OrbitingItem[] = [
  { shape: "diamond", radius: 2.4, speed: 0.3, inclination: 0.3, phase: 0, scale: 0.18 },
  { shape: "hexagon", radius: 2.6, speed: -0.25, inclination: -0.2, phase: 1.2, scale: 0.22 },
  { shape: "ring", radius: 2.3, speed: 0.4, inclination: 0.5, phase: 2.4, scale: 0.26 },
  { shape: "torus", radius: 2.7, speed: -0.2, inclination: -0.4, phase: 3.6, scale: 0.2 },
  { shape: "cube", radius: 2.5, speed: 0.35, inclination: 0.1, phase: 4.8, scale: 0.16 },
];

export function OrbitingIcons({ visible = 1 }: { visible?: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const item = ITEMS[i];
      if (!item) return;
      const angle = t * item.speed + item.phase;
      child.position.x = Math.cos(angle) * item.radius;
      child.position.z = Math.sin(angle) * item.radius;
      child.position.y = Math.sin(angle + item.phase) * item.inclination - 0.4;
      child.rotation.x = t * 0.5 + item.phase;
      child.rotation.y = t * 0.3 + item.phase;
    });
    // Group-wide opacity via material traversal — cheap, doesn't allocate.
    const opacity = visible;
    group.current.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material) {
        const mat = obj.material as THREE.MeshStandardMaterial;
        mat.opacity = opacity;
        mat.transparent = true;
      }
    });
    group.current.visible = opacity > 0.01;
  });

  return (
    <group ref={group}>
      {ITEMS.map((item, i) => (
        <IconMesh key={i} item={item} />
      ))}
    </group>
  );
}

function IconMesh({ item }: { item: OrbitingItem }) {
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#B8A4D9",
        emissive: "#6C2BD9",
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.5,
      }),
    [],
  );

  switch (item.shape) {
    case "diamond":
      return (
        <mesh material={material} scale={item.scale}>
          <octahedronGeometry args={[1, 0]} />
        </mesh>
      );
    case "hexagon":
      return (
        <mesh material={material} scale={item.scale}>
          <cylinderGeometry args={[1, 1, 0.3, 6]} />
        </mesh>
      );
    case "ring":
      return (
        <mesh material={material} scale={item.scale}>
          <torusGeometry args={[1, 0.15, 12, 24]} />
        </mesh>
      );
    case "torus":
      return (
        <mesh material={material} scale={item.scale}>
          <torusKnotGeometry args={[0.7, 0.2, 64, 8]} />
        </mesh>
      );
    case "cube":
      return (
        <mesh material={material} scale={item.scale} rotation={[0.5, 0.5, 0]}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
        </mesh>
      );
  }
}
