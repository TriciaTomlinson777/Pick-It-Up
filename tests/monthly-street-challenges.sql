
begin;
create temporary table game_test_ids as select id as user_id,gen_random_uuid() as hero_id from auth.users limit 1;
grant select on game_test_ids to authenticated;
do $$ begin if not exists(select 1 from game_test_ids) then raise exception 'Test needs an existing account'; end if; end $$;
insert into public.game_player_profiles(id,user_id,name,avatar) select hero_id,user_id,'Temporary verification hero',0 from game_test_ids;
insert into public.game_challenges(id,title,starts_at,ends_at) values ('verification-expired','Test',now()-interval '2 days',now()-interval '1 day');
select set_config('request.jwt.claim.sub',(select user_id::text from game_test_ids),true);
set local role authenticated;
do $$ declare h uuid; c text; s jsonb; begin
 select hero_id into h from game_test_ids;
 s:=public.game_challenge_state(h);
 c:=s->'challenge'->>'id';
 if c is null then raise exception 'No current challenge'; end if;
 insert into public.game_challenge_entries(hero_id,challenge_id,user_id) select h,c,user_id from game_test_ids;
 update public.game_challenge_entries set gear=array['gloves','grabber'],screen='equipment' where hero_id=h and challenge_id=c;
 s:=public.game_challenge_state(h);
 if jsonb_array_length(s->'entry'->'gear')<>2 then raise exception 'Progress did not restore'; end if;
 begin
 insert into public.game_challenge_entries(hero_id,challenge_id,user_id) select h,'verification-expired',user_id from game_test_ids;
 raise exception 'Expired join was allowed';
 exception when insufficient_privilege then null; end;
 begin
 update public.game_challenge_entries set user_id='00000000-0000-0000-0000-000000000001' where hero_id=h;
 raise exception 'Ownership change was allowed';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
do $$ declare h uuid; begin
 select hero_id into h from game_test_ids;
 if exists(select 1 from public.game_challenge_entries where hero_id=h) then raise exception 'Another account could read entry'; end if;
 begin
 insert into public.game_challenge_entries(hero_id,challenge_id,user_id)
 select h,c.id,'00000000-0000-0000-0000-000000000001'::uuid from public.game_challenges c where now()>=starts_at and now()<ends_at limit 1;
 raise exception 'Another account could join as hero';
 exception when insufficient_privilege then null; end;
end $$;
reset role;
rollback;
select 'PASS: join, save, restore, expired join, immutable owner, cross-account isolation; test writes rolled back' as verification;
