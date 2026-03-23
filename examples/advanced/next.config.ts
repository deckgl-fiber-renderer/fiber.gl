import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    reactCompiler: true,
    ppr: "incremental",
    dynamicIO: true,
    useCache: true,
  },
  poweredByHeader: false,

  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
