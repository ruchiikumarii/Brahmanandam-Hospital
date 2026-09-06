/**
 * Deterministic, rule-based SEO scoring for the SEO title and the meta
 * description. No guessing: every point is traceable to a stated rule, and the
 * UI shows the rule and the reason next to each failure.
 */

export type Band = "good" | "needs-work" | "poor";

export type RuleResult = {
  id: string;
  /** Short rule name shown in the UI. */
  label: string;
  /** Why the rule exists — shown verbatim to the author. */
  why: string;
  /** What we actually measured, e.g. "Meta description is 212 characters." */
  problem: string;
  points: number;
  max: number;
  passed: boolean;
};

export type ScoreResult = {
  score: number;
  band: Band;
  rules: RuleResult[];
  failing: RuleResult[];
  length: number;
  idealRange: [number, number];
};

export type ScoreContext = {
  focusKeyword?: string | null;
  /** Post H1 — an SEO title identical to it scores no uniqueness point. */
  h1?: string | null;
  /** Titles/descriptions already used by other posts. */
  otherTitles?: string[];
  otherDescriptions?: string[];
};

export const TITLE_RANGE: [number, number] = [50, 60];
export const DESC_RANGE: [number, number] = [120, 160];

export function bandOf(score: number): Band {
  if (score >= 80) return "good";
  if (score >= 50) return "needs-work";
  return "poor";
}

export const BAND_LABEL: Record<Band, string> = {
  good: "Good",
  "needs-work": "Needs work",
  poor: "Poor",
};

/* ------------------------------------------------------------- vocabularies */

const POWER_WORDS = [
  "best", "top", "expert", "complete", "essential", "proven", "trusted",
  "advanced", "affordable", "fast", "quick", "easy", "simple", "safe",
  "guide", "ultimate", "leading", "modern", "24x7", "24×7", "emergency",
  "free", "new", "specialist", "senior", "certified", "compassionate",
];

const CTA_VERBS = [
  "learn", "discover", "find", "get", "book", "call", "explore", "see",
  "read", "compare", "choose", "understand", "know", "check", "start",
  "consult", "visit", "schedule", "download", "request",
];

/** Weak, boilerplate openers that signal a generic description. */
const BOILERPLATE = [
  "welcome to", "this page", "in this article", "we are a", "we are one of",
  "lorem ipsum", "click here", "this blog", "this post is about",
];

const PASSIVE_HINTS = [
  " is provided", " are provided", " was made", " were made", " is offered",
  " are offered", " is done", " are done", " is being", " has been",
  " have been", " is used", " are used",
];

const SEPARATORS = /[|\-–—:·•]/g;

/* ----------------------------------------------------------------- helpers */

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

function keywordPosition(text: string, keyword: string): number {
  if (!keyword.trim()) return -1;
  return norm(text).indexOf(norm(keyword));
}

function keywordCount(text: string, keyword: string): number {
  const k = norm(keyword);
  if (!k) return 0;
  const t = norm(text);
  let n = 0;
  let i = t.indexOf(k);
  while (i !== -1) {
    n += 1;
    i = t.indexOf(k, i + k.length);
  }
  return n;
}

function capsRatio(text: string): number {
  const letters = text.replace(/[^A-Za-z]/g, "");
  if (letters.length < 8) return 0;
  const caps = text.replace(/[^A-Z]/g, "").length;
  return caps / letters.length;
}

/* ============================================================== SEO TITLE == */

