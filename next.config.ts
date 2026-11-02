import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is intentionally disabled — use `npm run dev` (webpack).
  // Turbopack on Windows with stray lockfiles in parent directories causes
  // SSR chunk resolution failures (.next/server/pages/_document.js crash).
};

export default nextConfig;
