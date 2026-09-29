import Link from "next/link";
import { site, telHref } from "@/config/site";

export function CtaBand() {
  return (
    <section aria-labelledby="cta-band-title" style={{ padding: "0 0 clamp(64px, 9vw, 112px)" }}>
      <div className="wrap">
        <div data-r="0" style={{ position: "relative", overflow: "hidden", borderRadius: 28, background: "var(--brand)", color: "#fff", padding: "clamp(36px, 6vw, 80px)" }}>
          <div className="row" style={{ gap: 32, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ maxWidth: 640 }}>
              <h2 id="cta-band-title" style={{ margin: 0, fontSize: "clamp(32px, 4.6vw, 56px)", lineHeight: 1.02, letterSpacing: "-.04em", fontWeight: 600 }}>
                See where you rank before the call ends.
              </h2>
              <p style={{ margin: "16px 0 0", fontSize: 18, lineHeight: 1.55 }}>Book a 30-minute demo. We&apos;ll walk through your own profiles and show you what to fix first.</p>
            </div>
            <div className="row" style={{ gap: 12 }}>
              <Link href="/contact" className="btn btn-dark" style={{ height: 54, padding: "0 26px", borderRadius: 14, fontSize: 16 }} data-cta="cta_band_demo">
                Book a demo<span aria-hidden="true">→</span>
              </Link>
              <a href={telHref} className="btn" style={{ height: 54, padding: "0 22px", borderRadius: 14, fontSize: 16, background: "#fff", color: "var(--ink)" }} data-cta="cta_band_phone">
                {site.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
