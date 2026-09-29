// Server-only email delivery via the Resend HTTP API (no SDK needed).
// Imported only by route handlers; credentials never reach the browser.

type Mail = { to: string; subject: string; text: string; html: string; replyTo?: string };

function config() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  const to = process.env.CONTACT_EMAIL?.trim();
  if (!apiKey || !from || !to) return null;
  return { apiKey, from, to, replyTo: process.env.EMAIL_REPLY_TO?.trim() || undefined, audienceId: process.env.RESEND_AUDIENCE_ID?.trim() || undefined };
}

export const emailConfigured = () => config() !== null;
export const leadRecipient = () => config()?.to;

async function resend(path: string, apiKey: string, body: unknown): Promise<void> {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend ${path} failed with ${res.status}`);
}

export async function sendMail(m: Mail): Promise<void> {
  const c = config();
  if (!c) throw new Error("Email is not configured");
  await resend("/emails", c.apiKey, { from: c.from, to: [m.to], subject: m.subject, text: m.text, html: m.html, reply_to: m.replyTo ?? c.replyTo });
}

/** Adds a newsletter contact to the Resend audience when RESEND_AUDIENCE_ID is set. Returns false if not configured. */
export async function addToAudience(email: string): Promise<boolean> {
  const c = config();
  if (!c?.audienceId) return false;
  await resend(`/audiences/${encodeURIComponent(c.audienceId)}/contacts`, c.apiKey, { email, unsubscribed: false });
  return true;
}
