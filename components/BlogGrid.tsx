"use client";

import Link from "next/link";
import { useState } from "react";
import { blogCategories, blogCategoryStyle } from "@/content/site";
import type { BlogPostSummary } from "@/lib/blog";
import { gridVars } from "@/lib/style";
import { BlogCover, formatDate } from "./BlogCover";

/** Category filter and post cards. Every card is a crawlable link rendered on the server. */
export function BlogGrid({ posts }: { posts: BlogPostSummary[] }) {
  const [cat, setCat] = useState<string>("All");
  const shown = posts.filter((p) => cat === "All" || p.category === cat);
  return (
    <>
      <div role="group" aria-label="Filter by category" style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {blogCategories.map((c) => (
          <button key={c} type="button" className="chip-btn" aria-pressed={c === cat} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p style={{ marginTop: 28, padding: "48px 24px", textAlign: "center", border: "1px dashed var(--line-2)", borderRadius: 20, color: "var(--muted)", fontSize: 16 }}>
          {posts.length === 0 ? "Our first guides are on the way. Subscribe above to get them in your inbox." : `No ${cat} articles yet. Check back soon.`}
        </p>
      ) : (
        <div className="grid-auto grid-fill" style={{ marginTop: 28, ...gridVars(300, 20) }}>
          {shown.map((p) => (
            <article key={p.slug} className="lift" style={{ position: "relative", display: "flex", flexDirection: "column", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden", background: "#fff" }}>
              <div style={{ aspectRatio: "16/9", position: "relative", overflow: "hidden", background: "var(--surface-2)" }}>
                <BlogCover url={p.cover_image_url} alt="" category={p.category} sizes="(max-width: 700px) 100vw, 400px" />
                <span style={{ position: "absolute", left: 14, top: 14, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,.95)", color: blogCategoryStyle[p.category]?.ink, padding: "5px 10px", borderRadius: 999 }}>{p.category}</span>
              </div>
              <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                  <span style={{ color: "var(--brand-strong)", fontWeight: 600 }}>{p.category}</span>
                  <span style={{ color: "var(--subtle)" }}>
                    <time dateTime={p.published_at ?? undefined}>{formatDate(p.published_at)}</time> · {p.reading_minutes} min read
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: 19, lineHeight: 1.3, letterSpacing: "-.02em", fontWeight: 600 }}>
                  {/* Stretched link: the whole card is clickable, the title stays the accessible name. */}
                  <Link href={`/blog/${p.slug}`} className="stretched">
                    {p.title}
                  </Link>
                </h2>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "var(--muted)" }}>{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
