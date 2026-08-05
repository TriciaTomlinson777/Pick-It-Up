import crypto from 'crypto';

export const BLOG_ADMIN_COOKIE_NAME = 'pick_it_up_blog_admin_session';
const DEFAULT_SESSION_HOURS = 12;

function getSecret() {
  const secret = (process.env.BLOG_ADMIN_SESSION_SECRET || '').trim();
  if (!secret) {
    throw new Error('BLOG_ADMIN_SESSION_SECRET is not set.');
  }

  return secret;
}

function base64UrlEncode(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4;
  const withPad = pad === 0 ? normalized : `${normalized}${'='.repeat(4 - pad)}`;
  return Buffer.from(withPad, 'base64').toString('utf8');
}

function signPayload(payload, secret) {
  return base64UrlEncode(
    crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('base64')
  );
}

export function createAdminSessionToken({ adminUser = 'admin' } = {}) {
  const secret = getSecret();
  const expiresAt = Date.now() + DEFAULT_SESSION_HOURS * 60 * 60 * 1000;
  const payload = JSON.stringify({ adminUser, expiresAt });
  const encodedPayload = base64UrlEncode(payload);
  const signature = signPayload(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { ok: false };
  }

  const secret = getSecret();
  const [encodedPayload, signature] = token.split('.');
  const expectedSignature = signPayload(encodedPayload, secret);

  const givenBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    givenBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(givenBuffer, expectedBuffer)
  ) {
    return { ok: false };
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const expiresAt = Number(payload.expiresAt || 0);

    if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
      return { ok: false };
    }

    return { ok: true, adminUser: payload.adminUser || 'admin', expiresAt };
  } catch {
    return { ok: false };
  }
}

export function validateAdminCredentials(username, password) {
  const expectedUsername = (process.env.BLOG_ADMIN_USERNAME || 'admin').trim();
  const expectedPassword = (process.env.BLOG_ADMIN_PASSWORD || '').trim();

  if (!expectedPassword) {
    throw new Error('BLOG_ADMIN_PASSWORD is not set.');
  }

  return username === expectedUsername && password === expectedPassword;
}

export function getAdminCookieConfig() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: DEFAULT_SESSION_HOURS * 60 * 60,
  };
}
