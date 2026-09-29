import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { DetailHero } from "@/components/DetailHero";
import { FaqList } from "@/components/Faq";
import { Glyph, Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { featureHref, featureLead, features } from "@/content/features";
import { imageSrc, solutionHref, solutions } from "@/content/groups";
import { breadcrumbSchema, faqSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { gridVars } from "@/lib/style";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => features.map((f) => ({ slug: f.slug }));

const find = (slug: string) => features.find((f) => f.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = find((await params).slug);
  if (!f) return {};
  return pageMetadata({ title: f.name, description: `${f.title} ${featureLead(f)}`, path: featureHref(f.slug), keywords: [f.name, f.short, "local SEO", "Google Business Profile"] });
}

const h2 = { margin: 0, fontSize: "clamp(28px, 3.8vw, 44px)", lineHeight: 1.08, letterSpacing: "-.035em", fontWeight: 600 } as const;

export default async function FeaturePage({ params }: Props) {
  const f = find((await params).slug);
  if (!f) notFound();
  const path = featureHref(f.slug);
  const crumbs = [{ name: "Home", href: "/" }, { name: "Product", href: "/features" }, { name: f.name }];
  const fi = features.indexOf(f);
  const related = [1, 2, 3].map((k) => features[(fi + k) % features.length]);

  return (
    <>
      <JsonLd data={[webPageSchema({ path, title: `${f.name} · RankMonk`, description: f.desc }), breadcrumbSchema(crumbs, path), faqSchema(f.faqs)]} />
      <DetailHero crumbs={crumbs} icon={f.icon} kicker={f.name} title={f.title} desc={f.desc} mock={f.mock} />

      <section className="sec9 bt">
        <div className="wrap">
          <h2 data-r="0" style={{ ...h2, maxWidth: 680 }}>What you get</h2>
          <ul className="grid-auto" style={{ marginTop: 40, padding: 0, listStyle: "none", ...gridVars(260) }}>
            {f.caps.map((c, i) => (
              <li key={c} data-r={i % 3} className="lift" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 28, minHeight: 150, padding: 22, border: "1px solid var(--line)", borderRadius: 18, background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 13, color: "var(--subtle)" }}>0{i + 1}</span>
                  <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--success-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Glyph name="check" stroke={2.6} color="#067647" />
                  </span>
                </div>
                <span style={{ fontSize: 17, lineHeight: 1.45, fontWeight: 600, letterSpacing: "-.01em" }}>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec9 alt">
        <div className="wrap">
          <h2 data-r="0" style={h2}>How it works</h2>
          <ol className="grid-auto" style={{ marginTop: 40, padding: 0, listStyle: "none", ...gridVars(260, 20) }}>
            {f.steps.map(([t, d], i) => (
              <li key={t} data-r={i} className="card" style={{ position: "relative", overflow: "hidden", padding: 28 }}>
                <span aria-hidden="true" style={{ position: "absolute", right: 14, top: -6, fontSize: 96, fontWeight: 700, letterSpacing: "-.06em", color: "var(--brand-tint)", lineHeight: 1, pointerEvents: "none" }}>0{i + 1}</span>
                <span className="mono" style={{ position: "relative", display: "inline-flex", width: 36, height: 36, borderRadius: "50%", background: "var(--brand-strong)", color: "#fff", fontSize: 13, alignItems: "center", justifyContent: "center" }}>0{i + 1}</span>
                <h3 className="card-title" style={{ position: "relative", margin: "14px 0 0" }}>{t}</h3>
                <p className="body" style={{ position: "relative" }}>{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section style={{ padding: "clamp(64px, 9vw, 112px) 0 0" }}>
        <div className="wrap">
          <h2 data-r="0" style={h2}>Built for every kind of team</h2>
          <div className="grid-auto" style={{ marginTop: 32, ...gridVars(260) }}>
            {solutions.map((s, i) => (
              <Link key={s.slug} data-r={i} href={solutionHref(s.slug)} className="photo lift-photo" style={{ aspectRatio: "16/11", borderRadius: 20 }}>
                <Image src={imageSrc(s.image)} alt={s.alt} fill sizes="(max-width: 700px) 100vw, 400px" />
                <span className="photo-shade" style={{ background: "linear-gradient(180deg, rgba(10,10,14,0) 30%, rgba(10,10,14,.85))" }} />
                <span style={{ position: "absolute", left: 20, right: 20, bottom: 18 }}>
                  <span style={{ display: "block", fontSize: 20, fontWeight: 600, letterSpacing: "-.02em" }}>{s.name}</span>
                  <span style={{ display: "block", marginTop: 3, fontSize: 14, color: "#E4E5EA" }}>{s.short}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec9">
        <div className="wrap row" style={{ gap: 48 }}>
          <div style={{ flex: "1 1 300px" }}>
            <h2 data-r="0" style={h2}>Common questions</h2>
          </div>
          <div style={{ flex: "2 1 480px", minWidth: 0 }}>
            <FaqList items={f.faqs} name="feature-faq" />
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 clamp(64px, 9vw, 112px)" }}>
        <div className="wrap">
          <h2 data-r="0" style={{ margin: 0, fontSize: 24, letterSpacing: "-.02em", fontWeight: 600 }}>Works well with</h2>
          <div className="grid-auto" style={{ marginTop: 24, ...gridVars(260) }}>
            {related.map((r, i) => (
              <Link key={r.slug} data-r={i} href={featureHref(r.slug)} className="lift-sm" style={{ display: "flex", gap: 14, padding: 22, border: "1px solid var(--line)", borderRadius: 16 }}>
                <span className="icon-tile"><Icon name={r.icon} size={19} /></span>
                <span>
                  <span style={{ display: "block", fontWeight: 600 }}>{r.name}</span>
                  <span style={{ display: "block", fontSize: 14, color: "var(--subtle)", marginTop: 3 }}>{r.short}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
