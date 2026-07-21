import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-0 border-t border-[#0f9aa1]/35 bg-[linear-gradient(155deg,_#fff8eb_0%,_#eefbfb_38%,_#f0f8e7_72%,_#fff0cc_100%)] text-[#002244]">
      <div className="container-custom py-10 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10 xl:gap-12 mb-10 lg:mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 lg:text-2xl">Pick It Up Seattle</h3>
            <p className="text-[#1a5570] lg:text-lg">
              Making it easy to leave Seattle better than you found it.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold lg:text-lg">Quick Links</h4>
            <ul className="space-y-2 text-[#1a5570]">
              <li>
                <Link href="/events" className="transition hover:text-[#0f9aa1]">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/how-to-participate" className="transition hover:text-[#0f9aa1]">
                  How to Participate
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="transition hover:text-[#0f9aa1]">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition hover:text-[#0f9aa1]">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 font-semibold lg:text-lg">Resources</h4>
            <ul className="space-y-2 text-[#1a5570]">
              <li>
                <Link href="/community-resources" className="transition hover:text-[#0f9aa1]">
                  Community Resources
                </Link>
              </li>
              <li>
                <Link href="/shop" className="transition hover:text-[#0f9aa1]">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-[#0f9aa1]">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition hover:text-[#0f9aa1]">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="font-semibold mb-4 lg:text-lg">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/pickitupseattle"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#0f9aa1]/40 bg-white p-2 text-[#0f9aa1] shadow-[0_8px_18px_rgba(15,154,161,0.16)] transition hover:-translate-y-0.5 hover:bg-[#e9f9fa] hover:text-[#0c8a90]"
              >
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                </svg>
              </a>
              <a
                href="https://facebook.com/pickitupseattle"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#69BE28]/45 bg-white p-2 text-[#4f9a1f] shadow-[0_8px_18px_rgba(105,190,40,0.18)] transition hover:-translate-y-0.5 hover:bg-[#edf8e3] hover:text-[#3f7f17]"
              >
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/pickitupseattle"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#f4a62a]/45 bg-white p-2 text-[#be7310] shadow-[0_8px_18px_rgba(244,166,42,0.18)] transition hover:-translate-y-0.5 hover:bg-[#fff4e2] hover:text-[#a8640d]"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#69BE28]/35 pt-6 lg:pt-8">
          <div className="flex flex-col items-center justify-between text-sm text-[#1a5570] md:flex-row lg:text-base">
            <p>&copy; {currentYear} Pick It Up Seattle. All rights reserved.</p>
            <div className="mt-4 flex space-x-6 md:mt-0 lg:space-x-8">
              <Link href="/privacy" className="transition hover:text-[#0f9aa1]">
                Privacy Policy
              </Link>
              <Link href="/terms" className="transition hover:text-[#0f9aa1]">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
