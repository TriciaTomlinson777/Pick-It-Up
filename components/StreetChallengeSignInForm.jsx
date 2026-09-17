'use client';

import { useState } from 'react';
import { createParticipantBrowserClient } from '@/lib/supabase/participant-browser';

export default function StreetChallengeSignInForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function sendCode(event) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const supabase = createParticipantBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setStep('code');
    } catch {
      setMessage('Unable to send a sign-in code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyCode(event) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/auth/callback', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Verification failed.');
      window.location.assign('/street-challenge/profile');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Verification failed.');
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-7 space-y-5" onSubmit={step === 'email' ? sendCode : verifyCode}>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-[#002244]">Email address</span>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={step === 'code'}
          autoComplete="email"
          className="w-full rounded-lg border border-[#002244]/20 bg-white px-4 py-3 text-[#002244] outline-none focus:border-[#0f9aa1] focus:ring-2 focus:ring-[#0f9aa1]/20 disabled:bg-[#edf3f2]"
        />
      </label>

      {step === 'code' ? (
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-[#002244]">Email code</span>
          <input
            name="code"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 8))}
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            className="w-full rounded-lg border border-[#002244]/20 bg-white px-4 py-3 text-lg text-[#002244] outline-none focus:border-[#0f9aa1] focus:ring-2 focus:ring-[#0f9aa1]/20"
          />
        </label>
      ) : null}

      {message ? (
        <p className="rounded-lg border border-[#b23d31]/25 bg-[#fff2f0] px-4 py-2.5 text-sm font-medium text-[#b23d31]">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[#0f9aa1] px-5 py-3 font-semibold text-white hover:bg-[#0c8890] disabled:opacity-65"
      >
        {isSubmitting ? 'Please wait...' : step === 'email' ? 'Email me a code' : 'Verify code'}
      </button>

      {step === 'code' ? (
        <button
          type="button"
          onClick={() => {
            setStep('email');
            setCode('');
            setMessage('');
          }}
          className="w-full text-sm font-semibold text-[#1f5f7a] hover:text-[#002244]"
        >
          Use a different email
        </button>
      ) : null}
    </form>
  );
}