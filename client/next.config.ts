import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    let apiTarget =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_URL ||
      'http://localhost:5001';

    if (!apiTarget.startsWith('http://') && !apiTarget.startsWith('https://')) {
      apiTarget = `https://${apiTarget}`;
    }

    // Strip trailing slashes to avoid double-slash route issues like //api/...
    apiTarget = apiTarget.replace(/\/+$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
