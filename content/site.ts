// Page copy and small datasets from the design reference that are shared by
// more than one page (or by llms.txt / structured data).
import type { IconName } from "./icons";

export const platforms = ["Google Search", "Google Maps", "Bing Places", "Apple Maps", "Facebook", "Waze", "ChatGPT", "Gemini", "Google AI Overviews", "20+ directories"];

export const heroWords = ["Google Maps", "Google Search", "ChatGPT", "Gemini", "Apple Maps", "Bing"];

export const howSteps: [string, string, string][] = [
  ["01", "Connect", "Add your Google Business Profiles and locations. We help you set up keywords and competitors."],
  ["02", "Diagnose", "Run geo-grid scans, a profile audit and a competitor check to see where you stand."],
  ["03", "Act", "Work through prioritised fixes, reply to reviews with AI and sync your listings."],
  ["04", "Report", "Track rank, calls and directions over time, and share reports on a schedule."],
];

export const whys: [IconName, string, string][] = [
  ["bldg", "Multi-location from day one", "Bulk tools, groups and branch leaderboards are part of the core product."],
  ["spark", "AI search alongside Maps", "Track ChatGPT and Gemini answers in the same dashboard as your Maps rank."],
  ["shield", "Protection that watches every edit", "Suspension risk scoring and change alerts on the fields that matter most."],
  ["rupee", "Priced in rupees, with a team you can call", "Per-location pricing in ₹ and support on the phone when you need it."],
];

export const homeFaqs: [string, string][] = [
  ["What is RankMonk?", "RankMonk is a local SEO platform for businesses, brands and agencies. It tracks local rankings, audits and protects Google Business Profiles, manages reviews and listings, and shows how you appear in AI search."],
  ["Who is RankMonk for?", "Single-location businesses, multi-location brands and the agencies and consultants who manage them."],
  ["Which platforms does RankMonk cover?", "Google Search and Maps, Bing, Apple Maps and 20+ connected directories, plus AI assistants such as ChatGPT and Gemini."],
  ["How do I get started?", "Book a demo. We will walk through your profiles, show you where you rank and set up your account."],
  ["Where do existing customers log in?", "At dashboard.rankmonk.io. Use the Log in link at the top of any page."],
];

export const featureBands: { kicker: string; title: string; desc: string; mock: "grid" | "audit" | "reviews"; feats: string[] }[] = [
  { kicker: "Track", title: "Know exactly where you stand.", desc: "See your rank on every street, the competitors around you and how AI assistants answer the questions your customers ask.", mock: "grid", feats: ["rank-tracking", "competitors", "ai-visibility"] },
  { kicker: "Protect & fix", title: "Fix what holds your profile back.", desc: "Audit every profile, catch risky edits before they cause a suspension and keep your details right on every directory.", mock: "audit", feats: ["business-audit", "profile-protection", "listings"] },
  { kicker: "Engage & scale", title: "Win customers at every location.", desc: "Reply to every review in your voice, manage hundreds of locations in bulk and report results in calls and visits.", mock: "reviews", feats: ["reviews", "multi-location", "reports"] },
];

export type Plan = { name: string; for: string; price?: number; discount?: number; popular?: boolean; cta: string; items: string[] };

// Final per-location monthly price after the plan's % discount, rounded to whole rupees.
export const finalPrice = (p: Plan) => (p.price === undefined ? undefined : Math.round(p.price * (1 - (p.discount ?? 0) / 100)));

export const plans: Plan[] = [
  { name: "Starter", for: "For single-location businesses", price: 1149, discount: 10, cta: "Book a demo", items: ["Rank tracker: 10 keywords, 5×5 grid, weekly scans", "Business audit & profile score", "AI review replies (100 per month)", "Listings on Google, Bing and Apple Maps", "Basic profile protection alerts", "Monthly performance report"] },
  { name: "Growth", for: "For growing brands and agencies", price: 1699, discount: 10, popular: true, cta: "Book a demo", items: ["Everything in Starter", "30 keywords, grids up to 9×9, daily scans", "Competitor tracker (5 per location)", "Full suspension risk & protection", "Unlimited AI replies + sentiment analysis", "20+ directory sync", "Bulk multi-location tools", "AI search visibility (25 prompts)"] },
  { name: "Enterprise", for: "For 50+ locations", cta: "Talk to sales", items: ["Everything in Growth", "Custom keyword, grid and prompt limits", "Location groups and branch leaderboards", "Custom and scheduled reporting", "Dedicated success manager", "Guided onboarding for every location"] },
];

export const compareRows: [string, string, string, string][] = [
  ["Tracked keywords per location", "10", "30", "Custom"], ["Geo-grid size", "5×5", "Up to 9×9", "Custom"], ["Scan frequency", "Weekly", "Daily", "Custom"],
  ["Business audit & profile score", "✓", "✓", "✓"], ["AI review replies", "100 / month", "Unlimited", "Unlimited"], ["Sentiment analysis", "—", "✓", "✓"],
  ["Competitor tracker", "—", "5 per location", "Custom"], ["Suspension risk & protection", "Basic alerts", "Full", "Full"], ["Listings", "Google, Bing, Apple", "20+ directories", "20+ directories"],
  ["Bulk multi-location tools", "—", "✓", "✓"], ["AI search visibility", "—", "25 prompts", "Custom"], ["Reports", "Monthly", "Scheduled", "Custom"], ["Support", "Email & phone", "Priority", "Dedicated manager"],
];

export const pricingFaqs: [string, string][] = [
  ["Is pricing per location?", "Yes. You pay for each location you manage, so the cost grows with your business."],
  ["Do prices include GST?", "No. All prices are in Indian rupees and exclude 18% GST."],
  ["Can I change plans later?", "Yes. Talk to our team and we will move you to the plan that fits."],
  ["Do you offer pricing for large networks?", "Yes. Enterprise pricing depends on the number of locations. Book a demo for a quote."],
];

export const blogCategories = ["All", "Local SEO", "Google Business Profile", "Reviews", "AI search", "Multi-location"] as const;

// Card styling per category (from the design reference). Used for the category
// chip and as the cover when a post has no image.
export const blogCategoryStyle: Record<string, { tint: string; ink: string; mark: string }> = {
  "Local SEO": { tint: "#FFF1EA", ink: "#E8490F", mark: "7×7" },
  "Google Business Profile": { tint: "#ECFDF3", ink: "#067647", mark: "GBP" },
  Reviews: { tint: "#FFFAEB", ink: "#B54708", mark: "★" },
  "AI search": { tint: "#F2F3F5", ink: "#14151A", mark: "AI" },
  "Multi-location": { tint: "#EEF4FF", ink: "#3538CD", mark: "100" },
};
