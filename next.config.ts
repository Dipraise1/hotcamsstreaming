import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds to avoid errors from generated Prisma files
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during builds if needed
    ignoreBuildErrors: false,
  }
};

export default nextConfig;
