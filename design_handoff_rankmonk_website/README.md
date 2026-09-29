# Handoff: RankMonk marketing website

## Overview
The public marketing website for RankMonk, a local SEO and AI-search visibility platform for local businesses, multi-location brands and agencies (India, priced in INR). It covers the home page, the product and feature pages, the solution and industry pages, pricing, about, contact/book-a-demo, blog index, legal pages and a 404 page. The logged-in product lives at `dashboard.rankmonk.io` and is **not** part of this handoff. The site only links to it.

## About the design files
The files in this bundle are **design references created in HTML**. They are prototypes that show the intended look, copy and behaviour. They are not production code to ship. Recreate them in the target stack. If no stack exists yet, a good fit is **Next.js (App Router) + TypeScript + Tailwind CSS**, with Framer Motion (or the Web Animations API) for motion. The site should be statically generated for SEO, and each route below should be a real URL (the prototype uses `#/` hash routes only because it is a single file).

To view the prototype, open `RankMonk.dc.html` in a browser from a local server (e.g. `npx serve .`). `support.js` is the prototype runtime and is not needed in production.

## Fidelity
**High-fidelity.** Colours, typography, spacing, copy and interactions are final. Recreate them pixel-accurately. The copy is final except where noted under "Open items".

## Files
- `RankMonk.dc.html`: the whole site: header, every route, footer, all copy and data (feature, solution, industry and legal content live in the logic class at the bottom: `F`, `S`, `N`, `LEGAL`, `PH`).
- `ProductDemo.dc.html`: the interactive, self-playing product tour used in the home hero.
- `ProductMock.dc.html`: nine animated dashboard mock-ups, selected by the `kind` prop: `hero | grid | comp | audit | protect | reviews | listings | multi | ai | reports`.
- `support.js`: prototype runtime only.

## Routes
| Route | Content |
|---|---|
| `/` | Home |
| `/features` | Product overview |
| `/features/[slug]` | 9 feature pages: `rank-tracking, competitors, business-audit, profile-protection, reviews, listings, multi-location, ai-visibility, reports` |
| `/solutions/[slug]` | 3 pages: `brands, agencies, local-businesses` |
| `/industries/[slug]` | 10 pages: `healthcare, restaurants, retail, automotive, hospitality, real-estate, education, beauty-wellness, fitness, financial-services` |
| `/pricing` | Plans, comparison table, FAQ |
| `/about` | Company page |
| `/contact` | Book a demo form |
| `/blog` | Blog index (posts to be written by the client) |
| `/privacy`, `/terms`, `/cookies` | Legal pages (full text in `LEGAL`) |
| `*` | 404: "This page is off the map." |

Feature, solution and industry pages are generated from data (the `F`, `S`, `N` arrays). Move these to typed content files (`/content/features.ts` etc.) or a CMS.

## Design tokens

### Colour
| Token | Hex | Use |
|---|---|---|
| ink | `#14151A` | Primary text, dark buttons, dark sections |
| ink-2 | `#3A3D47` | Secondary text on light |
| muted | `#4A4E5A` | Body copy |
| subtle | `#6B6F7B` | Captions, labels |
| faint | `#9A9DA6` | Meta text, placeholders |
| line | `#EEF0F3` | Borders, dividers |
| line-2 | `#E4E5EA` / `#E1E3E8` | Input and pill borders |
| surface | `#FAFAFB` | Alternate section background |
| surface-2 | `#F2F3F5` / `#F6F6F8` | Hover fills, chips |
| brand | `#FF5A1F` | Brand orange: logo, accents, charts |
| brand-strong | `#E8490F` | Orange text and primary CTA background (AA contrast) |
| brand-hover | `#C93D0B` | CTA hover |
| brand-tint | `#FFF1EA` | Icon tiles, soft highlights |
| brand-line | `#FFD9C7` / `#FFD0BA` | Hover borders |
| brand-on-dark | `#FF8A5C` / `#FFB899` | Orange text on dark |
| footer-bg | `#0E0F13` | Footer |
| dark-card | `#16171D` / `#1B1C22`, border `#23252C` / `#2A2C33` | Cards on dark |
| success | `#12B76A`, text `#067647`, tint `#ECFDF3` | Top-3 rank, synced, positive deltas |
| warning | `#F79009`, text `#B54708`, tint `#FFFAEB` | Rank 4–10, medium issues |
| danger | `#F04438`, text `#B42318`, tint `#FEF3F2`, border `#FECDCA` | Rank 11–20, risk alerts |
| neutral-rank | `#98A2B3` | Rank 20+ |
| star | `#F5A524` | Review stars |

