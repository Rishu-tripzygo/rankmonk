import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/config/site";
import { listPublished } from "@/lib/blog";

// /blog/sitemap.xml: published posts. Refreshed on publish via the API and hourly.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.seo.index) return [];
  const posts = await listPublished({ limit: 1000 });
  return posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: new Date(p.updated_at) }));
}
