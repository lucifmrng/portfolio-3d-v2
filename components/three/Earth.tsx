"use client";

import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

/**
 * Earth as three concentric layers:
 *   1. Surface sphere with day texture + bump
 *   2. Cloud sphere slightly above, slowly counter-rotating
 *   3. Atmosphere shell using a fresnel shader for the rim glow
 *
 * Required textures in /public/textures/:
 *   - earth-day.jpg   (NASA Visible Earth — Blue Marble)
 *   - earth-clouds.jpg (NASA Visible Earth — Cloud Cover)
 *
 * Without these, the spheres render solid gray. See public/textures/README.md.
 *
 * Performance note: bump and normal maps are skipped on mobile (passed via
 * `lite` prop). The fresnel shader is cheap and stays on everywhere.
 */
export function Earth({
  radius = 1.6,
  lite = false,
  position = [0, -0.4, 0],
}: {
  radius?: number;
  lite?: boolean;
  position?: [number, number, number];
}) {
  const surfaceRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmosphereMaterial = useMemo(() => createAtmosphereMaterial(), []);

  // Texture loading. R3F's useLoader suspends; the parent should wrap in <Suspense>.
  const textures = useLoader(TextureLoader, [
    "/textures/earth-day.jpg",
    "/textures/earth-clouds.jpg",
  ]);
  const day = textures[0]!;
  const clouds = textures[1]!;
  // sRGB so colors aren't washed out by the linear renderer.
  day.colorSpace = THREE.SRGBColorSpace;
  clouds.colorSpace = THREE.SRGBColorSpace;
  // Improve sampling at glancing angles (the rim of the planet).
  day.anisotropy = 8;

  useFrame((_, delta) => {
    // Slow rotation — 1 full rotation every ~2 minutes. Aspirational, not realistic.
    if (surfaceRef.current) surfaceRef.current.rotation.y += delta * 0.05;
    // Clouds drift slightly faster to feel alive.
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.07;
  });

  // Two-pass tilt. Real Earth tilts ~23.5°; we use it for visual interest.
  const groupTilt: [number, number, number] = [0.4, 0, 0];

  return (
    <group position={position} rotation={groupTilt}>
      {/* Surface */}
      <mesh ref={surfaceRef}>
        <sphereGeometry args={[radius, lite ? 48 : 96, lite ? 24 : 48]} />
        <meshStandardMaterial
          map={day}
          roughness={0.85}
          metalness={0}
          emissive={new THREE.Color(0x0a0612)}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[radius * 1.012, lite ? 48 : 96, lite ? 24 : 48]} />
        <meshStandardMaterial
          map={clouds}
          alphaMap={clouds}
          transparent
          opacity={0.55}
          depthWrite={false}
          roughness={1}
        />
      </mesh>

      {/* Atmosphere — rim glow via fresnel */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[radius, 64, 32]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Custom shader material for the atmosphere rim. Cheap: one dot product
 * and a power curve in the fragment shader. The visual hook is the
 * back-side rendering — we draw the inside of a slightly larger sphere
 * so the rim is visible against the background.
 */
function createAtmosphereMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color("#8A4FE8") }, // matches plum.glow
      uPower: { value: 2.4 },
      uIntensity: { value: 1.1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vEye;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vEye = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uPower;
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vEye;
      void main() {
        // Backside fresnel: rim is brightest where normal faces away from camera.
        float rim = pow(1.0 - max(dot(vNormal, vEye), 0.0), uPower);
        gl_FragColor = vec4(uColor * rim * uIntensity, rim);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}
