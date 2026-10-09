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
            <p className="text-lg font-bold text-[#0f9aa1]">Coming Soon!</p>
            <h1 className="mt-4 text-4xl font-extrabold text-[#0f9aa1] sm:text-5xl">Street Challenge</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed">
              Get ready to pick up litter, earn points, and cheer each other on while making your neighborhood shine.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed">
              We’re getting the challenge ready. Come back soon!
            </p>
            <Link href="/kids-corner" className="btn-green mt-8 inline-flex min-h-12 items-center justify-center px-6 py-3 text-lg font-bold">
              Explore Kids Corner
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
