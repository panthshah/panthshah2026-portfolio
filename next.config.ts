import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root (there is an unrelated package-lock.json higher up in the home folder).
  turbopack: { root: path.join(__dirname) },

  // Old URLs from panth-2025-portfolio. Each one must keep working after the domain moves;
  // case study routes are added here as their pages are rebuilt.
  async redirects() {
    return [{ source: "/home", destination: "/", permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
