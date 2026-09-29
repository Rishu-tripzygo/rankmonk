"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { icons, type IconName } from "@/content/icons";
import { LogoMark } from "./Logo";

// Interactive, self-playing product tour (sample data). A 1200×720 app frame is
// scaled to its container. Any real pointer-down inside the frame pauses the
// tour and hands control to the visitor; every control also works manually.

type View = "overview" | "grid" | "reviews" | "ai" | "listings";
type ReplyState = "idle" | "typing" | "ready" | "posted";

const W = 1200, H = 720;
const NAV: [View | "comp" | "reports", string, IconName, number?][] = [["overview", "Overview", "home"], ["grid", "Geo-grid", "pin"], ["comp", "Competitors", "users"], ["reviews", "Reviews", "msg", 3], ["listings", "Listings", "list"], ["ai", "AI visibility", "spark"], ["reports", "Reports", "chart"]];
const NAV_ICONS: Partial<Record<IconName, readonly string[]>> = { ...icons, msg: [icons.msg[0]] };
const NAVY = (i: number) => 44 + 128 + i * 38 + 18;
const CH: [View, string][] = [["overview", "Overview"], ["grid", "Geo-grid"], ["reviews", "AI replies"], ["ai", "AI visibility"], ["listings", "Listings"]];
const CHDUR = [3400, 9800, 8200, 6600, 6200];
const REVS: [string, string, string, number, string, string, string][] = [
  ["Priya S.", "PS", "#FFE3D6", 4, "1h", "Dr. Rao was patient and explained every step of my root canal. The waiting time was long though, almost 40 minutes past my slot.", "Waiting time"],
  ["Arjun K.", "AK", "#DCFCE7", 5, "3h", "Best dental clinic in Indiranagar. Painless cleaning and very friendly staff.", "Staff"],
  ["Meera J.", "MJ", "#E0F2FE", 5, "5h", "Clean, modern and on time. Booking on WhatsApp was easy.", "Booking"],
  ["Rohit M.", "RM", "#FEF3C7", 2, "1d", "Treatment was fine but the billing was confusing and nobody explained the charges.", "Pricing"],
  ["Sana A.", "SA", "#EDE9FE", 5, "2d", "My kids actually like coming here. Thank you Dr. Kavya!", "Kids care"],
];
const REPLIES = [
  "Thank you so much, Priya! We're glad Dr. Rao took the time to explain every step. You're right about the wait, and we're sorry. We've added evening slots to keep queues shorter. See you at your next check-up!",
  "Thank you for your feedback, Priya. We are pleased Dr. Rao explained your treatment clearly. We apologise for the delay and have extended our appointment hours to reduce waiting times.",
  "Thanks, Priya! Glad Dr. Rao helped. Sorry about the wait, we're adding more slots to fix it.",
];
const TILES = [15190, 15191, 15192, 15193].flatMap((y) => [23449, 23450, 23451, 23452].map((x) => `/tiles/${y}-${x}.png`));
const P = { g: ["#ECFDF3", "#067647"], a: ["#FFFAEB", "#B54708"], r: ["#FEF3F2", "#B42318"], n: ["#F2F3F5", "#3A3D47"] } as const;
const rc = (r: number) => (r <= 3 ? "#12B76A" : r <= 10 ? "#F79009" : r <= 20 ? "#F04438" : "#98A2B3");
const star = (k: number) => "★★★★★".slice(0, k) + "☆☆☆☆☆".slice(0, 5 - k);

function rank(i: number, j: number, k: number, before: boolean) {
  const dx = i - 3, dy = j - 3, dist = Math.sqrt(dx * dx + dy * dy), base = [1.15, 1.7, 2.4][k] + (before ? 1.6 : 0);
  const noise = ((i * 7 + j * 13 + k * 5) % 5) - 2;
  return Math.max(1, Math.round(1 + dist * base + noise * 0.7 + (dy > 0 ? dist * 0.4 * k : 0) - (dx < 0 ? 0.6 : 0) + (before ? 2 : 0)));
}
function linePath(vals: number[], w: number, h: number, pad: number, lo: number, hi: number) {
  const st = w / (vals.length - 1);
  return vals.map((v, i) => `${i ? "L" : "M"}${(i * st).toFixed(1)} ${(pad + (h - 2 * pad) * (1 - (v - lo) / (hi - lo))).toFixed(1)}`).join(" ");
}
const CALLS = linePath([30, 34, 31, 38, 36, 42, 40, 46, 44, 51, 49, 55, 58, 54, 61], 520, 190, 12, 20, 90);
const DIRS = linePath([52, 55, 58, 54, 60, 63, 61, 66, 70, 68, 72, 75, 73, 79, 82], 520, 190, 12, 20, 90);

type State = {
  view: View; playing: boolean; manual: boolean; ch: number; cur: { x: number; y: number }; caption: string; capN: number;
  kw: number; sel: number | null; compare: boolean; rev: number; tone: number; chars: number; replyState: ReplyState;
  aiState: "loading" | "done"; syncState: "idle" | "running" | "done"; sync: number[]; toast: string | null; tasks: boolean[];
};
const INITIAL: State = { view: "overview", playing: true, manual: false, ch: 0, cur: { x: 760, y: 420 }, caption: "", capN: 1, kw: 0, sel: null, compare: false, rev: 0, tone: 0, chars: 0, replyState: "idle", aiState: "done", syncState: "idle", sync: [], toast: null, tasks: [false, false, true, false] };

const box = { border: "1px solid #EEF0F3", borderRadius: 14 } as const;
const pill = (on: boolean) => ({ border: `1px solid ${on ? "#14151A" : "#E4E5EA"}`, background: on ? "#14151A" : "#fff", color: on ? "#fff" : "#3A3D47", borderRadius: 999, font: "inherit", cursor: "pointer" });
const legend = [["#12B76A", "1–3"], ["#F79009", "4–10"], ["#F04438", "11–20"], ["#98A2B3", "20+"]] as const;

