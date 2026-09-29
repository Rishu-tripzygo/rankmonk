import type { Metadata } from "next";
import { absoluteUrl, site } from "@/config/site";
import type { Crumb } from "@/components/Breadcrumbs";

type PageMeta = {
  /** Page title without the brand suffix. Omit for the home page. */
  title?: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
  /** Absolute URL or site path of a page-specific sharing image (defaults to OG_IMAGE). */
  image?: string;
  imageAlt?: string;
  article?: { publishedTime?: string; modifiedTime?: string; section?: string; tags?: string[]; authors?: string[] };
};

/** Per-page metadata: unique title/description, canonical, Open Graph, Twitter, robots. */
export function pageMetadata({ title, description, path, keywords, noindex, image, imageAlt, article }: PageMeta): Metadata {
  const fullTitle = title ? `${title} · ${site.name}` : site.seo.defaultTitle;
  const url = absoluteUrl(path);
  const index = site.seo.index && !noindex;
  const img = absoluteUrl(image ?? site.seo.ogImage);
  return {
    title: title ? { absolute: fullTitle } : { absolute: site.seo.defaultTitle },
    description,
    keywords: keywords ?? site.seo.keywords,
    alternates: { canonical: url },
    robots: { index, follow: site.seo.follow, googleBot: { index, follow: site.seo.follow, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      ...(article ? { type: "article" as const, ...article } : { type: "website" as const }),
      siteName: site.name,
      locale: site.locale,
      url,
      title: fullTitle,
      description,
      images: [image ? { url: img, alt: imageAlt ?? fullTitle } : { url: img, width: 1200, height: 630, alt: `${site.name}: local SEO and AI search visibility` }],
    },
    // X/Twitter link previews reuse the Open Graph image.
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [img] },
  };
}

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/icon.svg"),
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phone.replace(/\s/g, ""),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.locality,
      addressRegion: site.contact.region,
      postalCode: site.contact.postalCode,
      addressCountry: site.contact.country,
    },
    contactPoint: [{ "@type": "ContactPoint", contactType: "sales", telephone: site.contact.phone.replace(/\s/g, ""), email: site.contact.email, areaServed: "IN", availableLanguage: ["en"] }],
    ...(site.social.length ? { sameAs: site.social } : {}),
  };
}

export function websiteSchema() {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": SITE_ID, url: site.url, name: site.name, description: site.description, inLanguage: site.language, publisher: { "@id": ORG_ID } };
}

export function webPageSchema({ path, title, description, type = "WebPage" }: { path: string; title: string; description: string; type?: string }) {
  return { "@context": "https://schema.org", "@type": type, "@id": `${absoluteUrl(path)}#webpage`, url: absoluteUrl(path), name: title, description, inLanguage: site.language, isPartOf: { "@id": SITE_ID }, about: { "@id": ORG_ID } };
}

export function breadcrumbSchema(items: Crumb[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absoluteUrl(c.href ?? path) })),
  };
}

export function faqSchema(items: [string, string][]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
}
