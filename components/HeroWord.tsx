"use client";

import { useEffect, useState } from "react";

/** Cycles the hero platform name every 2.4s with the reference blur/slide-in. */
export function HeroWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span key={i} className={i ? "a-word" : undefined} style={{ display: "inline-block", color: "var(--brand)" }}>
      {words[i]}
    </span>
  );
}