Geo-grid colour rule: rank 1–3 success, 4–10 warning, 11–20 danger, 20+ neutral.

### Typography
- **Geist** (400/500/600/700) for all UI and headings. **Geist Mono** (400/500) for step numbers, percentages, and codes. Load from Google Fonts or `next/font`.
- Headings use weight 600 and tight tracking:
  - H1 hero: `clamp(42px, 7vw, 82px)`, line-height 1, letter-spacing −0.045em
  - H1 inner pages: `clamp(38px, 5.6vw, 66–72px)`, line-height 1.02, −0.04em
  - H2 section: `clamp(32px, 4.6vw, 54px)`, line-height 1.05, −0.035em
  - H2 sub-section: `clamp(28px, 3.8vw, 44px)`, line-height 1.08
  - Card titles: 17–23px, −0.02em
- Body: 15–18px, line-height 1.55–1.7. Eyebrows: 14px, weight 600, `#E8490F`.
- Use `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs.

### Layout, radius, shadow
- Content max-width **1240px**, side padding 24px. Section padding `clamp(64px, 8vw, 104px)` vertically.
- Radius: 8–12px for buttons and inputs, 14–16px for small cards, 20–22px for cards, 24–28px for feature panels and the CTA band, 999px for pills.
- Card hover: `translateY(-4px)`, shadow `0 24–30px 48–60px -24–30px rgba(16,24,40,.25–.32)`, border to brand-line. Transition 0.3–0.35s `cubic-bezier(.2,.8,.2,1)`.
- Primary CTA: 50px tall, 12px radius, bg `#E8490F`, white 15px/600, shadow `0 12px 28px -10px rgba(232,73,15,.75)`.

## Global components

### Header (floating, sticky)
- Sticky wrapper with 14px top padding (8px after scrolling >24px). Inner bar: 18px radius, frosted white (`rgba(255,255,255,.55)` → `.86` after scroll), `backdrop-filter: blur(18px) saturate(180%)`. Height 64 → 58px, max-width 1240 → 1100px on scroll, with a stronger shadow. Transitions 0.35–0.45s.
- Left to right: logo (28px orange tile with a 3×3 dot grid, centre dot solid) and "RankMonk" wordmark (18px/700, −0.035em); nav: Product ▾, Solutions ▾, Pricing, Resources ▾; right: "Log in" link to dashboard.rankmonk.io, and a "Book a demo" dark button with an orange arrow tile.
- **Sliding hover indicator:** a single `#F2F3F5` pill behind the nav items moves to the hovered item (left and width animate 0.3s). Chevrons rotate 180° when a menu is open.
- **Mega menus** (open on hover or click; close on mouse-leave of the header). A white panel 10px below the bar, 20px radius, drop animation 0.28s (fade, −6px, scale .98):
  - *Product* (max 1080px): a 3×3 grid of the 9 features (icon tile, name, short line). Hovering a feature updates a dark preview card on the right (feature name, title, 3 capabilities, "Explore feature →"). Footer strip: "Works with Google, Bing, Apple Maps, ChatGPT, Gemini and 20+ directories", "All features →".
  - *Solutions* (max 980px): "By team" with 3 rows of photo thumbnail, name and short line; "By industry" with a 2-column list of 10 industries with 40px thumbnails.
  - *Resources* (max 760px): a featured blog photo card, plus links to Blog, About, Contact and Customer login.
