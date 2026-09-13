# Brahmanandam Hospital, Sonari — Website

Production frontend for **Brahmanandam Hospital, Multi Specialty Centre, Sonari,
Jamshedpur**, built to the supplied Stitch designs.

**Stack:** React 19 + TypeScript + Vite + React Router 7 + Tailwind CSS 4 +
lucide-react.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Brand tokens

Defined once in [`src/globals.css`](src/globals.css) under `@theme`:

| Token                | Value     | Used for                                                   |
| -------------------- | --------- | ---------------------------------------------------------- |
| `--color-primary`    | `#2F3B80` | Headings, nav, primary buttons, dark sections, footer, stats |
| `--color-secondary`  | `#BE353A` | CTAs, emergency, accents, EKG lines, active states           |
| `--color-tint`       | `#F1F2FB` | Lavender section background (primary at ~5% opacity)         |
| `--color-tint-soft`  | `#F8F9FD` | Near-white section background                                |
| `--color-blush`      | `#FDF3F3` | Very light red surface                                       |

Backgrounds stay predominantly white; the brand colours appear as low-opacity
radial gradients, soft blobs and EKG traces (`.bg-tint-soft-grad`,
`.bg-lavender`, `.bg-primary-deep`, `<BrandBackdrop />`).

Fonts: **Plus Jakarta Sans** (display) and **DM Sans** (body), loaded in
`index.html`.

## Scroll animations

Driven by GSAP ScrollTrigger from
[`src/lib/use-scroll-reveal.ts`](src/lib/use-scroll-reveal.ts), mounted once in
`App`. Add `data-reveal` to any element and it eases in as it enters the
viewport:

```tsx
<article data-reveal style={revealDelay(i)}>…</article>   // fade + rise (default)
<div data-reveal="left">…</div>                            // slide from left  (lg+)
<div data-reveal="right">…</div>                           // slide from right (lg+)
<li data-reveal="zoom">…</li>                              // subtle scale-in
<p data-reveal="fade">…</p>                                // opacity only
<div data-parallax="-55" aria-hidden="true" />              // drifts across its section
```

- Elements are grouped by variant and handed to `ScrollTrigger.batch`, which
  animates whatever crosses the fold together with a 60ms stagger. Batches are
  capped at six: collecting a whole section and staggering it puts the last
  card a second behind the first, which reads as lag rather than rhythm.
- Each tween ends with `clearProps`, so nothing inline is left on the element
  and the cards' hover transforms are not fighting a leftover transform.
- `data-parallax` scrubs a decorative layer against its section. Only
  `aria-hidden` blobs use it.
- A debounced MutationObserver arms nodes added by lazy routes and filtered
  lists, and refreshes ScrollTrigger at most every 400ms.
- **Safe by default:** GSAP loads from its own chunk (~46KB gzipped) after the
  page is interactive, so it costs nothing up front. The hidden state lives
  under `.reveal-ready`, which the hook adds only when it runs and a 2.5s timer
  removes if that chunk never arrives. Without JavaScript -- or with
  `prefers-reduced-motion: reduce`, which returns before GSAP is even fetched
  -- every element renders visible immediately.
- Horizontal offsets apply only from `lg` up, where the shell has side padding
  to absorb them, so narrow screens never gain a horizontal scrollbar.
- The admin passes `false` to the hook: it has no revealed elements, so it does
  not download GSAP at all.

Also included: statistics count up when scrolled into view
([`CountUp`](src/components/ui/CountUp.tsx), reserves the final width so nothing
reflows), EKG lines draw themselves, cards lift on hover, and a back-to-top
button appears past 900px of scroll -- clear of the mobile tab bar.

## Responsive

Verified with no horizontal overflow — before *and* after reveal — at
320, 360, 375, 390, 414, 480, 640, 740 (landscape), 768, 834, 1024, 1180, 1280,
1440, 1536, 1920 and 2560 px. Content is capped at 1284px (the design width) and
centred on larger displays.

## Routes

| Path | Page |
| --- | --- |
| `/` | Homepage |
| `/about` · `/about-us` | About the hospital |
| `/chairmans-message` | Chairman's message |
| `/ceo-message` | CEO message |
| `/leadership` · `/our-directors` | Leadership team |
| `/mission-vision-values` · `/mission-vision-and-values` | Mission, vision & 7 core values |
| `/quality-and-safety` | Quality & safety — 8 focus areas |
| `/doctors` | Doctors directory (search, filter, sort) |
| `/doctors/:slug` | Doctor profile + sticky booking card |
| `/departments` | Departments, centres of excellence + full 20-speciality roster |
| `/departments/:slug` | Department detail |
| `/services` | Clinical services |
| `/facilities` | Hospital facilities |
| `/gallery` | Photo gallery with category filter & lightbox |
| `/patient-services` | Patient services & support facilities |
| `/admission-process` | Admission process |
| `/discharge-process` | Discharge process |
| `/visitor-guidelines` · `/guidelines-for-visitors` | 24 visitor rules |
| `/patient-rights` · `/patient-and-attendant-rights` | Patient & attendant rights |
| `/insurance` · `/tpa-insurance` | TPA & insurance, 17 empanelled partners, cashless process |
| `/faq` | Frequently asked questions (accordion) |
| `/careers` · `/career` | Careers (top-level nav item) |
| `/csr` | Corporate social responsibility |
| `/appointment` | 5-step OPD booking flow |
| `/appointment/confirmation` | Booking confirmation & digital pass |
| `/contact` | Contact, map & inquiry form |
| `/blog` · `/blog/:slug` | Health blog |
| `/privacy-policy` · `/terms` · `/patient-charter` | Legal pages |
| `*` | 404 |

