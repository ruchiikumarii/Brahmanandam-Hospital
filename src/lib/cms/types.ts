import type { BlogStatus } from "./visibility";

export type { BlogStatus };

/* ------------------------------------------------------- structured content */

/** Inline tokens (`**bold**`, `*italic*`, `[text](url)`) stay in the text and
 *  are rendered by <RichText>. Blocks are never raw HTML. */
export type Block =
  | { type: "h1" | "h2" | "h3" | "p" | "blockquote"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "code"; text: string; lang?: string }
  | { type: "hr" }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "table"; head: string[]; rows: string[][] };

export type BlogContent = { blocks: Block[] };

export type FaqItem = { question: string; answer: string };

/* ----------------------------------------------------------------- the post */

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: BlogContent;
  featured_image: string | null;
  image_alt: string | null;
  category: string | null;
  tags: string[];
  seo_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  read_time: number | null;
  author: string | null;
  status: BlogStatus;
  /** Author-set publish date — drives the public date and the sitemap. */
  publish_at: string | null;
  /** Internal first-went-live stamp; never moves once set. */
  published_at: string | null;
  time_zone: string;
  related_blogs: string[];
  faq: FaqItem[];
  canonical_url: string | null;
  og_image: string | null;
  twitter_image: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  version: number;
  /** Set by the repository: 'cms' rows come from Supabase, 'static' are the
   *  hand-written articles that shipped with the site. */
  source: "cms" | "static";
};

export type BlogVersion = {
  id: string;
  blog_id: string;
  version: number;
  snapshot: BlogPost;
  created_at: string;
  created_by: string | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type MediaItem = {
  id: string;
  path: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
};

/* ------------------------------------------------------------------ helpers */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "");
}

/** Plain text of a post body — used for read time and excerpt fallbacks. */
export function blocksToText(content: BlogContent): string {
  return (content?.blocks ?? [])
    .map((b) => {
      switch (b.type) {
        case "ul":
        case "ol":
          return b.items.join(" ");
        case "hr":
          return "";
        case "image":
          return b.caption ?? "";
        case "table":
          return [b.head.join(" "), ...b.rows.map((r) => r.join(" "))].join(" ");
        default:
          return b.text;
      }
    })
    .join(" ")
    .replace(/\*\*|\*|\[|\]\([^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** ~200 wpm, minimum 1 minute. */
export function estimateReadTime(content: BlogContent): number {
  const words = blocksToText(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
