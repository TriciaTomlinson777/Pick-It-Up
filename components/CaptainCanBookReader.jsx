'use client';

import Image from 'next/image';
import { useState } from 'react';

const bookPages = [
  { label: 'Cover', src: '/captain-can-redesigned-pages/01_cover.jpg' },
  { label: 'Page 1', src: '/captain-can-redesigned-pages/02_page_01.jpg' },
  { label: 'Page 2', src: '/captain-can-redesigned-pages/03_page_02.jpg' },
  { label: 'Page 3', src: '/captain-can-redesigned-pages/04_page_03.jpg' },
  { label: 'Page 4', src: '/captain-can-redesigned-pages/05_page_04.jpg' },
  { label: 'Page 5', src: '/captain-can-redesigned-pages/06_page_05.jpg' },
  { label: 'Page 6', src: '/captain-can-redesigned-pages/07_page_06.jpg' },
  { label: 'Page 7', src: '/captain-can-redesigned-pages/08_page_07.jpg' },
  { label: 'Page 8', src: '/captain-can-redesigned-pages/09_page_08.jpg' },
  { label: 'Page 9', src: '/captain-can-redesigned-pages/10_page_09.jpg' },
  { label: 'Page 10', src: '/captain-can-redesigned-pages/11_page_10.jpg' },
  { label: 'Page 11', src: '/captain-can-redesigned-pages/12_page_11.jpg' },
  { label: 'Page 12', src: '/captain-can-redesigned-pages/13_page_12.jpg' },
  { label: 'Page 13', src: '/captain-can-redesigned-pages/14_page_13.jpg' },
  { label: 'Page 14', src: '/captain-can-redesigned-pages/15_page_14.jpg' },
  { label: 'Page 15', src: '/captain-can-redesigned-pages/16_page_15.jpg' },
  { label: 'Page 16', src: '/captain-can-redesigned-pages/17_page_16.jpg' },
  { label: 'Page 17', src: '/captain-can-redesigned-pages/18_page_17.jpg' },
  { label: 'Page 18', src: '/captain-can-redesigned-pages/19_page_18.jpg' },
  { label: 'Page 19', src: '/captain-can-redesigned-pages/20_page_19.jpg' },
  { label: 'Page 20', src: '/CCMB Story Page 20 - Website (1).png' },
  { label: 'Page 21', src: '/captain-can-redesigned-pages/21_page_21.jpg' },
  { label: 'Page 22', src: '/captain-can-redesigned-pages/22_page_22.jpg' },
];

function getSpreadStart(index) {
  return index % 2 === 1 ? index : index - 1;
}

