import type { IconName } from "./icons";
import type { MockKind } from "./features";

export type Group = {
  slug: string;
  mock: MockKind;
  icon: IconName;
  name: string;
  short: string;
  kicker: string;
  title: string;
  desc: string;
  pains: [string, string][];
  feats: string[];
  outcomes: string[];
  /** Photo file in /public/images and its alt text. */
  image: string;
  alt: string;
  /** Industries only. */
  search?: string;
  searches?: string[];
};

export const solutions: Group[] = [
  {
    slug: "brands", mock: "multi", icon: "bldg", name: "Multi-location brands", short: "Every branch accurate, protected and ranking", kicker: "For multi-location brands",
    title: "Consistent local visibility across every branch.", desc: "Keep hundreds of profiles accurate, protected and ranking, and see which locations lead and which fall behind.",
    pains: [["Details drift apart", "Hours, phone numbers and categories go out of sync across branches and directories."], ["No branch-level view", "Head office sees totals, not which store lost rank last week."], ["Reviews go unanswered", "Reviews pile up at locations with no one assigned to reply."]],
    feats: ["multi-location", "listings", "reviews", "profile-protection", "reports"],
    outcomes: ["One source of truth for every location", "Branch leaderboards for rank, score and rating", "Reply drafts for every review, at every store", "Alerts before risky edits go live"],
    image: "brands", alt: "Shoppers in a multi-level mall",
  },
  {
    slug: "agencies", mock: "reports", icon: "chart", name: "Agencies & consultants", short: "Serve more clients with the same team", kicker: "For agencies & consultants",
    title: "Deliver local SEO for more clients with the same team.", desc: "Audit a prospect in minutes, run geo-grids for every client and send reports that show calls and visits, not just rankings.",
    pains: [["Manual reporting", "Hours go into screenshots and spreadsheets every month."], ["Hard to prove value", "Clients want calls and visits, not a list of ranks."], ["Too many tools", "Rank tracking, reviews and listings sit in separate apps."]],
    feats: ["rank-tracking", "competitors", "business-audit", "reports", "ai-visibility"],
    outcomes: ["Audits that win new clients in the first meeting", "Geo-grids and competitor views for every account", "Scheduled reports in calls, clicks and directions", "AI visibility as a new service to offer"],
    image: "agencies", alt: "Agency team working on laptops",
  },
  {
    slug: "local-businesses", mock: "reviews", icon: "pin", name: "Local businesses", short: "Get found nearby without being an SEO expert", kicker: "For local businesses",
    title: "Get found by customers nearby, without becoming an SEO expert.", desc: "RankMonk tells you what to fix, drafts your review replies and keeps your details correct, so you can get back to running the business.",
    pains: [["Not sure what to fix", "Advice is everywhere, but which change matters for your business?"], ["No time for reviews", "Replying well to every review takes time you do not have."], ["Competitors show up first", "Newer businesses nearby rank above you on Maps."]],
    feats: ["business-audit", "reviews", "rank-tracking", "listings", "profile-protection"],
    outcomes: ["A clear list of fixes, in order of impact", "Review replies drafted in seconds", "Your details right on Google, Bing and Apple", "Street-level rank so you can see progress"],
    image: "local-businesses", alt: "Owner standing in her coffee shop",
  },
];