Paths listed with a second slug are the URLs used by the previous hospital site
— both resolve to the same page so existing links and search results keep
working.

Every route is lazy-loaded except the homepage.

## Appointment data flow

Booking state lives in
[`src/lib/appointment-context.tsx`](src/lib/appointment-context.tsx) and is
mirrored to `sessionStorage`, so selections survive step changes and a page
reload:

```
department → doctor → date → time → patientName → mobile → age →
gender → visitCategory → chiefConcern → insurance
```

On submit the flow generates a booking reference (`BH-YYYY-DEPT-NNNNN`) and an
OPD token, then redirects to `/appointment/confirmation`, which renders entirely
from that stored booking — nothing on the confirmation screen is hard-coded.

Deep links are supported: `/appointment?doctor=<slug>` jumps straight to the
date/slot step, `/appointment?department=<slug>` to doctor selection.

## Replacing the mock data with an API

All content is typed, data-driven and isolated in `src/lib/data/`:

| File             | Contents                                                |
| ---------------- | ------------------------------------------------------- |
| `site.ts`        | Hospital name, phone, address, nav, headline statistics  |
| `doctors.ts`     | Full doctor records (profile, schedule, fees, reviews)   |
| `departments.ts` | Departments, capabilities, leads, OPD timings            |
| `content.ts`     | Specialities, facilities, insurance, testimonials, blog  |
| `blog.ts`        | Long-form article bodies                                 |
| `slots.ts`       | OPD sessions, live calendar generation, slot availability |
| `institutional.ts` | Leadership messages, mission/vision/values, patient-care policies, TPA list, CSR, careers, FAQs, 20-speciality roster |
| `gallery.ts`     | Gallery images with categories and captions |

Swap these modules for API calls without touching any component; the exported
types are the contract.

Two form submissions are currently client-side only and marked in code — the
inquiry form (`src/components/home/InquiryForm.tsx`) and the appointment
submit (`src/components/appointment/AppointmentFlow.tsx`). Point them at the
hospital CRM/booking endpoint when it is available.

## Assets

`public/images/` holds doctor portraits, facility photography, blog imagery and
the Sonari location map, extracted from the approved design files.
`public/sitemap.xml`, `public/robots.txt` and `public/_redirects` (SPA fallback
for Netlify-style hosts) ship with the build.

`public/brand/` holds the logo, favicon set, touch icon and manifest icons,
generated by `python scripts/brand-assets.py` from the two files the hospital
supplied in `brand/source/`. The sources are flat ~1 MB PNGs on white; the
script lifts the white out to transparency, trims them, writes each asset at
the size the site renders, and makes a white knock-out of the lockup for the
navy footer. Re-run it if the hospital sends a new logo.

## Deploying

`npm run build` outputs a static `dist/`. Every public route is prerendered to
a real file, so the host needs **no** catch-all rewrite — and must not have one.
A blanket `/(.*)` → `/index.html` would answer every misspelled URL with 200 and
an empty shell, which is exactly what the prerender exists to avoid; unknown
paths must keep returning `404.html`.

Only `/admin` is client-only and therefore needs a rewrite:

- **Vercel** — `vercel.json` is in the repo: it publishes `dist/`, rewrites
  `/admin` and `/admin/:path*` to `/index.html`, marks the admin `noindex`, and
  caches `/assets` and `/fonts` immutably.
- **Netlify** — the generated `dist/_redirects` covers it.
- **Apache** — `RewriteRule ^admin(/.*)?$ /index.html [L]`
- **nginx** — `location /admin { try_files $uri /index.html; }`

The SSR pass builds to `.ssr/`, outside `dist/`, so the server bundle is never
published — set the host's output directory to `dist`.

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the host's
environment variables for the Production environment, or the admin will load
and then report that the CMS is not configured. Both are publishable values
that end up in the client bundle either way, so they need no secret handling.
`VITE_CMS_ENABLED` is optional — the CMS is on unless it is set to `false`.

## Content provenance

Every page of the previous site (`sonari.brahmanandamhospital.in`) was audited
against its `page-sitemap.xml`, `post-sitemap.xml` and the Department mega-menu.
Real published copy was imported verbatim. The following was deliberately **not**
imported because it is unmodified WordPress theme demo data:

