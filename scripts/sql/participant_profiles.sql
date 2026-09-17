-- Private Street Challenge participant profiles.
-- Run this file once in the Supabase SQL Editor after enabling email authentication.

create table if not exists public.participant_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.create_participant_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.participant_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists participant_profile_on_auth_user_created on auth.users;
create trigger participant_profile_on_auth_user_created
after insert on auth.users
for each row execute function public.create_participant_profile();

insert into public.participant_profiles (id)
select id from auth.users
on conflict (id) do nothing;

create or replace function public.set_participant_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists participant_profile_set_updated_at on public.participant_profiles;
create trigger participant_profile_set_updated_at
before update on public.participant_profiles
for each row execute function public.set_participant_profile_updated_at();

alter table public.participant_profiles enable row level security;

revoke all on table public.participant_profiles from anon, authenticated;
grant select on table public.participant_profiles to authenticated;
grant update (display_name) on table public.participant_profiles to authenticated;

drop policy if exists participant_profiles_select_own on public.participant_profiles;
create policy participant_profiles_select_own
on public.participant_profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists participant_profiles_update_own on public.participant_profiles;
create policy participant_profiles_update_own
on public.participant_profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);