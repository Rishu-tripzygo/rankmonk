/** RankMonk mark: orange tile with a 3×3 dot grid, centre dot solid. */
export function LogoMark({ size = 28, radius = 8, pad = 6, gap = 2.5 }: { size?: number; radius?: number; pad?: number; gap?: number }) {
  return (
    <span aria-hidden="true" style={{ width: size, height: size, borderRadius: radius, background: "#FF5A1F", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap, padding: pad, boxShadow: "0 4px 12px -4px rgba(255,90,31,.6)", flex: "none" }}>
      {Array.from({ length: 9 }, (_, i) => (
        <i key={i} style={{ background: "#fff", borderRadius: "50%", opacity: i === 4 ? 1 : 0.55 }} />
      ))}
    </span>
  );
}
