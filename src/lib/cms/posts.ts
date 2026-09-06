import { blogArticles } from "@/lib/data/blog";
import { getSupabase, cmsEnabled } from "./supabase";
import { isPubliclyVisible, selectVisible } from "./visibility";
import {
  estimateReadTime,
  slugify,
  type BlogContent,
  type BlogPost,
} from "./types";

/**
 * The read side of the blog.
 *
 * Two sources are merged:
 *   - `static`  — the hand-written articles that shipped with the site
 *   - `cms`     — rows from Supabase
 *
 * On a slug clash the EXISTING (static) article wins, so publishing a CMS post
 * can never silently replace hand-written content. Everything is filtered
 * through `isPubliclyVisible` / `selectVisible`, and sorted newest publish
 * date first across both sources.
 */

const SELECT_COLUMNS =
  "id,title,slug,excerpt,content,featured_image,image_alt,category,tags," +
  "seo_title,meta_description,focus_keyword,read_time,author,status," +
  "publish_at,published_at,time_zone,related_blogs,faq,canonical_url," +
  "og_image,twitter_image,created_at,updated_at,created_by,updated_by,version";

/* ------------------------------------------- the hand-written articles ---- */

/** Turn a shipped article into the same shape as a CMS row. */
function staticToPost(a: (typeof blogArticles)[number]): BlogPost {
  const content: BlogContent = {
    blocks: a.body.flatMap((block) => {
      const out: BlogContent["blocks"] = [
        { type: "h2" as const, text: block.heading },
        ...block.paragraphs.map((t) => ({ type: "p" as const, text: t })),
      ];
      if (block.points?.length) {
        out.push({ type: "ul" as const, items: [...block.points] });
      }
      return out;
    }),
  };

  const publishAt = new Date(a.date).toISOString();

  return {
    id: `static:${a.slug}`,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content,
    featured_image: a.image,
    image_alt: a.title,
    category: a.category,
    tags: [],
    seo_title: null,
    meta_description: a.excerpt,
    focus_keyword: null,
    read_time: a.readMinutes,
    author: a.author,
    status: "published",
    publish_at: publishAt,
    published_at: publishAt,
    time_zone: "Asia/Kolkata",
    related_blogs: [],
    faq: [],
    canonical_url: null,
    og_image: a.image,
    twitter_image: a.image,
    created_at: publishAt,
    updated_at: publishAt,
    created_by: a.author,
    updated_by: a.author,
    version: 1,
    source: "static",
  };
}

export const staticPosts: BlogPost[] = blogArticles.map(staticToPost);

/* ------------------------------------------------------- CMS row mapping -- */

type Row = Record<string, unknown>;

function rowToPost(r: Row): BlogPost {
  const content = (r.content as BlogContent | null) ?? { blocks: [] };
  return {
    id: String(r.id),
    title: String(r.title ?? ""),
    slug: String(r.slug ?? ""),
    excerpt: (r.excerpt as string) ?? "",
    content,
    featured_image: (r.featured_image as string) ?? null,
    image_alt: (r.image_alt as string) ?? null,
    category: (r.category as string) ?? null,
    tags: (r.tags as string[]) ?? [],
    seo_title: (r.seo_title as string) ?? null,
    meta_description: (r.meta_description as string) ?? null,
    focus_keyword: (r.focus_keyword as string) ?? null,
    read_time: (r.read_time as number) ?? estimateReadTime(content),
    author: (r.author as string) ?? null,
    status: (r.status as BlogPost["status"]) ?? "draft",
    publish_at: (r.publish_at as string) ?? null,
    published_at: (r.published_at as string) ?? null,
    time_zone: (r.time_zone as string) ?? "Asia/Kolkata",
    related_blogs: (r.related_blogs as string[]) ?? [],
    faq: (r.faq as BlogPost["faq"]) ?? [],
    canonical_url: (r.canonical_url as string) ?? null,
    og_image: (r.og_image as string) ?? null,
    twitter_image: (r.twitter_image as string) ?? null,
    created_at: (r.created_at as string) ?? new Date().toISOString(),
    updated_at: (r.updated_at as string) ?? new Date().toISOString(),
    created_by: (r.created_by as string) ?? null,
    updated_by: (r.updated_by as string) ?? null,
    version: (r.version as number) ?? 1,
    source: "cms",
  };
}

export { rowToPost };

/* --------------------------------------------------------------- the reads */

/**
 * Fetch every CMS row the public may see. Returns `[]` — never throws — if the
 * CMS is disabled or the database is unreachable, so an outage degrades to the
 * hand-written articles instead of a 500.
 */
async function fetchVisibleCmsPosts(): Promise<BlogPost[]> {
  if (!cmsEnabled) return [];
  const sb = getSupabase();
  if (!sb) return [];

  try {
    const { data, error } = await sb
      .from("blogs")
      .select(SELECT_COLUMNS)
      .in("status", ["published", "scheduled"])
      .lte("publish_at", new Date().toISOString())
      .order("publish_at", { ascending: false });

    if (error) {
      console.warn("[cms] blog fetch failed, serving static only:", error.message);
      return [];
    }
    // Belt and braces: re-apply the rule in code even though RLS + the query
    // already enforce it.
    return selectVisible(((data ?? []) as unknown as Row[]).map(rowToPost));
  } catch (err) {
    console.warn("[cms] blog fetch threw, serving static only:", err);
    return [];
  }
}

/** Merge CMS + static. Existing static articles win a slug clash. */
export async function getVisiblePosts(): Promise<BlogPost[]> {
  const cms = await fetchVisibleCmsPosts();
  const staticSlugs = new Set(staticPosts.map((p) => p.slug));
  const merged = [
    ...staticPosts,
    ...cms.filter((p) => !staticSlugs.has(p.slug)),
  ];
  return selectVisible(merged);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const all = await getVisiblePosts();
  return all.find((p) => p.slug === slug) ?? null;
}

/** Resolve a renamed slug to its current one, or null. */
export async function resolveSlugRedirect(
  oldSlug: string,
): Promise<string | null> {
  if (!cmsEnabled) return null;
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data } = await sb
      .from("blog_slug_redirects")
      .select("blog_id, blogs(slug,status,publish_at)")
      .eq("old_slug", oldSlug)
      .maybeSingle();
    const target = (data as { blogs?: Row } | null)?.blogs;
    if (!target) return null;
    if (
      !isPubliclyVisible({
        status: target.status as BlogPost["status"],
        publish_at: (target.publish_at as string) ?? null,
      })
    ) {
      return null;
    }
    return String(target.slug);
  } catch {
    return null;
  }
}

/** Ordered related posts for an article, falling back to same-category recents. */
export function pickRelated(
  post: BlogPost,
  all: BlogPost[],
  limit = 3,
): BlogPost[] {
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const chosen = post.related_blogs
    .map((s) => bySlug.get(s))
    .filter((p): p is BlogPost => Boolean(p) && p!.slug !== post.slug);

  if (chosen.length >= limit) return chosen.slice(0, limit);

  const seen = new Set([post.slug, ...chosen.map((p) => p.slug)]);
  const filler = all.filter(
    (p) => !seen.has(p.slug) && p.category === post.category,
  );
  const rest = all.filter((p) => !seen.has(p.slug) && p.category !== post.category);

  return [...chosen, ...filler, ...rest].slice(0, limit);
}

export function ensureSlug(title: string, existing?: string) {
  return existing?.trim() ? slugify(existing) : slugify(title);
}
