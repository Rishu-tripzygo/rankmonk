// Shared helpers for the blog API route handlers.
import { revalidatePath, revalidateTag } from "next/cache";
import { json } from "./api";
import { BLOG_TAG, BlogDbError } from "./blog";

/** Refresh every page that shows blog data right away after a write. */
export function revalidateBlog(...slugs: string[]) {
  revalidateTag(BLOG_TAG, { expire: 0 });
  for (const s of new Set(slugs)) revalidatePath(`/blog/${s}`);
  revalidatePath("/blog");
  revalidatePath("/blog/sitemap.xml");
  revalidatePath("/llms.txt");
}

export const postUrl = (req: Request, slug: string) => `${process.env.SITE_URL?.trim() || new URL(req.url).origin}/blog/${slug}`;

export function dbError(err: unknown) {
  if (err instanceof BlogDbError && err.code === "23505") return json({ error: "A post with this slug already exists." }, 409);
  if (err instanceof BlogDbError && err.code === "23514") return json({ error: "The post violates a database constraint (check lengths and category)." }, 422);
  console.error("blog api:", err instanceof Error ? err.message : err);
  return json({ error: "Database error." }, 502);
}
