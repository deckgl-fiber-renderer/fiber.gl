import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,

  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
