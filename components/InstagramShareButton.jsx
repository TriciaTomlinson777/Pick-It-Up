"use client";

import { useRef, useState } from 'react';
import { createWatermarkedShareFile, shareFileToInstagram, downloadShareFile } from '@/lib/instagram-share';

const MENU_HEIGHT_ESTIMATE_PX = 160;

function isMobileDevice() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

const MENU_ICONS = {
  facebook: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.8L4.3 22H1.2l8.1-9.3L1 2h7.1l4.9 6.2L18.9 2zm-1.2 18h1.9L7.4 4H5.4l12.3 16z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 6l10 7 10-7" />
    </svg>
  ),
};

const MENU_ITEMS = [
  ['facebook', 'Facebook'],
  ['x', 'X'],
  ['email', 'Email'],
];

export default function InstagramShareButton({
  images,
  shareUrl = '',
  label = 'Post or Share',
  className = '',
}) {
  const [status, setStatus] = useState('idle');
  const [feedback, setFeedback] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const buttonRef = useRef(null);

  const urls = (Array.isArray(images) ? images : [images]).filter(Boolean);

  if (!urls.length) {
    return null;
  }

  const handleShare = async () => {
    setStatus('working');
    setFeedback('');

    try {
      const file = await createWatermarkedShareFile(urls);
      const result = await shareFileToInstagram(file);

      if (result.shared) {
        setFeedback('Instagram opened — finish your post there.');
        return;
      }

      if (result.reason === 'cancelled') {
        setFeedback('');
        return;
      }

      downloadShareFile(file);
      setFeedback('Photo saved — open your sharing app to post it.');
    } catch {
      setFeedback('Could not prepare this photo for sharing.');
    } finally {
      setStatus('idle');
      window.setTimeout(() => setFeedback(''), 3200);
    }
  };

  // Desktop-only menu: opens a small PIUS-controlled panel instead of auto-downloading.
  const handleDesktopMenuChoice = (choice) => {
    if (status === 'working') {
      return;
    }

    setMenuOpen(false);

    const pageUrl = shareUrl || window.location.href;

    if (choice === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`,
        '_blank',
        'noopener,noreferrer,width=600,height=520'
      );
      return;
    }

    if (choice === 'x') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}`, '_blank', 'noopener,noreferrer');
      return;
    }

    if (choice === 'email') {
      window.location.href = `mailto:?body=${encodeURIComponent(pageUrl)}`;
    }
  };

  const toggleMenu = () => {
    setMenuOpen((open) => {
      const next = !open;

      if (next && buttonRef.current) {
        const { bottom } = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - bottom;
        setOpenUpward(spaceBelow < MENU_HEIGHT_ESTIMATE_PX);
      }

      return next;
    });
  };

  return (
    <div className="relative inline-flex flex-col items-center gap-1">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (isMobileDevice() ? handleShare() : toggleMenu())}
        disabled={status === 'working'}
        className={`font-semibold underline underline-offset-2 transition hover:opacity-80 disabled:opacity-60 ${className}`.trim()}
      >
        {status === 'working' ? 'Preparing…' : label}
      </button>
      {menuOpen ? (
        <div
          className={`absolute z-10 flex w-44 flex-col overflow-hidden rounded-lg border border-[#0f9aa1]/30 bg-white text-left shadow-[0_8px_20px_rgba(0,43,73,0.18)] ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}
        >
          {MENU_ITEMS.map(([choice, choiceLabel]) => (
            <button
              key={choice}
              type="button"
              onClick={() => handleDesktopMenuChoice(choice)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1f5f7a] no-underline hover:bg-[#0f9aa1]/10"
            >
              {MENU_ICONS[choice]}
              {choiceLabel}
            </button>
          ))}
        </div>
      ) : null}
      {feedback ? (
        <span className="text-xs font-medium text-[#1f5f7a]" aria-live="polite">
          {feedback}
        </span>
      ) : null}
    </div>
  );
}