export function scoreTitle(title: string, ctx: ScoreContext = {}): ScoreResult {
  const value = (title ?? "").trim();
  const len = value.length;
  const kw = (ctx.focusKeyword ?? "").trim();
  const rules: RuleResult[] = [];

  /* 1. Length — 30 */
  let lenPts = 0;
  if (len >= 50 && len <= 60) lenPts = 30;
  else if ((len >= 40 && len <= 49) || (len >= 61 && len <= 65)) lenPts = 20;
  else if ((len >= 30 && len <= 39) || (len >= 66 && len <= 70)) lenPts = 10;
  rules.push({
    id: "title-length",
    label: "Length 50–60 characters",
    why: "Google truncates the title at about 600px (roughly 60 characters) with an ellipsis, and anything under about 30 wastes the space you are given.",
    problem:
      len === 0
        ? "SEO title is empty."
        : `SEO title is ${len} characters${
            len > 60 ? " — the end will be cut off." : len < 50 ? " — shorter than the ideal range." : "."
          }`,
    points: lenPts,
    max: 30,
    passed: lenPts === 30,
  });

  /* 2. Focus keyword present — 25 */
  const kwPos = kw ? keywordPosition(value, kw) : -1;
  const hasKw = kwPos >= 0;
  rules.push({
    id: "title-keyword",
    label: "Focus keyword present",
    why: "The query the page targets has to appear in the title, or the title is not competing for it.",
    problem: !kw
      ? "No focus keyword set — add one to score the keyword rules."
      : hasKw
        ? `Contains “${kw}”.`
        : `“${kw}” does not appear in the title.`,
    points: hasKw ? 25 : 0,
    max: 25,
    passed: hasKw,
  });

  /* 3. Keyword early — 15 / 5 */
  const early = hasKw && kwPos <= 30;
  rules.push({
    id: "title-keyword-early",
    label: "Keyword within the first ~30 characters",
    why: "Earlier words carry more weight and survive truncation on narrow screens.",
    problem: !hasKw
      ? "Keyword not found, so position cannot be scored."
      : early
        ? `Keyword starts at character ${kwPos}.`
        : `Keyword starts at character ${kwPos} — move it nearer the front.`,
    points: hasKw ? (early ? 15 : 5) : 0,
    max: 15,
    passed: early,
  });

  /* 4. Unique — 10 */
  const dupOther = (ctx.otherTitles ?? []).some((t) => norm(t) === norm(value));
  const copiesH1 = Boolean(ctx.h1 && norm(ctx.h1) === norm(value));
  const unique = value.length > 0 && !dupOther && !copiesH1;
  rules.push({
    id: "title-unique",
    label: "Unique (not a duplicate or a copy of the H1)",
    why: "Duplicate titles compete with each other and dilute which page Google ranks.",
    problem: dupOther
      ? "Another post already uses this exact SEO title."
      : copiesH1
        ? "This is a verbatim copy of the page H1 — write a distinct search-facing title."
        : "Title is unique.",
    points: unique ? 10 : 0,
    max: 10,
    passed: unique,
  });

  /* 5. Number, power word or clear benefit — 10 */
  const hasNumber = /\d/.test(value);
  const hasPower = POWER_WORDS.some((w) => norm(value).includes(w));
  const compelling = hasNumber || hasPower;
  rules.push({
    id: "title-compelling",
    label: "Has a number, power word or clear benefit",
    why: "A concrete number or benefit lifts click-through rate — without tipping into clickbait.",
    problem: compelling
      ? "Contains a number or a benefit word."
      : "No number or benefit word — the title states a topic but no reason to click.",
    points: compelling ? 10 : 0,
    max: 10,
    passed: compelling,
  });

  /* 6. No stuffing / no shouting / ≤1 separator — 10 */
  const seps = (value.match(SEPARATORS) ?? []).length;
  const stuffed = kw ? keywordCount(value, kw) >= 3 : false;
  const shouting = capsRatio(value) > 0.6;
  const clean = !stuffed && !shouting && seps <= 1;
  rules.push({
    id: "title-clean",
    label: "No stuffing, no ALL-CAPS, at most one separator",
    why: "Repeating the keyword, shouting, or chaining separators reads as spam and can be flagged.",
    problem: stuffed
      ? `“${kw}” appears 3 or more times.`
      : shouting
        ? "Title is mostly capital letters."
        : seps > 1
          ? `Uses ${seps} separators — keep it to one.`
          : "Clean.",
    points: clean ? 10 : 0,
    max: 10,
    passed: clean,
  });

  const score = rules.reduce((n, r) => n + r.points, 0);
  return {
    score,
    band: bandOf(score),
    rules,
    failing: rules.filter((r) => !r.passed),
    length: len,
    idealRange: TITLE_RANGE,
  };
}

