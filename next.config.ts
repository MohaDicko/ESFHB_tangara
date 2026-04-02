import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    instantNavigationDevToolsToggle: true,
  }
};

export default nextConfig;
