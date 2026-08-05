import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  BLOG_ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieConfig,
  validateAdminCredentials,
  verifyAdminSessionToken,
} from './admin-session';

export async function getVerifiedAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(BLOG_ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const verification = verifyAdminSessionToken(token);
  if (!verification.ok) {
    return null;
  }

  return verification;
}

export function requireAdminApiSession(session) {
  if (session) {
    return null;
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function createAdminLoginResponse(username, password) {
  const valid = validateAdminCredentials(username, password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  const token = createAdminSessionToken({ adminUser: username });
  response.cookies.set(BLOG_ADMIN_COOKIE_NAME, token, getAdminCookieConfig());
  return response;
}

export function createAdminLogoutResponse() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(BLOG_ADMIN_COOKIE_NAME, '', {
    ...getAdminCookieConfig(),
    maxAge: 0,
  });
  return response;
}
