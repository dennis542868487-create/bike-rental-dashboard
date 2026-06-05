import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/form',   destination: '/intake', permanent: false },
      { source: '/waiver', destination: '/intake', permanent: false },
      { source: '/rent',   destination: '/intake', permanent: false },
    ];
  },
};

export default nextConfig;
