import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // R3F + three are heavy; transpile from src in case of ESM quirks.
  transpilePackages: ["three"],
};

export default nextConfig;
