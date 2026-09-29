import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { featureHref } from "@/content/features";
import type { IconName } from "@/content/icons";
import { imageSrc } from "@/content/groups";
import { platforms } from "@/content/site";
import { pageMetadata, webPageSchema } from "@/lib/seo";
import { gridVars } from "@/lib/style";

const title = "About";
const description = "RankMonk shows local businesses, brands and agencies how customers find them on Google Maps, Apple Maps, Bing and AI assistants, and what to do next.";

export const metadata = pageMetadata({ title, description, path: "/about" });

const why = [
  "Most local businesses depend on a Google Business Profile they rarely check. Details drift, reviews go unanswered, and a competitor two streets away starts showing up first. Agencies and brands with many locations face the same problem at a larger scale.",
  "The tools that exist tend to cover one piece of it: a rank tracker, a review inbox, a listings service. Teams switch between them and still cannot see the full picture for one location, let alone a hundred.",
  "We built RankMonk to put that picture in one place, and to cover what has changed most in the last two years: customers asking AI assistants for recommendations. RankMonk shows how you appear in both, and what to do next.",
];
const what: [IconName, string, string, string][] = [
  ["pin", "Where you rank", "Geo-grid scans show your position street by street, with competitors alongside.", "rank-tracking"],
  ["msg", "What customers say", "Every review in one inbox, with AI reply drafts and sentiment by topic.", "reviews"],
  ["list", "Whether your details are right", "Name, address, phone and hours kept consistent on 20+ directories.", "listings"],
  ["spark", "Whether AI recommends you", "Mentions and share of voice in ChatGPT, Gemini and Google AI Overviews.", "ai-visibility"],
];
const principles = [["Show the real picture", "Street-level ranks and plain scores, not vanity numbers."], ["Tell you what to do next", "Every finding comes with a fix you can act on."], ["Work at any scale", "The same tools work for one shop or a thousand branches."]];
const how = [["Guided onboarding", "We set up your profiles, keywords and competitors with you, so the first report is useful from day one."], ["A team you can call", "Support by phone and email from a team that works in Indian business hours."], ["Clear pricing in rupees", "Pricing is per location, so the cost grows only as you add locations."]];
const photos: [string, string, boolean][] = [["about-team-meeting", "Team meeting around a table", false], ["about-collaborating", "Four people collaborating around a laptop", true], ["about-laptops", "Colleagues working on laptops", false]];

