'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getParticipantSupabaseConfig } from './participant-config';

let browserClient;

export function createParticipantBrowserClient() {
  if (!browserClient) {
    const { url, publishableKey } = getParticipantSupabaseConfig();
    browserClient = createBrowserClient(url, publishableKey);
  }

  return browserClient;
}