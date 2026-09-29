import type { IconName } from "./icons";

export type MockKind = "hero" | "grid" | "comp" | "audit" | "protect" | "reviews" | "listings" | "multi" | "ai" | "reports";

export type Feature = {
  slug: string;
  icon: IconName;
  mock: MockKind;
  name: string;
  short: string;
  title: string;
  desc: string;
  caps: string[];
  steps: [string, string][];
  faqs: [string, string][];
};

export const features: Feature[] = [
  {
    slug: "rank-tracking", icon: "pin", mock: "grid", name: "Rank & geo-grid tracker", short: "Your Maps rank, street by street",
    title: "See where you rank on every street around you.",
    desc: "Pick your keywords, set a radius, and RankMonk scans a grid of points around each location. You see the streets where you appear in the top three and the ones where a competitor gets the call.",
    caps: ["Geo-grid scans at a radius you choose", "Keyword position history for every location", "Average rank and top-3 coverage at a glance", "Scheduled scans, so trends build on their own", "Before-and-after grids for every change", "Google Search and Google Maps positions"],
    steps: [["Add keywords", "Choose the searches customers use, like \"dentist near me\" or \"biryani in Koramangala\"."], ["Scan the grid", "RankMonk checks your position from every point on the map around your location."], ["Act on the gaps", "Red and amber points show where to push with categories, reviews and content."]],
    faqs: [["How is a geo-grid different from a normal rank check?", "A normal check shows one position from one spot. A geo-grid checks many points around your business, so you see how rank changes as the searcher moves."], ["Can I track every location in one place?", "Yes. Each location keeps its own keywords and grids, and you can compare them side by side."]],
  },
  {
    slug: "competitors", icon: "users", mock: "comp", name: "Competitor tracker", short: "Know who outranks you, and why",
    title: "Know who takes your customers, keyword by keyword.",
    desc: "RankMonk lines up the businesses that rank around you and compares their positions, ratings, review counts and profile signals with yours, so you know what to fix first.",
    caps: ["Competitors found from your own keywords", "Rank, rating and review count side by side", "Top-3 coverage on the same geo-grid", "Alerts when a competitor overtakes you", "Category and profile comparisons", "History that shows who is gaining ground"],
    steps: [["Pick a keyword", "Start from the searches that bring you business."], ["See the field", "RankMonk lists who ranks around you and how strong each profile is."], ["Close the gap", "Compare signals one by one and act where the difference is biggest."]],
    faqs: [["Do I have to add competitors by hand?", "No. RankMonk suggests the businesses that rank for your keywords, and you can add or remove any of them."], ["Can I track competitors for every location?", "Yes. Each location has its own set of local competitors."]],
  },
  {
    slug: "business-audit", icon: "audit", mock: "audit", name: "Business audit & profile score", short: "One score for profile health",
    title: "Find what holds your profile back, in one score.",
    desc: "The audit checks your Google Business Profile against the signals that affect local rank: categories, hours, photos, services, descriptions, Q&A and more. Every issue comes with a clear fix.",
    caps: ["Profile completion score out of 100", "Issues ranked by impact on visibility", "Plain-language fixes for each issue", "Checks on categories, hours, photos and services", "Re-audit to confirm progress", "Scores for every location in one view"],
    steps: [["Run the audit", "Connect a profile and get a score in minutes."], ["Review the issues", "Each finding explains why it matters and how to fix it."], ["Track the score", "Watch the score rise as you complete fixes."]],
    faqs: [["What does the profile score measure?", "How complete and well optimised your profile is, based on the fields and signals that matter for local results."], ["How often should I run an audit?", "Monthly is a good rhythm, and again after any big change to the profile."]],
  },
  {
    slug: "profile-protection", icon: "shield", mock: "protect", name: "Suspension risk & protection", short: "Catch risky edits before they cost you",
    title: "Protect your profile from edits you did not make.",
    desc: "Anyone can suggest changes to a Google Business Profile, and some changes lead to suspensions. RankMonk watches your name, address, phone, hours, category and map pin, flags risky edits and scores your suspension risk.",
    caps: ["Suspension risk score for every profile", "Alerts for edits to name, phone and address", "Watch on hours, categories and map pin", "Change history for every field", "Alerts for deleted and edited reviews", "Guidance to reduce risk factors"],
    steps: [["Connect profiles", "RankMonk records the current state of every field."], ["Watch for changes", "Any edit, suggested or live, is logged and checked."], ["Respond fast", "Risky changes are flagged so you can review them right away."]],
    faqs: [["What can cause a suspension?", "Common triggers include keyword-stuffed names, address problems, sudden category changes and edits suggested by other users."], ["Will RankMonk change my profile on its own?", "It flags changes and shows you what happened. You decide what to accept or revert."]],
  },
  {
    slug: "reviews", icon: "msg", mock: "reviews", name: "AI review replies & sentiment", short: "Reply faster, learn what customers say",
    title: "Reply to every review in your voice, in seconds.",
    desc: "RankMonk drafts a reply to each review from what the customer wrote, in the tone you choose. Sentiment analysis groups feedback by topic, so you can see what people love and what needs work.",
    caps: ["AI reply drafts for every new review", "Tone presets: warm, professional or short", "Auto-reply rules by star rating", "Sentiment by topic across all reviews", "Alerts for new negative reviews", "Every location in one review inbox"],
    steps: [["Collect reviews", "New reviews from every location land in one inbox."], ["Draft replies", "AI writes a reply that answers what the customer said."], ["Learn from feedback", "Sentiment by topic shows what to keep and what to fix."]],
    faqs: [["Can I edit a reply before it posts?", "Yes. You can review every draft, or set rules to auto-reply to certain ratings."], ["Does sentiment work across locations?", "Yes. View topics for one location or compare them across the whole brand."]],
  },
  {
    slug: "listings", icon: "list", mock: "listings", name: "Listings on 20+ directories", short: "Accurate everywhere customers look",
    title: "Keep your details right on Google, Bing, Apple and 20+ directories.",
    desc: "Update your name, address, phone, hours and categories once. RankMonk keeps them consistent on Google, Bing, Apple Maps and the directories linked to them, and flags any mismatch.",
    caps: ["Google Business Profile, Bing Places and Apple Maps", "Sync to 20+ connected directories", "Consistency score for your core details", "Holiday hours pushed everywhere at once", "Mismatch and duplicate alerts", "Create and verify new listings"],
    steps: [["Set your details", "Enter the correct details once, for each location."], ["Sync everywhere", "RankMonk pushes them to connected directories."], ["Stay consistent", "Mismatches and duplicates are flagged for you to fix."]],
    faqs: [["Which directories are included?", "Google, Bing, Apple Maps, Facebook, Waze and other directories that draw on Google Business Profiles and Bing Places."], ["Can you help create a new listing?", "Yes. You can create and verify new profiles from the dashboard."]],
  },
  {
    slug: "multi-location", icon: "bldg", mock: "multi", name: "Bulk multi-location management", short: "Run 5 or 500 locations from one place",
    title: "Manage every location from one dashboard.",
    desc: "Update hours, descriptions and details for hundreds of locations in one action. Compare rankings, scores and reviews across branches and spot the ones that need attention.",
    caps: ["Bulk edits to hours, descriptions and details", "Location groups by city, region or brand", "Leaderboards across branches", "Filters by score, rank or rating", "Brand-level and location-level reports", "One login for every brand you manage"],
    steps: [["Import locations", "Bring in every profile you manage."], ["Group and compare", "Sort by city or region and see which branches lead."], ["Update in bulk", "Change hours or details for many locations in one step."]],
    faqs: [["Is there a limit on locations?", "No fixed limit. Pricing is per location, and Enterprise plans cover large networks."], ["Can I group locations?", "Yes. Group by city, region, brand or any label you choose."]],
  },
  {
    slug: "ai-visibility", icon: "spark", mock: "ai", name: "AI search visibility", short: "Show up in ChatGPT and Gemini answers",
    title: "See whether AI assistants recommend you.",
    desc: "Customers now ask ChatGPT, Gemini and Google's AI Overviews for recommendations. RankMonk tracks the prompts that matter to your business and shows whether you are mentioned, where you appear and who is recommended instead.",
    caps: ["Prompt tracking across ChatGPT, Gemini and AI Overviews", "Mention rate and position for each prompt", "Share of voice against competitors", "How AI describes your business", "The sources AI assistants cite", "Trends over time for every location"],
    steps: [["Choose prompts", "Add the questions customers ask, like \"best clinic for kids near me\"."], ["Track answers", "RankMonk checks how each assistant answers, over time."], ["Improve your odds", "See which sources and signals help you get named."]],
    faqs: [["Why does AI visibility matter for local businesses?", "More people ask AI assistants for recommendations. If you are not named in the answer, you may not be considered at all."], ["Which assistants are tracked?", "ChatGPT, Gemini and Google AI Overviews."]],
  },
  {
    slug: "reports", icon: "chart", mock: "reports", name: "Reports & analytics", short: "Calls, clicks and directions in one report",
    title: "Show results in calls, clicks and visits.",
    desc: "RankMonk turns profile insights into reports your team and clients understand: searches, views, calls, direction requests and website clicks, with rank and review trends alongside.",
    caps: ["Calls, directions and website clicks per location", "Search and Maps views over time", "Rank and review trends in the same report", "Scheduled PDF reports by email", "Brand and location comparisons", "CSV export of every metric"],
    steps: [["Pick metrics", "Choose what matters to your team or client."], ["Schedule", "Set weekly or monthly delivery by email."], ["Share results", "Send clear PDFs that show real customer actions."]],
    faqs: [["Can I send reports to clients automatically?", "Yes. Schedule reports weekly or monthly and they go out by email."], ["Can I export the data?", "Yes. Every metric exports to CSV."]],
  },
];

export const featureHref = (slug: string) => `/features/${slug}`;

export function getFeature(slug: string): Feature {
  const f = features.find((x) => x.slug === slug);
  if (!f) throw new Error(`Unknown feature: ${slug}`);
  return f;
}

/** First sentence of the description, used as a one-line lead. */
export const featureLead = (f: Feature) => f.desc.split(". ")[0] + ".";
