import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const expected = url.searchParams.get('check');
  const validCheck = /^[0-9a-f-]{36}$/i.test(expected || '');
  const probeReturned = validCheck && request.cookies.get('game_cookie_delivery_check')?.value === expected;
  const authCookiePresent = request.cookies.getAll().some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name));
  let signedIn = false;
  let reason = authCookiePresent ? 'session_rejected' : 'missing_cookie';
  try {
    const client = await createParticipantServerClient();
    const { data: { user }, error } = await client.auth.getUser();
    signedIn = Boolean(user) && !error;
    if (signedIn) reason = 'recognized';
    else if (error && error.name !== 'AuthSessionMissingError'
      && ![400, 401, 403].includes(Number(error.status))) reason = 'unavailable';
  } catch { reason = 'unavailable'; }
  // Presence and outcome only: never log tokens, cookie values, email or profile.
  console.info('street-challenge cookie delivery', {
    validCheck, probeReturned, authCookiePresent, signedIn, reason,
    requestHost: url.hostname,
  });
  const nonce = randomUUID();
  const details = `Sign-in cookie: ${authCookiePresent ? 'PRESENT' : 'MISSING'}; browser check cookie: ${probeReturned ? 'RETURNED' : 'NOT RETURNED'}; sign-in: ${reason}`;
  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Street Challenge sign-in check</title><style nonce="${nonce}">body{margin:0;padding:24px;background:#fff6dc;color:#087c83;font:20px system-ui}main{max-width:480px;margin:12vh auto}p{line-height:1.5}button,a{display:inline-block;padding:14px 18px;border:0;border-radius:16px;background:#ffd45a;color:#087c83;font:inherit;font-weight:700}small{display:block;margin-top:24px;font-size:14px;overflow-wrap:anywhere}</style></head><body><main><h1>${signedIn ? 'Your sign-in is saved!' : 'Your sign-in needs a check'}</h1><p>${signedIn ? 'Opening your game…' : reason === 'unavailable' ? 'We couldn’t check your sign-in just now. Tap Try again.' : 'The email confirmation worked, but this browser did not return a working saved sign-in. Please send this screen to your game helper.'}</p>${signedIn ? '<a href="/street-challenge-preview/index.html?signin=success" id="continue">Continue to the game</a>' : '<button id="retry">Try again</button>'}<small>${details}</small></main><script nonce="${nonce}">${signedIn ? "const next='/street-challenge-preview/index.html?signin=success'+location.hash;document.getElementById('continue').href=next;location.replace(next);" : "document.getElementById('retry').onclick=()=>location.reload();"}</script></body></html>`;
  return new NextResponse(body, { headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'private, no-store',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`,
    'X-Content-Type-Options': 'nosniff',
  } });
}
