import Image from "next/image";
import Link from "next/link";
import { featureHref } from "@/content/features";
import { Glyph } from "./Icon";

const RK = [
  [2, 3, 4, 7, 12],
  [1, 2, 3, 5, 9],
  [1, 1, 1, 3, 6],
  [2, 1, 2, 4, 8],
  [4, 3, 5, 9, 21],
].flat();

export const rankColor = (r: number) => (r <= 3 ? "#12B76A" : r <= 10 ? "#F79009" : r <= 20 ? "#F04438" : "#98A2B3");

const TILES = [15190, 15191, 15192].flatMap((y) => [23449, 23450, 23451].map((x) => `/tiles/${y}-${x}.png`));

function Card({ slug, cls, minH, title, sub, children }: { slug: string; cls: string; minH: number; title: string; sub: string; children: React.ReactNode }) {
  return (
    <Link data-r="0" href={featureHref(slug)} className={`bcard lift ${cls}`}>
      <div className="bvis" style={{ minHeight: minH }} aria-hidden="true">
        {children}
      </div>
      <div className="bfoot">
        <div style={{ minWidth: 0 }}>
          <h3>{title}</h3>
          <p>{sub}</p>
        </div>
        <span className="round-arrow">
          <Glyph name="arrowUpRight" />
        </span>
      </div>
    </Link>
  );
}

