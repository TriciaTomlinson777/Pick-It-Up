'use client';

import { createParticipantBrowserClient } from '@/lib/supabase/participant-browser';

export default function ParticipantSignOutLink() {
  async function signOut() {
    const supabase = createParticipantBrowserClient();
    await supabase.auth.signOut();
    window.location.assign('/street-challenge');
  }

  return (
    <button type="button" onClick={signOut} className="underline underline-offset-4 hover:text-[#002244]">
      Sign Out
    </button>
  );
}