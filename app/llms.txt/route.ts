import { absoluteUrl, address, site } from "@/config/site";
import { featureHref, features } from "@/content/features";
import { industries, industryHref, solutionHref, solutions } from "@/content/groups";
import { legalDocs } from "@/content/legal";
import { homeFaqs, plans, platforms, pricingFaqs } from "@/content/site";

export const dynamic = "force-static";

// Plain-text site summary for AI assistants (llmstxt.org format). Generated from
// the same content files as the pages, so it always matches the website.
function build(): string {
  const inr = (v: number) => `₹${v.toLocaleString("en-IN")}`;
  const link = (title: string, path: string, desc: string) => `- [${title}](${absoluteUrl(path)}): ${desc}`;
  return [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} tracks local rank street by street with geo-grids, audits and protects Google Business Profiles, drafts AI replies to reviews, keeps business listings consistent on Google, Bing, Apple Maps and 20+ directories, and shows whether AI assistants (ChatGPT, Gemini, Google AI Overviews) recommend a business. One dashboard covers every location.`,
    "",
    "## Key facts",
    `- Website: ${site.url}`,
    `- Customer dashboard (login): ${site.dashboardUrl}`,
    `- Based in: ${address}`,
    `- Contact: ${site.contact.phone}, ${site.contact.email}`,
    `- Market and currency: India, prices in Indian rupees (INR), per location per month, excluding 18% GST`,
    `- Who it is for: single-location local businesses, multi-location brands, and agencies and consultants`,
    `- Platforms covered: ${platforms.join(", ")}`,
    `- Getting started: book a 30-minute demo at ${absoluteUrl("/contact")}`,
    "",
    "## Product features",
    ...features.map((f) => link(f.name, featureHref(f.slug), `${f.desc} Includes: ${f.caps.join("; ")}.`)),
    "",
    "## Pricing",
    ...plans.map((p) =>
      p.monthly !== undefined
        ? `- ${p.name} (${p.for.toLowerCase()}): ${inr(p.monthly)} per location per month billed monthly, or ${inr(p.yearly!)} billed yearly. Includes: ${p.items.join("; ")}.`
        : `- ${p.name} (${p.for.toLowerCase()}): custom pricing. Includes: ${p.items.join("; ")}.`,
    ),
    `- Details and plan comparison: ${absoluteUrl("/pricing")}`,
    "",
    "## Solutions",
    ...solutions.map((s) => link(s.name, solutionHref(s.slug), `${s.title} ${s.desc}`)),
    "",
    "## Industries",
    ...industries.map((i) => link(i.name, industryHref(i.slug), `${i.title} Example searches: ${(i.searches ?? []).join(", ")}.`)),
    "",
    "## Frequently asked questions",
    ...[...homeFaqs, ...pricingFaqs].map(([q, a]) => `- ${q} ${a}`),
    "",
    "## Company and legal",
    link("About", "/about", "Why RankMonk was built and how the team works with customers."),
    link("Book a demo", "/contact", "Demo request form and phone number."),
    link("Blog", "/blog", "Guides on local SEO, Google Business Profiles, reviews and AI search (posts coming soon)."),
    ...legalDocs.map((d) => link(d.title, `/${d.slug}`, d.description)),
    "",
  ].join("\n");
}

export function GET() {
  return new Response(build(), { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
