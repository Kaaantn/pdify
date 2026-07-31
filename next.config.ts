import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/editor", destination: "/pdify/editor", permanent: true },
      { source: "/gizlilik", destination: "/pdify/gizlilik", permanent: true },
      { source: "/hakkinda", destination: "/pdify/hakkinda", permanent: true },
    ];
  },
};

export default nextConfig;
