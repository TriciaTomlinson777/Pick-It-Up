"use client";

import { useEffect, useRef, useState } from 'react';
import { createWatermarkedShareFile, downloadShareFile, shareFileToInstagram } from '@/lib/instagram-share';

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

function isMobileDevice() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

const MENU_ICONS = {
  email: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 6l10 7 10-7" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),
};

// PIUS-controlled share menu for blog stories: Email/Facebook/Copy Link everywhere, Instagram is mobile-only.
export default function BlogShareMenu({
  url,
  title = 'Pick It Up Seattle',
  imageUrl = '',
  label = 'Share Story',
  className = '',
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [instagramBusy, setInstagramBusy] = useState(false);
  const containerRef = useRef(null);
  const feedbackTimerRef = useRef(null);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const showFeedback = (message) => {
    setFeedback(message);

    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback('');
      feedbackTimerRef.current = null;
    }, 2200);
  };

  const handleEmail = () => {
    setMenuOpen(false);
    const shareUrl = toAbsoluteUrl(url);
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${title}\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleFacebook = () => {
    setMenuOpen(false);
    const shareUrl = toAbsoluteUrl(url);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=520'
    );
  };

  const handleCopyLink = async () => {
    setMenuOpen(false);
    const shareUrl = toAbsoluteUrl(url);

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        window.prompt('Copy this link:', shareUrl);
      }
    } catch {
      window.prompt('Copy this link:', shareUrl);
    }

    showFeedback('Link copied.');
  };

  const handleInstagram = async () => {
    if (instagramBusy) {
      return;
    }

    setMenuOpen(false);

    if (!imageUrl) {
      showFeedback('No image available to share.');
      return;
    }

    setInstagramBusy(true);

    try {
      const file = await createWatermarkedShareFile([imageUrl]);
      const result = await shareFileToInstagram(file);

      if (result.shared) {
        showFeedback('Instagram opened — finish your post there.');
        return;
      }

      if (result.reason === 'cancelled') {
        return;
      }

      downloadShareFile(file);
      showFeedback('Photo saved — open your sharing app to post it.');
    } catch {
      showFeedback('Could not prepare this photo for sharing.');
    } finally {
      setInstagramBusy(false);
    }
  };

  const menuItems = [
    { key: 'email', label: 'Email', onClick: handleEmail },
    { key: 'facebook', label: 'Facebook', onClick: handleFacebook },
    ...(isMobile ? [{ key: 'instagram', label: 'Instagram', onClick: handleInstagram }] : []),
    { key: 'copy', label: 'Copy Link', onClick: handleCopyLink },
  ];

  return (
    <div className="relative inline-flex flex-col items-start gap-1" ref={containerRef}>
      <button
        type="button"
        onClick={() => setMenuOpen((open) => !open)}
        className={`inline-flex items-center rounded-full border border-[#69be28]/45 bg-[linear-gradient(145deg,_#2ec4c7_0%,_#7cd157_62%,_#69be28_100%)] px-4 py-2 text-sm font-semibold text-[#002244] shadow-[0_8px_18px_rgba(46,196,199,0.2)] transition hover:-translate-y-0.5 hover:brightness-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#69be28]/45 ${className}`.trim()}
      >
        {label}
      </button>
      {menuOpen ? (
        <div className="absolute top-full z-10 mt-1 flex w-44 flex-col overflow-hidden rounded-lg border border-[#0f9aa1]/30 bg-white text-left shadow-[0_8px_20px_rgba(0,43,73,0.18)]">
          {menuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={item.onClick}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1f5f7a] no-underline hover:bg-[#0f9aa1]/10"
            >
              {MENU_ICONS[item.key]}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
      <span className="min-h-[1rem] text-xs font-semibold text-[#2c7a3f]" aria-live="polite">
        {feedback}
      </span>
    </div>
  );
}
