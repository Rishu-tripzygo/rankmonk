"use client";

// Last-resort boundary when the root layout itself fails. Must render <html>/<body>.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", color: "#14151A", background: "#fff" }}>
        <main style={{ padding: "140px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: 40, letterSpacing: "-.03em", fontWeight: 600, margin: 0 }}>Something went wrong.</h1>
          <p style={{ color: "#4A4E5A", fontSize: 17 }}>Please reload the page.</p>
          <button type="button" onClick={reset} style={{ marginTop: 16, height: 48, padding: "0 22px", borderRadius: 12, border: 0, background: "#14151A", color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
