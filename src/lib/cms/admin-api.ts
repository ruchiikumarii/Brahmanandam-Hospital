import { getSupabase, BLOG_BUCKET } from "./supabase";
import { rowToPost } from "./posts";
import {
  estimateReadTime,
  type BlogPost,
  type Category,
  type MediaItem,
} from "./types";
import { ORIGIN } from "@/lib/seo/route-meta";

/**
 * Admin (authenticated) data access.
 *
 * Still the publishable/anon key — the elevated rights come from the logged-in
 * session, and RLS grants full read/write only to the `authenticated` role.
 * The service-role key is never used anywhere in this codebase.
 */

function sb() {
  const client = getSupabase();
  if (!client) throw new Error("Supabase is not configured");
  return client;
}

const ALL = "*";

/* -------------------------------------------------------------------- auth */

export async function signIn(email: string, password: string) {
  const { data, error } = await sb().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  await sb().auth.signOut();
}

export async function currentUser() {
  const client = getSupabase();
  if (!client) return null;
  const { data } = await client.auth.getUser();
  return data.user ?? null;
}

export function onAuthChange(cb: (signedIn: boolean) => void) {
  const client = getSupabase();
  if (!client) return () => {};
  const { data } = client.auth.onAuthStateChange((_e, session) =>
    cb(Boolean(session)),
  );
  return () => data.subscription.unsubscribe();
}

/* ------------------------------------------------------------------- blogs */

