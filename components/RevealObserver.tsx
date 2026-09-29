"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll reveal from the reference: elements with data-r="n" fade up 28px over
 * 0.8s, staggered by n × 80ms. Content is visible by default (works without JS);
 * only elements that start below the fold animate, when they scroll into view.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const play = (el: Element) => {
      const d = (Number(el.getAttribute("data-r")) || 0) * 80;
      el.animate([{ opacity: 0, transform: "translateY(28px)" }, { opacity: 1, transform: "none" }], { duration: 800, delay: d, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            play(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.01 },
    );
    const h = window.innerHeight;
    document.querySelectorAll("[data-r]").forEach((el) => {
      if (el.getBoundingClientRect().top >= h) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
