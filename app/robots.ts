import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

// All crawlers (search and AI) may read public pages; only the API is off-limits.
// Set ROBOTS_INDEX=false (or deploy as a Vercel preview) to block everything.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: site.seo.index ? [{ userAgent: "*", allow: "/", disallow: ["/api/"] }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: [`${site.url}/sitemap.xml`, `${site.url}/blog/sitemap.xml`],
    host: site.url,
  };
}
