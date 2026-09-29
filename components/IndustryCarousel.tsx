"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { industries, industryHref, imageSrc } from "@/content/groups";
import { Glyph } from "./Icon";

/** "By industry" row: horizontally scrolling, scroll-snapping photo cards with prev/next. */
export function IndustryCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 620), behavior: "smooth" });
  };
  return (
    <>
      <div data-r="0" className="row" style={{ marginTop: 72, justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "clamp(24px, 3vw, 32px)", letterSpacing: "-.03em", fontWeight: 600 }}>By industry</h3>
          <p style={{ margin: "6px 0 0", fontSize: 15, color: "var(--muted)" }}>Ten industries, and the searches that bring each one customers</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="round-btn" aria-label="Previous industries" onClick={() => scroll(-1)}>
            <Glyph name="chevronLeft" size={16} />
          </button>
          <button type="button" className="round-btn" aria-label="Next industries" onClick={() => scroll(1)}>
            <Glyph name="chevronRight" size={16} />
          </button>
        </div>
      </div>
      <div ref={ref} className="carousel">
        {industries.map((i) => (
          <Link key={i.slug} href={industryHref(i.slug)} className="photo lift-photo" style={{ flex: "0 0 clamp(250px, 24vw, 290px)", aspectRatio: "4/5", borderRadius: 22, scrollSnapAlign: "start" }}>
            <Image src={imageSrc(i.image)} alt={i.alt} fill sizes="290px" />
            <span className="photo-shade" style={{ background: "linear-gradient(180deg, rgba(10,10,14,0) 35%, rgba(10,10,14,.88))" }} />
            <span style={{ position: "absolute", left: 16, top: 16, right: 16, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.95)", color: "var(--ink)", borderRadius: 12, padding: "8px 12px", fontSize: 13, boxShadow: "0 10px 24px -10px rgba(0,0,0,.4)" }}>
              <Glyph name="search" color="#6B6F7B" />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i.search}</span>
            </span>
            <span style={{ position: "absolute", left: 20, right: 20, bottom: 20 }}>
              <span style={{ display: "block", fontSize: 22, fontWeight: 600, letterSpacing: "-.025em" }}>{i.name}</span>
              <span style={{ display: "block", marginTop: 4, fontSize: 14, color: "#E4E5EA" }}>{i.short}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
