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
            <p className="mt-4 text-2xl font-bold text-[#0f9aa1] sm:text-3xl">Street Challenge</p>
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
