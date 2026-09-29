import { Glyph } from "./Icon";

/** Accordion built on native <details>; the shared `name` keeps one item open at a time. */
export function FaqList({ items, name }: { items: [string, string][]; name: string }) {
  return (
    <div style={{ borderTop: "1px solid var(--line)" }}>
      {items.map(([q, a]) => (
        <details key={q} className="faq" name={name}>
          <summary>
            {q}
            <span className="faq-plus">
              <Glyph name="plus" stroke={2} />
            </span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
