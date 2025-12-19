import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during production builds (optional)
    // ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // Mark optional wallet connectors as external to avoid bundling errors
    config.externals.push(
      'pino-pretty',
      'lokijs',
      'encoding',
      'porto/internal',
      '@base-org/account',
      '@coinbase/wallet-sdk',
      '@gemini-wallet/core',
      '@metamask/sdk',
      '@porto'
    );
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

export default nextConfig;