const row = { display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid var(--line)", borderRadius: 9, padding: "7px 9px" } as const;
const ell = { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } as const;

export function FeatureGrid() {
  return (
    <div className="bento">
      <Card slug="rank-tracking" cls="b-geo" minH={440} title="Rank & geo-grid tracker" sub="Your Maps rank on every street around you">
        <div style={{ position: "absolute", left: "50%", top: "50%", width: 768, height: 768, transform: "translate(-50%,-50%) scale(1.25)", display: "flex", flexWrap: "wrap" }}>
          {TILES.map((t) => (
            <Image key={t} src={t} alt="" width={256} height={256} unoptimized draggable={false} style={{ display: "block" }} />
          ))}
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(250,250,251,0) 60%, rgba(250,250,251,.9))" }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "min(300px, 80%)", aspectRatio: "1", display: "grid", gridTemplateColumns: "repeat(5,1fr)", gridTemplateRows: "repeat(5,1fr)" }}>
          {RK.map((r, i) => (
            <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i === 12 && <span className="a-pulse" style={{ position: "absolute", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,90,31,.45)" }} />}
              <span style={{ position: "relative", width: 34, height: 34, borderRadius: "50%", background: rankColor(r), border: "2px solid #fff", boxShadow: "0 3px 8px rgba(16,24,40,.25)", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{r > 20 ? "20+" : r}</span>
            </div>
          ))}
        </div>
        <div className="a-float" style={{ position: "absolute", left: 18, top: 18, display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 12, padding: "9px 12px", boxShadow: "0 12px 28px -12px rgba(16,24,40,.35)", fontSize: 13, whiteSpace: "nowrap" }}>
          <Glyph name="search" color="#6B6F7B" />
          dentist near me
        </div>
        <div style={{ position: "absolute", right: 18, top: 18, background: "var(--ink)", color: "#fff", borderRadius: 12, padding: "10px 14px", boxShadow: "0 12px 28px -12px rgba(16,24,40,.5)" }}>
          <div style={{ fontSize: 11, color: "#A9ACB6", whiteSpace: "nowrap" }}>Average rank</div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-.03em" }}>
            3.2 <span style={{ fontSize: 12, color: "#6CE9A6" }}>▲ 5.2</span>
          </div>
        </div>
        <span style={{ position: "absolute", right: 8, bottom: 6, fontSize: 9, color: "var(--subtle)" }}>Tiles © Esri</span>
      </Card>

      <Card slug="business-audit" cls="b-audit" minH={170} title="Business audit & profile score" sub="One score, with the fixes that raise it">
        <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ position: "relative", width: 96, height: 96, flex: "none" }}>
            <svg width="96" height="96" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="#EEF0F3" strokeWidth="9" />
              <circle className="a-ring" cx="48" cy="48" r="40" fill="none" stroke="#FF5A1F" strokeWidth="9" strokeLinecap="round" strokeDasharray="196 252" transform="rotate(-90 48 48)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.04em" }}>78</span>
              <span style={{ fontSize: 10, color: "var(--subtle)" }}>of 100</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 7, fontSize: 12.5 }}>
            {(
              [
                ["#F04438", "Add 5 new photos"],
                ["#F79009", "Sunday hours missing"],
                ["#12B76A", "Categories complete"],
              ] as const
            ).map(([c, t]) => (
              <div key={t} style={row}>
                <i style={{ width: 7, height: 7, borderRadius: "50%", background: c, flex: "none" }} />
                <span style={ell}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card slug="profile-protection" cls="b-protect" minH={170} title="Suspension risk & protection" sub="Alerts before a risky edit costs you">
        <div style={{ position: "absolute", left: 32, right: 32, top: 34, height: 92, borderRadius: 14, background: "#fff", border: "1px solid var(--line)", transform: "scale(.92) translateY(-14px)", opacity: 0.6 }} />
        <div className="a-float" style={{ position: "absolute", left: 20, right: 20, top: 40, borderRadius: 14, background: "#fff", border: "1px solid var(--danger-line)", boxShadow: "0 18px 36px -18px rgba(180,35,24,.35)", padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ position: "relative", width: 10, height: 10, flex: "none" }}>
              <span className="a-pulse" style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#F04438" }} />
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#F04438" }} />
            </span>
            <span style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap" }}>Phone number changed</span>
            <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "var(--danger-text)", background: "var(--danger-tint)", padding: "2px 7px", borderRadius: 999, whiteSpace: "nowrap" }}>High risk</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 12, color: "var(--subtle)" }}>Suggested by a Google user · 2 min ago</div>
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, background: "var(--ink)", color: "#fff", padding: "5px 10px", borderRadius: 7 }}>Review edit</span>
            <span style={{ fontSize: 12, border: "1px solid var(--line-2)", padding: "5px 10px", borderRadius: 7 }}>Revert</span>
          </div>
        </div>
      </Card>

      <Card slug="ai-visibility" cls="b-ai" minH={220} title="AI search visibility" sub="Whether ChatGPT and Gemini recommend you">
        <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ alignSelf: "flex-end", maxWidth: "92%", background: "var(--ink)", color: "#fff", fontSize: 13, whiteSpace: "nowrap", padding: "9px 13px", borderRadius: "14px 14px 4px 14px" }}>best dentist in Indiranagar for kids?</div>
          <div style={{ maxWidth: "92%", background: "#fff", border: "1px solid var(--line)", borderRadius: "14px 14px 14px 4px", padding: "11px 13px", fontSize: 12.5, lineHeight: 1.55, color: "var(--ink-2)" }}>
            <span style={{ color: "var(--brand)" }}>✦</span> Parents recommend <b style={{ background: "var(--brand-tint)", color: "#C2410C", padding: "0 4px", borderRadius: 4 }}>Kinara Dental</b> for gentle kids&apos; care and weekend slots, followed by SmileCraft Dental.
            <span className="caret a-blink" />
          </div>
          <div style={{ marginTop: "auto", display: "flex", flexWrap: "wrap", gap: 6, fontSize: 11.5, fontWeight: 600 }}>
            <span style={{ background: "var(--success-tint)", color: "var(--success-text)", padding: "4px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>ChatGPT · #2</span>
            <span style={{ background: "var(--success-tint)", color: "var(--success-text)", padding: "4px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>Gemini · #1</span>
            <span style={{ background: "var(--danger-tint)", color: "var(--danger-text)", padding: "4px 9px", borderRadius: 999, whiteSpace: "nowrap" }}>AI Overviews · not named</span>
          </div>
        </div>
      </Card>

      <Card slug="reviews" cls="b-reviews" minH={220} title="AI review replies & sentiment" sub="A reply to every review, in your voice">
        <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#FFE3D6", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>PS</span>
              <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>Priya S.</span>
              <span style={{ marginLeft: "auto", color: "var(--star)", fontSize: 12, letterSpacing: 1 }}>★★★★☆</span>
            </div>
            <div style={{ marginTop: 6, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>Dr. Rao explained every step. The wait was long though.</div>
          </div>
          <div style={{ marginLeft: 22, background: "#FFFBF9", border: "1px solid var(--brand-line)", borderRadius: 14, padding: "12px 14px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: "#C2410C" }}>✦ AI reply · Warm</div>
            <div style={{ marginTop: 5, fontSize: 12.5, lineHeight: 1.5 }}>
              Thank you, Priya! Sorry about the wait. We&apos;ve added evening slots to keep queues short.
              <span className="caret a-blink" />
            </div>
          </div>
        </div>
      </Card>

      <Card slug="listings" cls="b-listings" minH={200} title="Listings on 20+ directories" sub="Correct details everywhere customers look">
        <div style={{ position: "absolute", inset: 0, padding: 18, display: "flex", flexDirection: "column", gap: 7 }}>
          {(
            [
              ["G", "Google Business Profile", true],
              ["B", "Bing Places", true],
              ["A", "Apple Business Connect", false],
              ["f", "Facebook", true],
            ] as const
          ).map(([i, n, ok]) => (
            <div key={n} style={{ ...row, gap: 10, borderRadius: 10, padding: "7px 10px" }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: "#F4F5F7", fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>{i}</span>
              <span style={{ flex: 1, ...ell }}>{n}</span>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: ok ? "#12B76A" : "#F79009", color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{ok ? "✓" : "!"}</span>
            </div>
          ))}
          <div style={{ marginTop: "auto", height: 6, borderRadius: 3, background: "var(--line)", overflow: "hidden" }}>
            <div className="a-bar" style={{ height: "100%", background: "#12B76A", borderRadius: 3 }} />
          </div>
        </div>
      </Card>

      <Card slug="competitors" cls="b-comp" minH={200} title="Competitor tracker" sub="Who outranks you, and by how much">
        <div style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
          {(
            [
              ["Kinara Dental (you)", 61, true],
              ["SmileCraft Dental", 57, false],
              ["Indira Dental Care", 34, false],
              ["PearlLine Dental", 18, false],
            ] as const
          ).map(([n, p, you]) => (
            <div key={n}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 5 }}>
                <span style={{ fontWeight: you ? 600 : 400 }}>{n}</span>
                <span className="mono" style={{ fontSize: 11.5 }}>{p}%</span>
              </div>
              <div style={{ height: 7, borderRadius: 4, background: "var(--line)", overflow: "hidden" }}>
                <div className="a-grow" style={{ height: "100%", width: `${p}%`, background: you ? "#FF5A1F" : "#98A2B3", borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card slug="multi-location" cls="b-multi" minH={200} title="Bulk multi-location management" sub="Five or 500 locations in one place">
        <div style={{ position: "absolute", inset: 0, padding: 18, display: "flex", flexDirection: "column", justifyContent: "center", gap: 7 }}>
          {(
            [
              ["Indiranagar", 92, "g"],
              ["Koramangala", 88, "g"],
              ["HSR Layout", 71, "a"],
              ["Whitefield", 64, "r"],
            ] as const
          ).map(([n, s, c]) => (
            <div key={n} style={{ ...row, gap: 10, borderRadius: 10, padding: "8px 10px", fontSize: 12.5 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5A1F" strokeWidth="2" strokeLinecap="round">
                <path d="M20 10c0 5-8 12-8 12s-8-7-8-12a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span style={{ flex: 1 }}>{n}</span>
              <span style={{ fontWeight: 600, fontSize: 11.5, background: `var(--${c === "g" ? "success" : c === "a" ? "warning" : "danger"}-tint)`, color: `var(--${c === "g" ? "success" : c === "a" ? "warning" : "danger"}-text)`, padding: "2px 8px", borderRadius: 999 }}>{s}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card slug="reports" cls="b-reports" minH={170} title="Reports & analytics" sub="Calls, directions and clicks, sent on a schedule">
        <div style={{ position: "absolute", inset: 0, padding: "22px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "24px 40px" }}>
          <div style={{ display: "flex", gap: 32 }}>
            {(
              [
                ["Calls", "1,284", "18%"],
                ["Directions", "2,310", "12%"],
                ["Website clicks", "964", "9%"],
              ] as const
            ).map(([t, v, c]) => (
              <div key={t}>
                <div style={{ fontSize: 12, color: "var(--subtle)" }}>{t}</div>
                <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.03em" }}>{v}</div>
                <div style={{ fontSize: 12, color: "var(--success-text)" }}>▲ {c}</div>
              </div>
            ))}
          </div>
          <svg viewBox="0 0 600 120" preserveAspectRatio="none" style={{ flex: "1 1 300px", minWidth: 0, height: 110 }} fill="none">
            <path d="M0 100 L50 92 L100 96 L150 80 L200 84 L250 66 L300 70 L350 52 L400 58 L450 40 L500 44 L550 26 L600 18 L600 120 L0 120 Z" fill="rgba(255,90,31,.08)" />
            <path className="a-draw" pathLength={1} d="M0 100 L50 92 L100 96 L150 80 L200 84 L250 66 L300 70 L350 52 L400 58 L450 40 L500 44 L550 26 L600 18" stroke="#FF5A1F" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>
      </Card>
    </div>
  );
}
