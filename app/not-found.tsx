import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Page not found · RankMonk" },
  description: "The page you were looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <section style={{ padding: "140px 24px", textAlign: "center" }}>
      <p className="mono" style={{ margin: 0, fontSize: 14, color: "var(--brand-strong)" }}>404</p>
      <h1 style={{ margin: "14px 0 0", fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-.04em", fontWeight: 600 }}>This page is off the map.</h1>
      <Link href="/" className="btn btn-dark" style={{ marginTop: 28, height: 48, padding: "0 22px" }}>
        Back to home
      </Link>
    </section>
  );
}
