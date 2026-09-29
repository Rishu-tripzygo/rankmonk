"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type Status = "idle" | "sending" | "done" | "error";

/** Newsletter signup used in the footer (dark) and on the blog (light). */
export function NewsletterForm({ variant, source }: { variant: "dark" | "light"; source: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const dark = variant === "dark";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, website: (form.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "" }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("done");
      track("sign_up", { method: "newsletter", form_location: source });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return dark ? (
      <p role="status" style={{ margin: "14px 0 0", fontSize: 14, color: "#6CE9A6" }}>
        ✓ You&apos;re subscribed.
      </p>
    ) : (
      <p role="status" style={{ margin: 0, fontSize: 15, color: "var(--success-text)", background: "var(--success-tint)", padding: "12px 16px", borderRadius: 12 }}>
        You&apos;re on the list.
      </p>
    );
  }

  const inputId = `newsletter-${source}`;
  return (
    <form onSubmit={onSubmit} style={dark ? { marginTop: 14 } : { flex: "0 1 420px", minWidth: 0 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          type="email"
          name="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          style={dark ? { height: 44, borderColor: "#2A2C33", background: "var(--footer-bg)", color: "#fff", fontSize: 14 } : { height: 48, borderRadius: 12 }}
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
        <button
          type="submit"
          className="btn"
          disabled={status === "sending"}
          style={dark ? { height: 44, padding: "0 16px", borderRadius: 10, background: "#fff", color: "var(--ink)", fontSize: 14 } : { height: 48, padding: "0 18px", borderRadius: 12, background: "var(--ink)", color: "#fff" }}
        >
          {status === "sending" ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" style={{ margin: "8px 0 0", fontSize: 13, color: dark ? "#FDA29B" : "var(--danger-text)" }}>
          {error}
        </p>
      )}
    </form>
  );
}
