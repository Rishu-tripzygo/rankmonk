import { blogAuthorized, json, readJson } from "@/lib/api";
import { adminList, BLOG_CATEGORIES, blogConfigured, insertPost, listPublished, parsePostInput } from "@/lib/blog";
import { dbError, postUrl, revalidateBlog } from "@/lib/blog-api";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
const MAX_POST_BYTES = 256 * 1024;

/**
 * GET /api/blog/posts
 *   Public: published posts (no content). Query: category, limit (1–100), offset.
 *   With the Bearer token: ?status=draft|published|all lists every post.
 */
export async function GET(req: Request) {
  if (!blogConfigured()) return json({ error: "Blog is not configured." }, 503);
  const q = new URL(req.url).searchParams;
  const status = q.get("status");
  if (status) {
    if (!blogAuthorized(req)) return json({ error: "Unauthorized" }, 401);
    try {
      return json({ posts: await adminList(status === "all" ? undefined : (status as "draft" | "published")) });
    } catch (err) {
      return dbError(err);
    }
  }
  const category = q.get("category") || undefined;
  if (category && !(BLOG_CATEGORIES as string[]).includes(category)) return json({ error: `category must be one of: ${BLOG_CATEGORIES.join(", ")}` }, 422);
  const limit = Math.min(Math.max(Number(q.get("limit")) || 20, 1), 100);
  const offset = Math.max(Number(q.get("offset")) || 0, 0);
  return json({ posts: await listPublished({ limit, offset, category }) });
}

/** POST /api/blog/posts: create (and by default publish) a post. Requires the Bearer token. */
export async function POST(req: Request) {
  if (!rateLimit(`blog:${clientIp(req)}`, 30, 60 * 60_000)) return json({ error: "Too many requests." }, 429);
  if (!blogAuthorized(req)) return json({ error: "Unauthorized" }, 401);
  if (!blogConfigured()) return json({ error: "Blog is not configured." }, 503);
  const body = await readJson(req, MAX_POST_BYTES);
  if (body === undefined) return json({ error: "Body must be JSON (Content-Type: application/json), max 256 KB." }, 400);

  const parsed = parsePostInput(body, false);
  if (!parsed.ok) return json({ error: "Validation failed.", fields: parsed.errors }, 422);
  try {
    const post = await insertPost(parsed.row);
    revalidateBlog(post.slug);
    return json({ post: { ...post, url: postUrl(req, post.slug) } }, 201);
  } catch (err) {
    return dbError(err);
  }
}
