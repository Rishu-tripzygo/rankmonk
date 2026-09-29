# RankMonk website

Marketing website for [RankMonk](https://rankmonk.io), a local SEO and AI search visibility platform for local businesses, multi-location brands and agencies in India. The logged-in product lives at `dashboard.rankmonk.io`; this site only links to it.

The design source of truth is the handoff in [`design_handoff_rankmonk_website/`](design_handoff_rankmonk_website/README.md) (HTML prototypes). This project is a production rebuild of that prototype. Copy, colours, spacing, motion and interactions follow it.

## Tech stack

- **Next.js 16** (App Router, React Server Components, static generation) + **React 19** + **TypeScript**
- Plain CSS with design tokens (`app/globals.css`) plus inline styles. No UI or CSS framework.
- `next/font` (Geist, Geist Mono), `next/image` (self-hosted photos in `public/images`)
- Route handlers for the two backend needs (demo form, newsletter). Submissions are appended to a Google Sheet through a Google Apps Script web app (`integrations/google-sheets/Code.gs`).
- No database. Nothing on the site needs one.

The only runtime dependencies are `next`, `react` and `react-dom`.

### Why no Express server?

The site's backend is two small form endpoints. Next.js route handlers run as Vercel serverless functions. They cover validation, rate limiting and saving to Google Sheets with no extra infrastructure. A persistent Express server doesn't fit Vercel's model, and wrapping one inside a function would add a dependency and a second routing layer for no benefit. If a real API is needed later (for example a shared backend with the dashboard), it should be its own service.

## Project structure

```
app/                  Routes (App Router)
  page.tsx            Home
  features/           /features and /features/[slug] (9 pages)
  solutions/[slug]/   3 pages      industries/[slug]/  10 pages
  pricing/ about/ contact/ blog/ privacy/ terms/ cookies/
  api/contact/        POST: demo request → Google Sheet tab "Demo requests"
  api/newsletter/     POST: newsletter signup → Google Sheet tab "Newsletter"
  sitemap.ts robots.ts manifest.ts llms.txt/ og.png/ icon.svg apple-icon.tsx
  not-found.tsx error.tsx global-error.tsx
components/           UI (Header, Footer, FeatureGrid, ProductDemo, ProductMock, …)
content/              Typed page content from the design reference (features, groups, legal, site)
config/site.ts        All environment-driven configuration, validated at build time
lib/                  SEO/JSON-LD helpers, validation, Google Sheets, rate limit, analytics
integrations/         Apps Script to paste into the Google Sheet
public/images, tiles  Photos (Unsplash) and map tiles (Esri), self-hosted
```

Content lives in `content/*.ts`. To add a feature, solution or industry, add an entry there. The page, navigation, footer, sitemap and `llms.txt` all update from it.

## Local development

Requires Node.js 20.9+ (tested on Node 24) and npm.

```bash
npm install
cp .env.example .env.local   # optional: fill in what you need
npm run dev                  # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (static generation of all pages) |
| `npm start` | Serve the production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint (next/core-web-vitals + TypeScript) |
| `npm test` | Unit checks for validation and rate limiting (Node test runner) |
| `npm run check` | All of the above plus a build |

## Environment variables

Every variable is documented in [`.env.example`](.env.example). The final SEO copy (title, description, keywords, OG image) is also the built-in default, so the site is correct even if those aren't set. The forms need the two Google Sheets variables. `config/site.ts` validates URLs and fails the build on malformed values.

| Group | Variables | Notes |
|---|---|---|
| Site | `SITE_URL`, `SITE_NAME`, `SITE_DESCRIPTION`, `SITE_LOCALE`, `SITE_LANGUAGE`, `DASHBOARD_URL` | `SITE_URL` is the canonical origin for every URL the site emits |
| SEO | `DEFAULT_TITLE`, `DEFAULT_DESCRIPTION`, `DEFAULT_KEYWORDS`, `OG_IMAGE`, `ROBOTS_INDEX`, `ROBOTS_FOLLOW` | `OG_IMAGE` is also used for X/Twitter previews. Preview deployments are always `noindex` |
| Google | `GA4_MEASUREMENT_ID`, `GOOGLE_SEARCH_CONSOLE_VERIFICATION` | Public by nature (rendered into HTML) |
| Public contact | `PUBLIC_EMAIL`, `PUBLIC_PHONE` | Shown in header, footer, legal pages and schema |
| Google Sheets (secret) | `GOOGLE_SHEETS_WEBHOOK_URL`, `GOOGLE_SHEETS_SECRET` | Server-only; never sent to the browser |
| Social | `LINKEDIN_URL`, `INSTAGRAM_URL`, `FACEBOOK_URL` | Used only in Organization `sameAs` |

No `NEXT_PUBLIC_` variables are needed. Server components read the config and pass the GA4 ID down as a prop. Pages are static, so **changing a variable needs a redeploy**.

## Deployment (Vercel)

1. Import `https://github.com/Rishu-tripzygo/rankmonk` in Vercel. The framework (Next.js), build command (`next build`) and output are detected automatically. No `vercel.json` is needed.
2. Add the environment variables for **Production**: at minimum `SITE_URL`, `GA4_MEASUREMENT_ID`, `GOOGLE_SEARCH_CONSOLE_VERIFICATION`, `GOOGLE_SHEETS_WEBHOOK_URL` and `GOOGLE_SHEETS_SECRET`. The easiest way is to copy them from your local `.env` (Vercel → Settings → Environment Variables → paste `.env` contents). Preview deployments are forced to `noindex`.
3. Deploy. All pages are prerendered. Only `/api/contact` and `/api/newsletter` run as functions (Node.js runtime).

### Domain setup for rankmonk.io

1. Vercel → Project → Settings → Domains → add `rankmonk.io` and `www.rankmonk.io`.
2. Set `rankmonk.io` as the primary domain and let `www.rankmonk.io` **redirect (308)** to it. `next.config.ts` also redirects `www` → apex as a fallback.
3. At the DNS provider: `A` record for `@` → `76.76.21.21`, and `CNAME` for `www` → `cname.vercel-dns.com` (or use the values Vercel shows).
4. HTTPS certificates are issued automatically. `http://` is redirected to `https://` by Vercel.
5. Keep `SITE_URL=https://rankmonk.io` (lowercase, no trailing slash) so canonicals match the primary domain.

## Google Search Console

1. In Search Console add a **URL-prefix** property for `https://rankmonk.io`. Alternatively, use a Domain property verified by DNS TXT, which needs no code.
2. Choose **HTML tag**. Google shows `<meta name="google-site-verification" content="ABC123…">`.
3. Copy only the `content` value into `GOOGLE_SEARCH_CONSOLE_VERIFICATION` in Vercel (Production) and redeploy. The tag is emitted by the root layout's metadata (`app/layout.tsx`).
4. Verify, then submit `https://rankmonk.io/sitemap.xml` under **Sitemaps**.

## Google Analytics 4

Set `GA4_MEASUREMENT_ID=G-XXXXXXXXXX` and redeploy. `components/Analytics.tsx` loads gtag.js after hydration (`next/script`, `afterInteractive`), so it never blocks rendering or causes hydration mismatches.

- **Page views**: GA4 enhanced measurement (on by default) records client-side navigations via history changes.
- **Consent mode**: `analytics_storage` granted; `ad_storage`, `ad_user_data`, `ad_personalization` denied. No advertising cookies are set, which matches the Cookie Policy. Add a consent banner before enabling any marketing tags.
- **Events** (no personal data is ever sent: no names, emails or phone numbers):

| Event | When | Parameters |
|---|---|---|
| `cta_click` | Any link with `data-cta` (Book a demo buttons, pricing CTAs, …) | `cta_id`, `link_url` |
| `click_to_call` / `click_to_email` | `tel:` / `mailto:` links | `link_location` |
| `outbound_click` | Links to other hosts (e.g. dashboard login) | `link_domain`, `link_url` |
| `generate_lead` | Demo form submitted successfully | `form_id`, `locations` (bucket) |
| `sign_up` | Newsletter subscription | `method`, `form_location` |

Mark `generate_lead` (and optionally `sign_up`) as **key events** in GA4 Admin to use them as conversions.

## UTM and attribution

URLs are never rewritten, so UTM parameters stay in the address bar and GA4 reads them natively. In addition, the first UTM-tagged landing (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`) is stored first-party in `localStorage` (`rm_attribution`, 90-day expiry, first touch wins). When someone books a demo, those values and the landing page are included in the lead email. If storage is blocked, attribution is skipped without affecting the form.

## SEO, sitemap, robots and AI discovery

- **Metadata**: every page has a unique title (`Page · RankMonk`), description, keywords, self-referencing canonical on `SITE_URL`, Open Graph and Twitter cards, and robots directives (`lib/seo.ts`). The 404 page is `noindex`.
- **Structured data (JSON-LD)**: Organization and WebSite on every page. WebPage, AboutPage, ContactPage or CollectionPage as appropriate. BreadcrumbList on detail and legal pages. FAQPage wherever FAQs are visible (home, pricing, features). SoftwareApplication with INR Offers on pricing, matching the visible prices. No ratings or reviews are marked up, because none exist.
- **Sitemap** (`/sitemap.xml`): built at build time. Static pages are discovered by scanning `app/` for `page.tsx`, so add or remove a folder and the sitemap follows. It skips `api`, dynamic, private (`_x`) and file routes, plus any page whose source contains `index: false`. Feature, solution and industry pages come from `content/`. Legal pages carry `lastModified` = effective date.
- **Robots** (`/robots.txt`): allows all crawlers, including AI crawlers, and disallows `/api/`. It references the sitemap and sets the canonical host. With `ROBOTS_INDEX=false` or on a Vercel preview, it disallows everything and the sitemap is empty.
- **`/llms.txt`**: a plain-text summary for AI assistants, generated from the same content files, so it cannot drift from the site. It covers products, pricing, solutions, industries, FAQs, contact and legal links.
- **Crawlability**: all content, including FAQ answers (native `<details>`) and navigation, is in the server-rendered HTML. The product demo and mocks are illustrative extras.
- **URLs**: no trailing slashes (`/pricing/` → 308 `/pricing`). `/solutions` and `/industries` redirect (307) to their first page. Unknown URLs return a real 404.

## Google Sheets setup (demo form and newsletter)

Submissions are saved to one Google Sheet: demo requests in a **Demo requests** tab (Submitted at, Name, Work email, Phone, Company, Locations, Message, UTM fields, Landing page) and newsletter emails in a **Newsletter** tab (Submitted at, Email, Source; duplicates are skipped). Tabs and header rows are created automatically on the first submission.

1. Create a Google Sheet (e.g. "RankMonk website leads") in the Google account that should own the data.
2. In the sheet: **Extensions → Apps Script**. Delete the sample code and paste the contents of [`integrations/google-sheets/Code.gs`](integrations/google-sheets/Code.gs). Save.
3. **Project Settings (gear icon) → Script properties → Add property**: name `SECRET`, value = the same long random string you put in `GOOGLE_SHEETS_SECRET` (a local `.env` already contains a generated one).
4. **Deploy → New deployment → Select type: Web app**. Description "website", **Execute as: Me**, **Who has access: Anyone**. Deploy and authorise the permissions prompt (Advanced → Go to project → Allow).
5. Copy the **Web app URL** (ends in `/exec`) into `GOOGLE_SHEETS_WEBHOOK_URL`, in Vercel and your local `.env`. Redeploy the site.
6. Submit the demo form once on the live site and check that a row appears.

"Anyone" access is required so the website's server can call the script. Requests without the matching secret are rejected, and values starting with `=`, `+`, `-` or `@` are stored as plain text to prevent formula injection. If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version**, which keeps the same URL.

Until both variables are set, the forms show a clear error with the phone number instead of pretending to succeed.

## Backend and API security

`POST /api/contact` and `POST /api/newsletter`:

- JSON only, 16 KB body limit, `Origin` must match the site (blocks cross-site posts)
- Shared validation with the browser form (`lib/validation.ts`), server-side sanitisation (control characters stripped, lengths capped), HTML-escaped email bodies
- Honeypot field for bots (bot submissions are dropped, never written to the sheet), and a per-IP rate limit of 5 requests per 10 minutes. The limiter is in-memory per function instance; move it to Vercel KV or Upstash if abuse appears.
- Generic error messages only: no stack traces or provider details in responses. Failures are logged server-side (Vercel function logs).
- The Apps Script URL and secret stay on the server; the browser only talks to `/api/*`.
- Responses are `no-store` and `noindex`

Site-wide headers (`next.config.ts`): CSP in production, HSTS, `X-Frame-Options: SAMEORIGIN`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` and `COOP`, with `X-Powered-By` removed.

## GitHub workflow

- `main` is the production branch; Vercel deploys it automatically and builds a preview for every other branch or PR.
- Work on a feature branch, run `npm run check`, open a PR, review the Vercel preview, then merge.
- Never commit `.env*` files (they are git-ignored); use Vercel environment variables.

## Assets and licensing

- **Photos**: Unsplash (Unsplash License), downloaded from the design reference and self-hosted in `public/images`. Replace them with the client's own photos by dropping in files with the same names.
- **Map tiles**: Esri World Light Gray Canvas, self-hosted in `public/tiles` with "Tiles © Esri" attribution. **Before launch, confirm the licence with Esri** or replace the tiles with a licensed provider or static image, as the handoff recommends.
- **Logo**: rebuilt from the reference (orange tile, 3×3 dots) as `app/icon.svg`. Swap in the client's final SVG when available.

## Open items before launch (from the design handoff)

1. Legal review of the Privacy Policy, Terms and Cookie Policy (`content/legal.ts`).
2. Client confirmation of final pricing (`content/site.ts` → `plans`, `compareRows`).
3. Blog posts: cards currently say "Coming soon". Build post pages when content exists; the sitemap picks them up.
4. Real photos, customer logos and testimonials. None are shown because none were supplied, and none were invented.
5. Map tile licence (see above).
6. Production values in Vercel: Google Sheets URL and secret (GA4 and Search Console values are ready in `.env`).
7. The legal pages name `legal@rankmonk.io` as the legal/grievance contact while the site's public email is `info@rankmonk.io`. Confirm both mailboxes exist.

## Troubleshooting

- **Form says "We couldn't send your request"**: `GOOGLE_SHEETS_WEBHOOK_URL`/`GOOGLE_SHEETS_SECRET` are missing, the secret doesn't match the `SECRET` script property (log shows `unauthorized`), or the Apps Script deployment isn't set to "Anyone". Check the Vercel function logs.
- **Canonical/OG URLs show the wrong domain**: set `SITE_URL` and redeploy (values are baked in at build time).
- **Site not indexed**: check `ROBOTS_INDEX` isn't `false`, and that you're not on a preview URL (always `noindex`).
- **GA4 shows no data**: confirm `GA4_MEASUREMENT_ID` is set for Production and redeployed. Ad blockers also block gtag.
- **Build fails with "Invalid SITE_URL"**: the value must be an absolute `https://` URL.
