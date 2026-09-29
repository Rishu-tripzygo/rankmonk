import { icons, type IconName } from "@/content/icons";

type Props = { name: IconName; size?: number; stroke?: number; className?: string };

/** Decorative stroke icon from the design reference. Always aria-hidden. */
export function Icon({ name, size = 18, stroke = 1.8, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {icons[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** Small inline glyphs used across the reference (arrows, check, search). */
const glyphs = {
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  arrowUpRight: "M7 17 17 7M8 7h9v9",
  check: "M20 6 9 17l-5-5",
  chevronDown: "m6 9 6 6 6-6",
  chevronLeft: "m15 18-6-6 6-6",
  chevronRight: "m9 18 6-6-6-6",
  plus: "M12 5v14M5 12h14",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5",
} as const;

export function Glyph({ name, size = 14, stroke = 2.2, color = "currentColor", className }: { name: keyof typeof glyphs; size?: number; stroke?: number; color?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={{ flex: "none" }}>
      <path d={glyphs[name]} />
    </svg>
  );
}
