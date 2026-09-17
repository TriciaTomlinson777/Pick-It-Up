import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { getParticipantSupabaseConfig } from '@/lib/supabase/participant-config';

export async function proxy(request) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getParticipantSupabaseConfig();
  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    '/street-challenge/:path*',
    '/auth/:path*',
    '/api/street-challenge/:path*',
  ],
};