import { NextResponse } from 'next/server';

const togetherHosts = new Set(['pickituptogether.org', 'www.pickituptogether.org']);

export function proxy(request) {
  // Keep the Seattle homepage intact; only the Together domain uses this landing page.
  if (togetherHosts.has(request.nextUrl.hostname.toLowerCase())) {
    const url = request.nextUrl.clone();
    url.pathname = '/together';
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = { matcher: '/' };
