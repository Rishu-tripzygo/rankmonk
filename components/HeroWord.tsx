"use client";

import { useEffect, useState } from "react";

/** Cycles the hero platform name every 2.4s with a blur/slide-in and a redrawn underline. */
export function HeroWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span key={i} className={`hero-word${i ? " a-word" : ""}`}>
      {words[i]}
      <svg className="hero-swoosh" viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
        <path d="M4 13 C 70 4, 150 3, 296 9" pathLength={1} />
      </svg>
    </span>
  );
}
