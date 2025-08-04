import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/view-data/page',
  //       permanent: true, // 308 redirect (true = permanent, false = temporary)
  //     },
  //     {
  //       source: '/blog/:slug',
  //       destination: '/posts/:slug',
  //       permanent: false, // 307 temporary redirect
  //     },
  //     {
  //       source: '/',
  //       destination: '/home',
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default nextConfig;
