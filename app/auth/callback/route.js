import { NextResponse } from 'next/server';
import { createParticipantServerClient } from '@/lib/supabase/participant-server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/street-challenge?error=invalid_callback', requestUrl.origin));
  }

  const supabase = await createParticipantServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL('/street-challenge?error=verification_failed', requestUrl.origin));
  }

  return NextResponse.redirect(new URL('/street-challenge/profile', requestUrl.origin));
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const email = String(body?.email || '').trim().toLowerCase();
  const token = String(body?.token || '').replace(/\s+/g, '');
  if (!email || !/^\d{6,8}$/.test(token)) {
    return NextResponse.json({ error: 'Enter the code from your email.' }, { status: 400 });
  }

  const supabase = await createParticipantServerClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

  if (error) {
    return NextResponse.json({ error: 'That code is invalid or has expired.' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}