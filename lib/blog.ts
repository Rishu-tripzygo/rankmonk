// Blog data layer: Supabase (PostgREST over fetch, no SDK), input validation and
// Markdown rendering. Server-only: uses the service role key.
import { Marked, type Tokens } from "marked";
import { blogCategories } from "../content/site.ts";

export const BLOG_TAG = "blog";
export const BLOG_CATEGORIES = blogCategories.slice(1) as Exclude<(typeof blogCategories)[number], "All">[];
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  keywords: string[];
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_name: string;
  status: "draft" | "published";
  reading_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
export type BlogPostSummary = Omit<BlogPost, "content">;

const SUMMARY_COLS = "id,slug,title,description,category,tags,keywords,cover_image_url,cover_image_alt,author_name,status,reading_minutes,published_at,created_at,updated_at";

// ---------- Supabase ----------

function db() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  // Legacy keys are JWTs (sent as Bearer too); new sb_secret_ keys go in `apikey` only.
  const headers: Record<string, string> = { apikey: key, "Content-Type": "application/json" };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  return { base: `${url}/rest/v1/blog_posts`, headers };
}

export const blogConfigured = () => db() !== null;

export class BlogDbError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request<T>(query: string, init: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {}): Promise<T> {
  const c = db();
  if (!c) throw new BlogDbError("Blog database is not configured", 503);
  const res = await fetch(`${c.base}${query}`, { ...init, headers: { ...c.headers, ...(init.headers as Record<string, string>) }, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
    throw new BlogDbError(err.message || `Supabase request failed (${res.status})`, res.status, err.code);
  }
  return (res.status === 204 ? null : await res.json()) as T;
}

const cached = { next: { revalidate: 3600, tags: [BLOG_TAG] } };
const nowIso = () => new Date().toISOString();

/** Published posts, newest first. Returns [] if the database isn't configured or is unreachable (so builds never fail). */
export async function listPublished(opts: { limit?: number; offset?: number; category?: string } = {}): Promise<BlogPostSummary[]> {
  if (!blogConfigured()) return [];
  const q = new URLSearchParams({ select: SUMMARY_COLS, status: "eq.published", published_at: `lte.${nowIso()}`, order: "published_at.desc", limit: String(opts.limit ?? 100), offset: String(opts.offset ?? 0) });
  if (opts.category) q.set("category", `eq.${opts.category}`);
  try {
    return await request<BlogPostSummary[]>(`?${q}`, cached);
  } catch (err) {
    console.error("blog: list failed", err instanceof Error ? err.message : err);
    return [];
  }
}

export async function getPublished(slug: string): Promise<BlogPost | null> {
  if (!blogConfigured() || !isSlug(slug)) return null;
  const q = new URLSearchParams({ select: "*", slug: `eq.${slug}`, status: "eq.published", published_at: `lte.${nowIso()}`, limit: "1" });
  try {
    return (await request<BlogPost[]>(`?${q}`, cached))[0] ?? null;
  } catch (err) {
    console.error("blog: get failed", err instanceof Error ? err.message : err);
    return null;
  }
}

// Management calls (API only, never cached).
export const adminList = (status?: "draft" | "published") =>
  request<BlogPostSummary[]>(`?${new URLSearchParams({ select: SUMMARY_COLS, order: "created_at.desc", limit: "500", ...(status ? { status: `eq.${status}` } : {}) })}`, { cache: "no-store" });
export const adminGet = async (slug: string) => (await request<BlogPost[]>(`?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`, { cache: "no-store" }))[0] ?? null;
export const insertPost = async (row: Partial<BlogPost>) =>
  (await request<BlogPost[]>("", { method: "POST", body: JSON.stringify(row), headers: { Prefer: "return=representation" }, cache: "no-store" }))[0];
export const updatePost = async (slug: string, patch: Partial<BlogPost>) =>
  (await request<BlogPost[]>(`?slug=eq.${encodeURIComponent(slug)}`, { method: "PATCH", body: JSON.stringify(patch), headers: { Prefer: "return=representation" }, cache: "no-store" }))[0] ?? null;
export const deletePost = async (slug: string) =>
  (await request<BlogPost[]>(`?slug=eq.${encodeURIComponent(slug)}`, { method: "DELETE", headers: { Prefer: "return=representation" }, cache: "no-store" })).length > 0;

// ---------- Validation ----------

export const isSlug = (s: string) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s) && s.length >= 3 && s.length <= 120;

export function slugify(title: string): string {
  return title.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100).replace(/-+$/, "");
}

export const readingMinutes = (markdown: string) => Math.max(1, Math.round(markdown.split(/\s+/).filter(Boolean).length / 220));

/** Cover images: a photo already on the site (/images/name.jpg) or an https URL in Supabase Storage. */
export function isAllowedCover(v: string): boolean {
  if (/^\/images\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(v)) return true;
  try {
    const u = new URL(v);
    return u.protocol === "https:" && u.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

type Input = Record<string, unknown>;
export type PostErrors = Record<string, string>;

const text = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);
const list = (v: unknown, max: number) => (Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === "string").map((x) => x.trim().slice(0, 60)).filter(Boolean))].slice(0, max) : undefined);

/**
 * Validates a create (partial=false) or update (partial=true) payload and maps it
 * to database columns. Unknown fields are ignored.
 */
