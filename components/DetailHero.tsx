import Link from "next/link";
import type { IconName } from "@/content/icons";
import type { MockKind } from "@/content/features";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Icon } from "./Icon";
import { ProductMock } from "./ProductMock";

/** Hero shared by feature, solution and industry pages. */
export function DetailHero({ crumbs, icon, kicker, title, desc, mock }: { crumbs: Crumb[]; icon: IconName; kicker: string; title: string; desc: string; mock: MockKind }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "56px 0 80px" }}>
      <div className="wrap" style={{ position: "relative" }}>
        <Breadcrumbs items={crumbs} />
        <div className="row" style={{ marginTop: 36, gap: "32px 56px", alignItems: "flex-end" }}>
          <div style={{ flex: "1 1 520px", minWidth: 0 }}>
            <p style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600, color: "var(--brand-strong)" }}>
              <span className="icon-tile" style={{ width: 32, height: 32, borderRadius: 9 }}>
                <Icon name={icon} size={17} stroke={1.9} />
              </span>
              {kicker}
            </p>
            <h1 style={{ margin: "18px 0 0", fontSize: "clamp(38px, 5.6vw, 66px)", lineHeight: 1.02, letterSpacing: "-.04em", fontWeight: 600 }}>{title}</h1>
          </div>
          <div style={{ flex: "1 1 360px", minWidth: 0 }}>
            <p className="lead" style={{ margin: 0 }}>{desc}</p>
            <div className="row" style={{ marginTop: 24, gap: 12 }}>
              <Link href="/contact" className="btn btn-primary" data-cta="detail_demo">
                Book a demo<span aria-hidden="true">→</span>
              </Link>
              <Link href="/pricing" className="btn btn-light" data-cta="detail_pricing">
                See pricing
              </Link>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 56 }}>
          <ProductMock kind={mock} />
        </div>
      </div>
    </section>
  );
}
