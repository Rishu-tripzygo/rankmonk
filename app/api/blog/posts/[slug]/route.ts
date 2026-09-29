import { blogAuthorized, json, readJson } from "@/lib/api";
import { adminGet, blogConfigured, deletePost, getPublished, isSlug, parsePostInput, updatePost } from "@/lib/blog";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { dbError, postUrl, revalidateBlog } from "@/lib/blog-api";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ slug: string }> };

/** GET /api/blog/posts/:slug: a published post with content (drafts too with the Bearer token). */
export async function GET(req: Request, { params }: Ctx) {
  const { slug } = await params;
  if (!blogConfigured()) return json({ error: "Blog is not configured." }, 503);
  if (!isSlug(slug)) return json({ error: "Not found" }, 404);
  try {
    const post = blogAuthorized(req) ? await adminGet(slug) : await getPublished(slug);
    return post ? json({ post: { ...post, url: postUrl(req, post.slug) } }) : json({ error: "Not found" }, 404);
  } catch (err) {
    return dbError(err);
  }
}

/** PATCH /api/blog/posts/:slug: update any subset of fields. Requires the Bearer token. */
export async function PATCH(req: Request, { params }: Ctx) {
  const { slug } = await params;
  if (!rateLimit(`blog:${clientIp(req)}`, 30, 60 * 60_000)) return json({ error: "Too many requests." }, 429);
  if (!blogAuthorized(req)) return json({ error: "Unauthorized" }, 401);
  if (!blogConfigured()) return json({ error: "Blog is not configured." }, 503);
  const body = await readJson(req, 256 * 1024);
  if (body === undefined) return json({ error: "Body must be JSON (Content-Type: application/json), max 256 KB." }, 400);
  const parsed = parsePostInput(body, true);
  if (!parsed.ok) return json({ error: "Validation failed.", fields: parsed.errors }, 422);
  if (!Object.keys(parsed.row).length) return json({ error: "Nothing to update." }, 422);
  try {
    // Publishing a draft without an explicit date publishes it now.
    if (parsed.row.status === "published" && !parsed.row.published_at) {
      const current = await adminGet(slug);
      if (current && !current.published_at) parsed.row.published_at = new Date().toISOString();
    }
    const post = await updatePost(slug, parsed.row);
    if (!post) return json({ error: "Not found" }, 404);
    revalidateBlog(slug, post.slug);
    return json({ post: { ...post, url: postUrl(req, post.slug) } });
  } catch (err) {
    return dbError(err);
  }
}

/** DELETE /api/blog/posts/:slug: permanently delete. Requires the Bearer token. */
export async function DELETE(req: Request, { params }: Ctx) {
  const { slug } = await params;
  if (!rateLimit(`blog:${clientIp(req)}`, 30, 60 * 60_000)) return json({ error: "Too many requests." }, 429);
  if (!blogAuthorized(req)) return json({ error: "Unauthorized" }, 401);
  if (!blogConfigured()) return json({ error: "Blog is not configured." }, 503);
  try {
    if (!(await deletePost(slug))) return json({ error: "Not found" }, 404);
    revalidateBlog(slug);
    return json({ deleted: slug });
  } catch (err) {
    return dbError(err);
  }
}
