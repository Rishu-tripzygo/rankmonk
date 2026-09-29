"use client";

import { useEffect, useState } from "react";
import type { MockKind } from "@/content/features";
import { LogoMark } from "./Logo";

// Illustrative dashboard panels with sample data (a dental clinic in Indiranagar, Bengaluru).

const rc = (r: number) => (r <= 3 ? "#12B76A" : r <= 10 ? "#F79009" : r <= 20 ? "#F04438" : "#98A2B3");
const P = { amber: ["#FFFAEB", "#B54708"], green: ["#ECFDF3", "#067647"], red: ["#FEF3F2", "#B42318"], gray: ["#F2F3F5", "#3A3D47"] } as const;
const d = (ms: number) => ({ animationDelay: `${ms}ms` });

function grid(k: number) {
  const base = [0.95, 1.7, 2.7][k];
  const cells: { label: string; bg: string; d: number; center: boolean }[] = [];
  let sum = 0, n = 0, t3 = 0;
  for (let j = 0; j < 7; j++)
    for (let i = 0; i < 7; i++) {
      const dx = i - 3, dy = j - 3, dist = Math.sqrt(dx * dx + dy * dy);
      const noise = ((i * 7 + j * 13 + k * 5) % 5) - 2;
      let r = Math.round(1 + dist * base + noise * 0.7 + (dy > 0 ? dist * 0.5 * k : 0) - (dx < 0 ? 0.6 : 0));
      if (r < 1) r = 1;
      if (r <= 20) { sum += r; n++; }
      if (r <= 3) t3++;
      cells.push({ label: r > 20 ? "20+" : String(r), bg: rc(r), d: Math.round(dist * 70 + (i + j) * 6), center: i === 3 && j === 3 });
    }
  return { cells, avg: (sum / n).toFixed(1), top3: Math.round((t3 / 49) * 100), top3n: t3 };
}

