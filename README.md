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

Driven by one IntersectionObserver in
[`src/lib/use-scroll-reveal.ts`](src/lib/use-scroll-reveal.ts), mounted once in
`App`. Add `data-reveal` to any element and it fades/slides in as it enters the
viewport:

```tsx
<article data-reveal style={revealDelay(i)}>…</article>   // fade + rise (default)
<div data-reveal="left">…</div>                            // slide from left  (lg+)
<div data-reveal="right">…</div>                           // slide from right (lg+)
<li data-reveal="zoom">…</li>                              // subtle scale-in
<p data-reveal="fade">…</p>                                // opacity only
```

- `revealDelay(i, step?, max?)` staggers a grid; the delay is capped so long
  lists never feel slow.
- Elements are observed once, then unobserved — no scroll listeners, no layout
  thrash. A debounced MutationObserver catches nodes added by lazy routes and
  filtered lists.
- **Safe by default:** the hidden state lives under `.reveal-ready`, a class the
  hook adds only after it runs. Without JavaScript — or with
  `prefers-reduced-motion: reduce` — every element renders visible immediately.
- Horizontal offsets apply only from `lg` up, where the shell has side padding
  to absorb them, so narrow screens never gain a horizontal scrollbar.

Also included: statistics count up when scrolled into view
([`CountUp`](src/components/ui/CountUp.tsx), reserves the final width so nothing
reflows), EKG lines draw themselves, cards lift on hover, decorative blobs drift
slowly, and a back-to-top button appears past 900px of scroll — clear of the
mobile tab bar.

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

## Deploying

`npm run build` outputs a static `dist/`. Because this is a single-page app,
configure the host to rewrite all unknown paths to `/index.html`:

- **Netlify** — `public/_redirects` is already included.
- **Vercel** — add a rewrite of `/(.*)` → `/index.html`.
- **Apache** — `FallbackResource /index.html`.
- **nginx** — `try_files $uri $uri/ /index.html;`

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
