import { NextResponse } from 'next/server';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';
export const dynamic = 'force-dynamic';
const reply=(data,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function context(heroId){
 if(!uuid.test(heroId||''))return {error:'Choose a saved hero.',status:400};
 const client=await createParticipantServerClient();
 const {data:{user},error}=await client.auth.getUser();
 if(error||!user)return {error:'Sign in to continue.',status:401};
 const {data:hero,error:heroError}=await client.from('game_player_profiles').select('id').eq('id',heroId).eq('user_id',user.id).maybeSingle();
 if(heroError)throw heroError;
 if(!hero)return {error:'Choose one of your heroes.',status:404};
 return {client,user};
}
async function state(client,heroId){
 const {data,error}=await client.rpc('game_challenge_state',{p_hero_id:heroId});
 if(error)throw error;
 return data;
}
export async function GET(request){
 try{const heroId=new URL(request.url).searchParams.get('heroId');const c=await context(heroId);
 if(c.error)return reply({error:c.error},c.status);
 return reply(await state(c.client,heroId));
 }catch{return reply({error:'Your challenge could not be loaded. Try again.'},503)}
}
export async function POST(request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'Open the game to continue.'},403);
 try{
 const body=await request.json(),c=await context(body.heroId);
 if(c.error)return reply({error:c.error},c.status);
 const current=await state(c.client,body.heroId),challenge=current.challenge;
 if(!challenge||body.challengeId!==challenge.id)return reply({error:'This challenge has ended. Return home for the next challenge.',ended:true},409);
 if(body.action==='join'){
 if(!current.entry){
 const {error}=await c.client.from('game_challenge_entries').insert({hero_id:body.heroId,challenge_id:challenge.id,user_id:c.user.id});
 if(error&&error.code!=='23505')throw error;
 }
 }else if(body.action==='progress'){
 const gear=body.gear;
 if(!Array.isArray(gear)||gear.length>4||new Set(gear).size!==gear.length||gear.some(k=>!['gloves','grabber','bottle','bag'].includes(k))||typeof body.done!=='boolean'||(body.done&&gear.length!==4)||!['equipment','ready'].includes(body.screen)||((body.screen==='ready')!==body.done))return reply({error:'Invalid game progress.'},400);
 if(!current.entry)return reply({error:'Join this challenge first.'},409);
 const {data,error}=await c.client.from('game_challenge_entries').update({gear,done:body.done,screen:body.screen,updated_at:new Date().toISOString()}).eq('hero_id',body.heroId).eq('challenge_id',challenge.id).eq('user_id',c.user.id).select('hero_id').maybeSingle();
 if(error)throw error;
 if(!data)return reply({error:'This challenge has ended.',ended:true},409);
 }else return reply({error:'Unknown action.'},400);
 return reply(await state(c.client,body.heroId));
 }catch{return reply({error:'Your progress could not be saved. Please try again.'},503)}
}