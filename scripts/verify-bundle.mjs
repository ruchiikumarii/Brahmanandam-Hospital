/**
 * Proves no privileged credential reached anything a browser downloads.
 *
 * Scans every file in dist/ -- all of which a browser can download, since the
 * SSR bundle builds to .ssr/ outside it -- for service-role keys, Postgres
 * connection strings and any JWT whose payload claims the `service_role` role.
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SERVER_DIR = join(root, ".ssr");

const TEXT = new Set([".html", ".js", ".mjs", ".css", ".json", ".txt", ".xml", ".map"]);

/** A Supabase JWT is `header.payload.signature`; decode and inspect the role. */
function jwtIsPrivileged(token) {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString("utf8"),
    );
    return payload?.role && payload.role !== "anon";
  } catch {
    return false;
  }
}

const PATTERNS = [
  { name: "service_role literal", re: /service_role/g },
  { name: "SUPABASE_SERVICE_ROLE var", re: /SUPABASE_SERVICE_ROLE[A-Z_]*/g },
  { name: "postgres connection string", re: /postgres(?:ql)?:\/\/[^\s"']+/g },
  { name: "sb_secret_ key", re: /sb_secret_[A-Za-z0-9_-]+/g },
];

const JWT = /eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (p === SERVER_DIR) continue;
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (TEXT.has(extname(p))) out.push(p);
  }
  return out;
}

if (!existsSync(dist)) {
  console.error("verify:bundle — dist/ not found; run the build first");
  process.exit(1);
}

const files = walk(dist);
const findings = [];

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const rel = file.slice(root.length + 1);

  for (const { name, re } of PATTERNS) {
    const hits = src.match(re);
    if (hits) findings.push(`${rel}: ${name} (${hits.length}x)`);
  }
  for (const token of src.match(JWT) ?? []) {
    if (jwtIsPrivileged(token)) {
      findings.push(`${rel}: JWT with a non-anon role`);
    }
  }
}

console.log(`verify:bundle — scanned ${files.length} client-served files`);
if (findings.length) {
  console.error("LEAK DETECTED:");
  findings.forEach((f) => console.error("  - " + f));
  process.exit(1);
}
console.log("verify:bundle — clean: no service-role key, privileged JWT or DB URL");
