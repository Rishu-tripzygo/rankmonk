import Image from "next/image";
import Link from "next/link";
import { featureHref, getFeature } from "@/content/features";
import { imageSrc, industries, industryHref, solutionHref, type Group } from "@/content/groups";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { gridVars } from "@/lib/style";
import { CtaBand } from "./CtaBand";
import { DetailHero } from "./DetailHero";
import { Glyph, Icon } from "./Icon";
import { JsonLd } from "./JsonLd";

const h2 = { margin: 0, fontSize: "clamp(28px, 3.8vw, 44px)", lineHeight: 1.08, letterSpacing: "-.035em", fontWeight: 600 } as const;

export const groupMetadata = (g: Group, path: string) =>
  pageMetadata({ title: g.name, description: `${g.title} ${g.desc.split(". ")[0].replace(/\.$/, "")}.`, path, keywords: [g.name, g.kicker, "local SEO", "Google Business Profile", ...(g.searches ?? []).slice(0, 2)] });

/** Solution (by team) and industry detail page. */
export function GroupPage({ g, kind }: { g: Group; kind: "solution" | "industry" }) {
  const isIndustry = kind === "industry";
  const path = isIndustry ? industryHref(g.slug) : solutionHref(g.slug);
  const crumbs = [{ name: "Home", href: "/" }, isIndustry ? { name: "Industries", href: industryHref(industries[0].slug) } : { name: "Solutions", href: solutionHref("brands") }, { name: g.name }];
  const others = industries.filter((x) => x.slug !== g.slug).slice(0, 4);

  return (
    <>
      <JsonLd data={[webPageSchema({ path, title: `${g.name} · RankMonk`, description: g.desc }), breadcrumbSchema(crumbs, path)]} />
      <DetailHero crumbs={crumbs} icon={g.icon} kicker={g.kicker} title={g.title} desc={g.desc} mock={g.mock} />

      <section className="sec9 bt">
        <div className="wrap row" style={{ gap: 48, alignItems: "stretch" }}>
          <div data-r="0" className="photo" style={{ flex: "1 1 380px", minWidth: 0, borderRadius: 24, minHeight: 420, color: "var(--ink)" }}>
            <Image src={imageSrc(g.image)} alt={g.alt} fill sizes="(max-width: 900px) 100vw, 600px" />
            <span style={{ position: "absolute", left: 18, bottom: 18, right: 18, display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.95)", borderRadius: 14, padding: "12px 14px", boxShadow: "0 16px 32px -14px rgba(0,0,0,.45)" }}>
              <span className="icon-tile" style={{ width: 34, height: 34, borderRadius: 10 }}><Icon name={g.icon} size={17} stroke={1.9} /></span>
              <span>
                <span style={{ display: "block", fontSize: 12, color: "var(--subtle)" }}>{g.kicker}</span>
                <span style={{ display: "block", fontSize: 14, fontWeight: 600 }}>{g.outcomes[0]}</span>
              </span>
            </span>
          </div>
          <div style={{ flex: "1 1 440px", minWidth: 0 }}>
            <h2 data-r="0" style={h2}>{isIndustry ? "The challenges" : "What gets in the way"}</h2>
            <ol style={{ margin: "32px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
              {g.pains.map(([t, d], i) => (
                <li key={t} data-r={i} style={{ padding: 28, border: "1px solid var(--line)", borderRadius: 20 }}>
                  <span className="mono" style={{ fontSize: 13, color: "var(--danger-text)", background: "var(--danger-tint)", padding: "3px 8px", borderRadius: 6 }}>0{i + 1}</span>
                  <h3 className="card-title" style={{ margin: "16px 0 0" }}>{t}</h3>
                  <p className="body">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {g.searches && (
        <section style={{ padding: "0 0 clamp(64px, 9vw, 112px)" }}>
          <div className="wrap">
            <div data-r="0" style={{ padding: "clamp(24px, 4vw, 48px)", borderRadius: 24, background: "var(--ink)", color: "#fff", position: "relative", overflow: "hidden" }}>
              <p className="eyebrow" style={{ margin: 0, color: "var(--brand-on-dark)" }}>Searches that bring customers</p>
              <h2 style={{ margin: "12px 0 0", fontSize: "clamp(26px, 3.4vw, 38px)", lineHeight: 1.1, letterSpacing: "-.03em", fontWeight: 600, maxWidth: 640 }}>Track the exact searches your customers type.</h2>
              <ul style={{ margin: "28px 0 0", padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 10 }}>
                {g.searches.map((q) => (
                  <li key={q} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 999, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", fontSize: 15 }}>
                    <Glyph name="search" color="#FF8A5C" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className="sec9 alt">
        <div className="wrap row" style={{ gap: 48 }}>
          <div data-r="0" style={{ flex: "1 1 320px", minWidth: 0 }}>
            <h2 style={h2}>How RankMonk helps</h2>
            <ul style={{ margin: "28px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
              {g.outcomes.map((o) => (
                <li key={o} style={{ display: "flex", gap: 12, fontSize: 16, lineHeight: 1.5 }}>
                  <span style={{ flex: "none", width: 24, height: 24, borderRadius: "50%", background: "var(--success-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Glyph name="check" size={13} stroke={2.8} color="#067647" />
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid-auto" style={{ flex: "1.4 1 440px", minWidth: 0, ...gridVars(220, 12) }}>
            {g.feats.map((slug, i) => {
              const f = getFeature(slug);
              return (
                <Link key={slug} data-r={i % 2} href={featureHref(slug)} className="lift-sm" style={{ display: "flex", flexDirection: "column", gap: 10, padding: 20, background: "#fff", border: "1px solid var(--line)", borderRadius: 16 }}>
                  <span className="icon-tile" style={{ width: 38, height: 38 }}><Icon name={f.icon} size={19} /></span>
                  <span style={{ fontWeight: 600 }}>{f.name}</span>
                  <span style={{ fontSize: 14, color: "var(--subtle)", lineHeight: 1.5 }}>{f.short}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec9">
        <div className="wrap">
          <h2 data-r="0" style={h2}>{isIndustry ? "More industries we work with" : "Industries we work with"}</h2>
          <div className="grid-auto" style={{ marginTop: 32, ...gridVars(190, 14) }}>
            {others.map((x, i) => (
              <Link key={x.slug} data-r={i % 4} href={industryHref(x.slug)} className="photo lift-photo" style={{ aspectRatio: "4/3", borderRadius: 18 }}>
                <Image src={imageSrc(x.image)} alt={x.alt} fill sizes="(max-width: 700px) 50vw, 300px" />
                <span className="photo-shade" style={{ background: "linear-gradient(180deg, rgba(10,10,14,0) 35%, rgba(10,10,14,.85))" }} />
                <span style={{ position: "absolute", left: 16, right: 16, bottom: 14, fontSize: 17, fontWeight: 600 }}>{x.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
