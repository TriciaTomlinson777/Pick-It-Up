-- Blog posts table for Pick It Up Seattle
create extension if not exists pgcrypto;

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  author text not null,
  category text not null default 'Volunteer Stories',
  preview_text text not null,
  body text not null,
  featured_image_url text,
  featured_image_path text,
  is_featured boolean not null default false,
  submission_photo_urls jsonb not null default '[]'::jsonb,
  submission_photo_paths jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  rejection_reason text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts
  add column if not exists category text not null default 'Volunteer Stories',
  add column if not exists is_featured boolean not null default false,
  add column if not exists submission_photo_urls jsonb not null default '[]'::jsonb,
  add column if not exists submission_photo_paths jsonb not null default '[]'::jsonb,
  add column if not exists submitted_at timestamptz not null default now(),
  add column if not exists reviewed_at timestamptz,
  add column if not exists rejection_reason text;

do $$
begin
  if exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'blog_posts'
      and constraint_name = 'blog_posts_status_check'
  ) then
    alter table public.blog_posts drop constraint blog_posts_status_check;
  end if;
end $$;

alter table public.blog_posts
  add constraint blog_posts_status_check
  check (status in ('draft', 'pending_review', 'published', 'rejected', 'archived'));

create index if not exists blog_posts_status_published_at_idx
  on public.blog_posts (status, published_at desc);

create index if not exists blog_posts_status_submitted_at_idx
  on public.blog_posts (status, submitted_at desc);

create index if not exists blog_posts_featured_idx
  on public.blog_posts (is_featured, published_at desc);

create index if not exists blog_posts_category_idx
  on public.blog_posts (category);

create index if not exists blog_posts_created_at_idx
  on public.blog_posts (created_at desc);

create or replace function public.set_blog_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row
execute procedure public.set_blog_posts_updated_at();

alter table public.blog_posts enable row level security;

-- Public reads only published posts.
drop policy if exists blog_posts_public_read_published on public.blog_posts;
create policy blog_posts_public_read_published
on public.blog_posts
for select
to anon, authenticated
using (status = 'published' and published_at is not null and published_at <= now());

-- Write access should happen via server-side service role only.