function path(vals: number[], W: number, H: number, pad: number, lo: number, hi: number) {
  const step = W / (vals.length - 1);
  const line = vals.map((v, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)} ${(pad + (H - 2 * pad) * (1 - (v - lo) / (hi - lo))).toFixed(1)}`).join(" ");
  return { line, area: `${line} L${W} ${H} L0 ${H} Z` };
}

const REPLIES = [
  "Thank you so much, Priya! We're glad Dr. Rao took the time to explain everything. You're right about the wait, and we're sorry. We've added evening slots to keep queues shorter. See you at your next visit!",
  "Thank you for your feedback, Priya. We are pleased Dr. Rao's explanation was helpful. We apologise for the delay and have extended our appointment hours to reduce waiting times.",
  "Thanks, Priya! Glad Dr. Rao helped. Sorry about the wait. We're adding more slots to fix it.",
];

const PATHS: Record<MockKind, string> = { hero: "geo-grid", grid: "geo-grid", comp: "competitors", audit: "audit", protect: "protection", reviews: "reviews", listings: "listings", multi: "locations", ai: "ai-visibility", reports: "reports" };

const border = "1px solid var(--line)";
const muted = { fontSize: 12, color: "var(--subtle)" } as const;
const title = { fontWeight: 600, fontSize: 15 } as const;
const tag = (bg: string, fg: string) => ({ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 999, background: bg, color: fg, whiteSpace: "nowrap" as const });
const pillBtn = (on: boolean) => ({ whiteSpace: "nowrap" as const, border: `1px solid ${on ? "#14151A" : "#E4E5EA"}`, background: on ? "#14151A" : "#fff", color: on ? "#fff" : "#3A3D47", borderRadius: 999, font: "inherit", cursor: "pointer" });

function GridView() {
  const [kw, setKw] = useState(0);
  const g = grid(kw);
  const sp = path([8.4, 7.9, 7.1, 6.2, 5.6, 4.6, 3.9, 3.2].map((v) => -v), 260, 80, 8, -9, -2.5);
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div><div style={title}>Kinara Dental · Indiranagar</div><div style={muted}>7×7 grid · 2 km radius · Scanned 21 Sep</div></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }} role="group" aria-label="Keyword">
          {["dentist near me", "dental clinic indiranagar", "root canal treatment"].map((label, i) => (
            <button key={label} type="button" aria-pressed={i === kw} onClick={() => setKw(i)} style={{ ...pillBtn(i === kw), padding: "5px 11px", fontSize: 12 }}>{label}</button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 20, alignItems: "start" }}>
        <div style={{ position: "relative", aspectRatio: "1", borderRadius: 12, overflow: "hidden", backgroundColor: "#EEF1F4", backgroundImage: "linear-gradient(90deg, transparent 47%, #fff 47%, #fff 53%, transparent 53%), linear-gradient(0deg, transparent 30%, #fff 30%, #fff 34%, transparent 34%), linear-gradient(0deg, transparent 71%, #fff 71%, #fff 73%, transparent 73%), linear-gradient(90deg, transparent 18%, #fff 18%, #fff 20%, transparent 20%), linear-gradient(90deg, transparent 80%, #fff 80%, #fff 82%, transparent 82%), linear-gradient(0deg, #E3E8EC 1px, transparent 1px), linear-gradient(90deg, #E3E8EC 1px, transparent 1px)", backgroundSize: "100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 28px 28px, 28px 28px" }}>
          <div style={{ position: "absolute", left: "58%", top: "8%", width: "26%", height: "20%", background: "#DDEFE3", borderRadius: 10 }} />
          <div style={{ position: "absolute", left: "6%", top: "76%", width: "30%", height: "16%", background: "#DCEBF7", borderRadius: "40% 60% 50% 50%" }} />
          <div key={kw} style={{ position: "absolute", inset: "5%", display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gridTemplateRows: "repeat(7, minmax(0,1fr))" }}>
            {g.cells.map((c, i) => (
              <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {c.center && <span className="a-pulse" style={{ position: "absolute", width: "62%", aspectRatio: "1", borderRadius: "50%", background: "rgba(255,90,31,.45)" }} />}
                <div className="a-pop" style={{ ...d(c.d), position: "relative", width: "72%", aspectRatio: "1", borderRadius: "50%", background: c.bg, color: "#fff", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", boxShadow: "0 2px 6px rgba(16,24,40,.2)", fontVariantNumeric: "tabular-nums" }}>{c.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ border, borderRadius: 12, padding: 14 }}><div style={muted}>Average rank</div><div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>{g.avg}</div><div style={{ fontSize: 12, color: "#067647" }}>▲ 5.2 in 8 weeks</div></div>
            <div style={{ border, borderRadius: 12, padding: 14 }}><div style={muted}>Top-3 coverage</div><div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>{g.top3}%</div><div style={muted}>{g.top3n} of 49 points</div></div>
          </div>
          <div style={{ border, borderRadius: 12, padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...muted, marginBottom: 8 }}><span>Average rank, last 8 weeks</span><span>Lower is better</span></div>
            <svg viewBox="0 0 260 80" style={{ width: "100%", height: 80, display: "block" }} fill="none"><path d={sp.area} fill="rgba(255,90,31,.08)" /><path className="a-draw" pathLength={1} style={{ animationDuration: "1.6s", animationDelay: ".3s" }} d={sp.line} stroke="#FF5A1F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 14px", fontSize: 12, color: "#3A3D47" }}>
            {([["#12B76A", "1–3"], ["#F79009", "4–10"], ["#F04438", "11–20"], ["#98A2B3", "Not in top 20"]] as const).map(([c, l]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />{l}</span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function CompView() {
  const comps = [
    { n: "Kinara Dental (you)", rank: "3.2", top3: 61, rating: "4.8", reviews: 412, you: true },
    { n: "SmileCraft Dental", rank: "2.6", top3: 68, rating: "4.6", reviews: 688 },
    { n: "Indira Dental Care", rank: "5.8", top3: 34, rating: "4.7", reviews: 251 },
    { n: "PearlLine Dental", rank: "7.1", top3: 22, rating: "4.4", reviews: 190 },
    { n: "BrightBite Dentistry", rank: "11.4", top3: 9, rating: "4.9", reviews: 76 },
  ];
  const cols = "minmax(0,2fr) 70px minmax(0,2fr) 90px";
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
        <div><div style={title}>Competitors</div><div style={muted}>Keyword &quot;dentist near me&quot; · Indiranagar</div></div>
        <span style={{ fontSize: 12, color: "#C2410C", background: "#FFF1EA", padding: "4px 10px", borderRadius: 999, alignSelf: "center" }}>SmileCraft overtook you on 3 points</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 440 }}>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: 12, fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--subtle)", padding: "0 12px" }}><span>Business</span><span>Avg. rank</span><span>Top-3 coverage</span><span>Rating</span></div>
          {comps.map((c, i) => (
            <div key={c.n} className="a-rise" style={{ ...d(i * 90), display: "grid", gridTemplateColumns: cols, gap: 12, alignItems: "center", padding: 12, borderRadius: 10, border: `1px solid ${c.you ? "#FFD9C7" : "#EEF0F3"}`, background: c.you ? "#FFFBF9" : "#fff" }}>
              <span style={{ fontWeight: c.you ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.n}</span>
              <span className="mono">{c.rank}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: 1, height: 8, borderRadius: 4, background: "#F2F3F5", overflow: "hidden" }}><span className="a-grow-1" style={{ ...d(200 + i * 90), display: "block", height: "100%", width: `${c.top3}%`, background: c.you ? "#FF5A1F" : "#98A2B3", borderRadius: 4 }} /></span>
                <span className="mono" style={{ fontSize: 12, width: 34 }}>{c.top3}%</span>
              </span>
              <span style={{ fontSize: 13 }}><span style={{ color: "#F5A524" }}>★</span> {c.rating} <span style={{ color: "var(--subtle)" }}>({c.reviews})</span></span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AuditView() {
  const S = { ok: ["#ECFDF3", "#067647", "✓", "Done"], warn: ["#FFFAEB", "#B54708", "!", "Improve"], fail: ["#FEF3F2", "#B42318", "×", "Fix now"] } as const;
  const rows = [["Primary category matches your services", "ok"], ["Photos added in the last 30 days", "fail"], ["Holiday hours set for October", "warn"], ["Description uses service keywords", "ok"], ["All services listed with prices", "warn"], ["Questions answered on profile", "ok"]] as const;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 20, alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 10 }}>
        <div style={{ position: "relative", width: 170, height: 170 }}>
          <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
            <circle cx="60" cy="60" r="52" stroke="#F2F3F5" strokeWidth="10" fill="none" />
            <circle className="a-ringoff" cx="60" cy="60" r="52" stroke="#FF5A1F" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray="326.7" strokeDashoffset="71.9" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-.04em", lineHeight: 1 }}>78</span><span style={muted}>of 100</span></div>
        </div>
        <div style={{ fontWeight: 600 }}>Profile score</div>
        <div style={{ ...muted, textAlign: "center" }}>Kinara Dental · 6 checks need attention</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map(([t, s], i) => (
          <div key={t} className="a-rise" style={{ ...d(i * 80), display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border, borderRadius: 10 }}>
            <span style={{ width: 22, height: 22, flex: "none", borderRadius: "50%", background: S[s][0], color: S[s][1], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{S[s][2]}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 13 }}>{t}</span>
            <span style={{ fontSize: 11, color: S[s][1], whiteSpace: "nowrap" }}>{S[s][3]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProtectView() {
  const alerts = [["Phone number edit suggested", "By a Google user · 2h ago", "Needs review", "amber"], ["Primary category changed", "Restored to \"Dental clinic\"", "Resolved", "green"], ["Map pin moved 180 m", "Flagged before it went live", "Flagged", "red"], ["5★ review removed", "Arjun K. · Yesterday", "Logged", "gray"]] as const;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: 20 }}>
      <div style={{ border, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={muted}>Suspension risk</div>
        <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-.03em" }}>Low</div>
        <div style={{ display: "flex", gap: 4 }}><div className="a-grow-1" style={{ ...d(200), flex: 1, height: 8, borderRadius: 4, background: "#12B76A" }} /><div style={{ flex: 1, height: 8, borderRadius: 4, background: "#F2F3F5" }} /><div style={{ flex: 1, height: 8, borderRadius: 4, background: "#F2F3F5" }} /></div>
        <div style={{ fontSize: 12, color: "#3A3D47", lineHeight: 1.5 }}>Name, address and category match your records. 1 suggested edit is waiting for review.</div>
        <div style={{ borderTop: border, paddingTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}><div><div style={{ color: "var(--subtle)" }}>Fields watched</div><div style={{ fontWeight: 600, fontSize: 16 }}>9</div></div><div><div style={{ color: "var(--subtle)" }}>Edits this month</div><div style={{ fontWeight: 600, fontSize: 16 }}>4</div></div></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ ...muted, marginBottom: 2 }}>Change log</div>
        {alerts.map(([t, s, st, c], i) => (
          <div key={t} className="a-rise" style={{ ...d(i * 90), display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border, borderRadius: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{t}</div><div style={muted}>{s}</div></div>
            <span style={tag(P[c][0], P[c][1])}>{st}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsView() {
  const [tone, setTone] = useState(0);
  const [chars, setChars] = useState(0);
  const full = REPLIES[tone];
  useEffect(() => {
    if (chars >= full.length) return;
    const t = setTimeout(() => setChars((c) => Math.min(full.length, c + 2)), 26);
    return () => clearTimeout(t);
  }, [chars, full]);
  const senti = [["Doctors & staff", 94], ["Treatment explained", 89], ["Cleanliness", 91], ["Pricing", 66], ["Waiting time", 41]] as const;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ border, borderRadius: 12, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#FFE3D6", color: "#C2410C", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13 }}>PS</span>
            <div><div style={{ fontWeight: 600, fontSize: 13 }}>Priya S.</div><div style={muted}><span style={{ color: "#F5A524" }}>★★★★</span><span style={{ color: "#D0D3DA" }}>★</span> · Google · 1h ago</div></div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: "#3A3D47" }}>Dr. Rao was patient and explained every step of the treatment. The waiting time was long though, almost 40 minutes past my slot.</div>
        </div>
        <div style={{ border: "1px solid #FFD9C7", background: "#FFFBF9", borderRadius: 12, padding: 14 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#C2410C" }}>✦ AI reply draft</span>
            <div style={{ display: "flex", gap: 4 }} role="group" aria-label="Reply tone">
              {["Warm", "Professional", "Short"].map((label, i) => (
                <button key={label} type="button" aria-pressed={i === tone} onClick={() => { setTone(i); setChars(0); }} style={{ ...pillBtn(i === tone), padding: "3px 9px", fontSize: 11 }}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.55, minHeight: 80 }} aria-live="off">{full.slice(0, chars)}<span className="caret a-blink" style={{ height: 14, marginLeft: 1 }} /></div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}><span style={{ fontSize: 12, fontWeight: 600, color: "#fff", background: "#14151A", padding: "6px 12px", borderRadius: 8 }}>Post reply</span><span style={{ fontSize: 12, color: "#3A3D47", border: "1px solid #E4E5EA", padding: "6px 12px", borderRadius: 8 }}>Edit</span></div>
        </div>
      </div>
      <div style={{ border, borderRadius: 12, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}><div style={{ fontWeight: 600 }}>Sentiment by topic</div><div style={muted}>412 reviews</div></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {senti.map(([t, p], i) => (
            <div key={t}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}><span>{t}</span><span className="mono" style={{ fontSize: 12, color: "#3A3D47" }}>{p}% positive</span></div><div style={{ height: 8, borderRadius: 4, background: "#FDE2E0", overflow: "hidden" }}><div className="a-grow-1" style={{ ...d(200 + i * 90), height: "100%", width: `${p}%`, background: "#12B76A", borderRadius: 4 }} /></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListingsView() {
  const LS = { Synced: "green", Updating: "amber", "Needs review": "red" } as const;
  const rows = [["G", "Google Business Profile", "Synced"], ["B", "Bing Places", "Synced"], ["A", "Apple Business Connect", "Synced"], ["f", "Facebook", "Synced"], ["W", "Waze", "Updating"], ["F", "Foursquare", "Synced"], ["H", "HERE WeGo", "Needs review"], ["T", "TomTom", "Synced"]] as const;
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div><div style={title}>Listings · Kinara Dental</div><div style={muted}>Name, address, phone, hours and categories</div></div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}><span style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-.03em" }}>96%</span><span style={muted}>consistency</span></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: 8 }}>
        {rows.map(([i2, n, st], i) => (
          <div key={n} className="a-rise" style={{ ...d(i * 60), display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", border, borderRadius: 10 }}>
            <span style={{ width: 28, height: 28, flex: "none", borderRadius: 8, background: "#F4F5F7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 12, color: "#3A3D47" }}>{i2}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n}</span>
            <span style={tag(P[LS[st]][0], P[LS[st]][1])}>{st}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function MultiView() {
  const [sel, setSel] = useState([true, false, true, false, true, false]);
  const locs = [["Indiranagar, Bengaluru", 92, "2.4", "4.8"], ["Koramangala, Bengaluru", 81, "3.9", "4.7"], ["HSR Layout, Bengaluru", 64, "8.1", "4.5"], ["Andheri West, Mumbai", 88, "3.1", "4.8"], ["Bandra, Mumbai", 58, "11.6", "4.3"], ["Baner, Pune", 76, "5.2", "4.6"]] as const;
  const cols = "28px minmax(0,2fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)";
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div><div style={title}>Locations</div><div style={muted}>Kinara Dental · 6 of 42 shown</div></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#14151A", color: "#fff", borderRadius: 10, padding: "6px 6px 6px 12px", fontSize: 12 }}><span>{sel.filter(Boolean).length} selected</span><span style={{ background: "#FF5A1F", borderRadius: 7, padding: "5px 10px", fontWeight: 600 }}>Update holiday hours</span></div>
      </div>
      <div style={{ border, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: 10, padding: "10px 12px", background: "#FAFAFB", fontSize: 11, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--subtle)" }}><span /><span>Location</span><span>Score</span><span>Avg. rank</span><span>Rating</span></div>
        {locs.map(([n, score, rank, rating], i) => (
          <label key={n} className="a-rise" style={{ ...d(i * 70), display: "grid", gridTemplateColumns: cols, gap: 10, alignItems: "center", padding: "10px 12px", borderTop: border, cursor: "pointer", background: sel[i] ? "#FFFBF9" : "#fff" }}>
            <input type="checkbox" checked={sel[i]} onChange={() => setSel((s) => s.map((v, k) => (k === i ? !v : v)))} className="sr-only" aria-label={`Select ${n}`} />
            <span aria-hidden="true" style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${sel[i] ? "#FF5A1F" : "#D0D3DA"}`, background: sel[i] ? "#FF5A1F" : "#fff", color: "#fff", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>{sel[i] ? "✓" : ""}</span>
            <span style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}><span style={{ width: 36, height: 6, borderRadius: 3, background: "#F2F3F5", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: `${score}%`, background: score >= 80 ? "#12B76A" : score >= 65 ? "#F79009" : "#F04438" }} /></span>{score}</span>
            <span className="mono" style={{ fontSize: 12 }}>{rank}</span>
            <span style={{ fontSize: 12 }}><span style={{ color: "#F5A524" }}>★</span> {rating}</span>
          </label>
        ))}
      </div>
    </>
  );
}

