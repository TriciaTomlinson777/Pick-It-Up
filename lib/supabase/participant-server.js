import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getParticipantSupabaseConfig } from './participant-config';

export async function createParticipantServerClient() {
  const cookieStore = await cookies();
  const { url, publishableKey } = getParticipantSupabaseConfig();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, { ...options, path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: options?.maxAge === 0 ? 0 : 60 * 60 * 24 * 30 });
          });
        } catch {
          // Some server rendering contexts cannot write cookies. Route handlers can.
        }
      },
    },
  });
}