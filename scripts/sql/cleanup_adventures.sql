-- Cleanup Adventures shared event storage (separate from Track It)

create extension if not exists pgcrypto;

create table if not exists public.cleanup_adventures_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  start_time time without time zone not null,
  end_time time without time zone not null,
  general_location text not null,
  meeting_place text not null,
  description text not null,
  organizer_name text not null,
  max_volunteers integer null check (max_volunteers is null or max_volunteers > 0),
  signed_up_count integer not null default 0 check (signed_up_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (max_volunteers is null or signed_up_count <= max_volunteers)
);

create index if not exists cleanup_adventures_events_created_at_idx
  on public.cleanup_adventures_events (created_at desc);

create index if not exists cleanup_adventures_events_event_date_idx
  on public.cleanup_adventures_events (event_date asc);

create or replace function public.cleanup_adventures_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cleanup_adventures_events_set_updated_at
  on public.cleanup_adventures_events;

create trigger cleanup_adventures_events_set_updated_at
before update on public.cleanup_adventures_events
for each row
execute function public.cleanup_adventures_set_updated_at();

create table if not exists public.cleanup_adventures_organizers (
  event_id uuid primary key references public.cleanup_adventures_events(id) on delete cascade,
  organizer_email text not null,
  organizer_phone text null,
  created_at timestamptz not null default now()
);

-- Atomic, concurrency-safe signup increment with max-volunteer enforcement.
create or replace function public.increment_cleanup_adventure_signup(p_event_id uuid)
returns table (
  result_status text,
  event_id uuid,
  signed_up_count integer,
  max_volunteers integer
)
language plpgsql
as $$
declare
  v_event public.cleanup_adventures_events%rowtype;
begin
  select *
  into v_event
  from public.cleanup_adventures_events
  where id = p_event_id
  for update;

  if not found then
    return query
    select 'not_found'::text, p_event_id, null::integer, null::integer;
    return;
  end if;

  if v_event.max_volunteers is not null and v_event.signed_up_count >= v_event.max_volunteers then
    return query
    select 'full'::text, v_event.id, v_event.signed_up_count, v_event.max_volunteers;
    return;
  end if;

  update public.cleanup_adventures_events
  set signed_up_count = cleanup_adventures_events.signed_up_count + 1
  where id = v_event.id
  returning * into v_event;

  return query
  select 'ok'::text, v_event.id, v_event.signed_up_count, v_event.max_volunteers;
end;
$$;