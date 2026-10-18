
create table public.game_challenges (
 id text primary key,
 title text not null,
 starts_at timestamptz not null,
 ends_at timestamptz not null check (ends_at > starts_at),
 timezone text not null default 'America/Los_Angeles',
 results_status text not null default 'pending' check (results_status in ('pending','published'))
);
alter table public.game_challenges enable row level security;
revoke all on public.game_challenges from anon, authenticated;
grant select on public.game_challenges to authenticated;
create policy game_challenges_read on public.game_challenges for select to authenticated using (true);
insert into public.game_challenges(id,title,starts_at,ends_at)
select 'seattle-street-'||to_char(m,'YYYY-MM'),to_char(m,'FMMonth YYYY')||' Street Challenge',
 (m - interval '1 day' + interval '18 hours') at time zone 'America/Los_Angeles',
 (m + interval '1 month' - interval '1 day' + interval '18 hours') at time zone 'America/Los_Angeles'
from generate_series(timestamp '2026-10-01',timestamp '2028-09-01',interval '1 month') m;

create table public.game_challenge_entries (
 hero_id uuid not null references public.game_player_profiles(id) on delete cascade,
 challenge_id text not null references public.game_challenges(id),
 user_id uuid not null references auth.users(id) on delete cascade,
 joined_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 screen text not null default 'equipment' check(screen in ('equipment','ready')),
 gear text[] not null default '{}' check(gear <@ array['gloves','grabber','bottle','bag']::text[]),
 done boolean not null default false,
 primary key(hero_id,challenge_id),
 check(not done or gear @> array['gloves','grabber','bottle','bag']::text[])
);
create index game_entries_user_id on public.game_challenge_entries(user_id);
alter table public.game_challenge_entries enable row level security;
revoke all on public.game_challenge_entries from anon,authenticated;
grant select,insert on public.game_challenge_entries to authenticated;
grant update(screen,gear,done,updated_at) on public.game_challenge_entries to authenticated;
create policy game_entries_read on public.game_challenge_entries for select to authenticated using(user_id=(select auth.uid()));
create policy game_entries_join on public.game_challenge_entries for insert to authenticated with check(
 user_id=(select auth.uid()) and exists(select 1 from public.game_player_profiles p where p.id=hero_id and p.user_id=(select auth.uid()))
 and exists(select 1 from public.game_challenges c where c.id=challenge_id and now()>=c.starts_at and now()<c.ends_at)
);
create policy game_entries_update on public.game_challenge_entries for update to authenticated
 using(user_id=(select auth.uid()) and exists(select 1 from public.game_challenges c where c.id=challenge_id and now()>=c.starts_at and now()<c.ends_at))
 with check(user_id=(select auth.uid()) and exists(select 1 from public.game_player_profiles p where p.id=hero_id and p.user_id=(select auth.uid())) and exists(select 1 from public.game_challenges c where c.id=challenge_id and now()>=c.starts_at and now()<c.ends_at));

create function public.game_challenge_state(p_hero_id uuid) returns jsonb
language sql security invoker set search_path='' as $$
 select jsonb_build_object('serverNow',now(),'challenge',(
 select to_jsonb(c) from public.game_challenges c where now()>=c.starts_at and now()<c.ends_at order by c.starts_at desc limit 1
 ),'entry',(
 select to_jsonb(e) from public.game_challenge_entries e join public.game_challenges c on c.id=e.challenge_id
 where e.hero_id=p_hero_id and e.user_id=auth.uid() and now()>=c.starts_at and now()<c.ends_at order by c.starts_at desc limit 1
 ),'previous',(
 select jsonb_build_object('challenge',to_jsonb(c),'entry',to_jsonb(e))
 from public.game_challenge_entries e join public.game_challenges c on c.id=e.challenge_id
 where e.hero_id=p_hero_id and e.user_id=auth.uid() and c.ends_at<=now() order by c.ends_at desc limit 1
 ));
$$;
revoke all on function public.game_challenge_state(uuid) from public,anon;
grant execute on function public.game_challenge_state(uuid) to authenticated;
