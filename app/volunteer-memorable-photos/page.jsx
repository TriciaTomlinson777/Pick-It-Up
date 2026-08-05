"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const COMMUNITY_SHARE_SUBMISSIONS_KEY = 'pick-it-up-community-share-submissions-v1';
const COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY = 'scenic-discovery';

export default function VolunteerMemorablePhotosPage() {
  const [savedScenicCards, setSavedScenicCards] = useState([]);

  useEffect(() => {
    try {
      const savedShares = JSON.parse(localStorage.getItem(COMMUNITY_SHARE_SUBMISSIONS_KEY) || '[]');
      const possibleEntries = Array.isArray(savedShares)
        ? savedShares
        : savedShares && Array.isArray(savedShares.submissions)
          ? savedShares.submissions
          : [];

      const filteredEntries = possibleEntries
        .filter((submission) => submission?.type === COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY)
        .map((submission, index) => {
          const publicUrl = typeof submission?.photo?.publicUrl === 'string' ? submission.photo.publicUrl.trim() : '';
          const caption = typeof submission?.caption === 'string' ? submission.caption.trim() : '';
          const submittedAt = submission?.submittedAt || '';

          if (!publicUrl) {
            return null;
          }

          return {
            id: submission?.id || `saved-scenic-${submittedAt || index}`,
            kind: 'saved-share',
            publicUrl,
            caption,
            submittedAt,
          };
        })
        .filter(Boolean)
        .sort((first, second) => {
          const firstTime = new Date(first.submittedAt || 0).getTime();
          const secondTime = new Date(second.submittedAt || 0).getTime();
          return secondTime - firstTime;
        });

      setSavedScenicCards(filteredEntries);
    } catch {
      setSavedScenicCards([]);
    }
  }, []);

  return (
    <>
      <Header />

      <section id="scenic-discoveries" className="scroll-mt-24 bg-[linear-gradient(126deg,_#f2fbff_0%,_#f5ffed_45%,_#fff1d8_100%)] py-14 sm:py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-[#002b49] sm:text-5xl">Scenic Discoveries</h1>
          </div>

          <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {savedScenicCards.map((card) => (
              <article
                key={card.id}
                className="mb-6 break-inside-avoid rounded-[1.4rem] border border-[#002b49]/14 bg-white/88 p-4 shadow-[0_16px_34px_rgba(0,43,73,0.12)]"
              >
                <div className="w-full rounded-xl border border-[#002b49]/10 bg-[#f7fbfc] p-2">
                  <img
                    src={card.publicUrl}
                    alt="Scenic discovery submission photo"
                    className="h-auto w-full rounded-lg object-contain"
                  />
                </div>
                {card.caption ? (
                  <p className="mt-3 text-[15px] leading-7 text-[#1d4254] whitespace-pre-wrap break-words">{card.caption}</p>
                ) : null}
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#69BE28] px-6 py-3 text-sm font-semibold text-[#002b49] shadow-[0_10px_24px_rgba(105,190,40,0.28)] transition hover:-translate-y-0.5 hover:bg-[#7fd33e]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
