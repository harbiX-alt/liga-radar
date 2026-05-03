import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.api-sports.io",
        pathname: "/football/**",
      },
      {
        protocol: "https",
        hostname: "media-4.api-sports.io",
        pathname: "/football/**",
      },
    ],
  },
  // ISR revalidation defaults per route type
  experimental: {
    staleTimes: {
      dynamic: 300, // 5 min for odds pages
      static: 3600,  // 1h for player/team pages
    },
  },
};

export default nextConfig;