- Below 980px: Book a demo and a hamburger that opens a full dropdown card with every link.

### Footer (dark `#0E0F13`)
- A large closing headline, "Be the name customers find first.", with a "Book a demo →" orange button and a phone button (+91 88717 19169).
- Newsletter card: email input and Subscribe button; shows "✓ You're subscribed." after submit (wire to the real email provider).
- Link columns: brand blurb, Product (9), Solutions (3), Industries (10), Company (Pricing, About, Blog, Book a demo, Log in).
- Bottom row: "© 2026 RankMonk · Gurugram, Haryana 122001, India · legal@rankmonk.io", plus Privacy, Terms and Cookies links.
- A giant faded "RankMonk" wordmark at the very bottom (`clamp(72px, 17.5vw, 260px)`, 700, gradient `#24262E` to transparent, clipped to the text).

### CTA band (above the footer on most pages)
An orange `#FF5A1F` rounded panel (28px radius) with a headline and a "Book a demo" CTA. It is hidden on the contact, legal and 404 pages.

## Screens

### Home `/`
1. **Hero:** an eyebrow pill linking to AI visibility; H1 "Be the first name customers find on {word}", where the word cycles every 2.4s through Google Maps, Google Search, ChatGPT, Gemini, Apple Maps and Bing (blur/slide-in 0.52s); subcopy; "Book a demo" and a secondary CTA. Below it, `ProductDemo` (see the Interactive product demo section below) at max-width 1200px.
2. **Platforms marquee:** "Manage your presence across" followed by an infinite horizontal scroll of the 10 platforms (38s loop).
3. **The platform (feature grid):** the heading and copy sit on the left and right, with "See all features →" linking to /features. A 6-column grid of 9 cards (2 columns below 980px, 1 below 640px):
   - Rank & geo-grid: spans 4 columns × 2 rows. Real map tiles (Esri Light Gray Canvas, zoom 15), a 5×5 grid of rank dots with a pulsing centre, a floating search chip ("dentist near me"), and a dark "Average rank 3.2 ▲ 5.2" badge.
   - Business audit: a score ring that animates from 0 to 78, with 3 issue rows.
   - Suspension risk: a floating red alert card ("Phone number changed · High risk") with a pulsing dot and Review/Revert buttons.
   - AI search visibility (3 columns): a chat bubble with the prompt, an AI answer that highlights "Kinara Dental" with a blinking caret, and result chips.
   - AI review replies (3 columns): a review, then an indented AI reply draft with a caret.
   - Listings: 4 directory rows with ✓/! icons and a looping sync progress bar.
   - Competitors: 4 horizontal share bars that grow in.
   - Multi-location: 4 branch rows with score badges.
   - Reports (full width): calls, directions and clicks with deltas, and a line chart that draws in.
   Each card has a visual area on top and, below it, the title, short line and a round ↗ arrow button, linking to its feature page.
4. **AI search visibility band (dark):** copy on the left, with 3 mini points and a "See AI visibility" button; `ProductMock kind="ai"` on the right.
5. **How it works:** 4 steps: Connect, Diagnose, Act, Report.
6. **Solutions:** 3 photo cards (16:10 photo with a name chip, kicker, title, description, 2 outcomes and "Explore →"). Then **By industry**, a horizontally scrolling, scroll-snapping row of 10 tall photo cards (4:5, `clamp(250px, 24vw, 290px)` wide), each with a search-query chip at the top and the name and short line at the bottom. Round prev/next buttons scroll by ~80% of the row width.
7. **Why RankMonk:** 4 cells in a single bordered grid with 1px gaps.
8. **FAQ:** 5-item accordion; a + icon rotates 45° when open.

