import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCover, formatDate } from "@/components/BlogCover";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, site } from "@/config/site";
import { blogCategoryStyle } from "@/content/site";
import { getPublished, listPublished, renderMarkdown, tableOfContents } from "@/lib/blog";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { gridVars } from "@/lib/style";

type Props = { params: Promise<{ slug: string }> };

// Posts known at build time are prerendered; new ones render on first request and are cached.
export const revalidate = 3600;
export const dynamicParams = true;
export async function generateStaticParams() {
  return (await listPublished({ limit: 100 })).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublished((await params).slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords.length ? post.keywords : undefined,
    image: post.cover_image_url ?? undefined,
    imageAlt: post.cover_image_alt ?? undefined,
    article: { publishedTime: post.published_at ?? undefined, modifiedTime: post.updated_at, section: post.category, tags: post.tags, authors: [post.author_name] },
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPublished((await params).slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;
  const crumbs = [{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: post.title }];
  const html = renderMarkdown(post.content);
  const toc = tableOfContents(post.content);
  const related = (await listPublished({ limit: 12 })).filter((p) => p.slug !== post.slug).sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 3);
  const st = blogCategoryStyle[post.category];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${absoluteUrl(path)}#article`,
            mainEntityOfPage: absoluteUrl(path),
            url: absoluteUrl(path),
            headline: post.title,
            description: post.description,
            ...(post.cover_image_url ? { image: absoluteUrl(post.cover_image_url) } : { image: absoluteUrl(site.seo.ogImage) }),
            datePublished: post.published_at,
            dateModified: post.updated_at,
            articleSection: post.category,
            keywords: [...post.keywords, ...post.tags].join(", ") || undefined,
            wordCount: post.content.split(/\s+/).filter(Boolean).length,
            inLanguage: site.language,
            author: { "@type": "Organization", name: post.author_name, url: site.url },
            publisher: { "@id": `${site.url}/#organization` },
            isPartOf: { "@id": `${absoluteUrl("/blog")}#blog` },
          },
          breadcrumbSchema(crumbs, path),
        ]}
      />

      <article>
        <header style={{ padding: "56px 0 0" }}>
          <div className="wrap" style={{ maxWidth: 880 }}>
            <Breadcrumbs items={crumbs} />
            <p style={{ margin: "28px 0 0", display: "inline-block", fontSize: 13, fontWeight: 600, color: st?.ink, background: st?.tint, padding: "5px 11px", borderRadius: 999 }}>{post.category}</p>
            <h1 style={{ margin: "16px 0 0", fontSize: "clamp(34px, 4.8vw, 54px)", lineHeight: 1.06, letterSpacing: "-.04em", fontWeight: 600 }}>{post.title}</h1>
            <p className="lead" style={{ margin: "18px 0 0" }}>{post.description}</p>
            <p style={{ margin: "20px 0 0", fontSize: 14, color: "var(--subtle)" }}>
              {post.author_name} · <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time> · {post.reading_minutes} min read
            </p>
          </div>
          <div className="wrap" style={{ maxWidth: 1040, marginTop: 36 }}>
            <div style={{ position: "relative", aspectRatio: "16/8", borderRadius: 24, overflow: "hidden", background: "var(--surface-2)" }}>
              <BlogCover url={post.cover_image_url} alt={post.cover_image_alt} category={post.category} sizes="(max-width: 1100px) 100vw, 1040px" priority />
            </div>
          </div>
        </header>

        <div className="wrap row" style={{ maxWidth: 1040, gap: 56, padding: "48px 24px clamp(64px, 9vw, 104px)", alignItems: "flex-start" }}>
          {toc.length > 2 && (
            <aside className="toc-aside" style={{ flex: "0 0 220px", position: "sticky", top: 100 }}>
              <nav aria-label="On this page" className="toc">
                <p style={{ margin: "0 0 10px", fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--subtle)" }}>On this page</p>
                {toc.map((h) => (
                  <a key={h.id} href={`#${h.id}`}>{h.text}</a>
                ))}
              </nav>
            </aside>
          )}
          <div style={{ flex: "1 1 560px", minWidth: 0, maxWidth: 720 }}>
            <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
            {post.tags.length > 0 && (
              <ul aria-label="Tags" style={{ listStyle: "none", margin: "40px 0 0", padding: 0, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {post.tags.map((t) => (
                  <li key={t} style={{ fontSize: 13, padding: "6px 12px", borderRadius: 999, border: "1px solid var(--line-2)", color: "var(--muted)" }}>{t}</li>
                ))}
              </ul>
            )}
            <div style={{ marginTop: 40, padding: 24, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--line)" }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 17 }}>See how your business shows up</p>
              <p style={{ margin: "6px 0 16px", fontSize: 15, lineHeight: 1.6, color: "var(--muted)" }}>RankMonk tracks your rank street by street, protects your Google Business Profile and shows whether AI assistants recommend you.</p>
              <Link href="/contact" className="btn btn-primary" data-cta="blog_post_demo">Book a demo →</Link>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section style={{ padding: "0 0 clamp(64px, 9vw, 104px)" }}>
          <div className="wrap">
            <h2 style={{ margin: 0, fontSize: 24, letterSpacing: "-.02em", fontWeight: 600 }}>Keep reading</h2>
            <div className="grid-auto grid-fill" style={{ marginTop: 24, ...gridVars(280) }}>
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="lift-sm" style={{ display: "flex", flexDirection: "column", gap: 8, padding: 22, border: "1px solid var(--line)", borderRadius: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-strong)" }}>{p.category}</span>
                  <span style={{ fontWeight: 600, fontSize: 17, lineHeight: 1.35 }}>{p.title}</span>
                  <span style={{ fontSize: 14, color: "var(--subtle)" }}>{p.reading_minutes} min read</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
