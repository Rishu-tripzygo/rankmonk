import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/config/site";
import { listPublished } from "@/lib/blog";

// /blog/sitemap.xml: published posts. Rendered per request (the page cache can't be
// purged for sitemap routes); the database read itself is cached and refreshed on publish.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.seo.index) return [];
  const posts = await listPublished({ limit: 1000 });
  return posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: new Date(p.updated_at) }));
}
