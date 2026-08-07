-- Shared Community in Action photo table for Pick It Up Seattle.
-- Stores one uploaded photo per submission for cross-device display.

create extension if not exists pgcrypto;

create table if not exists public.community_action_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  image_path text,
  caption text,
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
      and table_name = 'community_action_photos'
      and constraint_name = 'community_action_photos_moderation_status_check'
  ) then
    alter table public.community_action_photos
      drop constraint community_action_photos_moderation_status_check;
  end if;
end $$;

alter table public.community_action_photos
  add constraint community_action_photos_moderation_status_check
  check (moderation_status in ('pending_review', 'approved', 'rejected', 'removed'));

create index if not exists community_action_photos_moderation_status_idx
  on public.community_action_photos (moderation_status);

create index if not exists community_action_photos_submitted_at_idx
  on public.community_action_photos (submitted_at desc);

create or replace function public.set_community_action_photos_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists community_action_photos_set_updated_at on public.community_action_photos;
create trigger community_action_photos_set_updated_at
before update on public.community_action_photos
for each row
execute procedure public.set_community_action_photos_updated_at();

alter table public.community_action_photos enable row level security;

-- Explicit table-privilege hardening for public roles.
revoke insert, update, delete, truncate, references, trigger
on table public.community_action_photos
from anon, authenticated;

grant select
on table public.community_action_photos
to anon, authenticated;

grant all privileges
on table public.community_action_photos
to service_role;

-- Public can read approved rows only.
drop policy if exists community_action_photos_public_read_approved on public.community_action_photos;
create policy community_action_photos_public_read_approved
on public.community_action_photos
for select
to anon, authenticated
using (moderation_status = 'approved');

-- No direct public writes: no anon/authenticated insert/update/delete policies are created.

-- Server-side management policy for service role.
drop policy if exists community_action_photos_service_role_manage on public.community_action_photos;
create policy community_action_photos_service_role_manage
on public.community_action_photos
for all
to service_role
using (true)
with check (true);
