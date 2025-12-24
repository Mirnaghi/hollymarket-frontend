import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disable TypeScript errors during production builds (optional)
    // ignoreBuildErrors: true,
  },
  // Empty turbopack config to acknowledge we're using Turbopack in Next.js 16
  turbopack: {},
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
