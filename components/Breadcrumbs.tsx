import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { name: string; href?: string };

export function Breadcrumbs({ items, className, style }: { items: Crumb[]; className?: string; style?: React.CSSProperties }) {
  return (
    <nav aria-label="Breadcrumb" className={className} style={{ fontSize: 14, color: "var(--subtle)", ...style }}>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
        {items.map((c, i) => (
          <Fragment key={c.name}>
            {i > 0 && <li aria-hidden="true">/</li>}
            <li>{c.href ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page" style={{ color: "var(--ink)" }}>{c.name}</span>}</li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
