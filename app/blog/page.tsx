import { BlogGrid } from "@/components/BlogGrid";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterForm } from "@/components/NewsletterForm";
import { absoluteUrl, site } from "@/config/site";
import { listPublished } from "@/lib/blog";
import { pageMetadata, webPageSchema } from "@/lib/seo";

// Rebuilt on demand when a post is published through the API, and at least hourly.
export const revalidate = 3600;

const title = "Blog";
const description = "Practical guides on local SEO, Google Business Profiles, reviews, listings and AI search from the RankMonk team. Subscribe for monthly local search notes.";

export const metadata = pageMetadata({ title, description, path: "/blog" });

export default async function BlogPage() {
  const posts = await listPublished({ limit: 100 });
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ path: "/blog", title: `${title} · RankMonk`, description, type: "CollectionPage" }),
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${absoluteUrl("/blog")}#blog`,
            name: `${site.name} Blog`,
            url: absoluteUrl("/blog"),
            description,
            inLanguage: site.language,
            publisher: { "@id": `${site.url}/#organization` },
            blogPost: posts.slice(0, 20).map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absoluteUrl(`/blog/${p.slug}`), datePublished: p.published_at, dateModified: p.updated_at })),
          },
        ]}
      />
      <section style={{ padding: "72px 0 clamp(64px, 9vw, 112px)" }}>
        <div className="wrap">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
            <div style={{ maxWidth: 680 }}>
              <p className="eyebrow" style={{ margin: 0 }}>Blog</p>
              <h1 className="h1">Local search, explained.</h1>
              <p className="lead" style={{ margin: "18px 0 0" }}>Practical guides on Google Business Profiles, reviews, listings and AI search.</p>
            </div>
            <NewsletterForm variant="light" source="blog" />
          </div>
          <BlogGrid posts={posts} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
