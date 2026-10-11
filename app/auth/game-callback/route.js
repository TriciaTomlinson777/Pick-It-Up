import { NextResponse } from 'next/server';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';
export async function GET(request) {
  const url = new URL(request.url);
  let ok = false;
  try {
    const code = url.searchParams.get('code');
    const tokenHash = url.searchParams.get('token_hash');
    if (tokenHash) { const client = await createParticipantServerClient(); const { error } = await client.auth.verifyOtp({ token_hash: tokenHash, type: 'email' }); ok = !error; }
    else if (code) { const client = await createParticipantServerClient(); const { error } = await client.auth.exchangeCodeForSession(code); ok = !error; }
  } catch {}
  const response = NextResponse.redirect(new URL('/street-challenge-preview/index.html?signin=' + (ok ? 'success' : 'expired'), url.origin));
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('Referrer-Policy', 'no-referrer');
  return response;
}
