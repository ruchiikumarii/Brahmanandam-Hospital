/**
 * THE VISIBILITY RULE — single source of truth.
 *
 *     status IN ('published','scheduled') AND publish_at <= now()
 *
 * Everything that decides whether the public can see a post goes through this
 * file: the blog listing, the article page, the sitemap, related-post lookup
 * and any feed. It is also mirrored as an RLS policy in
 * `supabase/migrations/0001_blog_cms.sql` so a draft can never leak through
 * the API either.
 *
 * A scheduled post becomes visible because the clock moved past `publish_at` —
 * NOT because a cron job flipped a column. Nothing in this codebase rewrites
 * `status` on a timer.
 */

export type BlogStatus = "draft" | "scheduled" | "published" | "archived";

/** The minimum a record needs for a visibility decision. */
export type VisibilityInput = {
  status: BlogStatus;
  /** ISO timestamp. */
  publish_at: string | null;
};

/** Statuses that can ever be public. Used to build the DB filter. */
export const PUBLIC_STATUSES: BlogStatus[] = ["published", "scheduled"];

/**
 * Is this post visible to the public right now?
 *
 * @param now Injectable for tests; defaults to the current instant.
 */
export function isPubliclyVisible(
  post: VisibilityInput,
  now: Date = new Date(),
): boolean {
  if (!PUBLIC_STATUSES.includes(post.status)) return false;
  if (!post.publish_at) return false;
  const at = Date.parse(post.publish_at);
  if (Number.isNaN(at)) return false;
  return at <= now.getTime();
}

/** Filter a list down to what the public may see, newest publish date first. */
export function selectVisible<T extends VisibilityInput>(
  posts: T[],
  now: Date = new Date(),
): T[] {
  return posts
    .filter((p) => isPubliclyVisible(p, now))
    .sort(
      (a, b) =>
        Date.parse(b.publish_at as string) - Date.parse(a.publish_at as string),
    );
}

/**
 * The same rule expressed for PostgREST, so the database does the filtering.
 * Pairs with the RLS policy — belt and braces.
 */
export function visibilityFilter(nowIso: string = new Date().toISOString()) {
  return `and(status.in.(published,scheduled),publish_at.lte.${nowIso})`;
}
