import { NextResponse } from 'next/server';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';
import { sendGameSigninEmail } from '@/lib/game-signin-email';
export const dynamic = 'force-dynamic';
const reply = (data, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
export async function GET() {
  try {
    const client = await createParticipantServerClient();
    const { data: { user }, error } = await client.auth.getUser();
    return reply({ signedIn: Boolean(user && !error), hero: user && !error ? user.user_metadata?.game_hero || null : null });
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
      try { await sendGameSigninEmail(email, request); } catch (error) { return reply({ error: error.status === 429 ? 'Wait a minute, then try again.' : 'We couldn’t send the email. Please try again.' }, error.status === 429 ? 429 : 503); }
      return reply({ ok: true });
    }
    const { data: { user }, error } = await client.auth.getUser();
    if (!user || error) return reply({ error: 'Open your email sign-in link first.' }, 401);
    if (body.action === 'save') {
      const name = String(body.name || '').trim();
      const avatar = body.avatar;
      if (!name || name.length > 30 || !Number.isInteger(avatar) || avatar < 0 || avatar > 8) return reply({ error: 'Choose your hero and first name.' }, 400);
      const { error: saveError } = await client.auth.updateUser({ data: { game_hero: { name, avatar } } });
      if (saveError) return reply({ error: 'Your hero couldn’t be saved. Try again.' }, 503);
      return reply({ ok: true, hero: { name, avatar } });
    }
    if (body.action === 'logout') { await client.auth.signOut(); return reply({ ok: true }); }
    return reply({ error: 'Unknown action.' }, 400);
  } catch { return reply({ error: 'Sign-in is unavailable right now. Please try again.' }, 503); }
}
