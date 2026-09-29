import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { site, telHref } from "@/config/site";
import { pageMetadata, webPageSchema } from "@/lib/seo";

const title = "Book a demo";
const description = "Book a 30-minute RankMonk demo. We'll look at your own Google Business Profiles, show where you rank street by street and recommend a plan for your locations.";

export const metadata = pageMetadata({ title, description, path: "/contact" });

const steps = [["1", "We call you", "Within one working day, to pick a time."], ["2", "Live walkthrough", "We look at your own profiles, rankings and reviews."], ["3", "Your plan", "A clear recommendation and a quote for your locations."]];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ path: "/contact", title: `${title} · RankMonk`, description, type: "ContactPage" })} />
      <section style={{ position: "relative", overflow: "hidden", padding: "72px 0 clamp(64px, 9vw, 112px)" }}>
        <div className="glow" aria-hidden="true" style={{ left: -200, top: -300, width: 900, height: 700, background: "radial-gradient(closest-side, rgba(255,90,31,.12), transparent)" }} />
        <div className="wrap row" style={{ position: "relative", gap: 56 }}>
          <div style={{ flex: "1 1 360px", minWidth: 0 }}>
            <p className="eyebrow" style={{ margin: 0 }}>Book a demo</p>
            <h1 style={{ margin: "16px 0 0", fontSize: "clamp(38px, 5vw, 60px)", lineHeight: 1.02, letterSpacing: "-.04em", fontWeight: 600 }}>See RankMonk on your own business.</h1>
            <p className="lead" style={{ margin: "20px 0 0" }}>A 30-minute call with our team. Tell us about your locations and we&apos;ll show you where you rank, what to fix first and which plan fits.</p>
            <h2 className="sr-only">What happens next</h2>
            <ol style={{ margin: "36px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 18 }}>
              {steps.map(([n, t, d]) => (
                <li key={n} style={{ display: "flex", gap: 14 }}>
                  <span className="mono" style={{ flex: "none", width: 32, height: 32, borderRadius: "50%", border: "1.5px solid var(--brand)", color: "var(--brand-strong)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{n}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{t}</div>
                    <div style={{ fontSize: 15, color: "var(--muted)", marginTop: 2 }}>{d}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div style={{ marginTop: 36, padding: 20, border: "1px solid var(--line)", borderRadius: 16, display: "flex", alignItems: "center", gap: 14 }}>
              <span className="icon-tile" style={{ width: 44, height: 44, borderRadius: 12 }}><Icon name="phone" size={20} /></span>
              <div>
                <div style={{ fontSize: 14, color: "var(--subtle)" }}>Prefer to talk now?</div>
                <a href={telHref} style={{ fontSize: 18, fontWeight: 600 }} data-cta="contact_phone">{site.contact.phone}</a>
              </div>
            </div>
          </div>
          <div style={{ flex: "1 1 420px", minWidth: 0 }}>
            <div style={{ padding: "clamp(22px, 3vw, 36px)", border: "1px solid var(--line)", borderRadius: 24, background: "#fff", boxShadow: "0 32px 64px -32px rgba(16,24,40,.2)" }}>
              <h2 className="sr-only">Demo request form</h2>
              <ContactForm phone={site.contact.phone} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