/** Every row, regardless of status — admin only (RLS enforces it). */
export async function listAllBlogs(): Promise<BlogPost[]> {
  const { data, error } = await sb()
    .from("blogs")
    .select(ALL)
    .order("publish_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as Record<string, unknown>[]).map(rowToPost);
}

export async function getBlogById(id: string): Promise<BlogPost | null> {
  const { data, error } = await sb().from("blogs").select(ALL).eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? rowToPost(data as Record<string, unknown>) : null;
}

export type BlogDraft = Partial<BlogPost> & { title: string; slug: string };

function toRow(d: BlogDraft, userEmail: string | null) {
  const content = d.content ?? { blocks: [] };
  return {
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt ?? "",
    content,
    featured_image: d.featured_image ?? null,
    image_alt: d.image_alt ?? null,
    category: d.category ?? null,
    tags: d.tags ?? [],
    seo_title: d.seo_title ?? null,
    meta_description: d.meta_description ?? null,
    focus_keyword: d.focus_keyword ?? null,
    read_time: d.read_time ?? estimateReadTime(content),
    author: d.author ?? null,
    status: d.status ?? "draft",
    publish_at: d.publish_at ?? null,
    published_at: d.published_at ?? null,
    time_zone: d.time_zone ?? "Asia/Kolkata",
    related_blogs: d.related_blogs ?? [],
    faq: d.faq ?? [],
    canonical_url: d.canonical_url ?? `${ORIGIN}/blog/${d.slug}`,
    og_image: d.og_image ?? d.featured_image ?? null,
    twitter_image: d.twitter_image ?? d.featured_image ?? null,
    updated_by: userEmail,
  };
}

export async function createBlog(d: BlogDraft, userEmail: string | null) {
  const { data, error } = await sb()
    .from("blogs")
    .insert({ ...toRow(d, userEmail), created_by: userEmail })
    .select(ALL)
    .single();
  if (error) throw error;
  return rowToPost(data as Record<string, unknown>);
}

export async function updateBlog(
  id: string,
  d: BlogDraft,
  userEmail: string | null,
) {
  const before = await getBlogById(id);

  // Snapshot the previous state so it can be restored.
  if (before) {
    await sb().from("blog_versions").insert({
      blog_id: id,
      version: before.version,
      snapshot: before as unknown as Record<string, unknown>,
      created_by: userEmail,
    });
  }

  // A renamed slug keeps the old one resolving.
  if (before && before.slug !== d.slug) {
    await sb()
      .from("blog_slug_redirects")
      .upsert({ old_slug: before.slug, blog_id: id });
  }

  const { data, error } = await sb()
    .from("blogs")
    .update({ ...toRow(d, userEmail), version: (before?.version ?? 1) + 1 })
    .eq("id", id)
    .select(ALL)
    .single();
  if (error) throw error;
  return rowToPost(data as Record<string, unknown>);
}

export async function deleteBlog(id: string) {
  const { error } = await sb().from("blogs").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Publish immediately.
 *
 * If the post is already live its original `publish_at` is kept, so the public
 * date and the sitemap do not jump when someone fixes a typo.
 */
export async function publishNow(post: BlogPost, userEmail: string | null) {
  const nowIso = new Date().toISOString();
  const wasLive = post.status === "published" && Boolean(post.publish_at);
  const { data, error } = await sb()
    .from("blogs")
    .update({
      status: "published",
      publish_at: wasLive ? post.publish_at : nowIso,
      published_at: post.published_at ?? nowIso,
      updated_by: userEmail,
    })
    .eq("id", post.id)
    .select(ALL)
    .single();
  if (error) throw error;
  return rowToPost(data as Record<string, unknown>);
}

/** Schedule for a future instant. `whenIso` must already be UTC. */
export async function schedule(
  post: BlogPost,
  whenIso: string,
  timeZone: string,
  userEmail: string | null,
) {
  if (Date.parse(whenIso) <= Date.now()) {
    throw new Error("Scheduled time must be in the future.");
  }
  const { data, error } = await sb()
    .from("blogs")
    .update({
      status: "scheduled",
      publish_at: whenIso,
      time_zone: timeZone,
      updated_by: userEmail,
    })
    .eq("id", post.id)
    .select(ALL)
    .single();
  if (error) throw error;
  return rowToPost(data as Record<string, unknown>);
}

export async function setStatus(
  id: string,
  status: BlogPost["status"],
  userEmail: string | null,
) {
  const { data, error } = await sb()
    .from("blogs")
    .update({ status, updated_by: userEmail })
    .eq("id", id)
    .select(ALL)
    .single();
  if (error) throw error;
  return rowToPost(data as Record<string, unknown>);
}

/* ---------------------------------------------------------------- versions */

export async function listVersions(blogId: string) {
  const { data, error } = await sb()
    .from("blog_versions")
    .select("id,blog_id,version,snapshot,created_at,created_by")
    .eq("blog_id", blogId)
    .order("version", { ascending: false })
    .limit(30);
  if (error) throw error;
  return data ?? [];
}

/* -------------------------------------------------------------- categories */

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await sb()
    .from("categories")
    .select("id,name,slug,description")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function upsertCategory(c: Partial<Category> & { name: string; slug: string }) {
  const { error } = await sb().from("categories").upsert(c, { onConflict: "slug" });
  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await sb().from("categories").delete().eq("id", id);
  if (error) throw error;
}

/* ------------------------------------------------------------------- media */

export async function listMedia(): Promise<MediaItem[]> {
  const { data, error } = await sb()
    .from("media")
    .select(ALL)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as MediaItem[];
}

export async function uploadImage(
  file: File,
  userEmail: string | null,
): Promise<MediaItem> {
  const client = sb();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await client.storage
    .from(BLOG_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (upErr) throw upErr;

  const { data: pub } = client.storage.from(BLOG_BUCKET).getPublicUrl(path);

  const row = {
    path,
    url: pub.publicUrl,
    alt: null,
    size_bytes: file.size,
    mime_type: file.type,
    created_by: userEmail,
  };
  const { data, error } = await client.from("media").insert(row).select(ALL).single();
  if (error) throw error;
  return data as MediaItem;
}

export async function deleteMedia(item: MediaItem) {
  const client = sb();
  await client.storage.from(BLOG_BUCKET).remove([item.path]);
  const { error } = await client.from("media").delete().eq("id", item.id);
  if (error) throw error;
}
