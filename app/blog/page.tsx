import { BlogGrid } from "@/components/BlogGrid";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { NewsletterForm } from "@/components/NewsletterForm";
import { pageMetadata, webPageSchema } from "@/lib/seo";

const title = "Blog";
const description = "Practical guides on local SEO, Google Business Profiles, reviews, listings and AI search from the RankMonk team. Subscribe for monthly local search notes.";

export const metadata = pageMetadata({ title, description, path: "/blog" });

export default function BlogPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ path: "/blog", title: `${title} · RankMonk`, description, type: "CollectionPage" })} />
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
          <BlogGrid />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
