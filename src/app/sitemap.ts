import type { MetadataRoute } from "next";
import { PAGES, SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({ url: `${SITE}${path === "/" ? "" : path}`, changeFrequency: "monthly", priority: path === "/" ? 1 : 0.8 }));
}