export function parsePostInput(body: unknown, partial: boolean): { ok: true; row: Partial<BlogPost> } | { ok: false; errors: PostErrors } {
  const b = (body && typeof body === "object" ? body : {}) as Input;
  const e: PostErrors = {};
  const row: Partial<BlogPost> = {};
  const need = (k: string) => !partial || b[k] !== undefined;

  const title = text(b.title);
  if (need("title")) {
    if (!title || title.length < 10 || title.length > 120) e.title = "title is required, 10–120 characters.";
    else row.title = title;
  }
  const slug = text(b.slug) ?? (!partial && title ? slugify(title) : undefined);
  if (slug !== undefined) {
    if (!isSlug(slug)) e.slug = "slug must be 3–120 chars of lowercase letters, numbers and single hyphens.";
    else row.slug = slug;
  }
  const description = text(b.description);
  if (need("description")) {
    if (!description || description.length < 50 || description.length > 200) e.description = "description is required, 50–200 characters (used as the meta description).";
    else row.description = description;
  }
  const content = typeof b.content === "string" ? b.content.replace(/\r\n?/g, "\n").trim() : undefined;
  if (need("content")) {
    if (!content || content.length < 300 || content.length > 100_000) e.content = "content is required: Markdown, 300–100,000 characters.";
    else {
      row.content = content;
      row.reading_minutes = readingMinutes(content);
    }
  }
  const category = text(b.category);
  if (need("category")) {
    if (!category || !(BLOG_CATEGORIES as string[]).includes(category)) e.category = `category must be one of: ${BLOG_CATEGORIES.join(", ")}.`;
    else row.category = category as BlogCategory;
  }
  for (const [k, max] of [["tags", 8], ["keywords", 12]] as const) {
    if (b[k] === undefined) continue;
    const v = list(b[k], max);
    if (!v) e[k] = `${k} must be an array of strings.`;
    else row[k] = v;
  }
  if (b.cover_image_url !== undefined) {
    const v = b.cover_image_url === null ? null : text(b.cover_image_url);
    if (v && !isAllowedCover(v)) e.cover_image_url = "cover_image_url must be a site photo like /images/blog-geo-grid.jpg or an https URL on *.supabase.co.";
    else row.cover_image_url = v || null;
  }
  if (b.cover_image_alt !== undefined) row.cover_image_alt = text(b.cover_image_alt)?.slice(0, 200) || null;
  if (row.cover_image_url && !(row.cover_image_alt ?? text(b.cover_image_alt))) e.cover_image_alt = "cover_image_alt is required when a cover image is set.";
  if (b.author_name !== undefined) {
    const v = text(b.author_name);
    if (!v || v.length > 80) e.author_name = "author_name must be 1–80 characters.";
    else row.author_name = v;
  }
  if (b.status !== undefined || !partial) {
    const v = text(b.status) ?? "published";
    if (v !== "draft" && v !== "published") e.status = "status must be 'draft' or 'published'.";
    else row.status = v;
  }
  if (b.published_at !== undefined) {
    const v = text(b.published_at);
    const d = v ? new Date(v) : null;
    if (!d || Number.isNaN(d.getTime())) e.published_at = "published_at must be an ISO 8601 date-time.";
    else row.published_at = d.toISOString();
  }
  if (row.status === "published" && !row.published_at && !partial) row.published_at = nowIso();

  return Object.keys(e).length ? { ok: false, errors: e } : { ok: true, row };
}

// ---------- Markdown ----------

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const headingId = (s: string) => slugify(s.replace(/<[^>]+>/g, "")).slice(0, 60);

const md = new Marked({
  gfm: true,
  renderer: {
    // Raw HTML in posts is shown as text, never executed.
    html: ({ text: t }: Tokens.HTML | Tokens.Tag) => escape(t),
    // The page title is the only H1; content headings start at H2.
    heading({ tokens, depth }: Tokens.Heading) {
      const inner = this.parser.parseInline(tokens);
      const level = Math.min(Math.max(depth, 2), 4);
      return `<h${level} id="${headingId(inner)}">${inner}</h${level}>\n`;
    },
    link({ href, title, tokens }: Tokens.Link) {
      const inner = this.parser.parseInline(tokens);
      if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) return inner;
      const external = /^https?:/i.test(href) && !/^https?:\/\/(www\.)?rankmonk\.io/i.test(href);
      return `<a href="${escape(href)}"${title ? ` title="${escape(title)}"` : ""}${external ? ' rel="noopener" target="_blank"' : ""}>${inner}</a>`;
    },
    image({ href, text: alt }: Tokens.Image) {
      if (!isAllowedCover(href)) return "";
      return `<img src="${escape(href)}" alt="${escape(alt)}" loading="lazy" decoding="async">`;
    },
  },
});

export const renderMarkdown = (markdown: string) => md.parse(markdown, { async: false }) as string;

/** H2 headings for the article's table of contents. */
export function tableOfContents(markdown: string): { id: string; text: string }[] {
  return md.lexer(markdown).flatMap((t) => (t.type === "heading" && t.depth === 2 ? [{ id: headingId(md.parseInline(t.text, { async: false }) as string), text: t.text.replace(/[*_`]/g, "") }] : []));
}
