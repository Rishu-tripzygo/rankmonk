// Central site configuration. Server-only values are read here at build/request
// time and passed down as props; nothing in this file is exposed to the browser
// unless a component explicitly renders it.

const env = process.env;

function str(name: string, fallback: string): string {
  const v = env[name]?.trim();
  return v ? v : fallback;
}

function bool(name: string, fallback: boolean): boolean {
  const v = env[name]?.trim().toLowerCase();
  if (!v) return fallback;
  return v === "true" || v === "1" || v === "yes";
}

function url(name: string, fallback: string): string {
  const raw = str(name, fallback);
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`Invalid ${name}: "${raw}" is not an absolute URL.`);
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`Invalid ${name}: must use http or https.`);
  }
  // Canonical form: lowercase host, no trailing slash, no path/query.
  return `${parsed.protocol}//${parsed.host.toLowerCase()}`;
}

function optionalUrl(name: string): string | undefined {
  const v = env[name]?.trim();
  if (!v) return undefined;
  try {
    return new URL(v).toString();
  } catch {
    throw new Error(`Invalid ${name}: "${v}" is not an absolute URL.`);
  }
}

// Vercel preview deployments should never be indexed.
const isPreview = env.VERCEL_ENV === "preview";

export const site = {
  name: str("SITE_NAME", "RankMonk"),
  url: url("SITE_URL", "https://rankmonk.io"),
  description: str(
    "SITE_DESCRIPTION",
    "RankMonk is a local SEO and AI search visibility platform for local businesses, multi-location brands and agencies in India. Track Google Maps rank street by street, protect Google Business Profiles, reply to reviews with AI, keep listings right on 20+ directories and see whether ChatGPT and Gemini recommend you.",
  ),
  locale: str("SITE_LOCALE", "en_IN"),
  language: str("SITE_LANGUAGE", "en-IN"),
  dashboardUrl: url("DASHBOARD_URL", "https://dashboard.rankmonk.io"),

  seo: {
    defaultTitle: str("DEFAULT_TITLE", "RankMonk: Local SEO & AI Search Visibility Platform"),
    defaultDescription: str(
      "DEFAULT_DESCRIPTION",
      "Track Google Maps rank street by street, protect Google Business Profiles, reply to reviews with AI and see if ChatGPT and Gemini recommend you.",
    ),
    keywords: str(
      "DEFAULT_KEYWORDS",
      "local SEO, local SEO software India, Google Business Profile management, geo-grid rank tracker, Google Maps ranking, review management, AI review replies, listings management, AI search visibility, ChatGPT visibility, multi-location SEO, local SEO for agencies",
    )
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    ogImage: str("OG_IMAGE", "/og.png"),
    index: !isPreview && bool("ROBOTS_INDEX", true),
    follow: !isPreview && bool("ROBOTS_FOLLOW", true),
  },

  google: {
    ga4Id: env.GA4_MEASUREMENT_ID?.trim() || undefined,
    searchConsoleVerification: env.GOOGLE_SEARCH_CONSOLE_VERIFICATION?.trim() || undefined,
  },

  // Public contact details shown on the site (from the design reference).
  contact: {
    email: str("PUBLIC_EMAIL", "info@rankmonk.io"),
    phone: str("PUBLIC_PHONE", "+91 88717 19169"),
    locality: "Gurugram",
    region: "Haryana",
    postalCode: "122001",
    country: "IN",
    countryName: "India",
  },

  social: [
    optionalUrl("LINKEDIN_URL"),
    optionalUrl("INSTAGRAM_URL"),
    optionalUrl("FACEBOOK_URL"),
  ].filter((v): v is string => Boolean(v)),
} as const;

export const telHref = `tel:${site.contact.phone.replace(/[^\d+]/g, "")}`;
export const address = `${site.contact.locality}, ${site.contact.region} ${site.contact.postalCode}, ${site.contact.countryName}`;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return path === "/" ? site.url : `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
