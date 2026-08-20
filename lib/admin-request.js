import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {
  BLOG_ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminSessionCookieConfig,
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

// TEMPORARY diagnostic logging for live login troubleshooting; safe to remove once resolved.
const DIAG = '[admin-login-diag]';

export function createAdminLoginResponse(username, password) {
  console.log(DIAG, 'credential validation started');
  const valid = validateAdminCredentials(username, password);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }
  console.log(DIAG, 'credentials validated successfully');

  const response = NextResponse.json({ ok: true });

  console.log(DIAG, 'session token creation started');
  const token = createAdminSessionToken({ adminUser: username });
  console.log(DIAG, 'session token created successfully');

  console.log(DIAG, 'response cookie creation started');
  response.cookies.set(BLOG_ADMIN_COOKIE_NAME, token, getAdminSessionCookieConfig());
  console.log(DIAG, 'response cookie created successfully');

  return response;
}

export function createAdminLogoutResponse() {
  const response = new NextResponse(null, { status: 307 });
  response.headers.set('Location', '/admin/blog/login');
  const expiredCookieConfig = getAdminSessionCookieConfig({
    expires: new Date(0),
    maxAge: 0,
  });

  const sameSiteValue = String(expiredCookieConfig.sameSite || 'lax');
  const normalizedSameSite =
    sameSiteValue.charAt(0).toUpperCase() + sameSiteValue.slice(1);
  const secureFlag = expiredCookieConfig.secure ? '; Secure' : '';
  const adminPathExpiryHeader =
    `${BLOG_ADMIN_COOKIE_NAME}=; Path=/admin; Expires=${expiredCookieConfig.expires.toUTCString()}; ` +
    `Max-Age=0; HttpOnly; SameSite=${normalizedSameSite}${secureFlag}`;

  response.cookies.set(BLOG_ADMIN_COOKIE_NAME, '', expiredCookieConfig);
  response.headers.append('Set-Cookie', adminPathExpiryHeader);
  return response;
}
