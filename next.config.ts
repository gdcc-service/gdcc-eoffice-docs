import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/docs/admin-tools/super-admin/:path*",
        destination: "/docs/admin-tools/primary-admin/:path*",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
      {
        protocol: "https",
        hostname: "r2-eoffice-docs.zire.dev",
      },
    ],
  },
};

export default withMDX(nextConfig);
