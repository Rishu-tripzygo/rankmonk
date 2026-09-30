import Link from "next/link";
import type { CSSProperties } from "react";
import { site } from "@/config/site";
import { heroWords } from "@/content/site";
import { HeroWord } from "./HeroWord";
import { Glyph } from "./Icon";
import { ProductDemo } from "./ProductDemo";

/** Entrance delay for the staggered hero animation. */
const delay = (s: string): CSSProperties => ({ "--d": s }) as CSSProperties;

const HERO_COPY =
  "RankMonk tracks map rankings street by street, audits your Google Business Profiles, replies to reviews, analyzes sentiment, benchmarks competitors, syncs listings on 20+ directories and tracks AI visibility. One dashboard, all locations.";

// Platforms RankMonk covers (see content/site.ts), with a brand-neutral colour dot each.
const WORKS_ON: [string, string][] = [
  ["Google Maps", "#12B76A"],
  ["Google Search", "#F79009"],
  ["Apple Maps", "#98A2B3"],
  ["Bing", "#3538CD"],
  ["ChatGPT", "#10A37F"],
  ["Gemini", "#4F46E5"],
];

/** Floating product cards beside the headline (wide screens only, decorative, sample data). */
function FloatCards() {
  return (
    <div className="hero-floats" aria-hidden="true">
      <div className="hero-card hero-card--l1" style={delay("0.55s")}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--subtle)" }}>
          <Glyph name="search" color="#6B6F7B" size={13} />
          dentist near me
        </div>
        <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.03em" }}>3.2</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--success-text)", background: "var(--success-tint)", padding: "2px 7px", borderRadius: 999 }}>▲ 5.2</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--subtle)" }}>Average Maps rank · 7×7 grid</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4 }}>
          {[2, 1, 1, 3, 6, 1, 1, 2, 4, 9].map((r, i) => (
            <span key={i} style={{ aspectRatio: "1", borderRadius: "50%", background: r <= 3 ? "#12B76A" : r <= 10 ? "#F79009" : "#F04438", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{r}</span>
          ))}
        </div>
      </div>

      <div className="hero-card hero-card--l2" style={delay("0.8s")}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--star)", letterSpacing: 1, fontSize: 12.5 }}>★★★★★</span>
          <span style={{ color: "var(--subtle)", fontSize: 12 }}>New review · 2m ago</span>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.45 }}>&ldquo;Very clean clinic, and the staff made my son feel at ease.&rdquo;</p>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, color: "#C2410C", fontWeight: 600, fontSize: 12 }}>
          <span style={{ width: 18, height: 18, borderRadius: 6, background: "var(--brand-tint)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>✦</span>
          AI reply drafted
        </div>
      </div>

      <div className="hero-card hero-card--r1" style={delay("0.65s")}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--subtle)" }}>
          <span style={{ width: 20, height: 20, borderRadius: 6, background: "var(--ink)", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>AI</span>
          ChatGPT answer
        </div>
        <p style={{ margin: "8px 0 10px", fontSize: 13, lineHeight: 1.45 }}>&ldquo;best dentist in Indiranagar&rdquo;</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--success-text)", background: "var(--success-tint)", padding: "3px 8px", borderRadius: 999 }}>Mentioned</span>
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-2)" }}>Position #2</span>
        </div>
      </div>

      <div className="hero-card hero-card--r2" style={delay("0.9s")}>
        <div style={{ fontSize: 12, color: "var(--subtle)" }}>Suspension risk</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "4px 0 10px" }}>
          <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-.02em" }}>Low</span>
          <span style={{ fontSize: 12, color: "var(--success-text)" }}>No risky edits</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <span style={{ flex: 1, height: 6, borderRadius: 3, background: "#12B76A" }} />
          <span style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--line)" }} />
          <span style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--line)" }} />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-dots" aria-hidden="true" />
      <div className="glow" aria-hidden="true" style={{ left: "50%", top: -300, width: 1200, height: 760, transform: "translateX(-50%)", background: "radial-gradient(closest-side, rgba(255,90,31,.18), transparent)" }} />
      <FloatCards />

      <div className="wrap" style={{ position: "relative", textAlign: "center" }}>
        <Link href="/features/ai-visibility" className="hero-pill hero-in" style={delay("0s")}>
          <span className="hero-pill-new">New</span>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI search visibility tracking</span>
          <span style={{ color: "var(--brand-strong)" }} aria-hidden="true">→</span>
        </Link>

        <h1 className="h1-hero" style={{ margin: "28px auto 0", maxWidth: 980 }}>
          Be the first name customers find on{" "}
          <span className="hero-word-line">
            <HeroWord words={heroWords} />
          </span>
        </h1>

        <p className="hero-in hero-sub" style={delay("0.1s")}>{HERO_COPY}</p>

        <div className="row hero-in" style={{ ...delay("0.2s"), marginTop: 36, justifyContent: "center", gap: 12 }}>
          <Link href="/contact" className="btn btn-lg btn-primary hero-cta" data-cta="hero_demo">
            Book a demo
            <Glyph name="arrowRight" size={16} />
          </Link>
          <Link href="/features" className="btn btn-lg btn-light" style={{ padding: "0 24px" }} data-cta="hero_features">
            Explore features
          </Link>
        </div>
        <p className="hero-in" style={{ ...delay("0.25s"), margin: "18px 0 0", fontSize: 14, color: "var(--subtle)" }}>
          Already a customer?{" "}
          <a href={site.dashboardUrl} style={{ color: "var(--ink)", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3 }}>
            Log in to your dashboard
          </a>
        </p>

        <div className="hero-in hero-works" style={delay("0.3s")}>
          <span className="hero-works-label">Works on</span>
          <ul>
            {WORKS_ON.map(([name, c]) => (
              <li key={name}>
                <i style={{ background: c }} />
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap hero-in" style={{ ...delay("0.35s"), position: "relative", maxWidth: 1200, marginTop: 56 }}>
        <div className="hero-stage">
          <ProductDemo />
        </div>
      </div>
    </section>
  );
}
