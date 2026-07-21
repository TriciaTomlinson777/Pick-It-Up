"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const THANK_YOU_CARDS = [
  { id: 1, author: 'Arianna - Rainier Valley', kind: 'photo', title: 'Thanks for the corner cleanup!', message: 'You cleared the bus stop before school pickup. Parents noticed right away.', accent: 'border-[#0f9aa1]/28', imageClass: 'h-44 bg-[linear-gradient(145deg,_#dff6fb_0%,_#bdebf4_100%)]' },
  { id: 2, author: 'Miles - Greenwood', kind: 'text', title: 'Quiet acts matter', message: 'Someone I never met cleaned the alley by our shop. It changed the whole mood of the block.', accent: 'border-[#69BE28]/28' },
  { id: 3, author: 'Leena - Ballard', kind: 'photo', title: 'Weekend crew appreciation', message: 'Five neighbors, ten bags, one cleaner street. Thank you for showing up.', accent: 'border-[#f4a62a]/32', imageClass: 'h-56 bg-[linear-gradient(145deg,_#fff1d8_0%,_#ffe1a7_100%)]' },
  { id: 4, author: 'Jordan - Beacon Hill', kind: 'text', title: 'Felt proud walking home', message: 'The sidewalks looked cared for. My kids asked if we could help next time.', accent: 'border-[#2ec4c7]/30' },
  { id: 5, author: 'Nina - Wallingford', kind: 'photo', title: 'Small crew, big difference', message: 'This stretch has looked rough for months. Today it looked like a fresh start.', accent: 'border-[#0f9aa1]/28', imageClass: 'h-48 bg-[linear-gradient(145deg,_#dff6fb_0%,_#e8fffc_100%)]' },
  { id: 6, author: 'Theo - Central District', kind: 'text', title: 'Thank you to the morning volunteer', message: 'You were out there before sunrise with gloves and a smile. Respect.', accent: 'border-[#69BE28]/28' },
  { id: 7, author: 'Mia - Queen Anne', kind: 'photo', title: 'Community pride', message: 'The before and after was incredible. Thank you for making this corner shine.', accent: 'border-[#f4a62a]/32', imageClass: 'h-60 bg-[linear-gradient(145deg,_#fff1d8_0%,_#ffd892_100%)]' },
  { id: 8, author: 'Caleb - Fremont', kind: 'text', title: 'This inspired us', message: 'We saw the cleanup photos and organized one on our block the next day.', accent: 'border-[#2ec4c7]/30' },
  { id: 9, author: 'Sam - Columbia City', kind: 'photo', title: 'Neighbors noticed', message: 'People stopped to say thanks while we worked. That energy felt amazing.', accent: 'border-[#0f9aa1]/28', imageClass: 'h-52 bg-[linear-gradient(145deg,_#dff6fb_0%,_#ccecf4_100%)]' },
  { id: 10, author: 'Elle - Capitol Hill', kind: 'text', title: 'More than cleanup', message: 'It felt like care in action. Thank you for making the street feel welcoming again.', accent: 'border-[#69BE28]/28' },
  { id: 11, author: 'Ray - West Seattle', kind: 'photo', title: 'Much appreciated', message: 'The park entrance looked transformed. You helped us feel proud of our space.', accent: 'border-[#f4a62a]/32', imageClass: 'h-40 bg-[linear-gradient(145deg,_#fff1d8_0%,_#ffe8ba_100%)]' },
  { id: 12, author: 'Ivy - U-District', kind: 'text', title: 'A little kindness', message: 'Your effort reminded me that people still show up for each other.', accent: 'border-[#2ec4c7]/30' },
  { id: 13, author: 'Noah - South Lake Union', kind: 'photo', title: 'Loved this effort', message: 'The block looked brighter and safer. Thank you for your time and heart.', accent: 'border-[#0f9aa1]/28', imageClass: 'h-[13.5rem] bg-[linear-gradient(145deg,_#dff6fb_0%,_#b9e8f3_100%)]' },
  { id: 14, author: 'Piper - Magnolia', kind: 'text', title: 'Community care', message: 'I did not know who started it, but the results made the neighborhood feel cared for.', accent: 'border-[#69BE28]/28' },
  { id: 15, author: 'Drew - Delridge', kind: 'photo', title: 'Thank you from our street', message: 'Our corner looked tired before. It feels new again after your cleanup.', accent: 'border-[#f4a62a]/32', imageClass: 'h-[11.5rem] bg-[linear-gradient(145deg,_#fff1d8_0%,_#ffdca1_100%)]' },
  { id: 16, author: 'Kira - Northgate', kind: 'text', title: 'Seen and appreciated', message: 'Your work did not go unnoticed. Thank you for caring about this place.', accent: 'border-[#2ec4c7]/30' },
  { id: 17, author: 'Omar - Ravenna', kind: 'photo', title: 'So grateful', message: 'The cleanup made our dog walk route feel cleaner and happier.', accent: 'border-[#0f9aa1]/28', imageClass: 'h-[14.5rem] bg-[linear-gradient(145deg,_#dff6fb_0%,_#d3f3fa_100%)]' },
  { id: 18, author: 'Jules - Phinney Ridge', kind: 'text', title: 'Thanks to all volunteers', message: 'Every bag collected matters. Thank you for your consistency.', accent: 'border-[#69BE28]/28' },
];

const PAGE_SIZE = 6;

export default function ThankYousPage() {
  const totalPages = Math.ceil(THANK_YOU_CARDS.length / PAGE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);

  const visibleCards = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return THANK_YOU_CARDS.slice(start, start + PAGE_SIZE);
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

      <section className="bg-[linear-gradient(130deg,_#e8f9ff_0%,_#f6ffef_42%,_#fff3dc_100%)] py-14 sm:py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1f5f7a]">Community Gratitude</p>
            <h1 className="mt-3 text-4xl font-bold text-[#002b49] sm:text-5xl">Thank yous</h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-[#1c4d63] sm:text-xl">
              A running wall of appreciation with both photo thank-yous and text-only notes from around Seattle.
            </p>
          </div>

          <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {visibleCards.map((card) => (
              <article
                key={card.id}
                className={`mb-6 break-inside-avoid rounded-[1.4rem] border bg-white/85 p-5 shadow-[0_16px_34px_rgba(0,43,73,0.12)] ${card.accent}`}
              >
                {card.kind === 'photo' ? (
                  <div className={`w-full rounded-xl border border-[#002b49]/10 ${card.imageClass}`}>
                    <div className="flex h-full items-end rounded-xl bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.42),_transparent_55%)] p-3">
                      <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0a5f80]">
                        Photo Thank You
                      </span>
                    </div>
                  </div>
                ) : null}

                <h2 className="mt-4 text-xl font-bold text-[#002b49]">{card.title}</h2>
                <p className="mt-2 text-[15px] leading-7 text-[#1d4254]">{card.message}</p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b6c8c]">{card.author}</p>
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
