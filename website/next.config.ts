import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      remotePatterns: [new URL("https://lh3.googleusercontent.com/**")]
  },
    eslint: {
      ignoreDuringBuilds: true,
    }
};

export default nextConfig;
