'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClassName =
    'rounded-full px-2.5 py-2 text-[1.04rem] font-bold tracking-[0.01em] transition hover:bg-[#e7f7f8] lg:px-3.5 lg:py-2.5 lg:text-[1.28rem] xl:text-[1.42rem] whitespace-nowrap';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#0f9aa1]/20 bg-[#fffaf0]/95 shadow-[0_10px_24px_rgba(0,34,68,0.1)] backdrop-blur-sm">
      <nav className="container-custom py-1 sm:py-5 lg:py-0 xl:py-0">
        <div className="flex items-center justify-between">
          <Logo href="/" className="inline-flex sm:ml-6 lg:ml-8 xl:ml-10 lg:relative lg:h-[17.4rem] lg:w-[24.3rem] lg:overflow-hidden xl:h-[18.75rem] xl:w-[26.1rem]" imgClassName="h-8 w-[7.5rem] object-contain sm:h-[7.5rem] sm:w-auto lg:absolute lg:left-[-1rem] lg:top-[-4.3rem] lg:h-[26.5rem] lg:w-[26.5rem] lg:max-w-none xl:left-[-1.2rem] xl:top-[-4.7rem] xl:h-[28.65rem] xl:w-[28.65rem]" />

          {/* Mobile menu button */}
          <button
            className="rounded-full border border-[#0f9aa1]/25 bg-white/90 p-2.5 text-[#002244] shadow-[0_8px_20px_rgba(0,34,68,0.08)] lg:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden lg:flex items-center justify-end gap-1.5 lg:gap-2 xl:gap-2.5 flex-nowrap text-[#002244]">
            <Link href="/events" className={`${navLinkClassName} text-[#0f9aa1] hover:text-[#0f9aa1] focus-visible:text-[#0f9aa1] active:text-[#0f9aa1]`}>
              Events
            </Link>
            <Link href="/how-to-participate" className={`${navLinkClassName} text-[#61b826] hover:bg-[#e8f4e1] hover:text-[#61b826] focus-visible:text-[#61b826] active:text-[#61b826]`}>
              How to Participate
            </Link>
            <Link href="/about" className={`${navLinkClassName} text-[#ef7f2d] hover:bg-[#fff2da] hover:text-[#ef7f2d] focus-visible:text-[#ef7f2d] active:text-[#ef7f2d]`}>
              About
            </Link>
            <Link href="/blog" className={`${navLinkClassName} text-[#1fb8c2] hover:bg-[#e3f2fb] hover:text-[#1fb8c2] focus-visible:text-[#1fb8c2] active:text-[#1fb8c2]`}>
              Blog
            </Link>
            <Link href="/shop" className={`${navLinkClassName} text-[#f59a2d] hover:bg-[#e8f4e1] hover:text-[#f59a2d] focus-visible:text-[#f59a2d] active:text-[#f59a2d]`}>
              Shop
            </Link>
            <Link href="/contact" className={`${navLinkClassName} text-[#0fa5af] hover:text-[#0fa5af] focus-visible:text-[#0fa5af] active:text-[#0fa5af]`}>
              Contact
            </Link>
            <Link href="/volunteer" className="btn-green min-h-12 whitespace-nowrap px-4.5 text-[1.04rem] font-bold lg:px-6 lg:text-[1.26rem] xl:text-[1.38rem]">
              Join the Movement
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="mt-4 space-y-3 rounded-2xl border border-[#0f9aa1]/20 bg-white/85 p-4 shadow-[0_12px_28px_rgba(0,34,68,0.08)] lg:hidden">
            <Link
              href="/events"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#0f9aa1] transition hover:bg-[#e7f7f8] hover:text-[#0f9aa1] focus-visible:text-[#0f9aa1] active:text-[#0f9aa1]"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/how-to-participate"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#61b826] transition hover:bg-[#e8f4e1] hover:text-[#61b826] focus-visible:text-[#61b826] active:text-[#61b826]"
              onClick={() => setIsOpen(false)}
            >
              How to Participate
            </Link>
            <Link
              href="/about"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#ef7f2d] transition hover:bg-[#fff2da] hover:text-[#ef7f2d] focus-visible:text-[#ef7f2d] active:text-[#ef7f2d]"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/blog"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#1fb8c2] transition hover:bg-[#e3f2fb] hover:text-[#1fb8c2] focus-visible:text-[#1fb8c2] active:text-[#1fb8c2]"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/shop"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#f59a2d] transition hover:bg-[#e8f4e1] hover:text-[#f59a2d] focus-visible:text-[#f59a2d] active:text-[#f59a2d]"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/contact"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#0fa5af] transition hover:bg-[#e7f7f8] hover:text-[#0fa5af] focus-visible:text-[#0fa5af] active:text-[#0fa5af]"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/volunteer"
              className="btn-green block w-full text-center"
              onClick={() => setIsOpen(false)}
            >
              Join the Movement
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
