-- Shared community before/after gallery table for Pick It Up Seattle
-- This table stores community submissions only (not permanent homepage art).

create extension if not exists pgcrypto;

create table if not exists public.community_before_after_pairs (
  id uuid primary key default gen_random_uuid(),
  before_image_url text not null,
  after_image_url text not null,
  before_image_path text,
  after_image_path text,
  pair_caption text,
  moderation_status text not null default 'pending_review',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'community_before_after_pairs'
      and constraint_name = 'community_before_after_pairs_moderation_status_check'
  ) then
    alter table public.community_before_after_pairs
      drop constraint community_before_after_pairs_moderation_status_check;
  end if;
end $$;

alter table public.community_before_after_pairs
  add constraint community_before_after_pairs_moderation_status_check
  check (moderation_status in ('pending_review', 'approved', 'rejected', 'removed'));

create index if not exists community_before_after_pairs_moderation_status_idx
  on public.community_before_after_pairs (moderation_status);

create index if not exists community_before_after_pairs_submitted_at_idx
  on public.community_before_after_pairs (submitted_at desc);

create or replace function public.set_community_before_after_pairs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists community_before_after_pairs_set_updated_at on public.community_before_after_pairs;
create trigger community_before_after_pairs_set_updated_at
before update on public.community_before_after_pairs
for each row
execute procedure public.set_community_before_after_pairs_updated_at();

alter table public.community_before_after_pairs enable row level security;

-- Explicit table-privilege hardening for public roles.
revoke insert, update, delete, truncate, references, trigger
on table public.community_before_after_pairs
from anon, authenticated;

grant select
on table public.community_before_after_pairs
to anon, authenticated;

grant all privileges
on table public.community_before_after_pairs
to service_role;

-- Public can read approved rows only.
drop policy if exists community_before_after_pairs_public_read_approved on public.community_before_after_pairs;
create policy community_before_after_pairs_public_read_approved
on public.community_before_after_pairs
for select
to anon, authenticated
using (moderation_status = 'approved');

-- No direct public writes: no anon/authenticated insert/update/delete policies are created.

-- Server-side management policy for service role.
drop policy if exists community_before_after_pairs_service_role_manage on public.community_before_after_pairs;
create policy community_before_after_pairs_service_role_manage
on public.community_before_after_pairs
for all
to service_role
using (true)
with check (true);
