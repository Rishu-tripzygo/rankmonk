import Link from "next/link";
import { site, telHref } from "@/config/site";
import { LEGAL_EFFECTIVE_DATE, LEGAL_EFFECTIVE_LABEL, legalDocs, type LegalDoc } from "@/content/legal";
import { breadcrumbSchema, pageMetadata, webPageSchema } from "@/lib/seo";
import { Breadcrumbs } from "./Breadcrumbs";
import { JsonLd } from "./JsonLd";

export const legalMetadata = (d: LegalDoc) => pageMetadata({ title: d.title, description: d.description, path: `/${d.slug}` });

export function LegalPage({ doc }: { doc: LegalDoc }) {
  const path = `/${doc.slug}`;
  const crumbs = [{ name: "Home", href: "/" }, { name: doc.title }];
  return (
    <>
      <JsonLd data={[{ ...webPageSchema({ path, title: `${doc.title} · RankMonk`, description: doc.description }), datePublished: LEGAL_EFFECTIVE_DATE, dateModified: LEGAL_EFFECTIVE_DATE }, breadcrumbSchema(crumbs, path)]} />
      <section style={{ padding: "64px 0 40px", borderBottom: "1px solid var(--line)", background: "var(--surface)" }}>
        <div className="wrap" style={{ maxWidth: 1100 }}>
          <Breadcrumbs items={crumbs} />
          <h1 style={{ margin: "14px 0 0", fontSize: "clamp(34px, 4.6vw, 56px)", letterSpacing: "-.04em", fontWeight: 600 }}>{doc.title}</h1>
          <p style={{ margin: "14px 0 0", maxWidth: 720, fontSize: 17, lineHeight: 1.6, color: "var(--muted)" }}>{doc.intro}</p>
          <p style={{ margin: "16px 0 0", fontSize: 14, color: "var(--subtle)" }}>
            Effective <time dateTime={LEGAL_EFFECTIVE_DATE}>{LEGAL_EFFECTIVE_LABEL}</time>
          </p>
        </div>
      </section>
      <section style={{ padding: "48px 0 clamp(64px, 9vw, 112px)" }}>
        <div className="wrap row" style={{ maxWidth: 1100, gap: 48 }}>
          <aside style={{ flex: "0 1 240px", minWidth: 0 }}>
            <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 4 }}>
              <nav aria-label="Legal documents" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <p style={{ margin: 0, fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--subtle)", padding: "0 12px 8px" }}>Legal</p>
                {legalDocs.map((d) => {
                  const on = d.slug === doc.slug;
                  return (
                    <Link key={d.slug} href={`/${d.slug}`} aria-current={on ? "page" : undefined} style={{ padding: "9px 12px", borderRadius: 9, fontSize: 15, color: on ? "var(--ink)" : "var(--muted)", background: on ? "var(--surface-2)" : "transparent", fontWeight: on ? 600 : 400 }}>
                      {d.title}
                    </Link>
                  );
                })}
              </nav>
              <p style={{ margin: "20px 0 0", padding: 14, borderRadius: 12, border: "1px solid var(--line)", fontSize: 13.5, lineHeight: 1.55, color: "var(--muted)" }}>
                Questions? Email{" "}
                <a href={`mailto:${site.contact.email}`} style={{ color: "var(--brand-strong)", fontWeight: 600 }}>
                  {site.contact.email}
                </a>{" "}
                or call <a href={telHref}>{site.contact.phone}</a>.
              </p>
            </div>
          </aside>
          <article style={{ flex: "1 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: 36 }}>
            {doc.sections.map(([t, blocks], i) => (
              <section key={t} aria-labelledby={`s${i + 1}`}>
                <h2 id={`s${i + 1}`} style={{ margin: 0, fontSize: 21, letterSpacing: "-.02em", fontWeight: 600, scrollMarginTop: 100 }}>
                  {i + 1}. {t}
                </h2>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                  {blocks.map((b, k) =>
                    Array.isArray(b) ? (
                      <ul key={k} style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                        {b.map((li) => (
                          <li key={li} style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-2)" }}>{li}</li>
                        ))}
                      </ul>
                    ) : (
                      <p key={k} style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "var(--ink-2)" }}>{b}</p>
                    ),
                  )}
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
