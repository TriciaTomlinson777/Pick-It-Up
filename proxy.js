import { NextResponse } from 'next/server';

const togetherHosts = new Set(['pickituptogether.org', 'www.pickituptogether.org']);

export function proxy(request) {
  // Preview deployment links must use the same host as email sign-in cookies.
  const branchHost = String(process.env.VERCEL_BRANCH_URL || '').trim();
  if (process.env.VERCEL_ENV === 'preview'
      && /^pick-it-up-ijjl-git-[a-z0-9-]+\.vercel\.app$/.test(branchHost)
      && request.nextUrl.pathname.startsWith('/street-challenge-preview/')
      && request.nextUrl.hostname !== branchHost) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = branchHost;
    const response = NextResponse.redirect(url, 307);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }
  // Keep the Seattle homepage intact; only the Together domain uses this landing page.
  if (request.nextUrl.pathname === '/' && togetherHosts.has(request.nextUrl.hostname.toLowerCase())) {
    const url = request.nextUrl.clone();
    url.pathname = '/together';
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/', '/street-challenge-preview/:path*'] };