### Product overview `/features`
The hero (centred H1 "Nine tools. One view of your local presence.", two CTAs), the same feature grid as the home page, and then 3 alternating bands (Track / Protect & fix / Engage & scale). Each band has a numbered kicker pill, H2, copy, 3 feature link rows (they shift right 4px on hover), and a `ProductMock` (`grid`, `audit`, `reviews`). The mock alternates left and right on wide screens.

### Feature detail `/features/[slug]` (9 pages)
- Breadcrumb; kicker with icon; H1 (the feature `title`); description; Book a demo and See pricing; a large `ProductMock` for the feature's `mock` kind.
- **What you get:** 6 capability cards (number, green check, 17px/600 text; they lift on hover).
- **How it works:** 3 step cards, each with an orange numbered circle and a large faint numeral in the background.
- **Built for every kind of team:** 3 solution photo cards.
- **Common questions:** 2-item accordion.
- **Works well with:** 3 related features.

### Solution and industry detail (3 + 10 pages)
- The same hero pattern as the feature pages.
- A photo on the left (with a floating caption chip) and the challenges on the right (3 numbered cards).
- Industry pages only: a dark "Searches that bring customers" panel with 5 search chips.
- "How RankMonk helps": 4 outcomes and the related feature cards.
- A row of 4 photo cards linking to other industries ("More industries we work with").

### Pricing `/pricing`
- A Monthly/Yearly toggle ("Save 17%"). Plans are priced per location per month:
  - Starter: ₹1,499 monthly / ₹1,249 yearly
  - Growth: ₹2,999 / ₹2,499, marked Most popular, shown as a dark card
  - Enterprise: Custom
- A 13-row comparison table and a 4-item FAQ.
- All prices are shown excluding GST. The client will confirm the final pricing before launch.

### About `/about`
- A hero with two intro paragraphs.
- A staggered 3-photo row (the middle photo is offset 48px down on wide screens).
- "Why we built RankMonk": 3 paragraphs.
- "What RankMonk shows you": 4 linked cards.
- "What we believe": 3 principles.
- "How we work with you": a dark section with 3 cards.
- "Where we help you show up": platform pills.

### Contact `/contact`
- Copy, next steps and contact details on the left; the form on the right.
- Fields: name*, work email*, phone*, company, number of locations (pills: 1 / 2–10 / 11–50 / 51–200 / 200+), and message.
- Validation on submit, then live after the first attempt:
  - name is required
  - email must match `^[^\s@]+@[^\s@]+\.[^\s@]+$`
  - phone must have at least 10 digits
- Errors show a red border and a message below the field. On success the form is replaced by a confirmation that greets the visitor by first name and has a "Send another" reset.
- Wire the form to a CRM or email backend.

### Blog `/blog`
A category filter (All, Local SEO, Google Business Profile, Reviews, AI search, Multi-location) and a grid of post cards (16:9 photo, category chip, "Coming soon", title, dek). The client will write the posts before launch; build this against a CMS or MDX.

### Legal `/privacy`, `/terms`, `/cookies`
- A grey header with breadcrumb, title, intro and "Effective 29 September 2026".
- A sticky left navigation between the three pages, and a contact box (legal@rankmonk.io, +91 88717 19169).
- Numbered sections rendered from `LEGAL`, where each item is either a paragraph (string) or a bullet list (array).
- The Privacy Policy follows India's Digital Personal Data Protection Act, 2023 and includes a Grievance Officer section (Gurugram, Haryana 122001, India). The Terms name the courts at Gurugram, Haryana.
- **All legal text must be reviewed by counsel before launch.**

