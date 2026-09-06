import type { Block, BlogContent, FaqItem } from "./types";
import { estimateReadTime, slugify } from "./types";

/**
 * Markdown → every editor field.
 *
 * Handles both metadata styles the team uses:
 *   - YAML frontmatter between `---` fences
 *   - a leading HTML comment block, e.g.
 *       <!-- SEO title: … / Meta description: … / Primary query: … -->
 *
 * `Primary query` (or `focus_keyword` / `keyword`) maps to the focus keyword.
 * The SEO title is taken VERBATIM from the SEO-title line only — it is never
 * back-filled from the H1, because a search-facing title and an on-page H1 are
 * different jobs.
 */

export type ImportResult = {
  title: string;
  slug: string;
  excerpt: string;
  content: BlogContent;
  category: string | null;
  tags: string[];
  author: string | null;
  seo_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  featured_image: string | null;
  image_alt: string | null;
  read_time: number;
  faq: FaqItem[];
  related_blogs: string[];
  /** Keys we recognised, for the "imported these fields" summary. */
  matched: string[];
};

/* ------------------------------------------------------------- meta parsing */

const KEY_ALIASES: Record<string, string> = {
  title: "title",
  h1: "title",
  slug: "slug",
  excerpt: "excerpt",
  summary: "excerpt",
  description: "excerpt",
  category: "category",
  tags: "tags",
  author: "author",
  "seo title": "seo_title",
  seotitle: "seo_title",
  seo_title: "seo_title",
  "meta title": "seo_title",
  "meta description": "meta_description",
  metadescription: "meta_description",
  meta_description: "meta_description",
  "primary query": "focus_keyword",
  "focus keyword": "focus_keyword",
  focus_keyword: "focus_keyword",
  keyword: "focus_keyword",
  "featured image": "featured_image",
  featured_image: "featured_image",
  image: "featured_image",
  "image alt": "image_alt",
  image_alt: "image_alt",
  alt: "image_alt",
  related: "related",
  "related blogs": "related",
  related_blogs: "related",
};

