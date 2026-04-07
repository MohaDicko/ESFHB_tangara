import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: false,
  experimental: {
    instantNavigationDevToolsToggle: true,
  }
};

export default nextConfig;
