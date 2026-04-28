"use client";

import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

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

  const day = useLoader(TextureLoader, "/textures/earth-day.jpg");
  const clouds = useLoader(TextureLoader, "/textures/earth-clouds.jpg");

  day.colorSpace = THREE.SRGBColorSpace;
  clouds.colorSpace = THREE.SRGBColorSpace;
  day.anisotropy = 8;

  useFrame((_, delta) => {
    if (surfaceRef.current) surfaceRef.current.rotation.y += delta * 0.05;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.07;
  });

  const groupTilt: [number, number, number] = [0.4, 0, 0];

  return (
    <group position={position} rotation={groupTilt}>
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

      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[radius, 64, 32]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function createAtmosphereMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color("#8A4FE8") },
      uPower: { value: 2.4 },
      uIntensity: { value: 1.1 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vEye;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vEye = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uPower;
      uniform float uIntensity;
      varying vec3 vNormal;
      varying vec3 vEye;
      void main() {
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