function normKey(k: string) {
  return k.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

function assign(meta: Record<string, string>, rawKey: string, rawVal: string) {
  const canon = KEY_ALIASES[normKey(rawKey)] ?? KEY_ALIASES[rawKey.trim().toLowerCase()];
  if (!canon) return false;
  const val = rawVal.trim().replace(/^["']|["']$/g, "");
  if (!val) return false;
  meta[canon] = val;
  return true;
}

/** Pull YAML frontmatter and/or a leading `<!-- Key: value -->` block. */
function extractMeta(src: string): { meta: Record<string, string>; body: string } {
  const meta: Record<string, string> = {};
  let body = src.replace(/^﻿/, "").replace(/\r\n/g, "\n").trim();

  // --- YAML frontmatter
  const fm = /^---\n([\s\S]*?)\n---\n?/.exec(body);
  if (fm) {
    for (const line of fm[1].split("\n")) {
      const m = /^([A-Za-z0-9 _-]+)\s*:\s*(.*)$/.exec(line);
      if (m) assign(meta, m[1], m[2]);
    }
    body = body.slice(fm[0].length).trim();
  }

  // --- leading HTML comment block(s)
  while (true) {
    const cm = /^<!--([\s\S]*?)-->\s*/.exec(body);
    if (!cm) break;
    let used = false;
    for (const line of cm[1].split("\n")) {
      const m = /^\s*([A-Za-z0-9 _-]+?)\s*:\s*(.+)$/.exec(line);
      if (m && assign(meta, m[1], m[2])) used = true;
    }
    body = body.slice(cm[0].length).trim();
    if (!used) continue;
  }

  // Any remaining comments anywhere in the body are stripped.
  body = body.replace(/<!--[\s\S]*?-->/g, "").trim();

  return { meta, body };
}

/* ------------------------------------------------------------ body parsing */

/** Split the body on `## FAQ` and `## Related` sections. */
function splitSections(body: string) {
  const lines = body.split("\n");
  const main: string[] = [];
  const faq: string[] = [];
  const related: string[] = [];
  let bucket: "main" | "faq" | "related" = "main";

  for (const line of lines) {
    const h = /^##\s+(.*)$/.exec(line.trim());
    if (h) {
      const name = h[1].trim().toLowerCase().replace(/[^a-z ]/g, "");
      if (/^faqs?\b|frequently asked/.test(name)) {
        bucket = "faq";
        continue;
      }
      if (/^related\b|read (also|next)|in this series/.test(name)) {
        bucket = "related";
        continue;
      }
      bucket = "main";
    }
    (bucket === "faq" ? faq : bucket === "related" ? related : main).push(line);
  }
  return { main: main.join("\n"), faq: faq.join("\n"), related: related.join("\n") };
}

/** `### Question` or bold `**Question?**`, answer on the same or next lines. */
function parseFaq(section: string): FaqItem[] {
  const items: FaqItem[] = [];
  const lines = section.split("\n");
  let q: string | null = null;
  let a: string[] = [];

  const flush = () => {
    if (q) {
      const answer = a.join(" ").replace(/\s+/g, " ").trim();
      if (answer) items.push({ question: q, answer });
    }
    q = null;
    a = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const h3 = /^#{3,6}\s+(.*)$/.exec(line);
    const bold = /^\*\*(.+?)\*\*:?\s*(.*)$/.exec(line);

    if (h3) {
      flush();
      q = h3[1].replace(/\*\*/g, "").trim();
    } else if (bold && (bold[1].includes("?") || bold[2] === "")) {
      flush();
      q = bold[1].trim();
      if (bold[2]) a.push(bold[2].trim());
    } else if (q) {
      a.push(line.replace(/^[-*]\s+/, ""));
    }
  }
  flush();
  return items;
}

function parseRelated(section: string, frontmatter?: string): string[] {
  const out: string[] = [];
  if (frontmatter) {
    for (const part of frontmatter.split(/[,\n]/)) {
      const s = part.trim().replace(/^[-*]\s*/, "");
      if (s) out.push(slugify(s.replace(/^\/?blog\//, "")));
    }
  }
  for (const raw of section.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const link = /\[([^\]]*)\]\(([^)]+)\)/.exec(line);
    if (link) {
      out.push(slugify(link[2].replace(/^https?:\/\/[^/]+/, "").replace(/^\/?blog\//, "")));
      continue;
    }
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) out.push(slugify(bullet[1].replace(/^\/?blog\//, "")));
  }
  return [...new Set(out.filter(Boolean))];
}

/** Markdown body → structured blocks. Inline tokens are left in the text. */
export function markdownToBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  const lines = body.split("\n");
  let i = 0;

  const flushParagraph = (buf: string[]) => {
    const text = buf.join(" ").replace(/\s+/g, " ").trim();
    if (text) blocks.push({ type: "p", text });
  };

  let para: string[] = [];

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();

    // fenced code
    if (/^```/.test(t)) {
      flushParagraph(para);
      para = [];
      const lang = t.replace(/^```/, "").trim() || undefined;
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        buf.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: "code", text: buf.join("\n"), lang });
      continue;
    }

    if (!t) {
      flushParagraph(para);
      para = [];
      i += 1;
      continue;
    }

    // horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(t)) {
      flushParagraph(para);
      para = [];
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    // heading
    const h = /^(#{1,3})\s+(.*)$/.exec(t);
    if (h) {
      flushParagraph(para);
      para = [];
      const level = h[1].length as 1 | 2 | 3;
      blocks.push({ type: (`h${level}` as "h1" | "h2" | "h3"), text: h[2].trim() });
      i += 1;
      continue;
    }

    // standalone image
    const img = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/.exec(t);
    if (img) {
      flushParagraph(para);
      para = [];
      blocks.push({ type: "image", src: img[2], alt: img[1], caption: img[3] });
      i += 1;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(t)) {
      flushParagraph(para);
      para = [];
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        buf.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push({ type: "blockquote", text: buf.join(" ").trim() });
      continue;
    }

    // table
    if (/^\|.*\|$/.test(t) && /^\|[\s:|-]+\|$/.test((lines[i + 1] ?? "").trim())) {
      flushParagraph(para);
      para = [];
      const cells = (row: string) =>
        row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(t);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) {
        rows.push(cells(lines[i]));
        i += 1;
      }
      blocks.push({ type: "table", head, rows });
      continue;
    }

    // lists
    const ul = /^[-*+]\s+(.*)$/.exec(t);
    const ol = /^\d+[.)]\s+(.*)$/.exec(t);
    if (ul || ol) {
      flushParagraph(para);
      para = [];
      const ordered = Boolean(ol);
      const items: string[] = [];
      while (i < lines.length) {
        const s = lines[i].trim();
        const m = ordered ? /^\d+[.)]\s+(.*)$/.exec(s) : /^[-*+]\s+(.*)$/.exec(s);
        if (!m) break;
        items.push(m[1].trim());
        i += 1;
      }
      blocks.push({ type: ordered ? "ol" : "ul", items });
      continue;
    }

    para.push(t);
    i += 1;
  }
  flushParagraph(para);

  return blocks;
}

/* ------------------------------------------------------------------ public */

export function importMarkdown(source: string): ImportResult {
  const { meta, body } = extractMeta(source);
  const { main, faq, related } = splitSections(body);

  const blocks = markdownToBlocks(main);

  // H1 is only used for the on-page title, never for the SEO title.
  const h1 = blocks.find((b) => b.type === "h1") as
    | { type: "h1"; text: string }
    | undefined;
  const title = meta.title || h1?.text || "Untitled";

  // Drop the leading H1 from the body — the page renders the title itself.
  const firstIdx = blocks.findIndex((b) => b.type === "h1");
  if (firstIdx !== -1 && firstIdx <= 1) blocks.splice(firstIdx, 1);

  const content: BlogContent = { blocks };

  const firstPara = blocks.find((b) => b.type === "p") as
    | { type: "p"; text: string }
    | undefined;

  const excerpt =
    meta.excerpt ||
    (firstPara ? firstPara.text.replace(/\*\*|\*/g, "").slice(0, 200) : "");

  return {
    title,
    slug: meta.slug ? slugify(meta.slug) : slugify(title),
    excerpt,
    content,
    category: meta.category ?? null,
    tags: meta.tags
      ? meta.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    author: meta.author ?? null,
    // Verbatim from the SEO-title line only.
    seo_title: meta.seo_title ?? null,
    meta_description: meta.meta_description ?? null,
    focus_keyword: meta.focus_keyword ?? null,
    featured_image: meta.featured_image ?? null,
    image_alt: meta.image_alt ?? null,
    read_time: estimateReadTime(content),
    faq: parseFaq(faq),
    related_blogs: parseRelated(related, meta.related),
    matched: Object.keys(meta),
  };
}