## Interactive product demo (`ProductDemo.dc.html`)
- A 1200×720 app frame scaled to fit its container: `scale = containerWidth / 1200`, with the container height set to `720 × scale`.
- The frame has browser chrome with a URL that follows the current view, a sidebar with the workspace switcher and 7 nav items, a top bar, a content area, and a "Sample data" badge.
- **The guided tour loops through 5 chapters**, with durations (ms) of 3400, 9800, 8200, 6600 and 6200:
  1. Overview: KPIs, a line chart that draws in, and a checklist you can tick.
  2. Geo-grid: 7×7 rank dots on real map tiles. The tour clicks a point to open a popover with the top 3 results, then turns on "Compare" (30 days ago).
  3. AI replies: the tour clicks "Generate reply"; the text types out 3 characters every 22ms and then posts, with a "Reply posted to Google" toast.
  4. AI visibility: "Run check" shows shimmer placeholders for 1.7s, then the results and animated share-of-voice bars.
  5. Listings: "Sync all" completes rows one by one every 200ms, with an "8 listings synced" toast.
- A fake cursor moves between targets (0.9s `cubic-bezier(.65,0,.35,1)`) and shows a click ripple. A caption pill at the bottom describes each step.
- **Any real pointer-down inside the frame pauses the tour** and hands control to the visitor; every control works manually (keyword pills, grid points, the compare toggle, review list, tone pills, run/sync buttons).
- Under the frame: a play/pause button, 5 chapter buttons with progress bars (the active one fills linearly over the chapter's duration), and a status text.
- In production, build this as one React component with a small step scheduler (async steps with cancellation tokens) and respect `prefers-reduced-motion` by starting paused.

## Dashboard mock-ups (`ProductMock.dc.html`)
These are self-contained animated panels with sample data (a dental clinic in Indiranagar, Bengaluru). Each `kind` renders a different screen: geo-grid (with keyword switcher and a 30-day comparison), competitors, audit score, protection alerts, reviews with a typing AI reply, listings sync, multi-location table, AI visibility, and reports chart. Recreate them as illustrative components, not live data.

## Motion
- **Scroll reveal:** elements with `data-r="n"` fade up 28px over 0.8s `cubic-bezier(.2,.8,.2,1)`, staggered by n × 80ms. Content is visible by default; only elements below the fold get the animation, triggered by IntersectionObserver.
- Looping micro-animations: pulse (1.8s), float (±6px, 2.4s alternate), caret blink (0.9s steps), sync bar (2.8s loop), bar grow (1.4s), ring fill (1.6s), line draw (2s).
- Disable non-essential motion under `prefers-reduced-motion: reduce`.

## Responsive
- Breakpoints: ≥980px shows the desktop nav and the 6-column feature grid; 640–979px uses a 2-column grid; <640px uses 1 column.
- Most grids use `repeat(auto-fit, minmax(…, 1fr))` and flex-wrap, and headings use `clamp()`. There must be no horizontal overflow at 360px.

## Assets
- **Photos:** Unsplash, free to use under the Unsplash License. The URLs are in `PH` and inline in `RankMonk.dc.html` (`images.unsplash.com/photo-<id>`). Replace them with the client's own photos where possible, and self-host them via `next/image`.
- **Map tiles:** Esri World Light Gray Canvas (`server.arcgisonline.com/.../World_Light_Gray_Base/MapServer/tile/15/{y}/{x}`). For production, use a licensed tile provider (Mapbox, MapTiler or Esri with an API key) or a static image, with attribution.
- **Icons:** hand-coded Lucide-style strokes (24px viewBox, stroke 1.8–2). Use `lucide-react`.
- **Logo:** an orange rounded square with a 3×3 white dot grid (the centre dot at full opacity, the others at 55%). Get the final SVG from the client.

## Contact details used
- Phone: +91 88717 19169
- Email: legal@rankmonk.io
- Address: Gurugram, Haryana 122001, India
- Dashboard: https://dashboard.rankmonk.io

## Open items before launch
1. Legal review of the Privacy Policy, Terms and Cookie Policy.
2. The client will confirm final pricing.
3. Blog posts (the client is writing them).
4. Real photos and customer proof (logos, testimonials) to replace stock images.
5. Backends for the demo form and newsletter, analytics, a cookie consent banner (needed for marketing cookies), and per-route SEO metadata and Open Graph images.
