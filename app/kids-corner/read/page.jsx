import Link from 'next/link';
import CaptainCanBookReader from '@/components/CaptainCanBookReader';

export const metadata = { title: 'Storybook Reader | Pick It Up' };

const messMasterPages = Array.from({ length: 35 }, (_, index) => ({
  label: index === 0 ? 'Cover' : index === 34 ? 'Back cover' : `Page ${index + 1}`,
  src: `/mess-master-page-${String(index + 1).padStart(2, '0')}.jpg`,
}));

const streetPages = Array.from({ length: 40 }, (_, index) => ({
  label: index === 0 ? 'Cover' : index === 39 ? 'Back cover' : index === 1 || index === 37 ? 'Teal page' : index === 38 ? 'Thank you' : `Page ${index - 1}`,
  src: `/ding-ding-street-page-${String(index + 1).padStart(2, '0')}.jpg`,
}));

export default async function StorybookReaderPage({ searchParams }) {
  const { book } = await searchParams;
  const isMessMaster = book === 'mess-master';
  const isStreet = book === 'ding-ding-street';
  const selectedBook = isStreet ? 'ding-ding-street' : isMessMaster ? 'mess-master' : 'captain-can';
  const title = isStreet ? 'Mia & Olivia: The Ding-Ding Street Challenge' : isMessMaster ? 'Mess Master and the Traveling Trash!' : 'Captain Can and the Messy Block';
  return (
    <main className="captain-can-reader-page bg-[#11100d] text-[#fff8e5] lg:min-h-screen">
      <section className="mx-auto flex w-full max-w-[92rem] flex-col px-5 pb-10 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:px-12 lg:pb-24">
        <div className="mx-auto w-full max-w-[78rem] text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#f4c94c]">Read This Book</p>
          <h1 className="mt-4 text-3xl font-bold text-[#fff8e5] sm:text-5xl">{title}</h1>
          <nav aria-label="Choose a book" className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/kids-corner/read?book=captain-can" aria-current={selectedBook === 'captain-can' ? 'page' : undefined} className="rounded-xl border border-[#f4c94c]/40 px-4 py-2 font-bold text-[#f4c94c] aria-[current=page]:bg-[#f4c94c]/15">Captain Can</Link>
            <Link href="/kids-corner/read?book=mess-master" aria-current={isMessMaster ? 'page' : undefined} className="rounded-xl border border-[#f4c94c]/40 px-4 py-2 font-bold text-[#f4c94c] aria-[current=page]:bg-[#f4c94c]/15">Mess Master</Link>
            <Link href="/kids-corner/read?book=ding-ding-street" aria-current={isStreet ? 'page' : undefined} className="rounded-xl border border-[#f4c94c]/40 px-4 py-2 font-bold text-[#f4c94c] aria-[current=page]:bg-[#f4c94c]/15">Ding-Ding Street Challenge</Link>
          </nav>
        </div>
        <CaptainCanBookReader key={selectedBook} title={title} pages={isStreet ? streetPages : isMessMaster ? messMasterPages : undefined} />
        <div className="mt-10 flex justify-end sm:mt-12">
          <Link href="/kids-corner" className="text-lg font-extrabold text-[#f4c94c] hover:text-[#ffe17a]">Back to Kids Corner</Link>
        </div>
      </section>
    </main>
  );
}
