import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root (there is an unrelated package-lock.json higher up in the home folder).
  turbopack: { root: path.join(__dirname) },

  // Old URLs from panth-2025-portfolio. Each one must keep working after the domain moves;
  // /about, /playground, /samsung, /foundermatch, /northeastern and the resume file keep their old addresses.
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true }, // the old site's home address
      { source: "/phone", destination: "/", permanent: true }, // the old 3D phone page; the Fold8 on the home page took its place
    ];
  },
  // three.js and the Onest files inside the Fold8 page, and the Playground films, never change (a new version gets a new name), so browsers keep them
  async headers() {
    const forever = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/fold/three.min.js", headers: forever },
      { source: "/fold/fonts/:file*", headers: forever },
      { source: "/playground/:file(.+\\.mp4)", headers: forever },
      { source: "/case/:path*", headers: forever }, // case study films // the Playground films are named after their posts
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
