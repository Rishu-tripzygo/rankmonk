// Logo mark drawn with plain elements for next/og ImageResponse (no CSS grid support there).
export function OgMark({ size }: { size: number }) {
  const dot = size * 0.131;
  const gap = size * 0.089;
  const pad = size * 0.214;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.286, background: "#FF5A1F", display: "flex", flexWrap: "wrap", padding: pad, gap, alignContent: "flex-start" }}>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} style={{ width: dot, height: dot, borderRadius: dot, background: "#fff", opacity: i === 4 ? 1 : 0.55 }} />
      ))}
    </div>
  );
}
