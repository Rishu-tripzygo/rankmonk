import { site } from "@/config/site";
import { json, readJson, sameOrigin } from "@/lib/api";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { appendRow, istNow, sheetsConfigured } from "@/lib/sheets";
import { clean, parseDemo } from "@/lib/validation";

const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const FAIL = `We couldn't send your request right now. Please try again, or call us on ${site.contact.phone}.`;

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Forbidden" }, 403);
  if (!rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60_000)) return json({ error: "Too many requests. Please wait a few minutes and try again." }, 429);

  const body = await readJson(req);
  if (body === undefined) return json({ error: "Invalid request." }, 400);
  const b = body as Record<string, unknown>;

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  if (clean(b.website, 200)) return json({ ok: true });

  const parsed = parseDemo(body);
  if (!parsed.ok) return json({ error: "Please check the highlighted fields.", fields: parsed.errors }, 422);
  if (!sheetsConfigured()) return json({ error: FAIL }, 503);

  const d = parsed.data;
  const attr = (b.attribution && typeof b.attribution === "object" ? b.attribution : {}) as Record<string, unknown>;
  const utm = (attr.utm && typeof attr.utm === "object" ? attr.utm : {}) as Record<string, unknown>;

  try {
    await appendRow("Demo requests", {
      "Submitted at": istNow(),
      Name: d.name,
      "Work email": d.email,
      Phone: d.phone,
      Company: d.company,
      Locations: d.locations,
      Message: d.message,
      ...Object.fromEntries(UTM.map((k) => [k, clean(utm[k], 200)])),
      "Landing page": clean(attr.landing, 300),
    });
    return json({ ok: true });
  } catch (err) {
    console.error("contact: sheet append failed", err instanceof Error ? err.message : err);
    return json({ error: FAIL }, 502);
  }
}
