"use client";

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThankYouCard from '@/components/ThankYouCard';

const COMMUNITY_SHARE_TYPE_THANK_YOU = 'thank-you';

export default function ThankYousPage() {
  const [savedThankYouCards, setSavedThankYouCards] = useState([]);

  const dedupeSavedThankYouCards = (cards = []) => {
    const seen = new Set();

    return cards.filter((card) => {
      const submissionId = String(card?.id || '').trim();
      const submittedAt = String(card?.submittedAt || '').trim();
      const note = String(card?.note || '').trim();
      const photoUrl = String(card?.photoUrl || '').trim();
      const identity = submissionId || `${submittedAt}-${note}-${photoUrl}`;

      if (!identity || seen.has(identity)) {
        return false;
      }

      seen.add(identity);
      return true;
    });
  };

  useEffect(() => {
    const abortController = new AbortController();

    const loadThankYouCards = async () => {
      try {
        const response = await fetch('/api/community-shares', {
          signal: abortController.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Unable to load thank-you notes.');
        }

        const data = await response.json();
        const submissions = Array.isArray(data?.submissions) ? data.submissions : [];

        const filteredEntries = submissions
          .filter((submission) => submission?.note)
          .map((submission, index) => {
            const photoPublicUrl = typeof submission?.image_url === 'string' ? submission.image_url.trim() : '';
            const note = typeof submission?.note === 'string' ? submission.note.trim() : '';
            const submittedAt = submission?.submitted_at || '';

            if (!note) {
              return null;
            }

            return {
              id: submission?.id || `saved-thank-you-${submittedAt || index}`,
              note,
              photoUrl: photoPublicUrl,
              submittedAt,
            };
          })
          .filter(Boolean)
          .sort((first, second) => {
            const firstTime = new Date(first.submittedAt || 0).getTime();
            const secondTime = new Date(second.submittedAt || 0).getTime();
            return secondTime - firstTime;
          });

        setSavedThankYouCards(dedupeSavedThankYouCards(filteredEntries));
      } catch {
        setSavedThankYouCards([]);
      }
    };

    loadThankYouCards();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <>
      <Header />

      <section id="community-gratitude" className="scroll-mt-24 bg-[linear-gradient(130deg,_#e8f9ff_0%,_#f6ffef_42%,_#fff3dc_100%)] py-14 sm:py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1f5f7a]">Community Gratitude</p>
          </div>

          {savedThankYouCards.length ? (
            <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
              {savedThankYouCards.map((card) => (
                <ThankYouCard key={card.id} note={card.note} photoUrl={card.photoUrl} shareId={card.id} />
              ))}
            </div>
          ) : null}

        </div>
      </section>

      <Footer />
    </>
  );
}
