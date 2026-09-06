-- ============================================================================
-- Brahmanandam Hospital — blog CMS schema
-- Run in: Supabase dashboard → SQL Editor → New query → Run
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- categories
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  slug        text not null unique,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- --------------------------------------------------------------------- blogs
create table if not exists public.blogs (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique
                     check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  excerpt          text,
  -- Structured blocks, never raw HTML:
  -- { "blocks": [ { "type": "h2", "text": "…" }, { "type":"ul", "items":[…] }, … ] }
  content          jsonb not null default '{"blocks":[]}'::jsonb,
  featured_image   text,
  image_alt        text,
  category         text,
  tags             text[] not null default '{}',
  seo_title        text,
  meta_description text,
  -- The primary query this post targets; drives the SEO score.
  focus_keyword    text,
  read_time        int,
  author           text,
  status           text not null default 'draft'
                     check (status in ('draft','scheduled','published','archived')),
  -- Author-set publish date: what the editor shows, what the public date and
  -- the sitemap use.
  publish_at       timestamptz,
  -- Internal stamp of when the post first went live; never moves afterwards.
  published_at     timestamptz,
  time_zone        text not null default 'Asia/Kolkata',
  related_blogs    text[] not null default '{}',
  faq              jsonb not null default '[]'::jsonb,
  canonical_url    text,
  og_image         text,
  twitter_image    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       text,
  updated_by       text,
  version          int not null default 1,

  -- A live or scheduled post must carry a publish date.
  constraint blogs_publish_at_required
    check (status not in ('published','scheduled') or publish_at is not null)
);

create index if not exists blogs_publish_at_idx on public.blogs (publish_at desc);
create index if not exists blogs_status_idx     on public.blogs (status);
create index if not exists blogs_category_idx   on public.blogs (category);
create index if not exists blogs_slug_idx       on public.blogs (slug);

-- Old slugs keep resolving after a rename.
create table if not exists public.blog_slug_redirects (
  old_slug   text primary key
               check (old_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  blog_id    uuid not null references public.blogs (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------ blog_versions
create table if not exists public.blog_versions (
  id         uuid primary key default gen_random_uuid(),
  blog_id    uuid not null references public.blogs (id) on delete cascade,
  version    int  not null,
  -- Full row snapshot at save time, for restore.
  snapshot   jsonb not null,
  created_at timestamptz not null default now(),
  created_by text,
  unique (blog_id, version)
);

create index if not exists blog_versions_blog_idx
  on public.blog_versions (blog_id, version desc);

-- --------------------------------------------------------------------- media
create table if not exists public.media (
  id         uuid primary key default gen_random_uuid(),
  path       text not null unique,      -- storage object path
  url        text not null,             -- public URL
  alt        text,
  width      int,
  height     int,
  size_bytes int,
  mime_type  text,
  created_at timestamptz not null default now(),
  created_by text
);

-- ------------------------------------------------------- deploy bookkeeping
-- Single row; lets the cron job avoid build-storming.
create table if not exists public.deploy_state (
  id              int primary key default 1 check (id = 1),
  last_dispatched timestamptz not null default 'epoch',
  last_reason     text,
  constraint deploy_state_singleton check (id = 1)
);

insert into public.deploy_state (id) values (1) on conflict (id) do nothing;

-- -------------------------------------------------- updated_at auto-trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
  before update on public.blogs
  for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
--
-- THE VISIBILITY RULE, enforced in the database:
--     status = 'published'
--     OR (status = 'scheduled' AND publish_at <= now())
--
-- A scheduled post becomes visible because the clock moved — no cron flips it.
-- Drafts, archived posts and future-scheduled posts can never leak through the
-- anon API even if the frontend asks for them.
-- ============================================================================

alter table public.blogs               enable row level security;
alter table public.blog_versions       enable row level security;
alter table public.blog_slug_redirects enable row level security;
alter table public.categories          enable row level security;
alter table public.media               enable row level security;
alter table public.deploy_state        enable row level security;

-- ---- blogs -----------------------------------------------------------------
drop policy if exists blogs_public_read on public.blogs;
create policy blogs_public_read
  on public.blogs
  for select
  to anon
  using (
    status = 'published'
    or (status = 'scheduled' and publish_at <= now())
  );

drop policy if exists blogs_admin_all on public.blogs;
create policy blogs_admin_all
  on public.blogs
  for all
  to authenticated
  using (true)
  with check (true);

-- ---- categories ------------------------------------------------------------
drop policy if exists categories_public_read on public.categories;
create policy categories_public_read
  on public.categories for select to anon using (true);

drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_all
  on public.categories for all to authenticated
  using (true) with check (true);

-- ---- slug redirects --------------------------------------------------------
drop policy if exists redirects_public_read on public.blog_slug_redirects;
create policy redirects_public_read
  on public.blog_slug_redirects for select to anon using (true);

drop policy if exists redirects_admin_all on public.blog_slug_redirects;
create policy redirects_admin_all
  on public.blog_slug_redirects for all to authenticated
  using (true) with check (true);

-- ---- media -----------------------------------------------------------------
drop policy if exists media_public_read on public.media;
create policy media_public_read
  on public.media for select to anon using (true);

drop policy if exists media_admin_all on public.media;
create policy media_admin_all
  on public.media for all to authenticated
  using (true) with check (true);

-- ---- versions & deploy state: admin only ----------------------------------
drop policy if exists versions_admin_all on public.blog_versions;
create policy versions_admin_all
  on public.blog_versions for all to authenticated
  using (true) with check (true);

drop policy if exists deploy_state_admin_all on public.deploy_state;
create policy deploy_state_admin_all
  on public.deploy_state for all to authenticated
  using (true) with check (true);

-- ============================================================================
-- Storage bucket for editor images
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

drop policy if exists "blog images public read" on storage.objects;
create policy "blog images public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'blog-images');

drop policy if exists "blog images admin write" on storage.objects;
create policy "blog images admin write"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'blog-images');

drop policy if exists "blog images admin update" on storage.objects;
create policy "blog images admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images');

drop policy if exists "blog images admin delete" on storage.objects;
create policy "blog images admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images');

-- ============================================================================
-- Seed the categories already used by the hand-written articles
-- ============================================================================
insert into public.categories (name, slug) values
  ('Hospital',         'hospital'),
  ('Cardiology',       'cardiology'),
  ('General Medicine', 'general-medicine'),
  ('Paediatrics',      'paediatrics'),
  ('Health Tips',      'health-tips')
on conflict (name) do nothing;