export const industries: Group[] = [
  {
    slug: "healthcare", mock: "grid", icon: "pin", name: "Healthcare", short: "Hospitals, clinics and diagnostics", kicker: "Healthcare & clinics", search: "dentist near me",
    title: "Help patients find your clinic when they need it most.", desc: "Hospitals, clinics and diagnostic centres depend on \"near me\" searches. RankMonk keeps doctor and department profiles accurate, protects them from risky edits and helps you reply to patient reviews with care.",
    pains: [["Many profiles per facility", "Departments, doctors and branches each need accurate listings."], ["Sensitive reviews", "Patient feedback needs careful, consistent replies."], ["High-intent searches", "Patients choose from the top results on Maps."]],
    searches: ["dentist near me", "orthopaedic doctor in Pune", "diagnostic centre open now", "24 hour pharmacy", "skin clinic in Indiranagar"],
    feats: ["rank-tracking", "reviews", "profile-protection", "multi-location"],
    outcomes: ["Accurate profiles for every doctor and department", "Careful reply drafts for patient reviews", "Street-level rank around every facility", "Alerts for risky edits to hours or phone"],
    image: "healthcare", alt: "Modern dental clinic with treatment chair",
  },
  {
    slug: "restaurants", mock: "comp", icon: "users", name: "Restaurants & QSR", short: "Outlets, cloud kitchens and cafés", kicker: "Restaurants & QSR", search: "biryani near me",
    title: "Win the \"near me\" search at lunch and dinner.", desc: "Restaurants and quick-service chains live on Maps. Track rank around every outlet, keep hours right on holidays and respond to reviews before they shape your rating.",
    pains: [["Hours change often", "Late nights, holidays and festivals need updates at every outlet."], ["High review volume", "Busy outlets get dozens of reviews a week."], ["Tight competition", "A new outlet two streets away can take your top spot."]],
    searches: ["biryani near me", "pizza delivery Koramangala", "cafe open late", "best burger in Bandra", "family restaurant near me"],
    feats: ["rank-tracking", "competitors", "reviews", "multi-location"],
    outcomes: ["Holiday hours updated at every outlet at once", "Reply drafts that keep up with review volume", "Competitor alerts around each outlet", "Outlet leaderboards for rank and rating"],
    image: "restaurants", alt: "Restaurant dining room with tables",
  },
  {
    slug: "retail", mock: "listings", icon: "list", name: "Retail", short: "Stores, showrooms and franchises", kicker: "Retail", search: "shoe store near me",
    title: "Bring shoppers from search to store.", desc: "Retail brands need every store to show the right address, hours and phone on Google, Apple Maps and Bing. RankMonk keeps listings in sync and shows which stores drive calls and direction requests.",
    pains: [["Store details out of date", "Moved stores and changed numbers linger on directories."], ["No store-level results", "It is hard to tell which stores search is helping."], ["Seasonal hours", "Sale and festival hours must go live everywhere at once."]],
    searches: ["shoe store near me", "electronics store in Andheri", "mobile shop open now", "furniture showroom Whitefield", "saree shop in T Nagar"],
    feats: ["listings", "multi-location", "reports", "business-audit"],
    outcomes: ["Correct store details on 20+ directories", "Calls and direction requests per store", "Seasonal hours pushed in one step", "Profile scores for every store"],
    image: "retail", alt: "Clothing rails in a retail store",
  },
  {
    slug: "automotive", mock: "comp", icon: "pin", name: "Automotive", short: "Dealerships, service centres and showrooms", kicker: "Automotive", search: "car service near me",
    title: "Bring more buyers and service bookings to every showroom.", desc: "Car buyers compare dealers on Maps before they visit, and owners search for a service centre when something goes wrong. RankMonk tracks rank around every showroom and workshop, keeps sales and service details correct, and helps you answer reviews quickly.",
    pains: [["Sales and service in one profile", "Different hours and phone numbers for sales, service and parts get mixed up."], ["Reviews shape the shortlist", "A few slow-service reviews can push buyers to the next dealer."], ["Brand rules across dealers", "Manufacturers need every dealer profile to follow the same standards."]],
    searches: ["car service near me", "Maruti showroom in Pune", "two wheeler service centre", "used car dealer near me", "car wash open now"],
    feats: ["rank-tracking", "reviews", "multi-location", "listings"],
    outcomes: ["Sales and service details kept correct everywhere", "Rank tracked around every showroom and workshop", "Reply drafts for sales and service reviews", "Dealer leaderboards for rank, score and rating"],
    image: "automotive", alt: "Car in a dark showroom",
  },
  {
    slug: "hospitality", mock: "reviews", icon: "bldg", name: "Hotels & hospitality", short: "Hotels, resorts and homestays", kicker: "Hotels & hospitality", search: "hotels near me",
    title: "Turn \"hotels near me\" into direct bookings.", desc: "Travellers check Maps, ratings and photos before they book. RankMonk keeps each property's profile complete, helps you reply to guest reviews in your brand voice and shows whether AI assistants recommend you for the trips guests plan.",
    pains: [["Guest reviews in volume", "Every stay can produce a review, and each one deserves a reply."], ["Photos and amenities drift", "Outdated photos and missing amenities cost bookings."], ["AI trip planning", "Guests ask AI assistants where to stay, and you may not be named."]],
    searches: ["hotels near me", "resort in Coorg", "homestay in Munnar", "business hotel near airport", "hotel with pool in Goa"],
    feats: ["reviews", "business-audit", "ai-visibility", "multi-location"],
    outcomes: ["Reply drafts for every guest review", "Profile checks for photos, amenities and attributes", "AI visibility for the trips guests plan", "One view across every property"],
    image: "hospitality", alt: "Hotel pool at sunset",
  },
  {
    slug: "real-estate", mock: "grid", icon: "pin", name: "Real estate", short: "Developers, brokers and site offices", kicker: "Real estate", search: "flats for sale in Whitefield",
    title: "Get your projects and site offices found first.", desc: "Home buyers search for projects, site offices and brokers by area. RankMonk tracks rank around each project, keeps site office details accurate as projects launch and close, and protects profiles from edits that send buyers to the wrong place.",
    pains: [["Projects open and close", "Site offices move, and old profiles linger with wrong details."], ["Wrong pins and numbers", "A misplaced pin or old phone number sends buyers elsewhere."], ["Area-level competition", "Every new launch in the area competes for the same searches."]],
    searches: ["flats for sale in Whitefield", "2 BHK in Gurgaon", "real estate agent near me", "villa project in Hyderabad", "property dealer near me"],
    feats: ["rank-tracking", "profile-protection", "listings", "competitors"],
    outcomes: ["Rank tracked around every project", "Alerts for edits to pins, phone and address", "Site office details kept accurate on 20+ directories", "Competitor views for each micro-market"],
    image: "real-estate", alt: "Modern house with a pool",
  },
  {
    slug: "education", mock: "ai", icon: "users", name: "Education", short: "Schools, coaching and training centres", kicker: "Education", search: "IELTS coaching near me",
    title: "Help students and parents choose you.", desc: "Parents and students compare schools, coaching centres and institutes on Maps, and now ask AI assistants for recommendations. RankMonk tracks your rank by centre and course, helps you reply to reviews and shows whether you are named in AI answers.",
    pains: [["Many centres, many courses", "Each centre needs accurate hours, courses and contact details."], ["Admission season spikes", "Searches jump in a few months of the year, and rank matters most then."], ["Reviews from parents and students", "Feedback needs careful, consistent replies."]],
    searches: ["IELTS coaching near me", "CBSE school in Noida", "NEET coaching in Kota", "coding classes for kids", "best MBA college in Pune"],
    feats: ["rank-tracking", "ai-visibility", "reviews", "multi-location"],
    outcomes: ["Rank tracked for every centre and course keyword", "AI visibility for \"best coaching\" prompts", "Reply drafts for parent and student reviews", "Centre leaderboards across cities"],
    image: "education", alt: "Classroom with desks",
  },
  {
    slug: "beauty-wellness", mock: "reviews", icon: "spark", name: "Salons & wellness", short: "Salons, spas and wellness centres", kicker: "Salons & wellness", search: "salon near me",
    title: "Fill more chairs from \"near me\" searches.", desc: "Salons, spas and wellness centres win customers from Maps, often on the same day. RankMonk tracks rank around each outlet, keeps services and hours correct, and helps you reply to every review so your rating keeps working for you.",
    pains: [["Same-day decisions", "Customers pick from the top few results and book right away."], ["Services and prices change", "Menus and offers go out of date on listings."], ["Reviews drive bookings", "A small drop in rating shows up quickly in footfall."]],
    searches: ["salon near me", "spa in Bandra", "bridal makeup artist", "unisex salon open now", "hair spa near me"],
    feats: ["rank-tracking", "reviews", "business-audit", "listings"],
    outcomes: ["Street-level rank around every outlet", "Reply drafts for every review", "Profile checks for services, photos and hours", "Correct details on 20+ directories"],
    image: "beauty-wellness", alt: "Salon with styling chairs",
  },
  {
    slug: "fitness", mock: "grid", icon: "users", name: "Gyms & fitness", short: "Gyms, studios and sports clubs", kicker: "Gyms & fitness", search: "gym near me",
    title: "Be the gym people find when they decide to start.", desc: "People choose a gym, yoga studio or sports club close to home or work. RankMonk shows where you rank across the neighbourhood, compares you with nearby clubs and keeps timings and trial offers accurate.",
    pains: [["Hyper-local choice", "Members rarely travel far, so a few streets decide who wins."], ["Early and late timings", "Opening hours change for holidays and batches."], ["Crowded neighbourhoods", "New studios open close by and compete for the same searches."]],
    searches: ["gym near me", "yoga classes in HSR Layout", "crossfit box in Mumbai", "swimming pool near me", "24 hour gym"],
    feats: ["rank-tracking", "competitors", "reviews", "listings"],
    outcomes: ["Rank tracked across every neighbourhood you serve", "Competitor alerts when a new club opens nearby", "Reply drafts for member reviews", "Timings kept correct everywhere"],
    image: "fitness", alt: "Gym with dumbbell racks",
  },
  {
    slug: "financial-services", mock: "multi", icon: "rupee", name: "Banks & financial services", short: "Branches, NBFCs and insurance offices", kicker: "Banks & financial services", search: "bank branch near me",
    title: "Keep every branch and ATM accurate and protected.", desc: "Customers search for branches, ATMs and advisors nearby, and wrong details damage trust. RankMonk keeps branch listings accurate at scale, watches for risky edits to phone numbers and addresses, and reports on calls and direction requests by branch.",
    pains: [["Thousands of listings", "Branches, ATMs and advisors each need correct details."], ["Fraud risk from edits", "A changed phone number can send customers to scammers."], ["Care with replies", "Review replies must follow approved language."]],
    searches: ["bank branch near me", "ATM open now", "home loan office", "insurance agent near me", "gold loan near me"],
    feats: ["multi-location", "profile-protection", "listings", "reports"],
    outcomes: ["Branch and ATM details kept consistent", "Alerts for edits to phone numbers and addresses", "Reply templates your compliance team approves", "Calls and directions reported by branch"],
    image: "financial-services", alt: "Financial documents and a calculator",
  },
];

export const solutionHref = (slug: string) => `/solutions/${slug}`;
export const industryHref = (slug: string) => `/industries/${slug}`;
export const imageSrc = (name: string) => `/images/${name}.jpg`;
