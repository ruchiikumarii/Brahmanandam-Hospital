/**
 * Verifies a fresh Supabase setup end to end, using ONLY the publishable key —
 * exactly what a visitor's browser has.
 *
 *   npm run cms:check
 *
 * Checks, in order:
 *   1. env vars present and the URL reachable
 *   2. every table exists
 *   3. the blog-images bucket exists and is public
 *   4. RLS actually hides drafts / archived / future-scheduled rows
 *   5. a due scheduled row IS visible (the clock, not a cron)
 *   6. writes are refused without a session
 *
 * Check 4 is the important one: it inserts nothing and reads as `anon`, so it
 * proves what an attacker with the public key would actually get back.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ------------------------------------------------------------ read .env */
const env = { ...process.env };
const envFile = join(root, ".env");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split("\n")) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
}

const URL_ = env.VITE_SUPABASE_URL;
const KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;

let failed = 0;
const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => {
  failed += 1;
  console.log(`  ✗ ${m}`);
};
const info = (m) => console.log(`    ${m}`);

console.log("\nSupabase setup check\n" + "=".repeat(60));

if (!URL_ || !KEY) {
  bad("VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY not found");
  info("Create .env from .env.example and paste the Project URL + anon key.");
  process.exit(1);
}
ok(`URL  ${URL_}`);
ok(`key  ${KEY.slice(0, 12)}…${KEY.slice(-6)} (${KEY.length} chars)`);

/* Refuse to run with a privileged key. */
try {
  const payload = JSON.parse(
    Buffer.from(KEY.split(".")[1], "base64").toString("utf8"),
  );
  if (payload.role && payload.role !== "anon") {
    bad(`this key has role "${payload.role}" — use the anon/publishable key`);
    process.exit(1);
  }
  ok('key role is "anon"');
} catch {
  info("key is not a JWT (new-style publishable key) — fine");
}

const sb = createClient(URL_, KEY, { auth: { persistSession: false } });

/* --------------------------------------------------------- 2. tables */
console.log("\nTables");
for (const t of ["blogs", "categories", "media", "blog_slug_redirects"]) {
  const { error } = await sb.from(t).select("*", { count: "exact", head: true });
  if (error) bad(`${t} — ${error.message}`);
  else ok(t);
}
/*
 * These must be invisible to anon. PostgREST does not error when RLS filters a
 * row out — it returns an empty set — so counting rows is the only honest test.
 * deploy_state always holds exactly one row (the migration seeds it), which
 * makes "anon sees 0" a real signal rather than an empty-table false pass.
 */
for (const t of ["blog_versions", "deploy_state"]) {
  const { data, error, count } = await sb.from(t).select("*", { count: "exact" });
  if (error) ok(`${t} not readable by anon (${error.code ?? "denied"})`);
  else if ((count ?? data?.length ?? 0) === 0) ok(`${t} returns 0 rows to anon`);
  else bad(`${t} LEAKED ${count} row(s) to anon — check its RLS policy`);
}

/* --------------------------------------------------------- 3. storage */
console.log("\nStorage");
{
  const { data, error } = await sb.storage.from("blog-images").list("", { limit: 1 });
  if (error) bad(`blog-images bucket — ${error.message}`);
  else ok(`blog-images bucket reachable (${data.length} object(s) listed)`);
}

/* ------------------------------------------------------------- 4. RLS */
console.log("\nRow Level Security (reading as anon)");
{
  const { data, error } = await sb
    .from("blogs")
    .select("slug,status,publish_at")
    .limit(500);

  if (error) {
    bad(`could not read blogs — ${error.message}`);
  } else {
    const rows = data ?? [];
    ok(`anon can see ${rows.length} row(s)`);

    const leaked = rows.filter(
      (r) =>
        r.status === "draft" ||
        r.status === "archived" ||
        (r.status === "scheduled" && Date.parse(r.publish_at) > Date.now()),
    );
    if (leaked.length) {
      bad(`${leaked.length} row(s) LEAKED through RLS:`);
      leaked.slice(0, 5).forEach((r) => info(`${r.slug} (${r.status})`));
      info("Re-run the blogs_public_read policy from 0001_blog_cms.sql.");
    } else {
      ok("no draft / archived / future-scheduled row is visible");
    }

    const due = rows.filter(
      (r) => r.status === "scheduled" && Date.parse(r.publish_at) <= Date.now(),
    );
    if (due.length) {
      ok(`${due.length} due scheduled row(s) visible while still status='scheduled'`);
    } else {
      info("no due scheduled rows to check (fine if none are scheduled yet)");
    }
  }
}

/* ----------------------------------------------------------- 5. writes */
console.log("\nWrites without a session");
{
  const { error } = await sb
    .from("blogs")
    .insert({ title: "cms-check probe", slug: `cms-check-${Date.now()}` });
  if (error) ok(`insert correctly refused — ${error.message.slice(0, 60)}`);
  else bad("anon was allowed to INSERT — the admin policy is too permissive");
}

/* ------------------------------------------------------------ summary */
console.log("\n" + "=".repeat(60));
if (failed) {
  console.log(`${failed} problem(s) found. Fix them, then re-run.`);
  process.exit(1);
}
console.log("Setup looks good. Next: npm run build && npm run test:cms");
