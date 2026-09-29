"use client";

import Image from "next/image";
import { useState } from "react";
import { imageSrc } from "@/content/groups";
import { blogCategories, blogPosts } from "@/content/site";
import { gridVars } from "@/lib/style";

/** Category filter and post cards. Posts are announced as "Coming soon" until published. */
export function BlogGrid() {
  const [cat, setCat] = useState("All");
  const posts = blogPosts.filter((p) => cat === "All" || p.cat === cat);
  return (
    <>
      <div data-r="1" role="group" aria-label="Filter by category" style={{ marginTop: 40, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {blogCategories.map((c) => (
          <button key={c} type="button" className="chip-btn" aria-pressed={c === cat} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid-auto" style={{ marginTop: 28, ...gridVars(300, 20) }}>
        {posts.map((p) => (
          <article key={p.title} style={{ display: "flex", flexDirection: "column", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ aspectRatio: "16/9", position: "relative", overflow: "hidden", background: "var(--surface-2)" }}>
              <Image src={imageSrc(p.image)} alt="" fill sizes="(max-width: 700px) 100vw, 400px" style={{ objectFit: "cover" }} />
              <span style={{ position: "absolute", left: 14, top: 14, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,.95)", color: p.ink, padding: "5px 10px", borderRadius: 999 }}>{p.cat}</span>
            </div>
            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "var(--brand-strong)", fontWeight: 600 }}>{p.cat}</span>
                <span style={{ color: "var(--subtle)" }}>Coming soon</span>
              </div>
              <h2 style={{ margin: 0, fontSize: 19, lineHeight: 1.3, letterSpacing: "-.02em", fontWeight: 600 }}>{p.title}</h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "var(--muted)" }}>{p.dek}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
