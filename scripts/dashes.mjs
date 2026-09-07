/**
 * Replaces em dashes with a plain hyphen in the text the site renders.
 *
 * Two guards keep it away from code:
 *
 *   1. Comments are skipped. They never reach the page, and rewriting them
 *      would bury the real change in noise. Skipping them needs a scanner
 *      rather than a regex, because "https://" inside a string would otherwise
 *      look like the start of a line comment and hide the rest of that line.
 *   2. Only a dash with whitespace on both sides is touched. Prose always
 *      writes it that way; a regex character class never does. That is what
 *      protects /[|\-–—:·•]/ , where replacing the dash would leave "\--" and
 *      a reversed range that stops the build.
 *
 *   node scripts/dashes.mjs [--check]
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const EM = String.fromCharCode(0x2014);
const ROOTS = ["src", "index.html"];
const EXT = new Set([".ts", ".tsx", ".html", ".css"]);

/** Marks the characters of a JS/TS source that sit inside a comment. */
function commentMask(src) {
  const mask = new Uint8Array(src.length);
  const S = { code: 0, line: 1, block: 2, str: 3, tmpl: 4 };
  let state = S.code;
  let quote = "";
  const tmplStack = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (state === S.code) {
      if (c === "/" && n === "/") { state = S.line; mask[i] = mask[i + 1] = 1; i += 2; continue; }
      if (c === "/" && n === "*") { state = S.block; mask[i] = mask[i + 1] = 1; i += 2; continue; }
      if (c === '"' || c === "'") { state = S.str; quote = c; i++; continue; }
      if (c === "`") { state = S.tmpl; i++; continue; }
      if (c === "}" && tmplStack.length) { state = S.tmpl; tmplStack.pop(); i++; continue; }
      i++; continue;
    }
    if (state === S.line) {
      mask[i] = 1;
      if (c === "\n") state = S.code;
      i++; continue;
    }
    if (state === S.block) {
      mask[i] = 1;
      if (c === "*" && n === "/") { mask[i + 1] = 1; state = S.code; i += 2; continue; }
      i++; continue;
    }
    if (state === S.str) {
      if (c === "\\") { i += 2; continue; }
      if (c === quote) state = S.code;
      i++; continue;
    }
    if (c === "\\") { i += 2; continue; }
    if (c === "$" && n === "{") { tmplStack.push(1); state = S.code; i += 2; continue; }
    if (c === "`") state = S.code;
    i++;
  }
  return mask;
}

/** HTML has one comment form and no strings that can fake it. */
function htmlCommentMask(src) {
  const mask = new Uint8Array(src.length);
  let i = 0;
  while (i < src.length) {
    if (src.startsWith("<!--", i)) {
      const end = src.indexOf("-->", i);
      const stop = end === -1 ? src.length : end + 3;
      mask.fill(1, i, stop);
      i = stop;
      continue;
    }
    i++;
  }
  return mask;
}

function walk(p, out = []) {
  if (statSync(p).isFile()) { out.push(p); return out; }
  for (const name of readdirSync(p)) walk(join(p, name), out);
  return out;
}

const check = process.argv.includes("--check");
let files = 0;
let replaced = 0;
let left = 0;

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const ext = extname(file);
    if (!EXT.has(ext)) continue;
    const src = readFileSync(file, "utf8");
    if (!src.includes(EM)) continue;
    const mask = ext === ".html" ? htmlCommentMask(src) : commentMask(src);
    let out = "";
    let hits = 0;
    let kept = 0;
    for (let i = 0; i < src.length; i++) {
      const spaced = /\s/.test(src[i - 1] ?? "") && /\s/.test(src[i + 1] ?? "");
      if (src[i] === EM && !mask[i] && spaced) { out += "-"; hits++; continue; }
      if (src[i] === EM) kept++;
      out += src[i];
    }
    left += kept;
    if (hits) {
      replaced += hits;
      files++;
      if (!check) writeFileSync(file, out, "utf8");
      console.log(`  ${String(hits).padStart(3)} ${file}${kept ? `  (${kept} kept)` : ""}`);
    }
  }
}
console.log(
  `${check ? "would replace" : "replaced"} ${replaced} em dashes in ${files} files; ` +
    `${left} left in comments or character classes`,
);