export function ProductDemo() {
  const [s, setS] = useState<State>(INITIAL);
  const [scale, setScale] = useState<number | null>(null);
  const sRef = useRef(s);
  const tokRef = useRef(0);
  const mounted = useRef(true);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const replyTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const chAnim = useRef<Animation | null>(null);

  const set = useCallback((p: Partial<State> | ((prev: State) => Partial<State>)) => {
    setS((prev) => {
      const next = { ...prev, ...(typeof p === "function" ? p(prev) : p) };
      sRef.current = next;
      return next;
    });
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timers.current.delete(t);
      if (mounted.current) fn();
    }, ms);
    timers.current.add(t);
  }, []);
  const wait = useCallback((ms: number) => new Promise<void>((r) => later(r, ms)), [later]);
  const alive = (tok: number) => mounted.current && tok === tokRef.current && sRef.current.playing;

  const tap = () => rippleRef.current?.animate([{ transform: "scale(.3)", opacity: 0.9 }, { transform: "scale(1.6)", opacity: 0 }], { duration: 520, easing: "ease-out" });
  const cap = (t: string) => set((p) => ({ caption: t, capN: p.ch + 1 }));
  const move = async (x: number, y: number, tok: number) => {
    set({ cur: { x, y } });
    await wait(950);
    return alive(tok);
  };

  const startReply = useCallback(() => {
    if (replyTimer.current) clearInterval(replyTimer.current);
    set({ replyState: "typing", chars: 0 });
    replyTimer.current = setInterval(() => {
      const cur = sRef.current, full = REPLIES[cur.tone];
      if (cur.chars >= full.length) {
        if (replyTimer.current) clearInterval(replyTimer.current);
        set({ replyState: "ready" });
      } else set((p) => ({ chars: Math.min(REPLIES[p.tone].length, p.chars + 3) }));
    }, 22);
  }, [set]);
  const postReply = () => {
    if (replyTimer.current) clearInterval(replyTimer.current);
    set((p) => ({ replyState: "posted", chars: REPLIES[p.tone].length, toast: "Reply posted to Google" }));
    later(() => set({ toast: null }), 2200);
  };
  const startAi = () => {
    set({ aiState: "loading" });
    later(() => set({ aiState: "done" }), 1700);
  };
  const startSync = () => {
    set({ syncState: "running", sync: [] });
    for (let i = 0; i < 8; i++) later(() => set((p) => ({ sync: p.sync.concat(i) })), 120 + i * 200);
    later(() => set({ syncState: "done", toast: "8 listings synced" }), 2300);
    later(() => set({ toast: null }), 3600);
  };

  const run = async (from: number) => {
    const tok = ++tokRef.current;
    set({ playing: true, manual: false });
    await wait(60);
    for (let c = from; ; c = (c + 1) % CH.length) {
      if (!alive(tok)) return;
      set({ ch: c, toast: null });
      if (c === 0) {
        set({ view: "overview", sel: null, compare: false, replyState: "idle", chars: 0, aiState: "done", syncState: "idle", sync: [] });
        cap("Every location, rank, review and listing on one screen.");
        await move(760, 420, tok);
        if (!alive(tok)) return;
        await wait(2400);
      } else if (c === 1) {
        cap("Scan your rank street by street.");
        if (!(await move(110, NAVY(1), tok))) return;
        tap(); set({ view: "grid", sel: null, compare: false });
        await wait(1500); if (!alive(tok)) return;
        cap("Click any point to see who ranks above you there.");
        if (!(await move(244 + 21 + 54 * 5 + 27, 124 + 52 + 21 + 54 + 27, tok))) return;
        tap(); set({ sel: 5 + 7 });
        await wait(2200); if (!alive(tok)) return;
        cap("Compare with last month to prove progress.");
        if (!(await move(244 + 862, 124 + 21, tok))) return;
        tap(); set({ compare: true, sel: null });
        await wait(1800); if (!alive(tok)) return;
        tap(); set({ compare: false });
        await wait(1200);
      } else if (c === 2) {
        cap("New reviews from every location land in one inbox.");
        if (!(await move(110, NAVY(3), tok))) return;
        tap(); set({ view: "reviews", rev: 0, replyState: "idle", chars: 0 });
        await wait(900); if (!alive(tok)) return;
        cap("AI drafts a reply that answers what the customer said.");
        if (!(await move(244 + 380 + 24 + 80, 124 + 52 + 410 + 19, tok))) return;
        tap(); startReply();
        await wait(3400); if (!alive(tok)) return;
        tap(); postReply();
        await wait(1600);
      } else if (c === 3) {
        cap("See whether ChatGPT and Gemini recommend you.");
        if (!(await move(110, NAVY(5), tok))) return;
        tap(); set({ view: "ai", aiState: "done" });
        await wait(800); if (!alive(tok)) return;
        if (!(await move(244 + 862, 124 + 20, tok))) return;
        tap(); startAi();
        await wait(3600);
      } else {
        cap("Fix your details on 20+ directories in one click.");
        if (!(await move(110, NAVY(4), tok))) return;
        tap(); set({ view: "listings", syncState: "idle", sync: [] });
        await wait(700); if (!alive(tok)) return;
        if (!(await move(244 + 862, 124 + 20, tok))) return;
        tap(); startSync();
        await wait(3400);
      }
    }
  };
  const runRef = useRef(run);
  useEffect(() => {
    runRef.current = run;
  });

  const pause = (manual: boolean) => {
    tokRef.current++;
    set({ playing: false, manual });
    chAnim.current?.pause();
  };

  // Scale the fixed 1200×720 frame to the container width.
  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const fit = () => {
      const w = el.getBoundingClientRect().width;
      if (w) setScale((prev) => (prev !== null && Math.abs(prev - w / W) < 0.004 ? prev : Math.max(0.2, w / W)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Start the tour (paused when the visitor prefers reduced motion).
  useEffect(() => {
    mounted.current = true;
    const pending = timers.current;
    const t = setTimeout(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        tokRef.current++;
        set({ playing: false });
      } else runRef.current(0);
    }, 700);
    return () => {
      mounted.current = false; // alive() checks this, so the tour loop stops
      clearTimeout(t);
      pending.forEach(clearTimeout);
      if (replyTimer.current) clearInterval(replyTimer.current);
    };
  }, [set]);

  // Chapter progress bar fills over the chapter's duration while playing.
  useEffect(() => {
    chAnim.current?.cancel();
    if (!s.playing) return;
    const el = barsRef.current?.querySelector(`[data-chbar="${s.ch}"]`);
    if (el) chAnim.current = el.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: CHDUR[s.ch], easing: "linear", fill: "forwards" });
  }, [s.ch, s.playing]);

  useEffect(() => {
    capRef.current?.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
  }, [s.caption]);

  // ---- Derived view data ----
  const vi = { overview: 0, grid: 1, reviews: 3, listings: 4, ai: 5 }[s.view];
  const cells: { label: string; bg: string; center: boolean; d: number; idx: number; r: number }[] = [];
  let sum = 0, n = 0, t3 = 0;
  for (let j = 0; j < 7; j++)
    for (let i = 0; i < 7; i++) {
      const r = rank(i, j, s.kw, s.compare);
      if (r <= 20) { sum += r; n++; }
      if (r <= 3) t3++;
      cells.push({ label: r > 20 ? "20+" : String(r), bg: rc(r), center: i === 3 && j === 3, d: Math.round(Math.hypot(i - 3, j - 3) * 60), idx: j * 7 + i, r });
    }
  const avg = (sum / n).toFixed(1);

  let pop: null | { rows: { p: number | string; n: string; r: string; you: boolean }[]; id: string; dist: string; x: number; y: number } = null;
  if (s.sel !== null) {
    const i = s.sel % 7, j = Math.floor(s.sel / 7), r = rank(i, j, s.kw, s.compare);
    const cx = 21 + 54 * i + 27, cy = 21 + 54 * j + 27;
    const names = [["SmileCraft Dental", "4.6"], ["Indira Dental Care", "4.7"], ["PearlLine Dental", "4.4"], ["BrightBite Dentistry", "4.9"]];
    const rows: { p: number | string; n: string; r: string; you: boolean }[] = [];
    let k = 0;
    for (let p = 1; p <= 3; p++) rows.push(p === r ? { p, n: "Kinara Dental (you)", r: "4.8", you: true } : { p, n: names[k][0], r: names[k++][1], you: false });
    if (r > 3) rows.push({ p: r > 20 ? "20+" : r, n: "Kinara Dental (you)", r: "4.8", you: true });
    pop = { rows, id: String.fromCharCode(65 + j) + (i + 1), dist: `${(Math.hypot(i - 3, j - 3) * 0.5).toFixed(1)} km away`, x: i >= 4 ? cx - 230 : cx + 24, y: Math.min(Math.max(cy - 40, 8), 420 - 190) };
  }
  const comps = [["Kinara Dental (you)", s.compare ? 38 : 61, "#FF5A1F", 600], ["SmileCraft Dental", s.compare ? 70 : 57, "#98A2B3", 400], ["Indira Dental Care", 34, "#98A2B3", 400], ["PearlLine Dental", s.compare ? 26 : 18, "#98A2B3", 400]] as const;

  const rv0 = REVS[s.rev];
  const full = REPLIES[s.tone], rs = s.replyState;
  const replyText = s.rev === 0 ? full.slice(0, rs === "idle" ? 0 : rs === "typing" ? s.chars : full.length) : rs === "idle" ? "" : `Thank you for taking the time to share this, ${rv0[0].split(" ")[0]}. We have passed your feedback to the team.`;
  const loading = s.aiState === "loading";
  const AIR = [["ChatGPT", "GPT", "#10A37F", "Mentioned · #2", "g", "Recommends Kinara Dental for its paediatric care and weekend hours, after SmileCraft Dental."], ["Gemini", "G", "#4F46E5", "Mentioned · #1", "g", "Lists Kinara Dental first and cites its 4.8 rating from 412 Google reviews."], ["Google AI Overviews", "AI", "#EA4335", "Not mentioned", "r", "Shows SmileCraft Dental and Indira Dental Care. Add kids-care details to your profile to compete."]] as const;
  const sov = [["Kinara Dental (you)", 34, "#FF5A1F", 600], ["SmileCraft Dental", 29, "#98A2B3", 400], ["Indira Dental Care", 18, "#98A2B3", 400], ["Others", 19, "#D0D3DA", 400]] as const;
  const LR = [["G", "Google Business Profile", "Matches", 0], ["B", "Bing Places", "Matches", 0], ["A", "Apple Business Connect", "Old phone number", 1], ["f", "Facebook", "Matches", 0], ["W", "Waze", "Missing holiday hours", 1], ["F", "Foursquare", "Matches", 0], ["H", "HERE WeGo", "Wrong category", 1], ["T", "TomTom", "Matches", 0]] as const;
  const lrows = LR.map(([i2, nm, det, bad], i) => {
    const done = s.syncState === "done" || s.sync.includes(i);
    return { i: i2, n: nm, det: done ? "Matches" : det, dfg: bad && !done ? "#B42318" : "#4A4E5A", p: done ? 100 : bad ? 40 : 100, pc: done || !bad ? "#12B76A" : "#F79009", dur: s.syncState === "running" ? 500 : 0, ok: done || !bad };
  });
  const badCount = lrows.filter((l) => !l.ok).length;
  const TK = [["Add 5 new photos", "Profiles with fresh photos rank higher", "High", "r"], ["Set Diwali holiday hours", "Due in 3 days · 42 locations", "Due soon", "a"], ["Reply to 3 new reviews", "Average reply time: 4h", "Done", "g"], ["Add \"Invisalign\" to services", "Searched 1.2k times a month nearby", "Medium", "n"]] as const;
  const urlPath = { overview: "overview", grid: "geo-grid", reviews: "reviews", ai: "ai-visibility", listings: "listings" }[s.view];
  const titles = { overview: "Kinara Dental, Indiranagar", grid: "Geo-grid", reviews: "Reviews", ai: "AI visibility", listings: "Listings" };
  const status = s.playing ? "Guided tour playing" : s.manual ? "You’re in control. Press play to resume." : "Tour paused";

  const onUser = (e: React.PointerEvent) => {
    if (e.isTrusted && sRef.current.playing) pause(true);
  };

  return (
    <div role="region" aria-roledescription="interactive product tour" aria-label="RankMonk product tour with sample data" style={{ width: "100%" }}>
      <div ref={outerRef} style={{ position: "relative", width: "100%", aspectRatio: `${W} / ${H}`, borderRadius: 18, boxShadow: "0 0 0 1px rgba(20,21,26,.08), 0 2px 4px rgba(16,24,40,.04), 0 40px 80px -30px rgba(16,24,40,.35)", overflow: "hidden", background: "#fff" }}>
        <div onPointerDown={onUser} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `scale(${scale ?? 1})`, transformOrigin: "0 0", opacity: scale === null ? 0 : 1, transition: "opacity .3s", background: "#fff", fontSize: 14, lineHeight: 1.4, whiteSpace: "nowrap" }}>
          {/* Browser chrome */}
          <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, width: W, height: 44, background: "#F6F6F8", borderBottom: "1px solid #E8E9ED", display: "flex", alignItems: "center", gap: 14, padding: "0 16px" }}>
            <div style={{ display: "flex", gap: 7 }}>{["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}</div>
            <div style={{ margin: "0 auto", width: 520, height: 28, borderRadius: 8, background: "#fff", border: "1px solid #E8E9ED", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 12.5, color: "#4A4E5A" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#12B76A" strokeWidth="2.4" strokeLinecap="round"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
              <span style={{ color: "#14151A" }}>dashboard.rankmonk.io</span><span>/kinara-dental/indiranagar/{urlPath}</span>
            </div>
            <span style={{ fontSize: 11, color: "#6B6F7B", border: "1px dashed #C9CCD3", borderRadius: 999, padding: "3px 9px" }}>Sample data</span>
          </div>

          {/* Sidebar */}
          <div style={{ position: "absolute", left: 0, top: 44, width: 220, height: 676, background: "#FBFBFC", borderRight: "1px solid #EEF0F3" }}>
            <div style={{ position: "absolute", left: 18, top: 16, display: "flex", alignItems: "center", gap: 9 }}><LogoMark size={26} pad={5} gap={2} /><span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-.03em" }}>RankMonk</span></div>
            <div style={{ position: "absolute", left: 12, top: 60, width: 196, height: 48, border: "1px solid #E8E9ED", background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", gap: 10, padding: "0 10px" }}>
              <span style={{ width: 28, height: 28, borderRadius: 7, background: "#E0F2FE", color: "#0369A1", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>KD</span>
              <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: "block", fontSize: 13, fontWeight: 600 }}>Kinara Dental</span><span style={{ display: "block", fontSize: 11.5, color: "#6B6F7B" }}>Indiranagar · 1 of 42</span></span>
            </div>
            <div style={{ position: "absolute", left: 20, top: 120, fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "#9A9DA6" }}>Workspace</div>
            <div style={{ position: "absolute", left: 12, top: 128, width: 196 }}>
              {NAV.map(([k, label, ic, badge], i) => {
                const on = i === vi;
                const go = ["overview", "grid", "reviews", "listings", "ai"].includes(k);
                return (
                  <button key={k} type="button" disabled={!go} onClick={() => go && set({ view: k as View, sel: null })} style={{ width: "100%", height: 36, marginTop: i ? 2 : 0, display: "flex", alignItems: "center", gap: 10, padding: "0 10px", border: 0, borderRadius: 8, background: on ? "#fff" : "transparent", color: on ? "#14151A" : "#4A4E5A", font: "inherit", fontSize: 13.5, fontWeight: on ? 600 : 400, cursor: go ? "pointer" : "default", textAlign: "left", boxShadow: on ? "0 1px 2px rgba(16,24,40,.08), 0 0 0 1px #EEF0F3" : "none" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? "#FF5A1F" : "#9A9DA6"} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{NAV_ICONS[ic]!.map((p) => <path key={p} d={p} />)}</svg>
                    <span style={{ flex: 1 }}>{label}</span>
                    {badge && rs !== "posted" && <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", background: "#FF5A1F", borderRadius: 999, padding: "1px 7px" }}>{badge}</span>}
                  </button>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 12, bottom: 14, width: 196, display: "flex", alignItems: "center", gap: 10, padding: 8, borderTop: "1px solid #EEF0F3" }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#FFE3D6", color: "#C2410C", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>AR</span>
              <span><span style={{ display: "block", fontSize: 13, fontWeight: 600 }}>Ananya Rao</span><span style={{ display: "block", fontSize: 11.5, color: "#6B6F7B" }}>Marketing lead</span></span>
            </div>
          </div>

          {/* Top bar */}
          <div aria-hidden="true" style={{ position: "absolute", left: 220, top: 44, width: 980, height: 56, borderBottom: "1px solid #EEF0F3", display: "flex", alignItems: "center", gap: 12, padding: "0 24px" }}>
            <div style={{ fontSize: 13, color: "#6B6F7B" }}>Locations <span style={{ color: "#C9CCD3" }}>/</span> <span style={{ color: "#14151A", fontWeight: 600 }}>{titles[s.view]}</span></div>
            <div style={{ marginLeft: "auto", width: 230, height: 34, border: "1px solid #E8E9ED", borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "0 10px", color: "#9A9DA6", fontSize: 13 }}>Search locations, keywords…<span style={{ marginLeft: "auto", fontSize: 11, border: "1px solid #E8E9ED", borderRadius: 5, padding: "0 5px" }}>⌘K</span></div>
            <div style={{ height: 34, border: "1px solid #E8E9ED", borderRadius: 9, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", fontSize: 13 }}>Last 30 days</div>
            <div style={{ position: "relative", width: 34, height: 34, border: "1px solid #E8E9ED", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A3D47" strokeWidth="1.9" strokeLinecap="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg><span style={{ position: "absolute", top: 6, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#FF5A1F", border: "1.5px solid #fff" }} /></div>
          </div>

          {/* Content */}
          <div style={{ position: "absolute", left: 244, top: 124, width: 932, height: 572 }}>
            {s.view === "overview" && (
              <div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}><div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-.03em" }}>Good morning, Ananya</div><div style={{ fontSize: 13, color: "#6B6F7B" }}>Updated 21 Sep, 07:30</div></div>
                <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                  {[["Profile score", "78", "+6", "of 100 · 6 fixes open"], ["Average rank", "3.2", "▲ 5.2", "\"dentist near me\""], ["Rating", "4.8", "+0.1", "412 Google reviews"], ["AI mention rate", "64%", "+12 pts", "across 25 prompts"]].map(([t, v, c, sub], i) => (
                    <div key={t} className="a-rise" style={{ ...box, padding: 16, animationDelay: `${i * 70}ms` }}>
                      <div style={{ fontSize: 12.5, color: "#6B6F7B" }}>{t}</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}><span style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-.04em", fontVariantNumeric: "tabular-nums" }}>{v}</span><span style={{ fontSize: 12, fontWeight: 600, color: "#067647", background: "#ECFDF3", padding: "2px 7px", borderRadius: 999 }}>{c}</span></div>
                      <div style={{ fontSize: 12, color: "#9A9DA6", marginTop: 4 }}>{sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 14 }}>
                  <div style={{ ...box, padding: 16, height: 340 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ fontWeight: 600 }}>Customer actions</div><div style={{ display: "flex", gap: 14, fontSize: 12, color: "#6B6F7B" }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 10, height: 3, borderRadius: 2, background: "#FF5A1F" }} />Calls</span><span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 10, height: 3, borderRadius: 2, background: "#14151A" }} />Directions</span></div></div>
                    <div style={{ display: "flex", gap: 28, marginTop: 12 }}>{[["Calls", "1,284"], ["Directions", "2,310"], ["Website clicks", "964"]].map(([t, v]) => <div key={t}><div style={{ fontSize: 12, color: "#6B6F7B" }}>{t}</div><div style={{ fontSize: 20, fontWeight: 600 }}>{v}</div></div>)}</div>
                    <svg viewBox="0 0 520 190" preserveAspectRatio="none" style={{ width: "100%", height: 200, marginTop: 10, display: "block" }} fill="none">
                      <path d="M0 47.5H520M0 95H520M0 142.5H520" stroke="#F2F3F5" />
                      <path d={`${CALLS} L520 190 L0 190 Z`} fill="rgba(255,90,31,.09)" />
                      <path className="a-draw" pathLength={1} style={{ animationDuration: "1.5s" }} d={DIRS} stroke="#14151A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path className="a-draw" pathLength={1} style={{ animationDuration: "1.5s" }} d={CALLS} stroke="#FF5A1F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ ...box, padding: 16, height: 340 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><div style={{ fontWeight: 600 }}>Next best actions</div><span style={{ fontSize: 12, color: "#6B6F7B" }}>{s.tasks.filter((x) => !x).length} left</span></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {TK.map(([t, sub, tg, c], i) => {
                        const on = s.tasks[i];
                        const [tb, tf] = P[on ? "g" : c];
                        return (
                          <button key={t} type="button" aria-pressed={on} className="a-rise" onClick={() => set((p) => ({ tasks: p.tasks.map((v, k) => (k === i ? !v : v)) }))} style={{ animationDelay: `${i * 70}ms`, display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", border: "1px solid #EEF0F3", borderRadius: 10, background: "#fff", font: "inherit", textAlign: "left", cursor: "pointer" }}>
                            <span style={{ width: 18, height: 18, flex: "none", borderRadius: "50%", border: `1.5px solid ${on ? "#12B76A" : "#C9CCD3"}`, background: on ? "#12B76A" : "#fff", color: "#fff", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>{on ? "✓" : ""}</span>
                            <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: "block", fontSize: 13, fontWeight: 500, textDecoration: on ? "line-through" : "none", color: on ? "#9A9DA6" : "#14151A" }}>{t}</span><span style={{ display: "block", fontSize: 11.5, color: "#9A9DA6" }}>{sub}</span></span>
                            <span style={{ fontSize: 11, fontWeight: 600, color: tf, background: tb, padding: "2px 7px", borderRadius: 999 }}>{on ? "Done" : tg}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {s.view === "grid" && (
              <div style={{ position: "relative", height: 572 }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: 40, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-.02em", marginRight: 8 }}>Geo-grid</div>
                  {["dentist near me", "dental clinic indiranagar", "root canal treatment"].map((label, i) => (
                    <button key={label} type="button" aria-pressed={i === s.kw} onClick={() => set({ kw: i, sel: null })} style={{ ...pill(i === s.kw), padding: "5px 12px", fontSize: 12.5 }}>{label}</button>
                  ))}
                </div>
                <button type="button" aria-pressed={s.compare} onClick={() => set((p) => ({ compare: !p.compare, sel: null }))} style={{ position: "absolute", left: 792, top: 6, width: 140, height: 30, display: "flex", alignItems: "center", gap: 8, justifyContent: "center", border: "1px solid #E8E9ED", borderRadius: 8, background: "#fff", font: "inherit", fontSize: 12.5, cursor: "pointer" }}>
                  <span style={{ position: "relative", width: 26, height: 15, borderRadius: 999, background: s.compare ? "#FF5A1F" : "#D0D3DA", transition: "background .2s" }}><span style={{ position: "absolute", top: 2, left: s.compare ? 13 : 2, width: 11, height: 11, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 2px rgba(0,0,0,.2)" }} /></span>
                  {s.compare ? "30 days ago" : "Compare"}
                </button>
                <div style={{ position: "absolute", left: 0, top: 52, width: 420, height: 420, borderRadius: 14, overflow: "hidden", background: "#EEF1F4", border: "1px solid #E8E9ED" }}>
                  <div style={{ position: "absolute", left: "-18.33%", top: "-32%", width: "133.33%", height: "133.33%", display: "flex", flexWrap: "wrap" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- tiny static map tiles inside a scaled canvas */}
                    {TILES.map((t) => <img key={t} src={t} alt="" draggable={false} loading="lazy" style={{ width: "25%", height: "25%", display: "block", objectFit: "cover", userSelect: "none" }} />)}
                  </div>
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.12)" }} />
                  <div key={`${s.kw}-${s.compare}`} style={{ position: "absolute", left: 21, top: 21, right: 21, bottom: 21, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(7, 1fr)" }}>
                    {cells.map((c) => (
                      <div key={c.idx} style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {c.center && <span className="a-pulse" style={{ position: "absolute", width: 34, height: 34, borderRadius: "50%", background: "rgba(255,90,31,.5)" }} />}
                        <button type="button" aria-label={`Point ${String.fromCharCode(65 + Math.floor(c.idx / 7))}${(c.idx % 7) + 1}: rank ${c.label}`} onClick={() => set((p) => ({ sel: p.sel === c.idx ? null : c.idx }))} className="a-pop" style={{ animationDelay: `${c.d}ms`, position: "relative", width: 34, height: 34, borderRadius: "50%", background: c.bg, color: "#fff", font: "inherit", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", boxShadow: s.sel === c.idx ? "0 0 0 3px #14151A, 0 4px 10px rgba(0,0,0,.25)" : "0 2px 6px rgba(16,24,40,.25)", cursor: "pointer", fontVariantNumeric: "tabular-nums", transition: "background .35s", padding: 0 }}>{c.label}</button>
                      </div>
                    ))}
                  </div>
                  {pop && (
                    <div className="a-rise" style={{ position: "absolute", left: pop.x, top: pop.y, width: 210, background: "#fff", borderRadius: 12, boxShadow: "0 18px 40px -12px rgba(16,24,40,.35), 0 0 0 1px rgba(16,24,40,.06)", padding: 12, zIndex: 3 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#6B6F7B" }}><span>Point {pop.id}</span><span>{pop.dist}</span></div>
                      <div style={{ fontSize: 13, fontWeight: 600, margin: "4px 0 8px" }}>Top results here</div>
                      {pop.rows.map((r) => (
                        <div key={`${r.p}-${r.n}`} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 6px", borderRadius: 7, background: r.you ? "#FFF1EA" : "transparent", fontSize: 12.5 }}><span className="mono" style={{ width: 18, color: "#6B6F7B" }}>{r.p}</span><span style={{ flex: 1, fontWeight: r.you ? 700 : 400 }}>{r.n}</span><span style={{ color: "#F5A524" }}>★</span><span>{r.r}</span></div>
                      ))}
                    </div>
                  )}
                  <div style={{ position: "absolute", right: 6, bottom: 4, fontSize: 9, color: "#6B6F7B", background: "rgba(255,255,255,.8)", padding: "1px 4px", borderRadius: 3 }}>Tiles © Esri</div>
                </div>
                <div style={{ position: "absolute", left: 440, top: 52, width: 492, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    <div style={{ ...box, padding: 14 }}><div style={{ fontSize: 12, color: "#6B6F7B" }}>Average rank</div><div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-.04em", fontVariantNumeric: "tabular-nums" }}>{avg}</div><div style={{ fontSize: 12, color: s.compare ? "#6B6F7B" : "#067647" }}>{s.compare ? "30 days ago" : "▲ 5.2 vs last month"}</div></div>
                    <div style={{ ...box, padding: 14 }}><div style={{ fontSize: 12, color: "#6B6F7B" }}>Top-3 coverage</div><div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-.04em", fontVariantNumeric: "tabular-nums" }}>{Math.round((t3 / 49) * 100)}%</div><div style={{ fontSize: 12, color: "#6B6F7B" }}>{t3} of 49 points</div></div>
                    <div style={{ ...box, padding: 14 }}><div style={{ fontSize: 12, color: "#6B6F7B" }}>Scan</div><div style={{ fontSize: 15, fontWeight: 600, marginTop: 8 }}>7×7 · 1.5 km</div><div style={{ fontSize: 12, color: "#6B6F7B" }}>{s.compare ? "Scanned 21 Aug" : "Scanned 21 Sep"}</div></div>
                  </div>
                  <div style={{ ...box, padding: 14 }}>
                    <div style={{ fontWeight: 600, marginBottom: 10 }}>Competitors on this grid</div>
                    {comps.map(([nm, w, c, fw]) => (
                      <div key={nm} style={{ display: "grid", gridTemplateColumns: "1fr 150px 44px", gap: 10, alignItems: "center", padding: "7px 0", borderTop: "1px solid #F2F3F5", fontSize: 13 }}><span style={{ fontWeight: fw }}>{nm}</span><span style={{ height: 7, borderRadius: 4, background: "#F2F3F5", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: `${w}%`, background: c, borderRadius: 4, transition: "width .6s" }} /></span><span className="mono" style={{ fontSize: 12, textAlign: "right" }}>{w}%</span></div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#3A3D47" }}>
                    {legend.map(([c, l]) => <span key={l} style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />{l}</span>)}
                    <span style={{ marginLeft: "auto", color: "#6B6F7B" }}>Click any point</span>
                  </div>
                </div>
              </div>
            )}

            {s.view === "reviews" && (
              <div style={{ position: "relative", height: 572 }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: 40, display: "flex", alignItems: "center", gap: 10 }}><div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-.02em" }}>Reviews</div><span style={{ fontSize: 12, color: "#6B6F7B" }}>412 total · 4.8 average</span></div>
                <div style={{ position: "absolute", left: 0, top: 52, width: 364, height: 520, ...box, overflow: "hidden" }}>
                  {REVS.map((r, i) => (
                    <button key={r[0]} type="button" aria-pressed={i === s.rev} onClick={() => set({ rev: i, replyState: "idle", chars: 0 })} style={{ width: "100%", height: 86, display: "flex", gap: 10, padding: 14, border: 0, borderBottom: "1px solid #F2F3F5", background: i === s.rev ? "#FFF8F4" : "#fff", font: "inherit", textAlign: "left", cursor: "pointer" }}>
                      <span style={{ width: 32, height: 32, flex: "none", borderRadius: "50%", background: r[2], color: "#14151A", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{r[1]}</span>
                      <span style={{ flex: 1, minWidth: 0 }}><span style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ fontWeight: 600 }}>{r[0]}</span><span style={{ color: "#9A9DA6", fontSize: 12 }}>{r[4]}</span></span><span style={{ display: "block", fontSize: 12, color: "#F5A524", letterSpacing: 1 }}>{star(r[3])}</span><span style={{ display: "block", fontSize: 12.5, color: "#4A4E5A", overflow: "hidden", textOverflow: "ellipsis" }}>{r[5]}</span></span>
                      {i === 0 && rs !== "posted" && <span style={{ width: 8, height: 8, marginTop: 4, borderRadius: "50%", background: "#FF5A1F" }} />}
                    </button>
                  ))}
                </div>
                <div style={{ position: "absolute", left: 380, top: 52, width: 552, height: 520, ...box }}>
                  <div style={{ position: "absolute", left: 24, top: 20, right: 24, display: "flex", alignItems: "center", gap: 12 }}><span style={{ width: 40, height: 40, borderRadius: "50%", background: rv0[2], fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>{rv0[1]}</span><div><div style={{ fontWeight: 600 }}>{rv0[0]}</div><div style={{ fontSize: 12, color: "#6B6F7B" }}><span style={{ color: "#F5A524" }}>{star(rv0[3])}</span> · Google · {rv0[4]}</div></div><span style={{ marginLeft: "auto", fontSize: 12, color: "#6B6F7B", border: "1px solid #EEF0F3", borderRadius: 999, padding: "3px 10px" }}>{rv0[6]}</span></div>
                  <p style={{ position: "absolute", left: 24, top: 76, right: 24, margin: 0, whiteSpace: "normal", fontSize: 14.5, lineHeight: 1.6 }}>{rv0[5]}</p>
                  <div style={{ position: "absolute", left: 24, right: 24, top: 170, height: 224, borderRadius: 12, border: `1px solid ${rs === "idle" ? "#EEF0F3" : "#FFD9C7"}`, background: rs === "idle" ? "#FCFCFD" : "#FFFBF9", padding: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#C2410C" }}>✦ AI reply</span>
                      <span style={{ display: "flex", gap: 4 }}>
                        {["Warm", "Professional", "Short"].map((label, i) => (
                          <button key={label} type="button" aria-pressed={i === s.tone} onClick={() => { set({ tone: i }); if (sRef.current.replyState !== "idle") later(startReply, 0); }} style={{ ...pill(i === s.tone), padding: "3px 10px", fontSize: 11.5 }}>{label}</button>
                        ))}
                      </span>
                    </div>
                    {rs === "idle" && <div style={{ fontSize: 13.5, color: "#9A9DA6", lineHeight: 1.6, whiteSpace: "normal" }}>Generate a reply that answers what {rv0[0].split(" ")[0]} wrote, in your brand&apos;s tone.</div>}
                    <div style={{ fontSize: 14, lineHeight: 1.65, whiteSpace: "normal" }}>{replyText}{rs === "typing" && <span className="caret a-blink" style={{ height: 15, marginLeft: 1 }} />}</div>
                  </div>
                  <button type="button" onClick={() => { const r = sRef.current.replyState; if (r === "idle") startReply(); else if (r === "ready" || r === "typing") postReply(); }} style={{ position: "absolute", left: 24, top: 410, width: 160, height: 38, border: 0, borderRadius: 10, background: rs === "posted" ? "#12B76A" : rs === "idle" ? "#14151A" : "#FF5A1F", color: "#fff", font: "inherit", fontSize: 13.5, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {rs === "idle" ? "✦ Generate reply" : rs === "posted" ? "✓ Posted" : "Post reply"}
                  </button>
                  <span style={{ position: "absolute", left: 200, top: 420, fontSize: 12.5, color: "#6B6F7B" }}>{rs === "posted" ? "Posted to Google just now" : rs === "ready" ? "Review it, then post" : ""}</span>
                </div>
              </div>
            )}

            {s.view === "ai" && (
              <div style={{ position: "relative", height: 572 }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: 40, display: "flex", alignItems: "center", gap: 10 }}><div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-.02em" }}>AI visibility</div><span style={{ fontSize: 12, color: "#6B6F7B" }}>25 prompts tracked</span></div>
                <button type="button" onClick={startAi} style={{ position: "absolute", left: 792, top: 3, width: 140, height: 34, border: 0, borderRadius: 9, background: "#14151A", color: "#fff", font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{loading ? "Checking…" : "Run check"}</button>
                <div style={{ position: "absolute", left: 0, top: 52, width: 932, height: 56, border: "1px solid #E8E9ED", borderRadius: 12, display: "flex", alignItems: "center", gap: 12, padding: "0 16px", fontSize: 15 }}><span style={{ color: "#FF5A1F", fontSize: 16 }}>✦</span>best dentist in Indiranagar for kids<span style={{ marginLeft: "auto", fontSize: 12, color: "#6B6F7B" }}>Prompt 1 of 25</span></div>
                <div style={{ position: "absolute", left: 0, top: 124, width: 580, display: "flex", flexDirection: "column", gap: 10 }}>
                  {AIR.map(([nm, ab, lg, st, c, q]) => (
                    <div key={nm} style={{ position: "relative", overflow: "hidden", border: "1px solid #EEF0F3", borderRadius: 12, padding: "14px 16px", height: 120 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 28, height: 28, borderRadius: 8, background: lg, color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{ab}</span><span style={{ fontWeight: 600 }}>{nm}</span><span style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: loading ? P.n[0] : P[c][0], color: loading ? P.n[1] : P[c][1] }}>{loading ? "Checking…" : st}</span></div>
                      {loading ? (
                        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}><div className="a-shimmer" style={{ height: 10, width: "92%", borderRadius: 5 }} /><div className="a-shimmer" style={{ height: 10, width: "70%", borderRadius: 5 }} /></div>
                      ) : (
                        <p className="a-rise" style={{ margin: "12px 0 0", whiteSpace: "normal", fontSize: 13, lineHeight: 1.55, color: "#3A3D47" }}>{q}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ position: "absolute", left: 596, top: 124, width: 336, height: 380, border: "1px solid #EEF0F3", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontWeight: 600 }}>Share of AI voice</div>
                  <div style={{ fontSize: 12, color: "#6B6F7B", marginBottom: 16 }}>All prompts · last 30 days</div>
                  {sov.map(([nm, p, c, fw]) => (
                    <div key={nm} style={{ marginBottom: 14 }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}><span style={{ fontWeight: fw }}>{nm}</span><span className="mono" style={{ fontSize: 12 }}>{p}%</span></div><div style={{ height: 8, borderRadius: 4, background: "#F2F3F5", overflow: "hidden" }}><div style={{ height: "100%", width: `${loading ? 0 : Math.round((p / 34) * 100)}%`, background: c, borderRadius: 4, transition: "width .8s cubic-bezier(.2,.8,.2,1)" }} /></div></div>
                  ))}
                  <div style={{ borderTop: "1px solid #F2F3F5", paddingTop: 12, fontSize: 12.5, color: "#3A3D47", lineHeight: 1.5, whiteSpace: "normal" }}>Most cited source: <b>Google Business Profile reviews</b></div>
                </div>
              </div>
            )}

            {s.view === "listings" && (
              <div style={{ position: "relative", height: 572 }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: 40, display: "flex", alignItems: "center", gap: 10 }}><div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-.02em" }}>Listings</div><span style={{ fontSize: 12, color: "#6B6F7B" }}>Consistency {badCount ? 88 : 100}%</span></div>
                <button type="button" onClick={() => sRef.current.syncState !== "running" && startSync()} style={{ position: "absolute", left: 792, top: 3, width: 140, height: 34, border: 0, borderRadius: 9, background: "#FF5A1F", color: "#fff", font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{s.syncState === "running" ? "Syncing…" : s.syncState === "done" ? "✓ All synced" : "Sync all"}</button>
                <div style={{ position: "absolute", left: 0, top: 52, width: 932, ...box, overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 2.2fr 1.2fr 1fr", gap: 12, padding: "12px 16px", background: "#FAFAFB", fontSize: 11.5, letterSpacing: ".06em", textTransform: "uppercase", color: "#6B6F7B" }}><span>Directory</span><span>Details</span><span>Sync</span><span>Status</span></div>
                  {lrows.map((l) => (
                    <div key={l.n} style={{ display: "grid", gridTemplateColumns: "2fr 2.2fr 1.2fr 1fr", gap: 12, alignItems: "center", padding: "0 16px", height: 50, borderTop: "1px solid #F2F3F5", fontSize: 13 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ width: 28, height: 28, borderRadius: 8, background: "#F4F5F7", fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{l.i}</span>{l.n}</span>
                      <span style={{ color: l.dfg }}>{l.det}</span>
                      <span style={{ height: 6, borderRadius: 3, background: "#F2F3F5", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: `${l.p}%`, background: l.pc, transition: `width ${l.dur}ms linear` }} /></span>
                      <span><span style={{ fontSize: 11.5, fontWeight: 600, padding: "3px 9px", borderRadius: 999, background: l.ok ? P.g[0] : P.r[0], color: l.ok ? P.g[1] : P.r[1] }}>{l.ok ? "Synced" : "Needs fix"}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {s.toast && (
            <div role="status" style={{ position: "absolute", left: "50%", bottom: 24, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 10, background: "#14151A", color: "#fff", padding: "11px 16px", borderRadius: 12, fontSize: 13.5, boxShadow: "0 20px 40px -12px rgba(0,0,0,.4)", zIndex: 20, animation: "rmFade .36s cubic-bezier(.2,.8,.2,1)" }}>
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#12B76A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</span>
              {s.toast}
            </div>
          )}

          {s.playing && (
            <div aria-hidden="true" style={{ position: "absolute", left: s.cur.x, top: s.cur.y, zIndex: 30, pointerEvents: "none", transition: "left .9s cubic-bezier(.65,0,.35,1), top .9s cubic-bezier(.65,0,.35,1)" }}>
              <span ref={rippleRef} style={{ position: "absolute", left: -18, top: -18, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,90,31,.35)", opacity: 0 }} />
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: "absolute", left: -4, top: -2, filter: "drop-shadow(0 2px 3px rgba(0,0,0,.3))" }}><path d="M4 2 L4 19 L8.5 14.8 L11.5 21.5 L14.3 20.3 L11.4 13.8 L17.5 13.8 Z" fill="#14151A" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
            </div>
          )}
          {s.playing && s.caption && (
            <div ref={capRef} aria-live="polite" style={{ position: "absolute", left: 220, right: 0, top: 654, display: "flex", justifyContent: "center", zIndex: 25, pointerEvents: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(20,21,26,.92)", color: "#fff", padding: "12px 18px", borderRadius: 14, fontSize: 15, fontWeight: 500, boxShadow: "0 20px 40px -12px rgba(0,0,0,.4)", backdropFilter: "blur(8px)" }}>
                <span style={{ width: 22, height: 22, borderRadius: 7, background: "#FF5A1F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{s.capN}</span>
                {s.caption}
              </div>
            </div>
          )}
        </div>
      </div>

      <div ref={barsRef} style={{ marginTop: 16, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
        <button type="button" onClick={() => (s.playing ? pause(false) : runRef.current(s.ch))} aria-label={s.playing ? "Pause tour" : "Play tour"} style={{ width: 44, height: 44, flex: "none", borderRadius: "50%", border: "1px solid #E1E3E8", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {s.playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#14151A" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#14151A" aria-hidden="true"><path d="M7 4v16l13-8z" /></svg>
          )}
        </button>
        <div style={{ flex: 1, minWidth: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8 }}>
          {CH.map(([, label], i) => {
            const on = i === s.ch;
            const fill = s.playing ? (i < s.ch ? 1 : 0) : i < s.ch ? 1 : on ? 0.5 : 0;
            return (
              <button key={label} type="button" aria-current={on ? "step" : undefined} onClick={() => runRef.current(i)} style={{ position: "relative", overflow: "hidden", textAlign: "left", padding: "10px 12px 12px", borderRadius: 12, border: `1px solid ${on ? "#FFB899" : "#EEF0F3"}`, background: on ? "#fff" : "#FAFAFB", font: "inherit", cursor: "pointer" }}>
                <span className="mono" style={{ display: "block", fontSize: 11, color: "#6B6F7B" }}>0{i + 1}</span>
                <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: on ? "#14151A" : "#6B6F7B", whiteSpace: "nowrap" }}>{label}</span>
                <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: "#F2F3F5" }}><span data-chbar={i} style={{ display: "block", height: "100%", width: "100%", background: "#FF5A1F", transformOrigin: "left center", transform: `scaleX(${fill})` }} /></span>
              </button>
            );
          })}
        </div>
        <span role="status" style={{ fontSize: 13, color: "#6B6F7B", whiteSpace: "nowrap" }}>{status}</span>
      </div>
    </div>
  );
}
