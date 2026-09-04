import Link from 'next/link';
import CaptainCanBookReader from '@/components/CaptainCanBookReader';

export const metadata = {
  title: 'Captain Can and the Messy Block | Pick It Up',
  description: 'A standalone reading page for Captain Can and the Messy Block.',
};

export default function CaptainCanMessyBlockReaderPage() {
  return (
    <main className="min-h-screen bg-[#11100d] text-[#fff8e5]">
      <section className="mx-auto flex w-full max-w-[92rem] flex-col px-5 pb-16 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:px-12 lg:pb-24">
        <div className="mx-auto w-full max-w-[78rem] text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f4c94c]">
            Read This Book
          </p>
          <h1 className="mt-4 text-3xl font-bold text-[#fff8e5] sm:text-5xl">
            Captain Can and the Messy Block
          </h1>
        </div>

        <CaptainCanBookReader />

        <div className="mt-10 flex justify-end sm:mt-12">
          <Link href="/kids-corner" className="text-lg font-extrabold text-[#f4c94c] hover:text-[#ffe17a]">
            Back to Kids Corner
          </Link>
        </div>
      </section>
    </main>
  );
}