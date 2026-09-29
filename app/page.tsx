import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { FaqList } from "@/components/Faq";
import { FeatureGrid } from "@/components/FeatureGrid";
import { HeroWord } from "@/components/HeroWord";
import { Glyph, Icon } from "@/components/Icon";
import { IndustryCarousel } from "@/components/IndustryCarousel";
import { JsonLd } from "@/components/JsonLd";
import { ProductDemo } from "@/components/ProductDemo";
import { ProductMock } from "@/components/ProductMock";
import { site } from "@/config/site";
import { imageSrc, solutionHref, solutions } from "@/content/groups";
import { heroWords, homeFaqs, howSteps, platforms, whys } from "@/content/site";
import { faqSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { gridVars } from "@/lib/style";

const description = site.seo.defaultDescription;
export const metadata = pageMetadata({ description, path: "/" });

export default function HomePage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ path: "/", title: site.seo.defaultTitle, description }), faqSchema(homeFaqs)]} />

      <section style={{ position: "relative", overflow: "hidden", padding: "56px 0 80px" }}>
        <div className="glow" aria-hidden="true" style={{ left: "50%", top: -280, width: 1100, height: 700, transform: "translateX(-50%)" }} />
        <div className="wrap" style={{ position: "relative", textAlign: "center" }}>
          <Link href="/features/ai-visibility" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "6px 14px 6px 6px", borderRadius: 999, background: "#fff", border: "1px solid var(--brand-line)", fontSize: 14, boxShadow: "0 2px 8px -4px rgba(255,90,31,.3)", maxWidth: "100%" }}>
            <span style={{ background: "var(--brand)", color: "#fff", borderRadius: 999, padding: "3px 9px", fontSize: 12, fontWeight: 600 }}>New</span>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI search visibility tracking</span>
            <span style={{ color: "var(--brand-strong)" }} aria-hidden="true">→</span>
          </Link>
          <h1 className="h1-hero" style={{ margin: "28px auto 0", maxWidth: 980 }}>
            Be the first name customers find on{" "}
            <span style={{ display: "block", height: "1.1em", marginTop: ".04em" }}>
              <HeroWord words={heroWords} />
            </span>
          </h1>
          <p style={{ margin: "24px auto 0", maxWidth: 680, fontSize: "clamp(17px, 2vw, 20px)", lineHeight: 1.55, color: "var(--muted)" }}>
            RankMonk tracks your rank street by street, audits and protects your Google Business Profiles, replies to reviews with AI, keeps listings right on 20+ directories and shows whether AI assistants recommend you. One dashboard for every location.
          </p>
          <div className="row" style={{ marginTop: 36, justifyContent: "center", gap: 12 }}>
            <Link href="/contact" className="btn btn-lg btn-primary" data-cta="hero_demo">
              Book a demo
              <Glyph name="arrowRight" size={16} />
            </Link>
            <Link href="/features" className="btn btn-lg btn-light" style={{ padding: "0 24px" }} data-cta="hero_features">
              Explore features
            </Link>
          </div>
          <p style={{ margin: "18px 0 0", fontSize: 14, color: "var(--subtle)" }}>
            Already a customer?{" "}
            <a href={site.dashboardUrl} style={{ color: "var(--ink)", fontWeight: 500, textDecoration: "underline", textUnderlineOffset: 3 }}>
              Log in to your dashboard
            </a>
          </p>
        </div>
        <div className="wrap" style={{ position: "relative", maxWidth: 1200, marginTop: 64 }}>
          <ProductDemo />
        </div>
      </section>

      <section aria-label="Platforms covered" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--surface)", padding: "22px 0", overflow: "hidden" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <p style={{ flex: "none", margin: 0, fontSize: 13, color: "var(--subtle)", maxWidth: 160, lineHeight: 1.35 }}>Manage your presence across</p>
          <div className="marquee-mask">
            <ul className="marquee" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {platforms.concat(platforms).map((p, i) => (
                <li key={i} aria-hidden={i >= platforms.length || undefined} style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.02em", color: "var(--ink-2)", whiteSpace: "nowrap" }}>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div data-r="0" className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 24, marginBottom: 40 }}>
            <div style={{ maxWidth: 680 }}>
              <p className="eyebrow" style={{ margin: "0 0 14px" }}>The platform</p>
              <h2 className="h2">Everything local search needs, in one dashboard.</h2>
            </div>
            <div style={{ maxWidth: 400 }}>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: "var(--muted)" }}>Nine tools that share the same data, so a drop in rank, a risky edit or a bad review shows up in one place with the fix next to it.</p>
              <Link href="/features" style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", borderBottom: "1.5px solid var(--brand)", paddingBottom: 2 }}>
                See all features →
              </Link>
            </div>
          </div>
          <FeatureGrid />
        </div>
      </section>

      <section className="sec dark">
        <div className="glow" aria-hidden="true" style={{ right: -200, top: -200, width: 700, height: 700, background: "radial-gradient(closest-side, rgba(255,90,31,.22), transparent)" }} />
        <div className="wrap row" style={{ position: "relative", gap: 56, alignItems: "center" }}>
          <div data-r="0" style={{ flex: "1 1 340px", minWidth: 0 }}>
            <p className="eyebrow" style={{ margin: "0 0 14px", color: "var(--brand-on-dark)" }}>AI search visibility</p>
            <h2 className="h2">Customers now ask AI. Are you in the answer?</h2>
            <p style={{ margin: "18px 0 0", fontSize: 18, lineHeight: 1.6, color: "#C9CBD3" }}>
              People ask ChatGPT, Gemini and Google&apos;s AI Overviews which clinic, restaurant or store to choose. RankMonk tracks those prompts for every location and shows whether you are named, in what position, and who is recommended instead.
            </p>
            <div className="grid-auto" style={{ marginTop: 28, ...gridVars(150, 14) }}>
              {[
                ["Mention tracking", "Are you named for each prompt?"],
                ["Share of voice", "How often you appear vs rivals"],
                ["Cited sources", "Where AI gets its facts"],
              ].map(([t, d]) => (
                <div key={t} style={{ borderTop: "1px solid rgba(255,255,255,.18)", paddingTop: 14 }}>
                  <h3 style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>{t}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 14, color: "#A9ACB6" }}>{d}</p>
                </div>
              ))}
            </div>
            <Link href="/features/ai-visibility" className="btn" style={{ marginTop: 32, height: 48, padding: "0 22px", background: "#fff", color: "var(--ink)" }}>
              See AI visibility<span aria-hidden="true">→</span>
            </Link>
          </div>
          <div data-r="1" style={{ flex: "1.3 1 480px", minWidth: 0 }}>
            <ProductMock kind="ai" />
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div data-r="0" style={{ maxWidth: 720 }}>
            <p className="eyebrow" style={{ margin: "0 0 14px" }}>How it works</p>
            <h2 className="h2">From first scan to monthly report.</h2>
          </div>
          <ol className="grid-auto" style={{ marginTop: 56, padding: 0, listStyle: "none", ...gridVars(230, 20) }}>
            {howSteps.map(([n, t, d], i) => (
              <li key={n} data-r={i} className="card" style={{ position: "relative", padding: "26px 24px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                  <span className="mono" style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid var(--brand)", color: "var(--brand-strong)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 500 }}>{n}</span>
                  <span aria-hidden="true" style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #FFD9C7, transparent)" }} />
                </div>
                <h3 className="card-title" style={{ margin: 0 }}>{t}</h3>
                <p className="body">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec alt">
        <div className="wrap">
          <div data-r="0" style={{ maxWidth: 680 }}>
            <p className="eyebrow" style={{ margin: "0 0 14px" }}>Solutions</p>
            <h2 className="h2">Built for one shop or a thousand branches.</h2>
          </div>
          <div className="grid-auto" style={{ marginTop: 48, ...gridVars(290, 20) }}>
            {solutions.map((s, i) => (
              <Link key={s.slug} data-r={i} href={solutionHref(s.slug)} className="card lift" style={{ display: "flex", flexDirection: "column", padding: "10px 10px 28px", borderRadius: 22 }}>
                <span className="photo" style={{ aspectRatio: "16/10", borderRadius: 14, marginBottom: 22, color: "var(--ink)" }}>
                  <Image src={imageSrc(s.image)} alt={s.alt} fill sizes="(max-width: 700px) 100vw, 400px" />
                  <span style={{ position: "absolute", left: 12, top: 12, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,.92)", padding: "5px 10px", borderRadius: 999 }}>{s.name}</span>
                </span>
                <span style={{ padding: "0 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-strong)" }}>{s.kicker}</span>
                  <span style={{ marginTop: 12, fontSize: 23, fontWeight: 600, letterSpacing: "-.025em", lineHeight: 1.2 }}>{s.title}</span>
                  <span style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6, color: "var(--muted)" }}>{s.desc}</span>
                  <span style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                    {s.outcomes.slice(0, 2).map((o) => (
                      <span key={o} style={{ display: "flex", gap: 8, fontSize: 14 }}>
                        <Glyph name="check" size={16} stroke={2.4} color="#12B76A" />
                        {o}
                      </span>
                    ))}
                  </span>
                  <span style={{ marginTop: "auto", paddingTop: 24, fontWeight: 600, fontSize: 15 }}>Explore →</span>
                </span>
              </Link>
            ))}
          </div>
          <IndustryCarousel />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div data-r="0" style={{ maxWidth: 720 }}>
            <p className="eyebrow" style={{ margin: "0 0 14px" }}>Why RankMonk</p>
            <h2 className="h2">Made for how local search works now.</h2>
          </div>
          <div className="grid-auto" style={{ marginTop: 48, ...gridVars(260, 1), background: "var(--line)", border: "1px solid var(--line)", borderRadius: 20, overflow: "hidden" }}>
            {whys.map(([ic, t, d], i) => (
              <div key={t} data-r={i} style={{ background: "#fff", padding: "30px 28px" }}>
                <span className="icon-tile" style={{ width: 44, height: 44, borderRadius: 12 }}>
                  <Icon name={ic} size={22} />
                </span>
                <h3 style={{ margin: "22px 0 0", fontSize: 19, fontWeight: 600, letterSpacing: "-.02em" }}>{t}</h3>
                <p className="body">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 clamp(64px, 8vw, 104px)" }}>
        <div className="wrap" style={{ maxWidth: 880 }}>
          <h2 data-r="0" style={{ margin: "0 0 32px", fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.1, letterSpacing: "-.035em", fontWeight: 600, textAlign: "center" }}>
            Questions, answered
          </h2>
          <FaqList items={homeFaqs} name="home-faq" />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
