"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { features, featureHref } from "@/content/features";
import { industries, solutions, industryHref, solutionHref, imageSrc } from "@/content/groups";
import { Glyph, Icon } from "./Icon";
import { LogoMark } from "./Logo";

type Menu = "p" | "s" | "r" | null;

export function Header({ dashboardUrl }: { dashboardUrl: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<Menu>(null);
  const [ind, setInd] = useState({ x: 0, w: 0, o: 0 });
  const [pv, setPv] = useState(0);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobile(false);
      }
    };
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenu(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, []);

  const hover = (k: Menu) => (e: React.SyntheticEvent<HTMLElement>) => {
    const t = e.currentTarget;
    setMenu(k);
    setInd({ x: t.offsetLeft, w: t.offsetWidth, o: 1 });
  };
  const toggle = (k: Menu) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const t = e.currentTarget;
    setMenu((m) => (m === k ? null : k));
    setInd({ x: t.offsetLeft, w: t.offsetWidth, o: 1 });
  };
  const close = () => {
    setMenu(null);
    setInd((i) => ({ ...i, o: 0 }));
  };
  // Any link click inside the header closes open menus (covers client-side navigation).
  const onClick = (e: React.MouseEvent) => {
    if ((e.target as Element).closest("a")) {
      setMenu(null);
      setMobile(false);
    }
  };

  const preview = features[pv];
  const navBtn = (k: Exclude<Menu, null>, label: string) => (
    <button type="button" className="nav-item" aria-expanded={menu === k} aria-controls={`mega-${k}`} onMouseEnter={hover(k)} onClick={toggle(k)}>
      {label}
      <Glyph name="chevronDown" size={13} />
    </button>
  );

  return (
    <header ref={ref} className="hdr" data-scrolled={scrolled} onMouseLeave={close} onClick={onClick}>
      <div className="hdr-bar">
        <Link href="/" className="logo" aria-label="RankMonk home">
          <LogoMark />
          <span className="logo-word">RankMonk</span>
        </Link>

        <nav aria-label="Main" className="nav desk-only" onMouseLeave={() => !menu && setInd((i) => ({ ...i, o: 0 }))}>
          <span className="nav-ind" style={{ left: ind.x, width: ind.w, opacity: ind.o }} />
          {navBtn("p", "Product")}
          {navBtn("s", "Solutions")}
          <Link href="/pricing" className="nav-item" onMouseEnter={hover(null)}>
            Pricing
          </Link>
          {navBtn("r", "Resources")}
        </nav>
        <div className="hdr-right desk-only">
          <a href={dashboardUrl} className="hdr-login">
            Log in
          </a>
          <Link href="/contact" className="hdr-cta" data-cta="header_demo">
            Book a demo
            <span className="hdr-cta-tile">
              <Glyph name="arrowRight" color="#fff" stroke={2.4} />
            </span>
          </Link>
        </div>

        <div className="hdr-mobile">
          <Link href="/contact" className="btn btn-dark" style={{ height: 40, padding: "0 14px", borderRadius: 10, fontSize: 14 }} data-cta="header_demo_mobile">
            Book a demo
          </Link>
          <button type="button" className="hdr-burger" aria-label={mobile ? "Close menu" : "Open menu"} aria-expanded={mobile} aria-controls="mobile-menu" onClick={() => setMobile((m) => !m)}>
            <Glyph name={mobile ? "close" : "menu"} size={18} stroke={2} />
          </button>
        </div>

        {menu === "p" && (
          <div id="mega-p" className="mega desk-only" style={{ width: "min(1080px, calc(100vw - 32px))" }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 2, padding: 6 }}>
                {features.map((f, i) => (
                  <Link key={f.slug} href={featureHref(f.slug)} onMouseEnter={() => setPv(i)} onFocus={() => setPv(i)} style={{ display: "flex", gap: 12, padding: 12, borderRadius: 12, background: i === pv ? "var(--surface-3)" : "transparent", transition: "background .15s" }}>
                    <span style={{ width: 36, height: 36, flex: "none", borderRadius: 10, background: i === pv ? "var(--brand)" : "var(--brand-tint)", color: i === pv ? "#fff" : "var(--brand-strong)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s, color .2s" }}>
                      <Icon name={f.icon} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: "block", fontWeight: 600, fontSize: 14 }}>{f.name}</span>
                      <span style={{ display: "block", fontSize: 12.5, color: "var(--subtle)", marginTop: 2 }}>{f.short}</span>
                    </span>
                  </Link>
                ))}
              </div>
              <Link href={featureHref(preview.slug)} style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", padding: 22, borderRadius: 14, background: "var(--ink)", color: "#fff" }}>
                <span aria-hidden="true" style={{ position: "absolute", right: -60, top: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,90,31,.55), transparent)" }} />
                <span style={{ position: "relative", fontSize: 11.5, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--brand-on-dark-2)" }}>{preview.name}</span>
                <span style={{ position: "relative", marginTop: 10, fontSize: 19, fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.25 }}>{preview.title}</span>
                <span style={{ position: "relative", marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                  {preview.caps.slice(0, 3).map((c) => (
                    <span key={c} style={{ display: "flex", gap: 8, fontSize: 13, color: "#D0D3DA", lineHeight: 1.4 }}>
                      <span style={{ color: "var(--brand-on-dark)" }} aria-hidden="true">✓</span>
                      {c}
                    </span>
                  ))}
                </span>
                <span style={{ position: "relative", marginTop: "auto", paddingTop: 18, fontSize: 14, fontWeight: 600 }}>Explore feature →</span>
              </Link>
            </div>
            <div style={{ marginTop: 8, padding: "12px 16px", borderRadius: 12, background: "var(--surface)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, fontSize: 13.5 }}>
              <span style={{ color: "var(--muted)" }}>Works with Google, Bing, Apple Maps, ChatGPT, Gemini and 20+ directories</span>
              <Link href="/features" style={{ fontWeight: 600, color: "var(--brand-strong)" }}>
                All features →
              </Link>
            </div>
          </div>
        )}

        {menu === "s" && (
          <div id="mega-s" className="mega desk-only" style={{ width: "min(980px, calc(100vw - 32px))" }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.25fr)", gap: 10 }}>
              <div style={{ padding: 8 }}>
                <div className="mega-label" style={{ padding: "4px 10px 8px" }}>By team</div>
                {solutions.map((s) => (
                  <Link key={s.slug} href={solutionHref(s.slug)} className="mega-row">
                    <Image src={imageSrc(s.image)} alt="" width={64} height={64} sizes="64px" style={{ flex: "none", borderRadius: 12, objectFit: "cover" }} />
                    <span style={{ minWidth: 0 }}>
                      <b>{s.name}</b>
                      <small>{s.short}</small>
                    </span>
                  </Link>
                ))}
              </div>
              <div style={{ padding: 8 }}>
                <div className="mega-label" style={{ padding: "4px 2px 8px" }}>By industry</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 2 }}>
                  {industries.map((s) => (
                    <Link key={s.slug} href={industryHref(s.slug)} className="mega-row" style={{ gap: 10, padding: 7, borderRadius: 11 }}>
                      <Image src={imageSrc(s.image)} alt="" width={40} height={40} sizes="40px" style={{ flex: "none", borderRadius: 9, objectFit: "cover" }} />
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: "block", fontWeight: 600, fontSize: 13.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</span>
                        <span style={{ display: "block", fontSize: 12, color: "var(--subtle)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.short}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {menu === "r" && (
          <div id="mega-r" className="mega desk-only" style={{ width: "min(760px, calc(100vw - 32px))" }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.1fr) minmax(0,1fr)", gap: 10 }}>
              <Link href="/blog" className="photo" style={{ minHeight: 220, borderRadius: 14 }}>
                <Image src={imageSrc("blog-ai-search")} alt="" fill sizes="400px" />
                <span aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.05), rgba(10,10,14,.85))" }} />
                <span style={{ position: "absolute", left: 18, right: 18, bottom: 16 }}>
                  <span style={{ display: "inline-block", fontSize: 11.5, fontWeight: 600, background: "var(--brand)", padding: "3px 8px", borderRadius: 6 }}>From the blog</span>
                  <span style={{ display: "block", marginTop: 8, fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>How ChatGPT and Gemini choose which local businesses to recommend</span>
                </span>
              </Link>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: 4 }}>
                <Link href="/blog" className="mega-link"><b>Blog</b><small>Guides on local SEO, reviews and AI search</small></Link>
                <Link href="/about" className="mega-link"><b>About RankMonk</b><small>What we build and why</small></Link>
                <Link href="/contact" className="mega-link"><b>Contact</b><small>Book a demo or talk to our team</small></Link>
                <a href={dashboardUrl} className="mega-link"><b>Customer login</b><small>{new URL(dashboardUrl).host}</small></a>
              </div>
            </div>
          </div>
        )}

        {mobile && (
          <nav id="mobile-menu" aria-label="Mobile" className="mobile-menu">
            <div className="mm-label">Product</div>
            {features.map((f) => (
              <Link key={f.slug} href={featureHref(f.slug)}>{f.name}</Link>
            ))}
            <div className="mm-label">Solutions</div>
            {solutions.map((s) => (
              <Link key={s.slug} href={solutionHref(s.slug)}>{s.name}</Link>
            ))}
            {industries.map((s) => (
              <Link key={s.slug} href={industryHref(s.slug)}>{s.name}</Link>
            ))}
            <div className="mm-label">Company</div>
            <Link href="/pricing">Pricing</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <a href={dashboardUrl} style={{ display: "flex", justifyContent: "center", marginTop: 16, padding: 12, border: "1px solid var(--line-2)", borderRadius: 10, fontWeight: 600 }}>
              Log in
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
