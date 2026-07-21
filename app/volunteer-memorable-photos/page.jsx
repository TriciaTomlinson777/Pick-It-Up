"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const VOLUNTEER_PHOTO_CARDS = [
  { id: 1, title: 'Green Lake Morning Team', comment: 'Fog, gloves, and great energy before 8 AM.', heightClass: 'h-64', toneClass: 'bg-[linear-gradient(150deg,_#dcf4fb_0%,_#bfe8f4_100%)]' },
  { id: 2, title: 'Capitol Hill Sidewalk Reset', comment: 'One block, five volunteers, visible difference in under an hour.', heightClass: 'h-48', toneClass: 'bg-[linear-gradient(150deg,_#fff2d9_0%,_#ffdca0_100%)]' },
  { id: 3, title: 'Rainier Ave Corner Crew', comment: '', heightClass: 'h-72', toneClass: 'bg-[linear-gradient(150deg,_#e9f8de_0%,_#cdefb3_100%)]' },
  { id: 4, title: 'Wallingford Family Cleanup', comment: 'Kids called it a treasure hunt for recyclables.', heightClass: 'h-52', toneClass: 'bg-[linear-gradient(150deg,_#dff6fb_0%,_#cceef7_100%)]' },
  { id: 5, title: 'West Seattle Park Path', comment: 'A quick stop became a full cleanup loop.', heightClass: 'h-60', toneClass: 'bg-[linear-gradient(150deg,_#fff2d9_0%,_#ffe8bf_100%)]' },
  { id: 6, title: 'Belltown Alley Before Brunch', comment: '', heightClass: 'h-44', toneClass: 'bg-[linear-gradient(150deg,_#e9f8de_0%,_#daf4c5_100%)]' },
  { id: 7, title: 'Beacon Hill Bus Stop Squad', comment: 'Neighbors joined after seeing us start.', heightClass: 'h-[14.5rem]', toneClass: 'bg-[linear-gradient(150deg,_#dff6fb_0%,_#bfe6f2_100%)]' },
  { id: 8, title: 'Fremont Bridge Walkway', comment: '', heightClass: 'h-[17rem]', toneClass: 'bg-[linear-gradient(150deg,_#fff2d9_0%,_#ffd796_100%)]' },
  { id: 9, title: 'Northgate Trail Entrance', comment: 'The route looked instantly brighter.', heightClass: 'h-[12.5rem]', toneClass: 'bg-[linear-gradient(150deg,_#e9f8de_0%,_#caecaa_100%)]' },
  { id: 10, title: 'U-District Weekend Group', comment: 'Students and neighbors teamed up in minutes.', heightClass: 'h-[15.5rem]', toneClass: 'bg-[linear-gradient(150deg,_#dff6fb_0%,_#d0f1f9_100%)]' },
  { id: 11, title: 'Queen Anne Stairway Cleanup', comment: '', heightClass: 'h-[11.5rem]', toneClass: 'bg-[linear-gradient(150deg,_#fff2d9_0%,_#ffe1ae_100%)]' },
  { id: 12, title: 'Ballard Market Route', comment: 'Lots of smiles and honks from passing bikes.', heightClass: 'h-[18.5rem]', toneClass: 'bg-[linear-gradient(150deg,_#e9f8de_0%,_#d7f2c0_100%)]' },
  { id: 13, title: 'South Lake Union Midday Crew', comment: '', heightClass: 'h-[14rem]', toneClass: 'bg-[linear-gradient(150deg,_#dff6fb_0%,_#b9e8f3_100%)]' },
  { id: 14, title: 'Delridge Trail Team', comment: 'Windy day, steady teamwork.', heightClass: 'h-[16.5rem]', toneClass: 'bg-[linear-gradient(150deg,_#fff2d9_0%,_#ffdca1_100%)]' },
  { id: 15, title: 'Magnolia Viewpoint Cleanup', comment: '', heightClass: 'h-[13.5rem]', toneClass: 'bg-[linear-gradient(150deg,_#e9f8de_0%,_#d2efb6_100%)]' },
  { id: 16, title: 'Columbia City Main Street', comment: 'Coffee in one hand, grabber in the other.', heightClass: 'h-[17.5rem]', toneClass: 'bg-[linear-gradient(150deg,_#dff6fb_0%,_#c9edf6_100%)]' },
  { id: 17, title: 'Ravenna Park Entrance', comment: '', heightClass: 'h-[10.5rem]', toneClass: 'bg-[linear-gradient(150deg,_#fff2d9_0%,_#ffdc9e_100%)]' },
  { id: 18, title: 'Central District Team Shot', comment: 'A proud end-of-day photo after a full route.', heightClass: 'h-[19rem]', toneClass: 'bg-[linear-gradient(150deg,_#e9f8de_0%,_#ccebaf_100%)]' },
];

const PAGE_SIZE = 6;

export default function VolunteerMemorablePhotosPage() {
  const totalPages = Math.ceil(VOLUNTEER_PHOTO_CARDS.length / PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);

  const visibleCards = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return VOLUNTEER_PHOTO_CARDS.slice(start, start + PAGE_SIZE);
  }, [currentPage]);

  const goPrevious = () => {
    setCurrentPage((existingPage) => (existingPage === 1 ? totalPages : existingPage - 1));
  };

  const goNext = () => {
    setCurrentPage((existingPage) => (existingPage === totalPages ? 1 : existingPage + 1));
  };

  return (
    <>
      <Header />

      <section className="bg-[linear-gradient(126deg,_#f2fbff_0%,_#f5ffed_45%,_#fff1d8_100%)] py-14 sm:py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1f5f7a]">Volunteer Highlights</p>
            <h1 className="mt-3 text-4xl font-bold text-[#002b49] sm:text-5xl">Volunteer Memorable Photos</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-[#1c4d63] sm:text-xl">
              A masonry gallery of volunteer moments with optional notes that capture effort, joy, and local pride.
            </p>
          </div>

          <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {visibleCards.map((card) => (
              <article
                key={card.id}
                className="mb-6 break-inside-avoid rounded-[1.4rem] border border-[#002b49]/14 bg-white/88 p-4 shadow-[0_16px_34px_rgba(0,43,73,0.12)]"
              >
                <div className={`w-full rounded-xl border border-[#002b49]/10 ${card.heightClass} ${card.toneClass}`}>
                  <div className="flex h-full items-end rounded-xl bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.42),_transparent_55%)] p-3">
                    <span className="rounded-full bg-white/82 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0a5f80]">
                      Volunteer Photo
                    </span>
                  </div>
                </div>
                <h2 className="mt-4 text-lg font-bold text-[#002b49] sm:text-xl">{card.title}</h2>
                {card.comment ? <p className="mt-2 text-[15px] leading-7 text-[#1d4254]">{card.comment}</p> : null}
              </article>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
            <button
              type="button"
              onClick={goPrevious}
              className="rounded-full border border-[#1f5f7a]/30 bg-white px-4 py-2 text-[#114b66] transition hover:bg-[#e9f6fb]"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-10 w-10 rounded-full border transition ${
                  currentPage === pageNumber
                    ? 'border-[#0f9aa1] bg-[#0f9aa1] text-white'
                    : 'border-[#1f5f7a]/30 bg-white text-[#114b66] hover:bg-[#e9f6fb]'
                }`}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={goNext}
              className="rounded-full border border-[#1f5f7a]/30 bg-white px-4 py-2 text-[#114b66] transition hover:bg-[#e9f6fb]"
            >
              Next
            </button>
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
