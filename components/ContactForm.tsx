"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { getAttribution, track } from "@/lib/analytics";
import { LIMITS, LOCATION_OPTIONS, validateDemo, type DemoErrors, type DemoRequest } from "@/lib/validation";
import { Glyph } from "./Icon";
import { gridVars } from "@/lib/style";

const EMPTY: DemoRequest = { name: "", email: "", phone: "", company: "", locations: "2–10", message: "" };

export function ContactForm({ phone }: { phone: string }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<DemoErrors>({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [serverError, setServerError] = useState("");
  const id = useId();

  const setF = <K extends keyof DemoRequest>(k: K, v: DemoRequest[K]) => {
    const next = { ...form, [k]: v };
    setForm(next);
    if (tried) setErrors(validateDemo(next));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validateDemo(form);
    setTried(true);
    setErrors(errs);
    setServerError("");
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`${id}-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const website = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, website, attribution: getAttribution() }) });
      const data = (await res.json().catch(() => ({}))) as { error?: string; fields?: DemoErrors };
      if (!res.ok) {
        if (data.fields) setErrors(data.fields);
        throw new Error(data.error || `Something went wrong. Please call us on ${phone}.`);
      }
      setStatus("sent");
      track("generate_lead", { form_id: "book_demo", locations: form.locations });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("idle");
      setServerError(err instanceof Error ? err.message : `Something went wrong. Please call us on ${phone}.`);
    }
  }

  if (status === "sent") {
    const first = form.name.trim().split(" ")[0] || "there";
    return (
      <div role="status" style={{ padding: "28px 8px", textAlign: "center" }}>
        <span style={{ width: 56, height: 56, margin: "0 auto", borderRadius: "50%", background: "var(--success-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Glyph name="check" size={26} stroke={2.6} color="#067647" />
        </span>
        <h2 style={{ margin: "20px 0 0", fontSize: 28, letterSpacing: "-.03em", fontWeight: 600 }}>Thanks, {first}.</h2>
        <p style={{ margin: "10px auto 0", maxWidth: 380, fontSize: 16, lineHeight: 1.6, color: "var(--muted)" }}>We&apos;ll call you within one working day to pick a time. For anything urgent, call {phone}.</p>
        <button type="button" onClick={() => { setForm(EMPTY); setTried(false); setErrors({}); setStatus("idle"); }} style={{ marginTop: 20, background: "none", border: "1px solid var(--line-2)", padding: "10px 16px", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>
          Send another request
        </button>
      </div>
    );
  }

  const field = (k: "name" | "email" | "phone", label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="field">
      <label htmlFor={`${id}-${k}`}>{label}</label>
      <input
        id={`${id}-${k}`}
        name={k}
        className="input"
        required
        value={form[k]}
        onChange={(e) => setF(k, e.target.value)}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `${id}-${k}-err` : undefined}
        maxLength={LIMITS[k]}
        {...props}
      />
      {errors[k] && <span id={`${id}-${k}-err`} className="field-err">{errors[k]}</span>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }} aria-describedby={serverError ? `${id}-server` : undefined}>
      <div className="grid-auto" style={gridVars(200)}>
        {field("name", "Full name", { autoComplete: "name" })}
        {field("email", "Work email", { type: "email", autoComplete: "email", inputMode: "email" })}
      </div>
      <div className="grid-auto" style={gridVars(200)}>
        {field("phone", "Phone", { type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "+91" })}
        <div className="field">
          <label htmlFor={`${id}-company`}>
            Company <span style={{ fontWeight: 400, color: "var(--subtle)", fontSize: 13 }}>(optional)</span>
          </label>
          <input id={`${id}-company`} name="company" className="input" autoComplete="organization" maxLength={LIMITS.company} value={form.company} onChange={(e) => setF("company", e.target.value)} />
        </div>
      </div>
      <fieldset style={{ border: 0, margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <legend style={{ fontSize: 14, fontWeight: 500, padding: 0, marginBottom: 8 }}>Number of locations</legend>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {LOCATION_OPTIONS.map((o) => (
            <button key={o} type="button" aria-pressed={form.locations === o} onClick={() => setF("locations", o)} className="chip-btn" style={{ borderRadius: 10, padding: "9px 14px", minHeight: 40 }}>
              {o}
            </button>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor={`${id}-message`}>
          What would you like to see? <span style={{ fontWeight: 400, color: "var(--subtle)", fontSize: 13 }}>(optional)</span>
        </label>
        <textarea id={`${id}-message`} name="message" className="input" rows={4} maxLength={LIMITS.message} value={form.message} onChange={(e) => setF("message", e.target.value)} />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      {serverError && (
        <p id={`${id}-server`} role="alert" className="form-alert" style={{ margin: 0 }}>
          {serverError}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={status === "sending"} style={{ height: 52, fontSize: 16 }}>
        {status === "sending" ? "Sending…" : "Book my demo"}
      </button>
      <p style={{ margin: 0, fontSize: 13, color: "var(--subtle)", lineHeight: 1.5 }}>
        By submitting, you agree to our{" "}
        <Link href="/privacy" className="link">
          Privacy Policy
        </Link>
        . We only use your details to arrange the demo.
      </p>
    </form>
  );
}
