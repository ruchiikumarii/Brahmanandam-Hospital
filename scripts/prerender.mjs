/**
 * Build-time prerender (Case B).
 *
 * Renders every public route to a static HTML file with real <head> tags and
 * JSON-LD baked in, so crawlers never see an empty shell. Blog posts are read
 * ONCE here — through the shared visibility rule — and serialised into each
 * page, so the browser never fetches article content.
 *
 * Run automatically by `npm run build`:
 *   vite build            -> client bundle
 *   vite build --ssr      -> server bundle
 *   node scripts/prerender.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ORIGIN = "https://sonari.brahmanandamhospital.in";

/* ------------------------------------------------------------- load bundle */

// pathToFileURL keeps this working on Windows, where a bare "d:\..." path is
// not a valid ESM specifier.
const serverMod = (name) =>
  import(pathToFileURL(join(dist, "server", name)).href);

const { render } = await serverMod("entry-server.js");
const { getVisiblePosts } = await serverMod("prerender-data.js");
const { getRouteMeta, FIXED_ROUTES, DOCTOR_SLUGS, DEPARTMENT_SLUGS } =
  await serverMod("prerender-meta.js");

/* ---------------------------------------------------------------- the data */

let posts = [];
try {
  posts = await getVisiblePosts();
} catch (err) {
  console.warn("[prerender] post fetch failed, building with static only:", err);
  posts = [];
}

const cmsCount = posts.filter((p) => p.source === "cms").length;
console.log(
  `[prerender] ${posts.length} visible posts (${cmsCount} from CMS, ` +
    `${posts.length - cmsCount} hand-written)`,
);

/* --------------------------------------------------------------- the routes */

// Straight from src/lib/data — no hand-maintained list to drift.
const doctorSlugs = DOCTOR_SLUGS;
const deptSlugs = DEPARTMENT_SLUGS;

const routes = [
  ...Object.keys(FIXED_ROUTES),
  ...doctorSlugs.map((s) => `/doctors/${s}`),
  ...deptSlugs.map((s) => `/departments/${s}`),
  ...posts.map((p) => `/blog/${p.slug}`),
];

/* ------------------------------------------------------------- the template */

const template = readFileSync(join(dist, "index.html"), "utf8");

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Strip the tags we are about to replace so nothing is duplicated. */
function stripHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace(/<meta\s+name="robots"[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:(?:title|description|url|image|type)"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "");
}

function headFor(meta) {
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${meta.noIndex ? "noindex, nofollow" : "index, follow"}" />`,
    `<link rel="canonical" href="${esc(meta.canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(meta.canonical)}" />`,
    `<meta property="og:image" content="${esc(meta.image)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(meta.image)}" />`,
  ];
  for (const block of meta.jsonLd ?? []) {
    tags.push(
      `<script type="application/ld+json">${JSON.stringify(block).replace(
        /</g,
        "\\u003c",
      )}</script>`,
    );
  }
  return tags.join("\n    ");
}

/* ----------------------------------------------------------------- render */

let written = 0;
const failures = [];

for (const route of routes) {
  try {
    const meta = getRouteMeta(route, posts);
    const appHtml = await render(route, posts);

    // Only the posts this route needs; the listing gets them all.
    const slug = /^\/blog\/([^/]+)$/.exec(route)?.[1];
    const payload = slug
      ? posts.filter(
          (p) => p.slug === slug || posts.indexOf(p) < 8, // article + recents for "related"
        )
      : posts;

    let html = stripHead(template)
      .replace(
        "</head>",
        `  ${headFor(meta)}\n  </head>`,
      )
      .replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>\n    <script>window.__BLOG__=${JSON.stringify(
          payload,
        ).replace(/</g, "\\u003c")}</script>`,
      );

    const outDir = route === "/" ? dist : join(dist, route);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, "index.html"), html, "utf8");
    written += 1;
  } catch (err) {
    failures.push(`${route}: ${err?.message ?? err}`);
  }
}

/* ------------------------------------------------------------ 404 page --
   Prerendered separately and wired up in _redirects so an unknown slug gets a
   real 404 status, not a soft 200 from an SPA catch-all. */
try {
  const meta = getRouteMeta("/__not-found__", posts);
  const appHtml = await render("/__not-found__", posts);
  const html = stripHead(template)
    .replace("</head>", `  ${headFor({ ...meta, noIndex: true })}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  writeFileSync(join(dist, "404.html"), html, "utf8");
  written += 1;
} catch (err) {
  failures.push(`404.html: ${err?.message ?? err}`);
}

/* --------------------------------------------- host routing (static hosts) */
writeFileSync(
  join(dist, "_redirects"),
  [
    "# Prerendered files are served first; these only catch what is left.",
    "# The admin is a client-only SPA.",
    "/admin            /index.html   200",
    "/admin/*          /index.html   200",
    "# Anything else that has no prerendered file is a genuine 404.",
    "/*                /404.html     404",
    "",
  ].join("\n"),
  "utf8",
);

/* ---------------------------------------------------------------- sitemap */

const STATIC_PRIORITY = {
  "/": 1.0, "/doctors": 0.9, "/departments": 0.9, "/appointment": 0.9,
  "/contact": 0.9, "/about": 0.8, "/services": 0.8, "/insurance": 0.8,
  "/health-packages": 0.8, "/blog": 0.7, "/faq": 0.7, "/facilities": 0.7,
  "/patient-services": 0.7,
};

const today = new Date().toISOString().slice(0, 10);

// Built from the SAME visibility-filtered list the pages used.
const sitemapRows = [
  ...Object.keys(FIXED_ROUTES)
    .filter((p) => !FIXED_ROUTES[p].noIndex)
    .map((p) => ({ loc: p, lastmod: today, priority: STATIC_PRIORITY[p] ?? 0.5 })),
  ...doctorSlugs.map((s) => ({ loc: `/doctors/${s}`, lastmod: today, priority: 0.8 })),
  ...deptSlugs.map((s) => ({ loc: `/departments/${s}`, lastmod: today, priority: 0.8 })),
  ...posts.map((p) => ({
    loc: `/blog/${p.slug}`,
    lastmod: (p.updated_at || p.publish_at || today).slice(0, 10),
    priority: 0.6,
  })),
];

writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemapRows
      .map(
        (r) =>
          `  <url>\n    <loc>${ORIGIN}${r.loc}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n` +
          `    <changefreq>monthly</changefreq>\n    <priority>${r.priority.toFixed(
            1,
          )}</priority>\n  </url>`,
      )
      .join("\n") +
    `\n</urlset>\n`,
  "utf8",
);

/* ------------------------------------------------------------------ report */

console.log(`[prerender] wrote ${written} pages, ${sitemapRows.length} sitemap URLs`);
if (failures.length) {
  console.error(`[prerender] ${failures.length} route(s) failed:`);
  failures.forEach((f) => console.error("  - " + f));
  process.exit(1);
}
if (!existsSync(join(dist, "blog", "index.html"))) {
  console.error("[prerender] /blog was not written — aborting");
  process.exit(1);
}
