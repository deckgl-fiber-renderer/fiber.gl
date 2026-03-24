import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    dynamicIO: true,
    ppr: 'incremental',
    reactCompiler: true,
    useCache: true,
  },
  poweredByHeader: false,

  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
