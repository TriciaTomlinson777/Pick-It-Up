-- Moderated community event listings for the Events connector page.
-- Run this migration in Supabase before enabling submissions.

create extension if not exists pgcrypto;

create table if not exists public.community_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  organization_name text not null,
  event_date date not null,
  start_time time without time zone,
  end_time time without time zone,
  location text not null,
  description text not null,
  event_url text,
  contact_name text,
  contact_email text,
  contact_phone text,
  public_contact_allowed boolean not null default false,
  image_url text,
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected')),
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_events
  alter column start_time drop not null,
  alter column end_time drop not null,
  alter column event_url drop not null,
  add column if not exists contact_phone text,
  add column if not exists public_contact_allowed boolean not null default false;

create index if not exists community_events_public_order_idx
  on public.community_events (status, is_pinned desc, event_date asc, start_time asc);

create or replace function public.community_events_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists community_events_set_updated_at on public.community_events;
create trigger community_events_set_updated_at
before update on public.community_events
for each row execute function public.community_events_set_updated_at();

alter table public.community_events enable row level security;

revoke select, insert, update, delete, truncate, references, trigger
on table public.community_events
from anon, authenticated;

grant all privileges
on table public.community_events
to service_role;
