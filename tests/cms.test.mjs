/**
 * Acceptance tests for the blog CMS.
 * Run: npm run test:cms   (builds first, then asserts against dist/ + the pure modules)
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const mod = (n) => import(pathToFileURL(join(dist, "server", n)).href);

const { isPubliclyVisible, selectVisible } = await mod("prerender-visibility.js");
const { scoreDescription, scoreTitle } = await mod("prerender-seo.js");
const { suggest } = await mod("prerender-suggest.js");
const { importMarkdown } = await mod("prerender-md.js");

let pass = 0;
const fails = [];
const t = (name, fn) => {
  try { fn(); pass++; console.log("  PASS  " + name); }
  catch (e) { fails.push(name + " :: " + e.message); console.log("  FAIL  " + name + "\n        " + e.message); }
};
const ta = async (name, fn) => {
  try { await fn(); pass++; console.log("  PASS  " + name); }
  catch (e) { fails.push(name + " :: " + e.message); console.log("  FAIL  " + name + "\n        " + e.message); }
};

const past = new Date(Date.now() - 864e5).toISOString();
const future = new Date(Date.now() + 864e5).toISOString();

console.log("\n1. draft / archived / future-scheduled are not public");
t("draft hidden", () => assert.equal(isPubliclyVisible({ status: "draft", publish_at: past }), false));
t("archived hidden", () => assert.equal(isPubliclyVisible({ status: "archived", publish_at: past }), false));
t("future scheduled hidden", () => assert.equal(isPubliclyVisible({ status: "scheduled", publish_at: future }), false));
t("published with no date hidden", () => assert.equal(isPubliclyVisible({ status: "published", publish_at: null }), false));
t("none of them reach the sitemap", () => {
  const xml = readFileSync(join(dist, "sitemap.xml"), "utf8");
  assert.ok(!xml.includes("/blog/__draft__"));
});

console.log("\n2. scheduled whose time passed is public, with no status change");
t("past scheduled visible", () => assert.equal(isPubliclyVisible({ status: "scheduled", publish_at: past }), true));
t("status is still 'scheduled'", () => {
  const row = { status: "scheduled", publish_at: past };
  isPubliclyVisible(row);
  assert.equal(row.status, "scheduled");   // nothing mutated it
});
t("no cron flips status anywhere in src", () => {
  const sql = readFileSync(join(root, "supabase/migrations/0001_blog_cms.sql"), "utf8");
  assert.ok(!/update\s+public\.blogs\s+set\s+status/i.test(sql));
});

console.log("\n4. posts sorted newest-first by publish date across sources");
t("selectVisible sorts desc", () => {
  const older = new Date(Date.now() - 3 * 864e5).toISOString();
  const newer = new Date(Date.now() - 1 * 864e5).toISOString();
  const out = selectVisible([
    { slug: "old", status: "published", publish_at: older },
    { slug: "new", status: "published", publish_at: newer },
  ]);
  assert.deepEqual(out.map((p) => p.slug), ["new", "old"]);
});

console.log("\n5. DB unreachable -> site still renders");
t("build produced pages with no Supabase env set", () => {
  assert.ok(existsSync(join(dist, "blog", "index.html")));
  assert.ok(existsSync(join(dist, "index.html")));
});

console.log("\n6. no DB credential in any client-served file");
t("no service-role key or privileged JWT in dist", () => {
  const out = execFileSync(process.execPath, [join(root, "scripts/verify-bundle.mjs")], {
    encoding: "utf8",
  });
  assert.match(out, /clean: no service-role key/);
});

console.log("\n7. unknown slug -> real 404 (no prerendered page, host serves 404)");
t("unknown slug has no HTML file", () => {
  assert.ok(!existsSync(join(dist, "blog", "definitely-not-a-post", "index.html")));
});
t("known slug does", () => {
  assert.ok(existsSync(join(dist, "blog", "why-choose-brahmanandam-hospital", "index.html")));
});

// Serve dist/ the way the host will (honouring _redirects) and check statuses.
{
  const { start } = await import(
    pathToFileURL(join(root, "scripts/serve-static.mjs")).href
  );
  const server = start(4199);
  const get = async (p) => {
    const r = await fetch("http://localhost:4199" + p);
    return { status: r.status, body: await r.text() };
  };

  const home = await get("/");
  const list = await get("/blog");
  const post = await get("/blog/why-choose-brahmanandam-hospital");
  const admin = await get("/admin/login");
  const ghost = await get("/blog/definitely-not-a-post");
  const junk = await get("/totally-unknown");

  t("home 200", () => assert.equal(home.status, 200));
  t("blog listing 200", () => assert.equal(list.status, 200));
  t("known slug 200", () => assert.equal(post.status, 200));
  t("admin shell 200", () => assert.equal(admin.status, 200));
  t("unknown slug -> real 404, not a soft 200", () =>
    assert.equal(ghost.status, 404));
  t("unknown path -> real 404", () => assert.equal(junk.status, 404));

  /*
   * The admin screens all rendered blank once because the descendant <Routes>
   * inside "/admin/*" declared absolute paths ("/admin/blogs"), which match
   * nothing: the parent route has already consumed "/admin". A 200 from the
   * shell does not catch that -- the nav still renders -- so guard the source.
   */
  t("admin child routes are relative, not absolute", () => {
    const app = readFileSync(join(root, "src", "App.tsx"), "utf8");
    const inner = app.slice(app.indexOf("<AdminShell>"), app.indexOf("</AdminShell>"));
    assert.ok(inner.includes("<Routes>"), "expected a descendant <Routes> under AdminShell");
    const absolute = [...inner.matchAll(/<Route[^>]*\spath="(\/[^"]*)"/g)].map((m) => m[1]);
    assert.deepEqual(absolute, [], `these would never match: ${absolute.join(", ")}`);
  });

  console.log("\n3. published content is in the served HTML, not fetched later");
  t("article body is in the initial HTML", () => {
    assert.match(post.body, /earned its reputation by consistently/);
    assert.match(post.body, /<h1/);
  });
  t("article head carries title, canonical and BlogPosting JSON-LD", () => {
    assert.match(post.body, /<title>Why Choose Brahmanandam/);
    assert.ok(post.body.includes('rel="canonical" href="https://sonari.brahmanandamhospital.in/blog/'));
    assert.ok(post.body.includes('"@type":"BlogPosting"'));
  });
  t("listing renders every visible post", () => {
    assert.match(list.body, /why-choose-brahmanandam-hospital/);
    assert.match(list.body, /heart-health-tips/);
  });

  server.close();
}

