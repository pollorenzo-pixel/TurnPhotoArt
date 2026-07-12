import type { MetadataRoute } from "next";
import { IS_INDEXING_ENABLED, absoluteSiteUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXING_ENABLED) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: absoluteSiteUrl("/sitemap.xml")! };
}
