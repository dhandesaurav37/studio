
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  // Allow dynamic parameters for static export. This is needed for product pages
  // that are not known at build time.
  dynamicParams: true, 
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      }
    ],
  },
  devIndicators: {
    allowedDevOrigins: [
        "*.cloudworkstations.dev",
    ]
  }
};

export default nextConfig;
