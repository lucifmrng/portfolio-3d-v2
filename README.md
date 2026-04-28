# Portfolio · 3D

A scroll-driven personal portfolio built with Next.js 15, React Three Fiber,
GSAP, and Lenis. Six sections, one continuous camera spline, geometric
character with cursor head-track, and Earth with NASA textures.

## Stack

- Next.js 15 (App Router) + TypeScript strict
- React Three Fiber + Drei + Three.js for the 3D scene
- GSAP + ScrollTrigger for scroll-driven motion
- Lenis for smooth scrolling, wired to ScrollTrigger via `scrollerProxy`
- Tailwind CSS for layout & tokens
- Inter via `next/font` (swap to Satoshi if you self-host)

## Run

```bash
pnpm install
# Drop NASA textures into public/textures/ — see public/textures/README.md
pnpm dev
```

Open <http://localhost:3000>. Press `p` for the FPS HUD.

## Structure

```
app/
  layout.tsx            # Root layout, font wiring
  page.tsx              # Composes Scene + sections
  globals.css           # Tailwind, ambient gradient, reduced-motion
components/
  SmoothScrollProvider  # Lenis + GSAP integration
  three/
    Scene               # Top-level Canvas, lite/full split
    Earth               # 3-layer Earth (surface + clouds + atmosphere fresnel)
    Character           # Geometric humanoid, idle motion + head-track
    CameraRig           # 6-keyframe Catmull-Rom spline driven by scroll
    OrbitingIcons       # Skill icons orbiting Earth (skills section only)
    SceneLights         # 3-light rig
  sections/
    HeroSection
    AboutSection
    SkillsSection
    ProjectsSection     # Horizontal scroll-pin
    ExperienceSection   # Vertical timeline with line-draw
    ContactSection
  ui/
    Nav                 # Floating pill, fades in past hero
    PerfHud             # Toggle with 'p'
hooks/
  useScrollProgress     # Global 0..1 scroll value
  useMouseRef           # Normalized mouse position, ref-based
  useDeviceProfile      # Mobile / low-power / reduced-motion detection
public/textures/
  README.md             # NASA texture URLs
```

## Design choices, briefly

**Restraint over maximalism.** One purple glow accent, one ambient gradient,
one easing curve (`cubic-bezier(0.16, 1, 0.3, 1)`). This is what separates
"premium feel" from "every effect turned on." If you want it louder, dial up
specific things — don't dial up everything.

**One scroll source of truth.** Lenis owns scroll position, GSAP's ticker
drives Lenis, and a single ScrollTrigger publishes a 0..1 progress value
that the 3D scene reads inside `useFrame`. No fighting between systems.

**Camera is a spline, not a slideshow.** Six keyframes through a
Catmull-Rom curve give continuous motion. With section-snapping, the camera
stops between sections; with splines, it's always going somewhere.

**Mobile graceful degradation.** Lower-poly geometry, fewer lights, no
orbiting icons, capped DPR at 1.5×. Same visual language; different budget.
A Retina iPhone at native 3× DPR is the difference between 60fps and 25fps.

**Reduced-motion respected at every layer.** OS setting bypasses Lenis,
short-circuits CSS animations, and skips most GSAP scrubs. Not just visual
politeness — the brief asked for premium and accessibility is part of that.

## What's a stub vs. what's real

Real:
- The full scroll system, camera rig, and all section animations
- The Earth shader and material setup (just needs textures)
- The character, lighting, orbiting icons
- Mobile fallback path

Stub-shaped:
- Project entries are placeholder text — swap in your real work
- Timeline entries are made-up — swap in your real history
- Email link goes to `hello@example.com`
- Social links go to `#`
- No analytics, no contact form backend — those are deploy-time choices

## Performance notes

Targeting 60fps on a 2020 MacBook Air and 30+fps on a mid-range Android.
The PerfHud (press `p`) is for tuning — if you see numbers below those,
likely culprits in order: (1) DPR too high on mobile, fix in
`useDeviceProfile`, (2) too many polys on the character, swap geometries
for `lite` versions, (3) atmosphere shader running on the GPU under
contention with another tab, not your problem.

Lighthouse will complain about JavaScript bundle size — Three.js is
~600KB minified. That's the tax for any 3D site. If first-load matters
more than 3D for some routes, code-split the Scene component behind a
dynamic import.
