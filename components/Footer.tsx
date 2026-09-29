import Link from "next/link";
import { address, site, telHref } from "@/config/site";
import { features, featureHref } from "@/content/features";
import { industries, solutions, industryHref, solutionHref } from "@/content/groups";
import { Icon } from "./Icon";
import { LogoMark } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

type FootLink = { href: string; label: string; external?: boolean };

function Col({ title, links }: { title: string; links: FootLink[] }) {
  return (
    <nav aria-label={`${title} links`}>
      <h2 className="foot-col-title">{title}</h2>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
        {links.map((l) => (
          <li key={l.href}>
            {l.external ? (
              <a href={l.href} className="foot-link">
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="foot-link">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

const small = { fontSize: 13, color: "#8A8E99" };

export function Footer() {
  return (
    <footer style={{ position: "relative", overflow: "hidden", background: "var(--footer-bg)", color: "#fff" }}>
      <div className="glow" aria-hidden="true" style={{ left: "50%", top: -320, width: 1000, height: 600, transform: "translateX(-50%)", background: "radial-gradient(closest-side, rgba(255,90,31,.14), transparent)" }} />
      <div className="wrap" style={{ position: "relative", paddingTop: "clamp(64px, 8vw, 96px)" }}>
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 40 }}>
          <div style={{ maxWidth: 620 }}>
            <p style={{ margin: 0, fontSize: "clamp(34px, 5vw, 60px)", lineHeight: 1.02, letterSpacing: "-.045em", fontWeight: 600, textWrap: "balance" }}>Be the name customers find first.</p>
            <div className="row" style={{ marginTop: 28, gap: 10 }}>
              <Link href="/contact" className="btn" style={{ background: "var(--brand)", color: "#fff", padding: "0 22px" }} data-cta="footer_demo">
                Book a demo →
              </Link>
              <a href={telHref} className="btn" style={{ border: "1px solid #2A2C33", color: "#fff", padding: "0 22px" }} data-cta="footer_phone">
                <Icon name="phone" size={16} stroke={2} />
                {site.contact.phone}
              </a>
            </div>
          </div>
          <div style={{ flex: "0 1 400px", minWidth: 0, padding: 22, borderRadius: 18, background: "#16171D", border: "1px solid #23252C" }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Local search notes, once a month</div>
            <div style={{ fontSize: 13.5, color: "#A9ACB6", marginTop: 4 }}>Guides on Maps rank, reviews and AI search.</div>
            <NewsletterForm variant="dark" source="footer" />
          </div>
        </div>

        <div style={{ marginTop: "clamp(56px, 7vw, 80px)", paddingTop: 48, borderTop: "1px solid #1F2127", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "40px 32px" }}>
          <div>
            <Link href="/" className="logo" aria-label="RankMonk home">
              <LogoMark />
              <span className="logo-word">RankMonk</span>
            </Link>
            <p style={{ margin: "16px 0 0", fontSize: 14, lineHeight: 1.6, color: "#A9ACB6", maxWidth: 240 }}>Local SEO and AI search visibility for businesses, brands and agencies.</p>
          </div>
          <Col title="Product" links={features.map((f) => ({ href: featureHref(f.slug), label: f.name }))} />
          <Col title="Solutions" links={solutions.map((s) => ({ href: solutionHref(s.slug), label: s.name }))} />
          <Col title="Industries" links={industries.map((s) => ({ href: industryHref(s.slug), label: s.name }))} />
          <Col
            title="Company"
            links={[
              { href: "/pricing", label: "Pricing" },
              { href: "/about", label: "About" },
              { href: "/blog", label: "Blog" },
              { href: "/contact", label: "Book a demo" },
              { href: site.dashboardUrl, label: "Log in", external: true },
            ]}
          />
        </div>

        <div className="row" style={{ marginTop: 56, padding: "22px 0", borderTop: "1px solid #1F2127", justifyContent: "space-between", gap: 16, ...small }}>
          <address style={{ fontStyle: "normal" }}>
            © {new Date().getFullYear()} {site.name} · {address} ·{" "}
            <a href={`mailto:${site.contact.email}`} className="foot-link" style={small}>
              {site.contact.email}
            </a>
          </address>
          <nav aria-label="Legal" style={{ display: "flex", gap: 20 }}>
            <Link href="/privacy" className="foot-link" style={small}>Privacy</Link>
            <Link href="/terms" className="foot-link" style={small}>Terms</Link>
            <Link href="/cookies" className="foot-link" style={small}>Cookies</Link>
          </nav>
        </div>
      </div>
      <div aria-hidden="true" style={{ position: "relative", textAlign: "center", fontWeight: 700, fontSize: "clamp(72px, 17.5vw, 260px)", lineHeight: 0.8, letterSpacing: "-.065em", marginBottom: "-.06em", background: "linear-gradient(180deg, #24262E, rgba(36,38,46,0) 85%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", userSelect: "none", whiteSpace: "nowrap" }}>
        RankMonk
      </div>
    </footer>
  );
}
