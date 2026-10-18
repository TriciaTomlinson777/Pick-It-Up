import { readGameSigninDraft, getGameOrigin } from '@/lib/game-signin-email';
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getParticipantSupabaseConfig } from '@/lib/supabase/participant-config';
import { randomUUID } from 'node:crypto';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const gameOrigin = getGameOrigin(request);
  // Verify the email token on the same host used by the saved game link.
  // This must happen before cookies are written: one host cannot set another's cookies.
  if (url.searchParams.get('token_hash') && url.origin !== gameOrigin) {
    const canonical = new URL(url.pathname + url.search, gameOrigin);
    const redirect = NextResponse.redirect(canonical);
    redirect.headers.set('Cache-Control', 'private, no-store');
    redirect.headers.set('Referrer-Policy', 'no-referrer');
    return redirect;
  }
  const target = new URL('/street-challenge-preview/index.html?signin=expired', url.origin);
  const response = NextResponse.redirect(target);
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');

  let ok = false;
  let cookiesWritten = 0;
  let verification = 'not_attempted';
  try {
    const code = url.searchParams.get('code');
    const tokenHash = url.searchParams.get('token_hash');
    if (tokenHash || code) {
      const { url: supabaseUrl, publishableKey } = getParticipantSupabaseConfig();
      // Write every session-cookie chunk directly onto the redirect we return.
      // Host-only cookies keep the game session on the preview used to request the link.
      const client = createServerClient(supabaseUrl, publishableKey, {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            for (const { name, value, options } of cookiesToSet) {
              cookiesWritten += 1;
              response.cookies.set(name, value, {
                ...options,
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: options?.maxAge === 0 ? 0 : 60 * 60 * 24 * 30,
              });
            }
          },
        },
      });
      const { error } = tokenHash
        ? await client.auth.verifyOtp({ token_hash: tokenHash, type: 'email' })
        : await client.auth.exchangeCodeForSession(code);
      ok = !error;
      verification = error ? `rejected:${String(error.code || error.name || 'unknown').slice(0, 64)}` : 'verified';
      // A used email link must not send a still-signed-in player back to sign-in.
      // Validate the existing session with Auth; never trust cookie presence alone.
      if (error) {
        const { data: { user }, error: sessionError } = await client.auth.getUser();
        if (user && !sessionError) target.searchParams.set('signin', 'success');
      }
    }
  } catch (error) {
    verification = `exception:${String(error?.name || 'unknown').slice(0, 64)}`;
  }
  // Log only delivery metadata. Never log email addresses, tokens, cookie names or values.
  console.info('street-challenge callback delivery', {
    verification, cookiesWritten, callbackHost: url.hostname,
    gameHost: new URL(gameOrigin).hostname, redirectToCheck: ok,
  });
  if (ok) {
    // Check the browser's first return before claiming the sign-in was saved.
    // The probe is not an authentication credential and grants no access.
    const check = randomUUID();
    response.cookies.set('game_cookie_delivery_check', check, {
      path: '/auth/game-session-check', httpOnly: true, sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production', maxAge: 300,
    });
    target.pathname = '/auth/game-session-check';
    target.searchParams.set('check', check);
    target.searchParams.set('signin', 'success');
    const hero = readGameSigninDraft(url.searchParams.get('draft'), url.searchParams.get('token_hash'));
    if (hero) target.hash = new URLSearchParams({ hero: JSON.stringify(hero) }).toString();
  }
  response.headers.set('Location', target.href);
  return response;
}
