import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase browser/build client.
 *
 * ONLY the publishable (anon) key is ever referenced here. The service-role key
 * must never appear in anything that reaches a browser — `npm run verify:bundle`
 * greps the built output to prove it.
 *
 * Reads are additionally constrained by RLS, so even a tampered client cannot
 * pull a draft.
 */

const url =
  (import.meta.env?.VITE_SUPABASE_URL as string | undefined) ??
  (typeof process !== "undefined" ? process.env.VITE_SUPABASE_URL : undefined);

const anonKey =
  (import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ??
  (typeof process !== "undefined"
    ? process.env.VITE_SUPABASE_PUBLISHABLE_KEY
    : undefined);

/** True when the CMS is wired up. The site works fine without it. */
export const cmsConfigured = Boolean(url && anonKey);

/**
 * Instant rollback switch. Set `VITE_CMS_ENABLED=false` to serve only the
 * hand-written articles and skip Supabase entirely.
 */
export const cmsEnabled =
  cmsConfigured &&
  ((import.meta.env?.VITE_CMS_ENABLED as string | undefined) ??
    (typeof process !== "undefined" ? process.env.VITE_CMS_ENABLED : undefined)) !==
    "false";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!cmsConfigured) return null;
  if (!client) {
    client = createClient(url as string, anonKey as string, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
        detectSessionInUrl: typeof window !== "undefined",
      },
    });
  }
  return client;
}

export const SUPABASE_URL = url ?? "";
export const BLOG_BUCKET = "blog-images";
