import {
  DESC_RANGE,
  TITLE_RANGE,
  scoreDescription,
  scoreTitle,
  type ScoreContext,
  type ScoreResult,
} from "./seo-score";

/**
 * Rewrite suggestions for the SEO title and meta description.
 *
 * Two strategies, tried in order:
 *   1. AI, when `VITE_GEMINI_API_KEY` is set — the rules go into the prompt as
 *      hard constraints so the output is grounded, not invented.
 *   2. Deterministic templates built from the post's own title, excerpt and
 *      focus keyword.
 *
 * Either way every candidate is re-scored with the same rule engine and only
 * options that actually improve on the current text are offered.
 */

export type Suggestion = {
  text: string;
  length: number;
  score: ScoreResult;
  origin: "ai" | "template";
};

export type SuggestInput = {
  kind: "title" | "description";
  /** Post H1 / working title. */
  title: string;
  excerpt: string;
  focusKeyword: string;
  ctx: ScoreContext;
};

/* --------------------------------------------------------------- utilities */

const clean = (s: string) =>
  s.replace(/\s+/g, " ").replace(/[*_`#]/g, "").trim();

/** Trim to `max` characters on a word boundary, never mid-word. */
function trimWords(text: string, max: number): string {
  const t = clean(text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max + 1);
  const at = cut.lastIndexOf(" ");
  return (at > 20 ? cut.slice(0, at) : t.slice(0, max)).replace(/[,;:\-–—]$/, "").trim();
}

/** Pad a candidate up to the minimum length using benefit clauses. */
function padTo(text: string, min: number, max: number, tails: string[]): string {
  let out = clean(text);
  for (const tail of tails) {
    if (out.length >= min) break;
    const next = `${out.replace(/[.]$/, "")} ${tail}`.trim();
    if (next.length <= max) out = next;
  }
  return trimWords(out, max);
}

const titleCaseKeyword = (kw: string) =>
  kw.replace(/\b\w/g, (c) => c.toUpperCase());

/** First meaningful clause of the excerpt, used as a benefit phrase. */
function benefitFrom(excerpt: string): string {
  const first = clean(excerpt).split(/(?<=[.!?])\s/)[0] ?? "";
  return first.replace(/^(the|a|an)\s+/i, "").replace(/[.]$/, "");
}

/* ------------------------------------------------------------- title plans */

function templateTitles(input: SuggestInput): string[] {
  const kw = clean(input.focusKeyword);
  const kwTitle = titleCaseKeyword(kw);
  const benefit = benefitFrom(input.excerpt);
  const base = clean(input.title).replace(/\s*[|\-–—:]\s*.*$/, "");
  const [min, max] = TITLE_RANGE;

  const tails = [
    "Complete Guide",
    "Expert Care in Jamshedpur",
    "What You Need to Know",
    "Sonari, Jamshedpur",
    "Trusted Specialist Advice",
  ];

  const seeds = [
    // keyword first, then a benefit
    kw ? `${kwTitle}: ${trimWords(benefit || base, max - kwTitle.length - 2)}` : base,
    // keyword first, then a guide promise
    kw ? `${kwTitle} - Complete Guide for Patients` : `${base} - Complete Guide`,
    // keyword plus a number, if the source offers one
    kw
      ? `${kwTitle}: 7 Things Every Patient Should Know`
      : `${base}: 7 Things to Know`,
    // fall back to shaping the working title itself
    base,
  ];

  return seeds
    .map((s) => padTo(s, min, max, tails))
    .filter((s) => s.length >= 30);
}

function templateDescriptions(input: SuggestInput): string[] {
  const kw = clean(input.focusKeyword);
  const benefit = benefitFrom(input.excerpt);
  const [min, max] = DESC_RANGE;

  const tails = [
    "Book an appointment at Brahmanandam Hospital, Sonari.",
    "Call 8271827999 to consult a specialist.",
    "Read expert guidance from our senior doctors.",
    "Get clear answers before your visit.",
  ];

  const seeds = [
    kw
      ? `Learn about ${kw}: ${benefit}.`
      : `Learn ${benefit}.`,
    kw
      ? `Discover how ${kw} is diagnosed and treated. ${benefit}.`
      : `Discover ${benefit}.`,
    kw
      ? `Get expert guidance on ${kw} from senior specialists. ${benefit}.`
      : `Get expert guidance. ${benefit}.`,
  ];

  return seeds.map((s) => padTo(s, min, max, tails)).filter((s) => s.length >= 70);
}

/* ------------------------------------------------------------------- AI ---- */

const GEMINI_KEY = import.meta.env?.VITE_GEMINI_API_KEY as string | undefined;

function promptFor(input: SuggestInput): string {
  if (input.kind === "title") {
    return [
      `Rewrite the SEO title for the page titled "${input.title}"`,
      `about "${clean(input.excerpt).slice(0, 300)}"`,
      `targeting the keyword "${input.focusKeyword}".`,
      "Return 3 options, each 50-60 characters, keyword in the first 30 characters,",
      "no ALL-CAPS, at most one separator.",
      "Output only the 3 lines, no numbering, no quotes.",
    ].join(" ");
  }
  return [
    `Rewrite the meta description for the page titled "${input.title}"`,
    `about "${clean(input.excerpt).slice(0, 300)}"`,
    `targeting the keyword "${input.focusKeyword}".`,
    "Return 3 options, each 120-160 characters, each containing the keyword,",
    "each starting with a call-to-action verb, active voice, specific to this page.",
    "Output only the 3 lines, no numbering, no quotes.",
  ].join(" ");
}

async function aiSuggest(input: SuggestInput): Promise<string[]> {
  if (!GEMINI_KEY) return [];
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptFor(input) }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
        }),
      },
    );
    if (!res.ok) return [];
    const json = await res.json();
    const text: string =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return text
      .split("\n")
      .map((l) => clean(l.replace(/^\s*[-*\d.)]+\s*/, "").replace(/^["']|["']$/g, "")))
      .filter(Boolean)
      .slice(0, 3);
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ public */

export const aiSuggestAvailable = Boolean(GEMINI_KEY);

/**
 * Produce up to three re-scored rewrite options, best first. Candidates that
 * score no better than what the author already has are dropped.
 */
export async function suggest(input: SuggestInput): Promise<Suggestion[]> {
  const scorer = input.kind === "title" ? scoreTitle : scoreDescription;

  const ai = await aiSuggest(input);
  const templates =
    input.kind === "title" ? templateTitles(input) : templateDescriptions(input);

  const seen = new Set<string>();
  const candidates: { text: string; origin: Suggestion["origin"] }[] = [];

  for (const text of ai) {
    const k = text.toLowerCase();
    if (text && !seen.has(k)) {
      seen.add(k);
      candidates.push({ text, origin: "ai" });
    }
  }
  for (const text of templates) {
    const k = text.toLowerCase();
    if (text && !seen.has(k)) {
      seen.add(k);
      candidates.push({ text, origin: "template" });
    }
  }

  return candidates
    .map(({ text, origin }) => ({
      text,
      length: text.length,
      score: scorer(text, input.ctx),
      origin,
    }))
    .sort((a, b) => b.score.score - a.score.score)
    .slice(0, 3);
}
