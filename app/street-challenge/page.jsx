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
              <svg aria-hidden="true" viewBox="0 0 48 64" className="h-12 w-8 shrink-0 text-[#d9665b] sm:h-16 sm:w-12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M35 14 C22 21 29 27 14 31 M35 33 L14 38 M36 48 C25 43 25 53 13 52" /></svg>
              <p className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl"><span className="text-[#0f9aa1]">Street</span>{' '}<span className="text-[#5b8f16]">Challenge</span><span className="text-[#d9665b]">!</span></p>
              <span className="-scale-x-100"><svg aria-hidden="true" viewBox="0 0 48 64" className="h-12 w-8 shrink-0 text-[#d9665b] sm:h-16 sm:w-12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"><path d="M35 14 C22 21 29 27 14 31 M35 33 L14 38 M36 48 C25 43 25 53 13 52" /></svg></span>
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