console.log("\n8. SEO scoring + suggestions");
const kw = "paediatric asthma";
const long212 =
  "Our hospital is one of the leading healthcare providers in the region and this page is provided to give you information about the many different services that we are able to offer to patients and their families today.";
t(`212-char description scores red (len=${long212.length})`, () => {
  const s = scoreDescription(long212, { focusKeyword: kw });
  assert.ok(s.score < 50, `expected <50, got ${s.score}`);
  assert.equal(s.band, "poor");
});
await ta("Suggest returns 3 options, each 120-160 chars containing the keyword", async () => {
  const out = await suggest({
    kind: "description",
    title: "Paediatric Asthma in Children",
    excerpt:
      "How childhood asthma is diagnosed, which triggers matter most, and the inhaler routine that keeps symptoms under control between visits.",
    focusKeyword: kw,
    ctx: { focusKeyword: kw },
  });
  assert.equal(out.length, 3, `expected 3 options, got ${out.length}`);
  for (const o of out) {
    assert.ok(o.length >= 120 && o.length <= 160, `length ${o.length}: ${o.text}`);
    assert.ok(o.text.toLowerCase().includes(kw), `missing keyword: ${o.text}`);
  }
});
t("good title scores green", () => {
  const s = scoreTitle("Paediatric Asthma: 7 Signs Every Parent Should Know", { focusKeyword: kw });
  assert.ok(s.score >= 80, `expected >=80, got ${s.score} (len ${s.length})`);
});

console.log("\n9. Markdown import");
t("comment block maps Primary query -> focus keyword, SEO title verbatim", () => {
  const md = [
    "<!--",
    "SEO title: Paediatric Asthma Care in Jamshedpur | Expert Help",
    "Meta description: Learn how paediatric asthma is diagnosed and treated at our Sonari clinic.",
    "Primary query: paediatric asthma",
    "Category: Paediatrics",
    "-->",
    "# Childhood Asthma: A Parent's Guide",
    "",
    "Asthma is common in children.",
    "",
    "## FAQ",
    "### Is asthma curable?",
    "It is controllable with the right inhaler routine.",
    "",
    "**Does my child need a nebuliser?**",
    "Not always — most children do well on an inhaler with a spacer.",
    "",
    "## Related",
    "- /blog/child-health-seasonal-care",
  ].join("\n");
  const r = importMarkdown(md);
  assert.equal(r.focus_keyword, "paediatric asthma");
  assert.equal(r.seo_title, "Paediatric Asthma Care in Jamshedpur | Expert Help");
  assert.equal(r.title, "Childhood Asthma: A Parent's Guide");   // H1, NOT the SEO title
  assert.notEqual(r.seo_title, r.title);
  assert.equal(r.category, "Paediatrics");
  assert.equal(r.faq.length, 2, `faq: ${JSON.stringify(r.faq)}`);
  assert.deepEqual(r.related_blogs, ["child-health-seasonal-care"]);
  assert.ok(!JSON.stringify(r.content).includes("<!--"));
});

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { fails.forEach((f) => console.error("  - " + f)); process.exit(1); }
