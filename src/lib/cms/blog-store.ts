import type { BlogPost } from "./types";

/**
 * Posts are resolved ONCE at build time and baked into each prerendered page,
 * then read synchronously here. Nothing fetches blog content from the browser,
 * so a crawler sees the full article in the initial HTML.
 */

declare global {
  interface Window {
    __BLOG__?: BlogPost[];
  }
}

let posts: BlogPost[] = [];

/** Called by the prerender renderer before rendering each route. */
export function setBlogPosts(next: BlogPost[]) {
  posts = next;
}

/** Synchronous read used by the public blog pages. */
export function getBlogPosts(): BlogPost[] {
  if (posts.length) return posts;
  if (typeof window !== "undefined" && Array.isArray(window.__BLOG__)) {
    posts = window.__BLOG__;
  }
  return posts;
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((p) => p.slug === slug);
}
