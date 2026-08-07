-- Shared community thank-you notes table for Pick It Up Seattle.
-- Stores note-only and photo+note submissions for cross-device display.

create extension if not exists pgcrypto;

create table if not exists public.community_shares (
  id uuid primary key default gen_random_uuid(),
  note text not null,
  image_url text,
  image_path text,
  moderation_status text not null default 'approved',
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
      and table_name = 'community_shares'
      and constraint_name = 'community_shares_moderation_status_check'
  ) then
    alter table public.community_shares
      drop constraint community_shares_moderation_status_check;
  end if;
end $$;

alter table public.community_shares
  add constraint community_shares_moderation_status_check
  check (moderation_status in ('approved', 'rejected', 'removed'));

create index if not exists community_shares_moderation_status_idx
  on public.community_shares (moderation_status);

create index if not exists community_shares_submitted_at_idx
  on public.community_shares (submitted_at desc);

create or replace function public.set_community_shares_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists community_shares_set_updated_at on public.community_shares;
create trigger community_shares_set_updated_at
before update on public.community_shares
for each row
execute procedure public.set_community_shares_updated_at();

alter table public.community_shares enable row level security;

-- Explicit table-privilege hardening for public roles.
revoke insert, update, delete, truncate, references, trigger
on table public.community_shares
from anon, authenticated;

grant select
on table public.community_shares
to anon, authenticated;

grant all privileges
on table public.community_shares
to service_role;

-- Public can read approved rows only.
drop policy if exists community_shares_public_read_approved on public.community_shares;
create policy community_shares_public_read_approved
on public.community_shares
for select
to anon, authenticated
using (moderation_status = 'approved');

-- No direct public writes: no anon/authenticated insert/update/delete policies are created.

-- Server-side management policy for service role.
drop policy if exists community_shares_service_role_manage on public.community_shares;
create policy community_shares_service_role_manage
on public.community_shares
for all
to service_role
using (true)
with check (true);
