import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { ProductMock } from "@/components/ProductMock";
import { featureHref, featureLead, features, getFeature } from "@/content/features";
import { featureBands } from "@/content/site";
import { absoluteUrl } from "@/config/site";
import { pageMetadata, webPageSchema } from "@/lib/seo";

const title = "Features";
const description = "Nine local SEO tools in one dashboard: geo-grid rank tracking, competitors, profile audits, suspension protection, AI review replies, listings, AI visibility and reports.";

export const metadata = pageMetadata({ title, description, path: "/features" });

export default function FeaturesPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path: "/features", title: `${title} · RankMonk`, description, type: "CollectionPage" }),
          { "@context": "https://schema.org", "@type": "ItemList", itemListElement: features.map((f, i) => ({ "@type": "ListItem", position: i + 1, name: f.name, url: absoluteUrl(featureHref(f.slug)) })) },
        ]}
      />
      <section style={{ position: "relative", overflow: "hidden", padding: "64px 0 56px" }}>
        <div className="glow" aria-hidden="true" style={{ left: "50%", top: -320, width: 1100, height: 640, transform: "translateX(-50%)", background: "radial-gradient(closest-side, rgba(255,90,31,.13), transparent)" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <div data-r="0" style={{ textAlign: "center", maxWidth: 840, margin: "0 auto" }}>
            <p className="eyebrow" style={{ margin: 0 }}>Product</p>
            <h1 style={{ margin: "16px 0 0", fontSize: "clamp(38px, 5.6vw, 68px)", lineHeight: 1.02, letterSpacing: "-.045em", fontWeight: 600 }}>Nine tools. One view of your local presence.</h1>
            <p className="lead" style={{ margin: "20px auto 0", maxWidth: 640 }}>Track, protect and grow every Google Business Profile, listing and review, and see how AI assistants talk about you.</p>
            <div className="row" style={{ marginTop: 28, justifyContent: "center", gap: 10 }}>
              <Link href="/contact" className="btn btn-primary" data-cta="features_demo">Book a demo →</Link>
              <Link href="/pricing" className="btn btn-light">See pricing</Link>
            </div>
          </div>
          <div style={{ marginTop: 56 }}>
            <FeatureGrid />
          </div>
        </div>
      </section>

      {featureBands.map((b, i) => (
        <section key={b.kicker} style={{ padding: "clamp(56px, 7vw, 96px) 0", background: i % 2 ? "var(--surface)" : "#fff", borderTop: "1px solid var(--line)" }}>
          <div className="wrap row" style={{ flexDirection: i % 2 ? "row-reverse" : "row", gap: "48px 64px", alignItems: "center" }}>
            <div data-r="0" style={{ flex: "1 1 380px", minWidth: 0 }}>
              <p style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "var(--brand-strong)", background: "var(--brand-tint)", padding: "5px 11px", borderRadius: 999 }}>
                <span className="mono">0{i + 1}</span>
                {b.kicker}
              </p>
              <h2 className="h2s" style={{ marginTop: 16 }}>{b.title}</h2>
              <p style={{ margin: "14px 0 0", fontSize: 17, lineHeight: 1.6, color: "var(--muted)" }}>{b.desc}</p>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
                {b.feats.map((slug) => {
                  const f = getFeature(slug);
                  return (
                    <Link key={slug} href={featureHref(slug)} className="nudge" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, background: "#fff", border: "1px solid var(--line)" }}>
                      <span className="icon-tile"><Icon name={f.icon} size={19} /></span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: "block", fontWeight: 600, fontSize: 15.5 }}>{f.name}</span>
                        <span style={{ display: "block", fontSize: 14, color: "var(--subtle)", marginTop: 2 }}>{featureLead(f)}</span>
                      </span>
                      <span style={{ color: "var(--faint)" }} aria-hidden="true">→</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div data-r="1" style={{ flex: "1.25 1 480px", minWidth: 0 }}>
              <ProductMock kind={b.mock} />
            </div>
          </div>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
