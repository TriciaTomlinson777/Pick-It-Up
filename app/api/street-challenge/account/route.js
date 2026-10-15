import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';
import { sendGameSigninEmail, getGameOrigin } from '@/lib/game-signin-email';
export const dynamic = 'force-dynamic';
const reply = (data, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export async function GET(request) {
  try {
    const sessionCookiePresent = request.cookies.getAll().some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name));
    const client = await createParticipantServerClient();
    const { data: { user }, error } = await client.auth.getUser();
    if (error) {
      const status = Number(error.status) || 0;
      console.warn('street-challenge auth', {
        code: typeof error.code === 'string' ? error.code : 'unknown',
        status,
        name: typeof error.name === 'string' ? error.name : 'unknown',
        sessionCookiePresent,
        reason: !sessionCookiePresent ? 'missing_cookie' : 'session_rejected',
        requestHost: new URL(request.url).hostname,
        gameHost: new URL(getGameOrigin(request)).hostname,
      });
      // Only definite missing/invalid sessions should ask for a new link.
      const invalidSession = status === 401 || status === 403
        || error.name === 'AuthSessionMissingError'
        || ['session_not_found', 'refresh_token_not_found', 'refresh_token_already_used',
            'bad_jwt', 'user_not_found'].includes(error.code);
      if (!invalidSession) {
        return reply({ unavailable: true, error: 'Your sign-in could not be checked. Try again in a moment.' }, 503);
      }
    }
    if (new URL(request.url).searchParams.get('diagnostics') === '1') {
      // Report presence only; never expose cookie values, tokens, or player data.
      return reply({
        signedIn: Boolean(user) && !error,
        sessionCookiePresent,
        gameOrigin: getGameOrigin(request),
        reason: !sessionCookiePresent ? 'missing_cookie' : error ? 'session_rejected' : user ? 'recognized' : 'no_user',
      });
    }
    if (!user || error) return reply({ signedIn: false, hero: null, heroes: [] });
    let { data: heroes, error: readError } = await client.from('game_player_profiles').select('id,name,avatar,hero_level,hero_title,total_items,cleanup_count').eq('user_id', user.id).order('created_at');
    if (readError) return reply({ error: 'Your heroes couldn’t be loaded. Try again.' }, 503);
    const legacy = user.user_metadata?.game_hero;
    if (!heroes.length && legacy && typeof legacy.name === 'string' && legacy.name.length <= 30 && Number.isInteger(legacy.avatar) && legacy.avatar >= 0 && legacy.avatar <= 8) {
      const { error: migrateError } = await client.from('game_player_profiles').upsert({ id: user.id, user_id: user.id, name: legacy.name, avatar: legacy.avatar }, { onConflict: 'id', ignoreDuplicates: true });
      if (migrateError) return reply({ error: 'Your hero couldn’t be loaded. Try again.' }, 503);
      const result = await client.from('game_player_profiles').select('id,name,avatar,hero_level,hero_title,total_items,cleanup_count').eq('user_id', user.id).order('created_at');
      if (result.error) return reply({ error: 'Your heroes couldn’t be loaded. Try again.' }, 503);
      heroes = result.data;
    }
    return reply({ signedIn: true, email: user.email || '', heroes, hero: heroes[0] || null });
  } catch { return reply({ signedIn: false, unavailable: true }); }
}
export async function POST(request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return reply({ error: 'Please open the game and try again.' }, 403);
  try {
    const body = await request.json();
    const client = await createParticipantServerClient();
    if (body.action === 'send') {
      const email = String(body.email || '').trim().toLowerCase();
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply({ error: 'Check your email address.' }, 400);
      try { await sendGameSigninEmail(email, request, body.hero); } catch (error) { return reply({ error: error.status === 429 ? 'Wait a minute, then try again.' : 'We couldn’t send the email. Please try again.' }, error.status === 429 ? 429 : 503); }
      return reply({ ok: true });
    }
    const { data: { user }, error } = await client.auth.getUser();
    if (!user || error) return reply({ error: 'Open your email sign-in link first.' }, 401);
    if (body.action === 'save') {
      const name = String(body.name || '').trim();
      const avatar = body.avatar;
      if (!name || name.length > 30 || !Number.isInteger(avatar) || avatar < 0 || avatar > 8) return reply({ error: 'Choose your hero and first name.' }, 400);
      if (body.heroId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.heroId)) return reply({ error: 'Choose one of your saved heroes.' }, 400);
      const hero = { id: body.heroId || randomUUID(), name, avatar };
      const query = body.heroId
        ? client.from('game_player_profiles').update({ avatar }).eq('id', body.heroId).eq('user_id', user.id)
        : client.from('game_player_profiles').insert({ ...hero, user_id: user.id });
      const { data: saved, error: saveError } = await query.select('id,name,avatar,hero_level,hero_title,total_items,cleanup_count').single();
      if (saveError || !saved) return reply({ error: 'Your hero couldn’t be saved. Try again.' }, 503);
      const { data: heroes, error: readError } = await client.from('game_player_profiles').select('id,name,avatar,hero_level,hero_title,total_items,cleanup_count').eq('user_id', user.id).order('created_at');
      if (readError) return reply({ error: 'Your heroes couldn’t be loaded. Try again.' }, 503);
      return reply({ ok: true, hero: saved, heroes });
    }
    if (body.action === 'resume') {
      const heroId = String(body.heroId || '');
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(heroId)) return reply({ error: 'Choose one of your saved heroes.' }, 400);
      const { data: hero, error: heroError } = await client.from('game_player_profiles')
        .select('id,name,avatar,hero_level,hero_title,total_items,cleanup_count')
        .eq('id', heroId).eq('user_id', user.id).maybeSingle();
      if (heroError) return reply({ error: 'Your hero couldn’t be loaded. Try again.' }, 503);
      if (!hero) return reply({ error: 'Choose one of your saved heroes.' }, 404);
      const { error: historyError } = await client.rpc('record_game_player_login', { p_hero_id: heroId });
      if (historyError) return reply({ error: 'Your saved progress couldn’t be recorded. Try again.' }, 503);
      const { data: latestHistory, error: latestError } = await client.from('game_player_history')
        .select('event_type,hero_level,hero_title,total_items,cleanup_count,challenge_id,screen,gear,done,star_color,recorded_at')
        .eq('hero_id', heroId).eq('user_id', user.id)
        .order('recorded_at', { ascending: false }).limit(1).maybeSingle();
      if (latestError) return reply({ error: 'Your saved progress couldn’t be loaded. Try again.' }, 503);
      return reply({ ok: true, hero, latestHistory });
    }
    if (body.action === 'logout') {
      const { error: logoutError } = await client.auth.signOut({ scope: 'local' });
      if (logoutError) return reply({ error: 'We couldn’t sign you out. Please try again.' }, 503);
      return reply({ ok: true });
    }
    return reply({ error: 'Unknown action.' }, 400);
  } catch { return reply({ error: 'Sign-in is unavailable right now. Please try again.' }, 503); }
}
