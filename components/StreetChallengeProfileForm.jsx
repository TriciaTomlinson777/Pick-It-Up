'use client';

import { useState } from 'react';
import { createParticipantBrowserClient } from '@/lib/supabase/participant-browser';

export default function StreetChallengeProfileForm({ userId, email, initialDisplayName }) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function saveProfile(event) {
    event.preventDefault();
    const normalizedName = displayName.trim();
    if (!normalizedName || normalizedName.length > 80) {
      setMessage('Enter a display name of 80 characters or fewer.');
      return;
    }

    setMessage('');
    setIsSaving(true);
    const supabase = createParticipantBrowserClient();
    const { error } = await supabase
      .from('participant_profiles')
      .update({ display_name: normalizedName })
      .eq('id', userId);

    setIsSaving(false);
    setMessage(error ? 'Unable to save your display name.' : 'Display name saved.');
  }

  async function signOut() {
    const supabase = createParticipantBrowserClient();
    await supabase.auth.signOut();
    window.location.assign('/street-challenge');
  }

  return (
    <div className="mt-7 space-y-6">
      <div className="border-l-4 border-[#0f9aa1] bg-[#eef9fc] px-4 py-3">
        <p className="text-xs font-bold uppercase text-[#1f5f7a]">Signed in as</p>
        <p className="mt-1 break-all text-sm font-semibold text-[#002244]">{email}</p>
      </div>

      <form className="space-y-4" onSubmit={saveProfile}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#002244]">Display name</span>
          <input
            name="displayName"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            maxLength={80}
            autoComplete="nickname"
            className="w-full rounded-lg border border-[#002244]/20 bg-white px-4 py-3 text-[#002244] outline-none focus:border-[#0f9aa1] focus:ring-2 focus:ring-[#0f9aa1]/20"
          />
        </label>

        {message ? <p className="text-sm font-semibold text-[#1f5f7a]">{message}</p> : null}

        <button
          type="submit"
          disabled={isSaving}
          className="w-full rounded-lg bg-[#69be28] px-5 py-3 font-semibold text-[#002244] hover:bg-[#79ca38] disabled:opacity-65"
        >
          {isSaving ? 'Saving...' : 'Save display name'}
        </button>
      </form>

      <button
        type="button"
        onClick={signOut}
        className="w-full border-t border-[#002244]/12 pt-5 text-sm font-semibold text-[#1f5f7a] hover:text-[#002244]"
      >
        Sign out
      </button>
    </div>
  );
}