export default function CaptainCanBookReader() {
  const [pageIndex, setPageIndex] = useState(0);
  const lastPageIndex = bookPages.length - 1;
  const currentPage = bookPages[pageIndex];
  const isCover = pageIndex === 0;
  const spreadStart = isCover ? 0 : getSpreadStart(pageIndex);
  const currentSpread = isCover ? null : [bookPages[spreadStart], bookPages[spreadStart + 1]].filter(Boolean);

  function goToPreviousSinglePage() {
    setPageIndex((current) => Math.max(current - 1, 0));
  }

  function goToNextSinglePage() {
    setPageIndex((current) => Math.min(current + 1, lastPageIndex));
  }

  function goToPreviousSpread() {
    setPageIndex((current) => {
      if (current <= 1) return 0;
      const start = getSpreadStart(current);
      return Math.max(start - 2, 1);
    });
  }

  function goToNextSpread() {
    setPageIndex((current) => {
      if (current === 0) return 1;
      const start = getSpreadStart(current);
      const nextStart = start + 2;
      return nextStart > lastPageIndex ? current : nextStart;
    });
  }

  return (
    <div className="mt-10 flex flex-col items-center gap-6 sm:mt-12 lg:mt-14">
      {/* Mobile: single page at a time, arrows overlaid near the page's left/right edges */}
      <div className="relative mx-auto w-full max-w-[34rem] lg:hidden">
        <div className="w-full rounded-[1.35rem] border border-[#2b271d]/12 bg-[#fffaf0] p-5 text-[#1f211b] shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
          <Image
            src={currentPage.src}
            alt={isCover ? 'Captain Can and the Messy Block cover' : `Captain Can and the Messy Block ${currentPage.label}`}
            width={1200}
            height={900}
            className="h-auto w-full rounded-[0.9rem] border border-[#2a2a23]/12 shadow-inner"
            priority={isCover}
          />
        </div>

        <button
          type="button"
          aria-label="Previous page"
          onClick={goToPreviousSinglePage}
          className="absolute left-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#fff8e5]/25 bg-[#fff8e5]/10 text-2xl font-bold text-[#fff8e5] shadow-[0_16px_34px_rgba(0,0,0,0.28)] transition hover:bg-[#fff8e5]/18"
        >
          ‹
        </button>

        <button
          type="button"
          aria-label="Next page"
          onClick={goToNextSinglePage}
          className="absolute right-2 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#fff8e5]/25 bg-[#fff8e5]/10 text-2xl font-bold text-[#fff8e5] shadow-[0_16px_34px_rgba(0,0,0,0.28)] transition hover:bg-[#fff8e5]/18"
        >
          ›
        </button>
      </div>

      {/* Desktop: unchanged two-page spread layout */}
      <div className="hidden w-full max-w-[88rem] grid-cols-[4rem_minmax(0,1fr)_4rem] items-center gap-8 lg:grid">
        <button
          type="button"
          aria-label="Previous page"
          onClick={goToPreviousSpread}
          className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#fff8e5]/25 bg-[#fff8e5]/10 text-4xl font-bold text-[#fff8e5] shadow-[0_16px_34px_rgba(0,0,0,0.28)] transition hover:bg-[#fff8e5]/18"
        >
          ‹
        </button>

        <div className="mx-auto flex w-full flex-col items-center gap-8">
          {isCover ? (
            <div className="w-full max-w-[34rem] rounded-[1.35rem] border border-[#f4c94c]/25 bg-[#f8efd7] p-5 text-[#1f211b] shadow-[0_28px_80px_rgba(0,0,0,0.48)] sm:p-7">
              <Image
                src={bookPages[0].src}
                alt="Captain Can and the Messy Block cover"
                width={1200}
                height={900}
                className="h-auto w-full rounded-[0.9rem] border border-[#2a2a23]/12 shadow-inner"
                priority
              />
            </div>
          ) : (
            <div className="grid w-full max-w-[68rem] grid-cols-2 gap-0">
              {currentSpread.map((page, index) => (
                <article
                  key={page.label}
                  className={`w-full max-w-[34rem] border border-[#2b271d]/12 bg-[#fffaf0] p-5 text-[#1f211b] shadow-[0_24px_70px_rgba(0,0,0,0.38)] sm:p-7 ${
                    index === 0
                      ? 'rounded-l-[1.35rem] rounded-r-none border-r-[#d7cda7]'
                      : 'rounded-l-none rounded-r-[1.35rem]'
                  }`}
                >
                  <Image
                    src={page.src}
                    alt={`Captain Can and the Messy Block ${page.label}`}
                    width={1200}
                    height={900}
                    className="h-auto w-full rounded-[0.9rem] border border-[#2a2a23]/12 shadow-inner"
                  />
                </article>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Next page"
          onClick={goToNextSpread}
          className="mx-auto flex size-16 items-center justify-center rounded-full border border-[#fff8e5]/25 bg-[#fff8e5]/10 text-4xl font-bold text-[#fff8e5] shadow-[0_16px_34px_rgba(0,0,0,0.28)] transition hover:bg-[#fff8e5]/18"
        >
          ›
        </button>
      </div>
    </div>
  );
}
