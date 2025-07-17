import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizeCss: false, // Disable CSS optimization that might affect animations
  }
};

export default nextConfig;
