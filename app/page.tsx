"use client";

import dynamic from "next/dynamic";
import { Nav } from "@/components/ui/Nav";
import { PerfHud } from "@/components/ui/PerfHud";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ContactSection } from "@/components/sections/ContactSection";

// 3D scene is client-only — it uses WebGL, which can't run on a server.
// `ssr: false` tells Next.js to skip server-side rendering for this component
// entirely, which avoids the React internals mismatch with @react-three/fiber.
const Scene = dynamic(
  () => import("@/components/three/Scene").then((m) => m.Scene),
  { ssr: false },
);

const SmoothScrollProvider = dynamic(
  () =>
    import("@/components/SmoothScrollProvider").then(
      (m) => m.SmoothScrollProvider,
    ),
  { ssr: false },
);

export default function Home() {
  return (
    <>
      <Scene />
      <SmoothScrollProvider>
        <Nav />
        <PerfHud />
        <main className="relative">
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ExperienceSection />
          <ContactSection />
        </main>
      </SmoothScrollProvider>
    </>
  );
}
