import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://hildam.insightpublicis.com/api/:path*', // Proxy to the external API
  //     },
  //   ];
  // },
  images: {
    domains: ['hildam.insightpublicis.com'], // Add your domain here
  },
};

export default nextConfig;