const h2 = { margin: 0, fontSize: "clamp(28px, 3.8vw, 44px)", lineHeight: 1.08, letterSpacing: "-.035em", fontWeight: 600 } as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ path: "/about", title: `${title} · RankMonk`, description, type: "AboutPage" })} />
      <section style={{ position: "relative", overflow: "hidden", padding: "72px 0 56px" }}>
        <div className="glow" aria-hidden="true" style={{ left: -240, top: -320, width: 1000, height: 700, background: "radial-gradient(closest-side, rgba(255,90,31,.12), transparent)" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <p className="eyebrow" style={{ margin: 0 }}>About RankMonk</p>
          <h1 style={{ margin: "16px 0 0", maxWidth: 1000, fontSize: "clamp(38px, 5.6vw, 72px)", lineHeight: 1.02, letterSpacing: "-.045em", fontWeight: 600 }}>Local search is changing. We help businesses keep up.</h1>
          <div className="grid-auto" style={{ marginTop: 36, maxWidth: 1000, ...gridVars(300, 32) }}>
            <p className="lead" style={{ margin: 0, lineHeight: 1.65 }}>People find local businesses on Google Maps, Apple Maps and Bing, and now in answers from ChatGPT and Gemini. Each place has its own rules, and most businesses cannot see how they appear in all of them.</p>
            <p className="lead" style={{ margin: 0, lineHeight: 1.65 }}>RankMonk brings it together: where you rank on every street, what customers say, whether your details are right everywhere and whether AI assistants recommend you. Then it tells you what to do next.</p>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 clamp(64px, 9vw, 112px)" }}>
        <div className="wrap grid-auto" style={gridVars(260)}>
          {photos.map(([img, alt, offset], i) => (
            <div key={img} data-r={i} className={offset ? "about-offset" : undefined} style={{ position: "relative", borderRadius: 22, overflow: "hidden", aspectRatio: "4/5" }}>
              <Image src={imageSrc(img)} alt={alt} fill sizes="(max-width: 900px) 100vw, 400px" style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </section>

      <section className="sec9 bt">
        <div className="wrap row" style={{ gap: "40px 72px" }}>
          <div data-r="0" style={{ flex: "1 1 320px" }}>
            <p className="eyebrow" style={{ margin: "0 0 14px" }}>Why we built RankMonk</p>
            <h2 style={h2}>One place to see how customers find you.</h2>
          </div>
          <div data-r="1" style={{ flex: "1.4 1 460px", minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
            {why.map((p) => (
              <p key={p} style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: "var(--ink-2)" }}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="sec9 alt">
        <div className="wrap">
          <h2 data-r="0" style={{ ...h2, maxWidth: 640 }}>What RankMonk shows you</h2>
          <div className="grid-auto" style={{ marginTop: 40, ...gridVars(250) }}>
            {what.map(([ic, t, d, slug], i) => (
              <Link key={t} data-r={i} href={featureHref(slug)} className="card lift" style={{ display: "flex", flexDirection: "column", padding: 26, minHeight: 230 }}>
                <span className="icon-tile" style={{ width: 44, height: 44, borderRadius: 12 }}><Icon name={ic} size={22} /></span>
                <h3 style={{ margin: "22px 0 0", fontSize: 19, fontWeight: 600, letterSpacing: "-.02em" }}>{t}</h3>
                <span style={{ marginTop: 8, fontSize: 15, lineHeight: 1.6, color: "var(--muted)" }}>{d}</span>
                <span style={{ marginTop: "auto", paddingTop: 18, fontSize: 14, fontWeight: 600 }}>Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec9">
        <div className="wrap">
          <h2 data-r="0" style={h2}>What we believe</h2>
          <div className="grid-auto" style={{ marginTop: 40, ...gridVars(260, 1), background: "var(--line)", border: "1px solid var(--line)", borderRadius: 22, overflow: "hidden" }}>
            {principles.map(([t, d], i) => (
              <div key={t} data-r={i} style={{ padding: "32px 30px", background: "#fff" }}>
                <span className="mono" style={{ fontSize: 14, color: "var(--brand-strong)" }}>0{i + 1}</span>
                <h3 style={{ margin: "14px 0 0", fontSize: 21, fontWeight: 600, letterSpacing: "-.02em" }}>{t}</h3>
                <p className="body">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec9 dark">
        <div className="glow" aria-hidden="true" style={{ right: -200, top: -240, width: 700, height: 700, background: "radial-gradient(closest-side, rgba(255,90,31,.22), transparent)" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <h2 data-r="0" style={{ ...h2, maxWidth: 640 }}>How we work with you</h2>
          <div className="grid-auto" style={{ marginTop: 40, ...gridVars(260) }}>
            {how.map(([t, d], i) => (
              <div key={t} data-r={i} style={{ padding: 28, borderRadius: 20, background: "#1B1C22", border: "1px solid #2A2C33" }}>
                <span className="mono" style={{ fontSize: 14, color: "var(--brand-on-dark)" }}>0{i + 1}</span>
                <h3 className="card-title" style={{ margin: "16px 0 0" }}>{t}</h3>
                <p className="body" style={{ color: "#C9CBD3" }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec9">
        <div className="wrap row" style={{ gap: 40, alignItems: "center" }}>
          <div data-r="0" style={{ flex: "1 1 320px" }}>
            <h2 style={h2}>Where we help you show up</h2>
          </div>
          <ul data-r="1" style={{ flex: "1.4 1 420px", margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 10 }}>
            {platforms.map((p) => (
              <li key={p} style={{ padding: "10px 16px", borderRadius: 999, border: "1px solid var(--line-2)", fontSize: 15, fontWeight: 500 }}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
