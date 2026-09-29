import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/config/site";
import { featureHref, features } from "@/content/features";
import { industries, industryHref, solutionHref, solutions } from "@/content/groups";
import { LEGAL_EFFECTIVE_DATE, legalDocs } from "@/content/legal";

export const dynamic = "force-static";

const APP_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "app");

/**
 * Static routes are discovered from the app directory at build time, so adding or
 * removing a page folder updates the sitemap automatically. Skipped: API routes,
 * private (_x) and dynamic ([x]) folders, file routes (llms.txt, og.png) and any
 * page that sets `index: false`. Dynamic routes come from the content files below.
 */
function staticRoutes(dir = APP_DIR, base = ""): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const n = e.name;
    if (!e.isDirectory() || n === "api" || n.startsWith("_") || n.startsWith("[") || n.includes(".")) continue;
    out.push(...staticRoutes(path.join(/*turbopackIgnore: true*/ dir, n), n.startsWith("(") ? base : `${base}/${n}`));
  }
  const page = ["page.tsx", "page.ts"].map((f) => path.join(/*turbopackIgnore: true*/ dir, f)).find((f) => fs.existsSync(f));
  if (page && !/index:\s*false/.test(fs.readFileSync(page, "utf8"))) out.push(base || "/");
  return out;
}

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.seo.index) return [];
  const legalDate = new Date(LEGAL_EFFECTIVE_DATE);
  const legal = new Set(legalDocs.map((d) => `/${d.slug}`));
  const paths = [
    ...staticRoutes().sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b))),
    ...features.map((f) => featureHref(f.slug)),
    ...solutions.map((s) => solutionHref(s.slug)),
    ...industries.map((i) => industryHref(i.slug)),
  ];
  return paths.map((p) => ({ url: absoluteUrl(p), ...(legal.has(p) ? { lastModified: legalDate } : {}) }));
}
