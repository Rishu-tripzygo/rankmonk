-- RankMonk blog posts.
-- Run once in Supabase: Dashboard → SQL Editor → paste → Run (or `supabase db push`).
-- Access is server-side only (service role key); RLS is on with no policies, so the
-- public anon key can neither read nor write this table.

create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique
                  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 120),
  title           text not null check (char_length(title) between 10 and 120),
  description     text not null check (char_length(description) between 50 and 200),
  content         text not null check (char_length(content) between 300 and 100000),
  category        text not null
                  check (category in ('Local SEO', 'Google Business Profile', 'Reviews', 'AI search', 'Multi-location')),
  tags            text[] not null default '{}',
  keywords        text[] not null default '{}',
  cover_image_url text,
  cover_image_alt text,
  author_name     text not null default 'RankMonk Team',
  status          text not null default 'published' check (status in ('draft', 'published')),
  reading_minutes int  not null default 1 check (reading_minutes > 0),
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint published_has_date check (status = 'draft' or published_at is not null)
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (published_at desc) where status = 'published';
create index if not exists blog_posts_category_idx
  on public.blog_posts (category, published_at desc) where status = 'published';

create or replace function public.blog_posts_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists blog_posts_updated_at on public.blog_posts;
create trigger blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.blog_posts_touch_updated_at();

alter table public.blog_posts enable row level security;