function AiView() {
  const ai = [["ChatGPT", "Mentioned · #2", "green", "Recommends Kinara Dental for its paediatric care and weekend hours."], ["Gemini", "Mentioned · #1", "green", "Lists Kinara Dental first, citing its 4.8 rating on Google."], ["Google AI Overviews", "Not mentioned", "red", "Shows SmileCraft Dental and Indira Dental Care instead."]] as const;
  const sov = [["Kinara Dental (you)", 34, "#FF5A1F", 600], ["SmileCraft Dental", 29, "#98A2B3", 400], ["Indira Dental Care", 18, "#98A2B3", 400], ["Others", 19, "#D0D3DA", 400]] as const;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #E4E5EA", borderRadius: 12, padding: "12px 14px", fontSize: 14 }}><span style={{ color: "#FF5A1F" }}>✦</span><span>best dentist in Indiranagar for kids</span><span className="a-blink" style={{ width: 2, height: 16, background: "#14151A" }} /></div>
        {ai.map(([n, st, c, q], i) => (
          <div key={n} className="a-rise" style={{ ...d(i * 120), border, borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}><span style={{ fontWeight: 600, fontSize: 13 }}>{n}</span><span style={tag(P[c][0], P[c][1])}>{st}</span></div>
            <div style={{ fontSize: 12, color: "#3A3D47", lineHeight: 1.5 }}>{q}</div>
          </div>
        ))}
      </div>
      <div style={{ border, borderRadius: 12, padding: 16 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Share of AI voice</div>
        <div style={{ ...muted, marginBottom: 16 }}>25 tracked prompts · last 30 days</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {sov.map(([n, p, c, fw], i) => (
            <div key={n}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}><span style={{ fontWeight: fw }}>{n}</span><span className="mono" style={{ fontSize: 12 }}>{p}%</span></div><div style={{ height: 8, borderRadius: 4, background: "#F2F3F5", overflow: "hidden" }}><div className="a-grow-1" style={{ ...d(200 + i * 90), height: "100%", width: `${Math.round((p / 34) * 100)}%`, background: c, borderRadius: 4 }} /></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportsView() {
  const kpis = [["Calls", "1,284", "18%"], ["Direction requests", "2,310", "12%"], ["Website clicks", "964", "9%"], ["Profile views", "48.2k", "21%"]] as const;
  const cur = path([62, 70, 66, 78, 84, 80, 92, 98, 94, 108, 116, 124], 600, 170, 14, 40, 130);
  const prev = path([58, 60, 64, 62, 66, 70, 68, 72, 74, 72, 78, 80], 600, 170, 14, 40, 130);
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div><div style={title}>Performance · All locations</div><div style={muted}>Last 90 days vs previous period</div></div>
        <span style={{ fontSize: 12, border: "1px solid #E4E5EA", borderRadius: 8, padding: "5px 10px" }}>Monthly PDF · scheduled 1 Oct</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 14 }}>
        {kpis.map(([t, v, c], i) => (
          <div key={t} className="a-rise" style={{ ...d(i * 80), border, borderRadius: 12, padding: 12 }}><div style={muted}>{t}</div><div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-.03em", fontVariantNumeric: "tabular-nums" }}>{v}</div><div style={{ fontSize: 12, color: "#067647" }}>▲ {c}</div></div>
        ))}
      </div>
      <div style={{ border, borderRadius: 12, padding: 14 }}>
        <div style={{ display: "flex", gap: 16, ...muted, marginBottom: 8 }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 14, height: 3, borderRadius: 2, background: "#FF5A1F" }} />Calls from profile</span><span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 14, height: 0, borderTop: "2px dashed #98A2B3" }} />Previous period</span></div>
        <svg viewBox="0 0 600 170" preserveAspectRatio="none" style={{ width: "100%", height: 170, display: "block" }} fill="none">
          <path d="M0 42.5H600M0 85H600M0 127.5H600" stroke="#F2F3F5" />
          <path d={prev.line} stroke="#98A2B3" strokeWidth="2" strokeDasharray="5 5" />
          <path d={cur.area} fill="rgba(255,90,31,.08)" />
          <path className="a-draw" pathLength={1} style={{ animationDuration: "1.6s", animationDelay: ".3s" }} d={cur.line} stroke="#FF5A1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
}

const VIEWS: Record<MockKind, () => React.ReactElement> = { hero: GridView, grid: GridView, comp: CompView, audit: AuditView, protect: ProtectView, reviews: ReviewsView, listings: ListingsView, multi: MultiView, ai: AiView, reports: ReportsView };
const SIDE = ["Overview", "Geo-grid", "Competitors", "Reviews", "Listings", "AI visibility", "Reports"];
const ACTIVE: Record<MockKind, number> = { hero: 1, grid: 1, comp: 2, audit: 0, protect: 0, reviews: 3, listings: 4, multi: 0, ai: 5, reports: 6 };

const LABELS: Record<MockKind, string> = {
  hero: "geo-grid rank map", grid: "geo-grid rank map", comp: "competitor comparison", audit: "profile audit score", protect: "profile protection alerts", reviews: "review inbox with an AI reply draft", listings: "directory listings sync", multi: "multi-location table", ai: "AI search visibility report", reports: "performance report",
};

export function ProductMock({ kind }: { kind: MockKind }) {
  const View = VIEWS[kind];
  const isGrid = kind === "grid" || kind === "hero";
  const active = ACTIVE[kind];
  return (
    <figure className="mock" style={{ position: "relative", width: "100%", margin: 0, fontSize: 14, lineHeight: 1.4, color: "var(--ink)" }} aria-label={`Sample RankMonk dashboard: ${LABELS[kind]}`}>
      <div style={{ position: "relative", background: "#fff", border: "1px solid #E6E7EB", borderRadius: 16, boxShadow: "0 1px 2px rgba(16,24,40,.04), 0 32px 64px -24px rgba(16,24,40,.22)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: border, background: "#FAFAFB" }} aria-hidden="true">
          <div style={{ display: "flex", gap: 6 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: "#E4E5EA" }} />)}</div>
          <div className="mono" style={{ flex: 1, minWidth: 0, maxWidth: 340, margin: "0 auto", background: "#fff", border, borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "var(--subtle)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>dashboard.rankmonk.io/{PATHS[kind]}</div>
          <span style={{ fontSize: 11, color: "var(--subtle)", border: "1px dashed #D0D3DA", borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap" }}>Sample data</span>
        </div>
        <div style={{ display: "flex", minHeight: 0 }}>
          {isGrid && (
            <div className="mock-side" aria-hidden="true" style={{ width: 184, flex: "none", borderRight: border, padding: "16px 12px", background: "#FCFCFD", flexDirection: "column", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px 14px" }}><LogoMark size={22} radius={7} pad={4} gap={2} /><span style={{ fontWeight: 600, fontSize: 13 }}>RankMonk</span></div>
              {SIDE.map((label, i) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, fontSize: 13, whiteSpace: "nowrap", color: i === active ? "#14151A" : "#6B6F7B", background: i === active ? "#F2F3F5" : "transparent", fontWeight: i === active ? 600 : 400 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: i === active ? "#FF5A1F" : "#D0D3DA" }} />
                  {label}
                </div>
              ))}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0, padding: 20 }}>
            <View />
          </div>
        </div>
      </div>
    </figure>
  );
}
