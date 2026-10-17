import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack resolves SSR chunks correctly even
  // when stray lockfiles exist in parent directories (npm scripts always run
  // from the project root, so cwd is stable here). Without this, Next infers
  // the wrong root and `next start` fails to load runtime chunks.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
