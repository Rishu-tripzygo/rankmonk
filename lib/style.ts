import type { CSSProperties } from "react";

/** CSS custom properties for the `.grid-auto` utility (min column width and gap, in px). */
export const gridVars = (min: number, gap = 16): CSSProperties => ({ "--min": `${min}px`, "--gap": `${gap}px` }) as CSSProperties;
