'use client';

import { useState } from 'react';

export default function BlogAdminLoginForm() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/session/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      window.location.href = '/admin/blog';
    } catch (error) {
      setErrorMessage(error.message || 'Login failed.');
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[#002244]">Username</span>
        <input
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          autoComplete="username"
          className="w-full rounded-xl border border-[#002244]/18 px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[#002244]">Password</span>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-[#002244]/18 px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
        />
      </label>

      {errorMessage ? (
        <p className="rounded-xl border border-[#b23d31]/25 bg-[#fff2f0] px-4 py-2 text-sm font-medium text-[#b23d31]">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[#0f9aa1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c8890] disabled:opacity-70"
      >
        {isSubmitting ? 'Signing In…' : 'Sign In'}
      </button>
    </form>
  );
}
