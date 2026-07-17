'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom py-4 lg:py-5">
        <div className="flex items-center justify-between">
          <Logo href="/" className="hidden sm:inline-flex" />

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
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
          <div className="hidden md:flex items-center justify-end gap-2 lg:gap-4 xl:gap-5 flex-nowrap">
            <Link href="/events" className="hover:text-seattle-green transition text-xs lg:text-sm xl:text-base whitespace-nowrap px-1">
              Events
            </Link>
            <Link href="/how-to-participate" className="hover:text-seattle-green transition text-xs lg:text-sm xl:text-base whitespace-nowrap px-1">
              How to Participate
            </Link>
            <Link href="/about" className="hover:text-seattle-green transition text-xs lg:text-sm xl:text-base whitespace-nowrap px-1">
              About
            </Link>
            <Link href="/blog" className="hover:text-seattle-green transition text-xs lg:text-sm xl:text-base whitespace-nowrap px-1">
              Blog
            </Link>
            <Link href="/shop" className="hover:text-seattle-green transition text-xs lg:text-sm xl:text-base whitespace-nowrap px-1">
              Shop
            </Link>
            <Link href="/contact" className="hover:text-seattle-green transition text-xs lg:text-sm xl:text-base whitespace-nowrap px-1">
              Contact
            </Link>
            <Link href="/volunteer" className="btn-primary whitespace-nowrap text-xs lg:text-sm xl:text-base">
              Join Us
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t pt-4">
            <Link
              href="/events"
              className="block hover:text-seattle-green transition"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/how-to-participate"
              className="block hover:text-seattle-green transition"
              onClick={() => setIsOpen(false)}
            >
              How to Participate
            </Link>
            <Link
              href="/about"
              className="block hover:text-seattle-green transition"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/blog"
              className="block hover:text-seattle-green transition"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/shop"
              className="block hover:text-seattle-green transition"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/contact"
              className="block hover:text-seattle-green transition"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/volunteer"
              className="btn-primary block text-center w-full"
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
