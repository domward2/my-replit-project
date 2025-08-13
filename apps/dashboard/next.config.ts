import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {},
  transpilePackages: ['@dex/types', '@dex/evm-connect', '@dex/solana-connect', '@dex/ui', '@dex/tokenlists'],
};

export default nextConfig;