/* ======================================================= META DESCRIPTION == */

export function scoreDescription(
  description: string,
  ctx: ScoreContext = {},
): ScoreResult {
  const value = (description ?? "").trim();
  const len = value.length;
  const kw = (ctx.focusKeyword ?? "").trim();
  const rules: RuleResult[] = [];

  /* 1. Length — 30 */
  let lenPts = 0;
  if (len >= 120 && len <= 160) lenPts = 30;
  else if ((len >= 70 && len <= 119) || (len >= 161 && len <= 170)) lenPts = 15;
  rules.push({
    id: "desc-length",
    label: "Length 120–160 characters",
    why: "Google shows roughly 920px on desktop (about 155–160 characters) and around 120 on mobile. Longer is truncated; shorter wastes the slot.",
    problem:
      len === 0
        ? "Meta description is empty."
        : `Meta description is ${len} characters${
            len > 160 ? " — Google will cut it off." : len < 120 ? " — shorter than the ideal range." : "."
          }`,
    points: lenPts,
    max: 30,
    passed: lenPts === 30,
  });

  /* 2. Focus keyword present — 25 */
  const hasKw = kw ? keywordPosition(value, kw) >= 0 : false;
  rules.push({
    id: "desc-keyword",
    label: "Focus keyword present",
    why: "Google bolds words that match the searcher's query, which visibly lifts click-through rate.",
    problem: !kw
      ? "No focus keyword set — add one to score the keyword rules."
      : hasKw
        ? `Contains “${kw}”.`
        : `“${kw}” does not appear in the description.`,
    points: hasKw ? 25 : 0,
    max: 25,
    passed: hasKw,
  });

  /* 3. Value proposition / CTA — 20 */
  const firstWords = norm(value).split(" ").slice(0, 6);
  const hasCta =
    CTA_VERBS.some((v) => firstWords.includes(v)) ||
    CTA_VERBS.some((v) => new RegExp(`\\b${v}\\b`, "i").test(value));
  rules.push({
    id: "desc-cta",
    label: "Value proposition or call to action",
    why: "The description's only job is to earn the click, so it needs a verb and a concrete benefit.",
    problem: hasCta
      ? "Contains an action verb."
      : "No action verb — try opening with Learn, Get, Book, Compare or Discover.",
    points: hasCta ? 20 : 0,
    max: 20,
    passed: hasCta,
  });

  /* 4. Specific & active — 15 */
  const lower = norm(value);
  const boiler = BOILERPLATE.some((b) => lower.includes(b));
  const passive = PASSIVE_HINTS.some((p) => lower.includes(p));
  const specific = len > 0 && !boiler && !passive;
  rules.push({
    id: "desc-specific",
    label: "Specific and in the active voice",
    why: "Generic or passive descriptions get rewritten by Google and read as filler, lowering click-through rate.",
    problem: boiler
      ? "Opens with boilerplate — describe what THIS page gives the reader."
      : passive
        ? "Uses passive phrasing — rewrite it in the active voice."
        : "Reads as specific and active.",
    points: specific ? 15 : 0,
    max: 15,
    passed: specific,
  });

  /* 5. Unique — 10 */
  const dup = (ctx.otherDescriptions ?? []).some((d) => norm(d) === norm(value));
  const unique = len > 0 && !dup;
  rules.push({
    id: "desc-unique",
    label: "Unique across pages",
    why: "Google drops duplicate descriptions and substitutes its own text.",
    problem: dup
      ? "Another post already uses this exact description."
      : "Description is unique.",
    points: unique ? 10 : 0,
    max: 10,
    passed: unique,
  });

  const score = rules.reduce((n, r) => n + r.points, 0);
  return {
    score,
    band: bandOf(score),
    rules,
    failing: rules.filter((r) => !r.passed),
    length: len,
    idealRange: DESC_RANGE,
  };
}
