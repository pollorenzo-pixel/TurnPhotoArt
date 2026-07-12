import type { MetadataRoute } from "next";
import { IS_INDEXING_ENABLED, absoluteSiteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!IS_INDEXING_ENABLED) return [];
  return ["/", "/privacy", "/terms"].map((path) => ({ url: absoluteSiteUrl(path)!, changeFrequency: "monthly" as const }));
}
