// Shared by the browser form and the API route, so both enforce the same rules.

export const LOCATION_OPTIONS = ["1", "2–10", "11–50", "51–200", "200+"] as const;

export type DemoRequest = {
  name: string;
  email: string;
  phone: string;
  company: string;
  locations: (typeof LOCATION_OPTIONS)[number];
  message: string;
};

export type DemoErrors = Partial<Record<"name" | "email" | "phone", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LIMITS = { name: 100, email: 254, phone: 20, company: 120, message: 2000 } as const;

export function isEmail(v: string): boolean {
  return v.length <= LIMITS.email && EMAIL_RE.test(v);
}

export function validateDemo(f: Pick<DemoRequest, "name" | "email" | "phone">): DemoErrors {
  const e: DemoErrors = {};
  if (!f.name.trim()) e.name = "Please enter your name.";
  if (!isEmail(f.email.trim())) e.email = "Please enter a valid email.";
  if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Please enter a 10-digit phone number.";
  return e;
}

/** Collapse control characters and trim to a max length. */
export function clean(v: unknown, max: number, multiline = false): string {
  if (typeof v !== "string") return "";
  const s = multiline ? v.replace(/\r\n?/g, "\n").replace(/[^\S\n]+/g, " ") : v.replace(/\s+/g, " ");
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

/** Parse and validate an untrusted JSON body into a DemoRequest. */
export function parseDemo(body: unknown): { ok: true; data: DemoRequest } | { ok: false; errors: DemoErrors } {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const locRaw = clean(b.locations, 10);
  const data: DemoRequest = {
    name: clean(b.name, LIMITS.name),
    email: clean(b.email, LIMITS.email).toLowerCase(),
    phone: clean(b.phone, LIMITS.phone),
    company: clean(b.company, LIMITS.company),
    locations: (LOCATION_OPTIONS as readonly string[]).includes(locRaw) ? (locRaw as DemoRequest["locations"]) : "2–10",
    message: clean(b.message, LIMITS.message, true),
  };
  if (data.phone && !/^[+\d\s()-]+$/.test(data.phone)) return { ok: false, errors: { phone: "Please enter a 10-digit phone number." } };
  const errors = validateDemo(data);
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

/** Escape text for safe inclusion in HTML email bodies. */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
