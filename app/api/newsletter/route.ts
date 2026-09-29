import { json, readJson, sameOrigin } from "@/lib/api";
import { addToAudience, emailConfigured, leadRecipient, sendMail } from "@/lib/email";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { clean, escapeHtml, isEmail } from "@/lib/validation";

const FAIL = "We couldn't subscribe you right now. Please try again later.";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!rateLimit(`newsletter:${clientIp(req)}`, 5, 10 * 60_000)) return json({ error: "Too many requests. Please try again later." }, 429);

  const body = await readJson(req);
  if (body === undefined) return json({ error: "Invalid request." }, 400);
  const b = body as Record<string, unknown>;
  if (clean(b.website, 200)) return json({ ok: true });

  const email = clean(b.email, 254).toLowerCase();
  if (!isEmail(email)) return json({ error: "Please enter a valid email." }, 422);
  if (!emailConfigured()) return json({ error: FAIL }, 503);

  try {
    // Prefer the Resend audience; otherwise notify the team so the signup isn't lost.
    if (!(await addToAudience(email))) {
      const source = clean(b.source, 40) || "site";
      await sendMail({ to: leadRecipient()!, subject: "Newsletter signup", text: `Email: ${email}\nSource: ${source}`, html: `<p>Newsletter signup: <b>${escapeHtml(email)}</b> (source: ${escapeHtml(source)})</p>` });
    }
    return json({ ok: true });
  } catch (err) {
    console.error("newsletter: signup failed", err instanceof Error ? err.message : err);
    return json({ error: FAIL }, 502);
  }
}