| Source page | Why skipped |
| --- | --- |
| `/service/` | Lorem ipsum body, "2Checkout" FAQ, `$29/Mo` pricing plans |
| `/doctors/` | 16 demo names (Melody Wilson, Kamron Halliday, Layla-Mae Lugo…) |
| `/our-directors/` | 8 cards of "Jodie Witt — Designer" / "Lorelai Leigh — Artist" with lorem bios |
| `/about-us/` (partial) | Lorem paragraphs, counters reading `0 Years`, `0+ Patients`, `0%` |
| 4 of 6 blog posts | Lorem bodies, or content the client asked to exclude |

There is **no privacy-policy page on the old site** (returns 404); the
`/privacy-policy`, `/terms` and `/patient-charter` pages here are newly written
for this build and should be reviewed by the hospital before launch.

## Design reference

The build follows the client-approved Stitch design PDFs. Those source files are
kept outside the repository (they are large binaries and are not needed to build
or run the site) — ask the project owner for a copy if you need them.

---

# Blog CMS

Self-hosted CMS on Supabase with an admin dashboard at `/admin`.

## Rendering case: **B — static / build-time**

The public site is a Vite SPA on static hosting, so publishing triggers a
rebuild + deploy and scheduling needs a periodic build. Before this work the
site shipped an empty `<div id="root">` on every route — effectively Case C,
which is unacceptable for a blog. `npm run build` now:

1. `vite build` — client bundle
2. `vite build --ssr` — server bundle
3. `node scripts/prerender.mjs` — renders **every** public route to real HTML
   with head tags and JSON-LD, writes `404.html`, `_redirects` and `sitemap.xml`

Articles are read once at build time and baked into the page. **Nothing fetches
blog content from the browser.**

## The visibility rule — one place

`src/lib/cms/visibility.ts`

```
status IN ('published','scheduled') AND publish_at <= now()
```

Used by the listing, the article page, the sitemap, related-post lookup and the
prerender, and mirrored as an RLS policy in `0001_blog_cms.sql`. **No cron flips
`scheduled` → `published`** — a scheduled post becomes visible because the clock
moved, and the next build picks it up.

## Fonts

DM Sans and Plus Jakarta Sans are served from `public/fonts`, not from
fonts.googleapis.com, which times out on some Indian networks — the page then
rendered in a fallback face and logged a failed request on every load. Run
`node scripts/fonts.mjs` to regenerate `public/fonts` and `src/fonts.css` if the
type stack changes.

## Supabase setup

1. Create a project. Put the **Project URL** and **publishable (anon)** key in
   `.env` as `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`
   (see `.env.example`). The service-role key is never used.
2. SQL Editor → run `supabase/migrations/0001_blog_cms.sql`
   (tables, indexes, `updated_at` trigger, RLS, `blog-images` bucket, seeds).
3. Auth → Providers → enable **Email**, then Auth → Users → **Add user** →
   *Create new user*. Tick **Auto Confirm User**, or the account exists but
   cannot sign in. That email and password are what `/admin/login` expects;
   nothing in this repo creates or stores them.
4. For automatic deploys, run `supabase/migrations/0002_auto_deploy.sql` and add
   the secrets it expects:
   ```sql
   select vault.create_secret('ghp_…', 'github_dispatch_token');
   select vault.create_secret('owner/repo', 'github_repo');
   ```
5. Verify in an incognito window that a `draft` row is not returned by the anon
   API.

## Automatic publishing

`pg_cron` runs every 3 minutes and fires a GitHub `repository_dispatch`
(`cms-publish`) **only** when a post changed or a scheduled post just became
due, tracked in `deploy_state` so it never build-storms.
`.github/workflows/deploy.yml` rebuilds, runs `verify:bundle` + `test:cms`, and
deploys. Publish → live in about 3 minutes.

`VITE_CMS_ENABLED=false` is the instant rollback: the site serves only the
hand-written articles.

## SEO score

`src/lib/cms/seo-score.ts` — deterministic, rule-based, no guessing. Title:
length 50–60 (30), keyword present (25), keyword in the first 30 chars (15),
unique (10), number/power word (10), no stuffing or shouting (10). Description:
length 120–160 (30), keyword (25), CTA (20), specific and active (15),
unique (10). Bands: ≥80 green, ≥50 amber, else red.

Below 80 a **Suggest** panel names each failing rule, explains why it matters,
and offers three rewrites built from the post's own title / excerpt / focus
keyword — via Gemini when `VITE_GEMINI_API_KEY` is set, otherwise from
deterministic templates. Every candidate is re-scored before it is offered.

## Commands

| Command | What it does |
| --- | --- |
| `npm run build` | client + SSR + prerender + sitemap |
| `npm run test:cms` | 26 acceptance tests |
| `npm run verify:bundle` | fails if any credential reached a client file |
| `node scripts/serve-static.mjs 4180` | serve `dist/` exactly as the host will |
