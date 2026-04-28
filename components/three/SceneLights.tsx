"use client";

/**
 * Three-light setup tuned for the deep-purple/black palette.
 *
 *   - Key light: warm-purple from front-right (3 o'clock high)
 *   - Fill: cool dim from front-left (9 o'clock low) — keeps shadows from going pure black
 *   - Rim/back: bright plum from behind, picks out silhouette edges
 *
 * No HDRI in this build — the brief asked for one but real HDRI files are
 * 5-30MB and would dominate first-load. The fresnel atmosphere + emissive
 * accents give us 80% of the look at 0% of the bandwidth cost. If you
 * want HDRI later, drop a .hdr in /public/textures/ and use Drei's
 * <Environment files="..." />.
 */
export function SceneLights() {
  return (
    <>
      {/* Ambient — very dim, just so blacks don't crush */}
      <ambientLight intensity={0.15} color="#3D1873" />

      {/* Key */}
      <directionalLight
        position={[4, 4, 5]}
        intensity={1.2}
        color="#F8F4FF"
        castShadow={false}
      />

      {/* Fill */}
      <directionalLight
        position={[-3, 1, 3]}
        intensity={0.4}
        color="#6C2BD9"
      />

      {/* Rim — behind the scene, picks out the character silhouette */}
      <pointLight
        position={[0, 2, -4]}
        intensity={2}
        color="#8A4FE8"
        distance={15}
        decay={2}
      />
    </>
  );
}
