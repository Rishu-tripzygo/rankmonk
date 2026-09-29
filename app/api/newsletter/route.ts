import { json, readJson, sameOrigin } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { appendRow, istNow, sheetsConfigured } from "@/lib/sheets";
import { clean, isEmail } from "@/lib/validation";

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
  if (!sheetsConfigured()) return json({ error: FAIL }, 503);

  try {
    // Duplicates are ignored by the sheet script; the visitor still sees success.
    await appendRow("Newsletter", { "Submitted at": istNow(), Email: email, Source: clean(b.source, 40) || "site" });
    return json({ ok: true });
  } catch (err) {
    console.error("newsletter: sheet append failed", err instanceof Error ? err.message : err);
    return json({ error: FAIL }, 502);
  }
}
