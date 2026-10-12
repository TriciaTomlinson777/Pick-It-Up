import { NextResponse } from 'next/server';

const togetherHosts = new Set(['pickituptogether.org', 'www.pickituptogether.org']);
const gamePreviewHost = 'pick-it-up-ijjl-git-street-challenge-9586ff-pick-it-up-seattle.vercel.app';

export function proxy(request) {
  // Use the exact same canonical preview host as getGameOrigin() and the
  // emailed game link. VERCEL_BRANCH_URL can be a different deployment alias,
  // causing host-only Supabase cookies to appear missing on return.
  const hostname = request.nextUrl.hostname.toLowerCase();
  if (process.env.VERCEL_ENV === 'preview'
      && request.nextUrl.pathname.startsWith('/street-challenge-preview/')
      && hostname !== gamePreviewHost
      && /^pick-it-up-ijjl-[a-z0-9-]+-pick-it-up-seattle\\.vercel\\.app$/.test(hostname)) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.host = gamePreviewHost;
    const response = NextResponse.redirect(url, 307);
    response.headers.set('Cache-Control', 'private, no-store');
    return response;
  }
  // Keep the Seattle homepage intact; only the Together domain uses this landing page.
  if (request.nextUrl.pathname === '/' && togetherHosts.has(hostname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/together';
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/', '/street-challenge-preview/:path*'] };
