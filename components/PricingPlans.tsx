import Link from "next/link";
import { finalPrice, plans } from "@/content/site";
import { Glyph } from "./Icon";
import { gridVars } from "@/lib/style";

const fmt = (v: number) => `₹${v.toLocaleString("en-IN")}`;

export function PricingPlans() {
  return (
    <>
      <div className="grid-auto" style={{ marginTop: 40, textAlign: "left", alignItems: "stretch", ...gridVars(290, 20) }}>
        {plans.map((p, i) => {
          const pop = !!p.popular;
          const mut = pop ? "#A9ACB6" : "var(--subtle)";
          const custom = p.price === undefined;
          return (
            <div key={p.name} data-r={i} style={{ position: "relative", display: "flex", flexDirection: "column", padding: 30, borderRadius: 22, background: pop ? "var(--ink)" : "#fff", color: pop ? "#fff" : "var(--ink)", border: `1px solid ${pop ? "var(--ink)" : "var(--line)"}`, boxShadow: pop ? "0 40px 80px -30px rgba(20,21,26,.55)" : "none" }}>
              {pop && <span style={{ position: "absolute", top: -12, left: 30, background: "var(--brand-strong)", color: "#fff", fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999 }}>Most popular</span>}
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, letterSpacing: "-.02em" }}>{p.name}</h2>
              <p style={{ margin: "6px 0 0", fontSize: 14, color: mut }}>{p.for}</p>
              <p style={{ margin: "26px 0 0", display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 46, fontWeight: 600, letterSpacing: "-.045em", fontVariantNumeric: "tabular-nums" }}>{custom ? "Custom" : fmt(finalPrice(p)!)}</span>
                {!custom && !!p.discount && <s style={{ fontSize: 16, color: mut }}>{fmt(p.price!)}</s>}
                {!custom && <span style={{ fontSize: 14, color: mut }}>/location/mo</span>}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: mut, minHeight: 18 }}>{custom ? "Volume pricing for large networks" : p.discount ? `${p.discount}% off` : "Per location"}</p>
              <Link href="/contact" data-cta={`pricing_${p.name.toLowerCase()}`} style={{ marginTop: 24, display: "flex", justifyContent: "center", alignItems: "center", height: 48, borderRadius: 12, fontWeight: 600, background: pop ? "var(--brand-strong)" : "#fff", color: pop ? "#fff" : "var(--ink)", border: `1px solid ${pop ? "var(--brand-strong)" : "var(--line-3)"}` }}>
                {p.cta}
              </Link>
              <ul style={{ margin: "26px 0 0", padding: "22px 0 0", listStyle: "none", borderTop: `1px solid ${pop ? "rgba(255,255,255,.14)" : "var(--line)"}`, display: "flex", flexDirection: "column", gap: 12 }}>
                {p.items.map((it) => (
                  <li key={it} style={{ display: "flex", gap: 10, fontSize: 14, lineHeight: 1.45 }}>
                    <span style={{ marginTop: 2 }}><Glyph name="check" size={16} stroke={2.5} color={pop ? "#FF8A5C" : "#12B76A"} /></span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
}
