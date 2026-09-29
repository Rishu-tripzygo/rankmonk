import { createHash, timingSafeEqual } from "node:crypto";
// Small helpers shared by the JSON API route handlers.
import { site } from "@/config/site";

export const MAX_BODY_BYTES = 16 * 1024;

export const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });

/** Rejects cross-site form posts: the Origin (when sent) must match the site or the request host. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const o = new URL(origin).host;
    return o === new URL(site.url).host || o === req.headers.get("host");
  } catch {
    return false;
  }
}

/** Reads a JSON body with a hard size limit. Returns undefined on bad input. */
export async function readJson(req: Request, maxBytes = MAX_BODY_BYTES): Promise<unknown> {
  if (!req.headers.get("content-type")?.includes("application/json")) return undefined;
  const len = Number(req.headers.get("content-length") || 0);
  if (len > maxBytes) return undefined;
  const text = await req.text();
  if (text.length > maxBytes) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/** Bearer-token check for the blog management API (constant-time compare). */
export function blogAuthorized(req: Request): boolean {
  const expected = process.env.BLOG_API_TOKEN?.trim();
  if (!expected || expected.length < 32) return false;
  const got = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ?? "";
  const digest = (v: string) => createHash("sha256").update(v).digest();
  return timingSafeEqual(digest(got), digest(expected));
}
