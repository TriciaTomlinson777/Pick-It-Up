"use client";

import { useRef, useState } from 'react';

function toAbsoluteUrl(url) {
  const value = String(url || '').trim();

  if (!value) {
    if (typeof window === 'undefined') {
      return '/';
    }

    return window.location.href;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (typeof window === 'undefined') {
    return value;
  }

  if (value.startsWith('/')) {
    return `${window.location.origin}${value}`;
  }

  return `${window.location.origin}/${value}`;
}

export default function ShareButton({
  url,
  title = 'Pick It Up Seattle',
  text = '',
  label = 'Share',
  className = '',
}) {
  const [feedback, setFeedback] = useState('');
  const feedbackTimerRef = useRef(null);

  const setCopiedFeedback = () => {
    setFeedback('Link copied!');

    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback('');
      feedbackTimerRef.current = null;
    }, 1800);
  };

  const handleShare = async () => {
    const shareUrl = toAbsoluteUrl(url);

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedFeedback();
        return;
      }

      if (typeof window !== 'undefined') {
        window.prompt('Copy this link:', shareUrl);
      }
    } catch {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopiedFeedback();
          return;
        } catch {
          // Ignore and fall through to prompt fallback.
        }
      }

      if (typeof window !== 'undefined') {
        window.prompt('Copy this link:', shareUrl);
      }
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center rounded-full border border-[#0f9aa1]/28 bg-[#fff8e9] px-4 py-2 text-sm font-semibold text-[#1f5f7a] shadow-[0_6px_16px_rgba(0,43,73,0.08)] transition hover:-translate-y-0.5 hover:bg-[#fff2d9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f9aa1]/35 ${className}`.trim()}
      >
        {label}
      </button>
      <span className="min-w-[78px] text-xs font-semibold text-[#2c7a3f]" aria-live="polite">
        {feedback}
      </span>
    </div>
  );
}
