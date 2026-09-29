import { CtaBand } from "@/components/CtaBand";
import { FaqList } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { PricingPlans } from "@/components/PricingPlans";
import { absoluteUrl, site } from "@/config/site";
import { compareRows, plans, pricingFaqs } from "@/content/site";
import { faqSchema, pageMetadata, webPageSchema } from "@/lib/seo";

const title = "Pricing";
const description = "Per-location pricing in rupees: Starter from ₹1,249 and Growth from ₹2,499 per location a month billed yearly, plus custom Enterprise plans. Excludes GST.";

export const metadata = pageMetadata({ title, description, path: "/pricing", keywords: ["local SEO pricing", "Google Business Profile management pricing", "per location pricing", "INR"] });

// Offers reflect the prices shown on the page (monthly billing, excl. GST).
const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  url: site.url,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: site.description,
  publisher: { "@id": `${site.url}/#organization` },
  offers: plans
    .filter((p) => p.monthly !== undefined)
    .map((p) => ({
      "@type": "Offer",
      name: p.name,
      description: p.for,
      url: absoluteUrl("/pricing"),
      priceCurrency: "INR",
      price: p.monthly,
      priceSpecification: { "@type": "UnitPriceSpecification", price: p.monthly, priceCurrency: "INR", unitText: "per location per month", valueAddedTaxIncluded: false },
    })),
};

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ path: "/pricing", title: `${title} · RankMonk`, description }), productSchema, faqSchema(pricingFaqs)]} />
      <section style={{ position: "relative", overflow: "hidden", padding: "72px 0 clamp(64px, 9vw, 112px)" }}>
        <div className="glow" aria-hidden="true" style={{ left: "50%", top: -300, width: 1000, height: 640, transform: "translateX(-50%)", background: "radial-gradient(closest-side, rgba(255,90,31,.12), transparent)" }} />
        <div className="wrap" style={{ position: "relative", textAlign: "center" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <p className="eyebrow" style={{ margin: 0 }}>Pricing</p>
            <h1 className="h1">Simple pricing, per location.</h1>
            <p className="lead" style={{ margin: "20px auto 0", maxWidth: 560 }}>Pay for the locations you manage. Every plan starts with a guided demo and setup.</p>
          </div>
          <PricingPlans />
          <p style={{ margin: "24px 0 0", fontSize: 14, color: "var(--subtle)" }}>Prices in Indian rupees, per location, excluding 18% GST.</p>
        </div>
      </section>

      <section style={{ padding: "0 0 clamp(64px, 9vw, 112px)" }}>
        <div className="wrap" style={{ maxWidth: 1040 }}>
          <h2 data-r="0" className="h3" style={{ margin: "0 0 28px" }}>Compare plans</h2>
          <div data-r="1" style={{ border: "1px solid var(--line)", borderRadius: 18, overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontSize: 14, textAlign: "left" }}>
              <caption className="sr-only">Plan comparison</caption>
              <thead>
                <tr style={{ background: "var(--surface)" }}>
                  <th scope="col" style={{ padding: "16px 20px", fontWeight: 600, width: "34%" }}>Feature</th>
                  <th scope="col" style={{ padding: "16px 20px", fontWeight: 600 }}>Starter</th>
                  <th scope="col" style={{ padding: "16px 20px", fontWeight: 600, color: "var(--brand-strong)" }}>Growth</th>
                  <th scope="col" style={{ padding: "16px 20px", fontWeight: 600 }}>Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map(([a, b, c, d]) => (
                  <tr key={a} style={{ borderTop: "1px solid var(--line)" }}>
                    <th scope="row" style={{ padding: "14px 20px", fontWeight: 400 }}>{a}</th>
                    <td style={{ padding: "14px 20px", color: "var(--ink-2)" }}>{b}</td>
                    <td style={{ padding: "14px 20px", background: "#FFFBF9" }}>{c}</td>
                    <td style={{ padding: "14px 20px", color: "var(--ink-2)" }}>{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 clamp(64px, 9vw, 112px)" }}>
        <div className="wrap" style={{ maxWidth: 880 }}>
          <h2 data-r="0" className="h3" style={{ margin: "0 0 24px" }}>Pricing questions</h2>
          <FaqList items={pricingFaqs} name="pricing-faq" />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
