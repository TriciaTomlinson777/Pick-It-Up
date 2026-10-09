import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Street Challenge — Coming Soon | Pick It Up Seattle',
  description: 'Street Challenge is coming soon. Small actions. Cleaner neighborhoods. More Litter Heroes.',
};

export default function StreetChallengeComingSoon() {
  return (
    <>
      <Header />
      <main className="bg-[#fdf7e8] text-[#002244]">
        <section className="hero-surface border-b border-[#0f9aa1]/20 py-16 sm:py-24">
          <div className="container-custom text-center">
            <h1 className="text-5xl font-extrabold leading-tight text-[#0f9aa1] sm:text-6xl lg:text-7xl">Coming Soon!</h1>
            <div className="mt-5 flex items-center justify-center gap-2 sm:gap-4">
              <svg aria-hidden="true" viewBox="0 0 48 64" className="h-12 w-8 shrink-0 text-[#d9665b] sm:h-16 sm:w-12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M35 20 C29 17 14 6 10 8 C5 11 22 22 31 25 Z M31 29 C23 27 4 27 4 32 C4 37 23 36 31 34 Z M31 40 C23 42 6 53 10 57 C14 61 29 47 35 44 Z" fill="#0f9aa1" stroke="none" /></svg>
              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"><span className="text-[#e53446]">Street Challenge!</span></h2>
              <span className="-scale-x-100"><svg aria-hidden="true" viewBox="0 0 48 64" className="h-12 w-8 shrink-0 text-[#d9665b] sm:h-16 sm:w-12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M35 20 C29 17 14 6 10 8 C5 11 22 22 31 25 Z M31 29 C23 27 4 27 4 32 C4 37 23 36 31 34 Z M31 40 C23 42 6 53 10 57 C14 61 29 47 35 44 Z" fill="#0f9aa1" stroke="none" /></svg></span>
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed">
              Get ready to pick up litter, earn points, and cheer each other on while making your neighborhood shine.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed">
              We’re getting the challenge ready. Come back soon!
            </p>
            <Link href="/kids-corner" className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full border border-[#0f9aa1]/40 px-5 py-2 text-base font-semibold text-[#002244] transition hover:bg-white/60">
              Explore Kids Corner
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
