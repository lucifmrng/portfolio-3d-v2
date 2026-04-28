"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Earth } from "./Earth";
import { Character } from "./Character";
import { SceneLights } from "./SceneLights";
import { CameraRig } from "./CameraRig";
import { OrbitingIcons } from "./OrbitingIcons";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[Scene] crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function Scene() {
  const profile = useDeviceProfile();
  const lite = profile.isMobile || profile.isLowPower;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        dpr={profile.dpr}
        gl={{
          antialias: !lite,
          powerPreference: "high-performance",
          alpha: true,
        }}
        camera={{ position: [0, 0.5, 6.5], fov: 35, near: 0.1, far: 100 }}
        style={{ background: "transparent" }}
      >
        <SceneErrorBoundary fallback={<FallbackScene />}>
          <Suspense fallback={<FallbackScene />}>
            <SceneContent lite={lite} />
          </Suspense>
        </SceneErrorBoundary>
      </Canvas>
    </div>
  );
}

function SceneContent({ lite }: { lite: boolean }) {
  const scrollProgress = useScrollProgress();
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

function FallbackScene() {
  return (
    <>
      <ambientLight intensity={0.3} color="#3D1873" />
      <directionalLight position={[4, 4, 5]} intensity={1.2} color="#F8F4FF" />
      <pointLight position={[0, 2, -4]} intensity={2} color="#8A4FE8" />
      <mesh position={[0, -0.4, 0]}>
        <sphereGeometry args={[1.6, 64, 32]} />
        <meshStandardMaterial color="#3D1873" roughness={0.7} metalness={0.2} />
      </mesh>
    </>
  );
}

function computeIconVisibility(p: number): number {
  const start = 0.33;
  const end = 0.58;
  const fade = 0.04;
  if (p < start - fade || p > end + fade) return 0;
  if (p < start) return (p - (start - fade)) / fade;
  if (p > end) return 1 - (p - end) / fade;
  return 1;
}
