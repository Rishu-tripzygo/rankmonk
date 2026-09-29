"use client";

import Link from "next/link";

// Route-level error boundary: keeps the header/footer and never shows error details.
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section style={{ padding: "140px 24px", textAlign: "center" }}>
      <p className="mono" style={{ margin: 0, fontSize: 14, color: "var(--brand-strong)" }}>Error</p>
      <h1 style={{ margin: "14px 0 0", fontSize: "clamp(36px, 5vw, 56px)", letterSpacing: "-.04em", fontWeight: 600 }}>Something went wrong.</h1>
      <p style={{ margin: "14px auto 0", maxWidth: 480, fontSize: 17, lineHeight: 1.6, color: "var(--muted)" }}>Please try again. If it keeps happening, call us or come back in a few minutes.</p>
      <div className="row" style={{ marginTop: 28, justifyContent: "center", gap: 10 }}>
        <button type="button" onClick={reset} className="btn btn-dark" style={{ height: 48, padding: "0 22px" }}>
          Try again
        </button>
        <Link href="/" className="btn btn-light" style={{ height: 48 }}>
          Back to home
        </Link>
      </div>
    </section>
  );
}
