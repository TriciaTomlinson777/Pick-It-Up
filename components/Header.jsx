'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClassName =
    'rounded-full px-2 py-2 text-base font-bold tracking-[0.01em] text-[#002244] transition hover:bg-[#e7f7f8] hover:text-[#0f9aa1] lg:px-3 lg:py-2.5 lg:text-[1.22rem] xl:text-[1.32rem] whitespace-nowrap';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#0f9aa1]/20 bg-[#fffaf0]/95 shadow-[0_10px_24px_rgba(0,34,68,0.1)] backdrop-blur-sm">
      <nav className="container-custom py-3.5 lg:py-4.5">
        <div className="flex items-center justify-between">
          <Logo href="/" className="inline-flex" imgClassName="w-64 sm:w-72 lg:w-[23rem] xl:w-[25.5rem]" />

          {/* Mobile menu button */}
          <button
            className="rounded-full border border-[#0f9aa1]/25 bg-white/90 p-2 text-[#002244] shadow-[0_8px_20px_rgba(0,34,68,0.08)] md:hidden"
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
          <div className="hidden md:flex items-center justify-end gap-1 lg:gap-1.5 xl:gap-2 flex-nowrap text-[#002244]">
            <Link href="/events" className={navLinkClassName}>
              Events
            </Link>
            <Link href="/how-to-participate" className={`${navLinkClassName} hover:bg-[#e8f4e1] hover:text-[#4e9a1c]`}>
              How to Participate
            </Link>
            <Link href="/about" className={`${navLinkClassName} hover:bg-[#fff2da] hover:text-[#c67816]`}>
              About
            </Link>
            <Link href="/blog" className={`${navLinkClassName} hover:bg-[#e3f2fb] hover:text-[#1380b3]`}>
              Blog
            </Link>
            <Link href="/shop" className={`${navLinkClassName} hover:bg-[#e8f4e1] hover:text-[#4e9a1c]`}>
              Shop
            </Link>
            <Link href="/contact" className={navLinkClassName}>
              Contact
            </Link>
            <Link href="/volunteer" className="btn-green min-h-11 whitespace-nowrap px-4 text-base font-bold lg:px-5 lg:text-[1.2rem] xl:text-[1.32rem]">
              Join Us
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="mt-4 space-y-3 rounded-2xl border border-[#0f9aa1]/20 bg-white/85 p-4 shadow-[0_12px_28px_rgba(0,34,68,0.08)] md:hidden">
            <Link
              href="/events"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#002244] transition hover:bg-[#e7f7f8] hover:text-[#0f9aa1]"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/how-to-participate"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#002244] transition hover:bg-[#e8f4e1] hover:text-[#4e9a1c]"
              onClick={() => setIsOpen(false)}
            >
              How to Participate
            </Link>
            <Link
              href="/about"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#002244] transition hover:bg-[#fff2da] hover:text-[#c67816]"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/blog"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#002244] transition hover:bg-[#e3f2fb] hover:text-[#1380b3]"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/shop"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#002244] transition hover:bg-[#e8f4e1] hover:text-[#4e9a1c]"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/contact"
              className="block rounded-xl px-3 py-2.5 text-[1.08rem] font-bold text-[#002244] transition hover:bg-[#e7f7f8] hover:text-[#0f9aa1]"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/volunteer"
              className="btn-green block w-full text-center"
              onClick={() => setIsOpen(false)}
            >
              Join Us
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
