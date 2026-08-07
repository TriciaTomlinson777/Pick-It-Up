-- Shared scenic discoveries table for Pick It Up Seattle.
-- Stores photo + caption submissions for cross-device display.

create extension if not exists pgcrypto;

create table if not exists public.scenic_discoveries (
  id uuid primary key default gen_random_uuid(),
  caption text not null,
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
      and table_name = 'scenic_discoveries'
      and constraint_name = 'scenic_discoveries_moderation_status_check'
  ) then
    alter table public.scenic_discoveries
      drop constraint scenic_discoveries_moderation_status_check;
  end if;
end $$;

alter table public.scenic_discoveries
  add constraint scenic_discoveries_moderation_status_check
  check (moderation_status in ('approved', 'rejected', 'removed'));

create index if not exists scenic_discoveries_moderation_status_idx
  on public.scenic_discoveries (moderation_status);

create index if not exists scenic_discoveries_submitted_at_idx
  on public.scenic_discoveries (submitted_at desc);

create or replace function public.set_scenic_discoveries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists scenic_discoveries_set_updated_at on public.scenic_discoveries;
create trigger scenic_discoveries_set_updated_at
before update on public.scenic_discoveries
for each row
execute procedure public.set_scenic_discoveries_updated_at();

alter table public.scenic_discoveries enable row level security;

-- Explicit table-privilege hardening for public roles.
revoke insert, update, delete, truncate, references, trigger
on table public.scenic_discoveries
from anon, authenticated;

grant select
on table public.scenic_discoveries
to anon, authenticated;

grant all privileges
on table public.scenic_discoveries
to service_role;

-- Public can read approved rows only.
drop policy if exists scenic_discoveries_public_read_approved on public.scenic_discoveries;
create policy scenic_discoveries_public_read_approved
on public.scenic_discoveries
for select
to anon, authenticated
using (moderation_status = 'approved');

-- No direct public writes: no anon/authenticated insert/update/delete policies are created.

-- Server-side management policy for service role.
drop policy if exists scenic_discoveries_service_role_manage on public.scenic_discoveries;
create policy scenic_discoveries_service_role_manage
on public.scenic_discoveries
for all
to service_role
using (true)
with check (true);
