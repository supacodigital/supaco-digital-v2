import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // formats modernes servis par next/image
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 82],
  },
  // en-têtes de sécurité de base
  poweredByHeader: false,
};

export default nextConfig;
