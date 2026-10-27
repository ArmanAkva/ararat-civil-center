import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dialogues",
        destination: "/dialogue",
        permanent: true,
      },
      {
        source: "/dialogues/:path*",
        destination: "/dialogue/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

