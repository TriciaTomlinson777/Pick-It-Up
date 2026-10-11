import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';
import { sendGameSigninEmail, getGameOrigin } from '@/lib/game-signin-email';
export const dynamic = 'force-dynamic';
const reply = (data, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export async function GET(request) {
  try {
    const client = await createParticipantServerClient();
    const { data: { user }, error } = await client.auth.getUser();
    if (new URL(request.url).searchParams.get('diagnostics') === '1') {
      // Report presence only; never expose cookie values, tokens, or player data.
      const sessionCookiePresent = request.cookies.getAll().some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name));
      return reply({
        signedIn: Boolean(user) && !error,
        sessionCookiePresent,
        gameOrigin: getGameOrigin(request),
        reason: !sessionCookiePresent ? 'missing_cookie' : error ? 'session_rejected' : user ? 'recognized' : 'no_user',
      });
    }
    if (!user || error) return reply({ signedIn: false, hero: null, heroes: [] });
    let { data: heroes, error: readError } = await client.from('game_player_profiles').select('id,name,avatar').eq('user_id', user.id).order('created_at');
    if (readError) return reply({ error: 'Your heroes couldn’t be loaded. Try again.' }, 503);
    const legacy = user.user_metadata?.game_hero;
    if (!heroes.length && legacy && typeof legacy.name === 'string' && legacy.name.length <= 30 && Number.isInteger(legacy.avatar) && legacy.avatar >= 0 && legacy.avatar <= 8) {
      const { error: migrateError } = await client.from('game_player_profiles').upsert({ id: user.id, user_id: user.id, name: legacy.name, avatar: legacy.avatar }, { onConflict: 'id', ignoreDuplicates: true });
      if (migrateError) return reply({ error: 'Your hero couldn’t be loaded. Try again.' }, 503);
      const result = await client.from('game_player_profiles').select('id,name,avatar').eq('user_id', user.id).order('created_at');
      if (result.error) return reply({ error: 'Your heroes couldn’t be loaded. Try again.' }, 503);
      heroes = result.data;
    }
    return reply({ signedIn: true, heroes, hero: heroes[0] || null });
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
        ? client.from('game_player_profiles').update({ name, avatar }).eq('id', body.heroId).eq('user_id', user.id)
        : client.from('game_player_profiles').insert({ ...hero, user_id: user.id });
      const { data: saved, error: saveError } = await query.select('id,name,avatar').single();
      if (saveError || !saved) return reply({ error: 'Your hero couldn’t be saved. Try again.' }, 503);
      const { data: heroes, error: readError } = await client.from('game_player_profiles').select('id,name,avatar').eq('user_id', user.id).order('created_at');
      if (readError) return reply({ error: 'Your heroes couldn’t be loaded. Try again.' }, 503);
      return reply({ ok: true, hero: saved, heroes });
    }
    if (body.action === 'logout') { await client.auth.signOut(); return reply({ ok: true }); }
    return reply({ error: 'Unknown action.' }, 400);
  } catch { return reply({ error: 'Sign-in is unavailable right now. Please try again.' }, 503); }
}
