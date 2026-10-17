import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Litter Hero Coloring Pages | Pick It Up Seattle',
  description: 'Choose a free printable Seattle Litter Hero coloring page. Preview recycling and trash activities before downloading.',
};

const COLORING_PAGES = [
  { id: 'recycling', title: 'What Goes in Recycling?', description: 'Match everyday recyclables to Seattle’s blue recycling bin, then color.', image: '/coloring/seattle-recycling-coloring.jpg', pdf: '/coloring/seattle-recycling-coloring.pdf' },
  { id: 'trash', title: 'What Goes in the Trash?', description: 'Learn what belongs in the garbage bin with a matching and coloring activity.', image: '/coloring/seattle-trash-coloring.jpg', pdf: '/coloring/seattle-trash-coloring.pdf' },
];

export default function ColoringPages() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fdf7e8] text-[#002244]">
        <section className="container-custom py-10 sm:py-14">
          <Link href="/kids-corner#take-home-materials" className="inline-flex min-h-11 items-center font-bold text-[#075c65] underline underline-offset-4">Back to Kids Corner</Link>
          <div className="mx-auto mt-5 max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold text-[#0f7f86] sm:text-4xl">Litter Hero Coloring Pages</h1>
            <p className="mt-4 text-lg">Choose a page to explore, color, and learn. Tap a picture to see it larger, or download just the page you want.</p>
            <p className="mt-2 font-medium">Free printable activities for Seattle families and educators.</p>
          </div>
          <div className="mx-auto mt-9 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
            {COLORING_PAGES.map((page) => (
              <article key={page.id} className="flex flex-col rounded-2xl border border-[#0f9aa1]/20 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-2xl font-extrabold text-[#075c65]">{page.title}</h2>
                <p className="mt-2 leading-relaxed">{page.description}</p>
                <Link href={'/kids-corner/coloring-pages/' + page.id} className="mt-5 block rounded-xl border border-[#0f9aa1]/15 p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                  <Image src={page.image} alt={page.title + ' coloring sheet preview'} width={773} height={1000} sizes="(max-width: 639px) 90vw, 440px" className="h-auto w-full rounded-lg" />
                  <span className="mt-2 block text-center font-bold text-[#075c65] underline underline-offset-4">View Coloring Page</span>
                </Link>
                <a href={page.pdf} download className="btn-orange mt-5 inline-flex min-h-12 items-center justify-center text-center">Download &amp; Print This Page</a>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-9 max-w-3xl text-center">
            <p>Looking for the answers? Find sorting reminders and reuse tips in our <Link href="/kids-corner#take-home-materials" className="font-bold text-[#075c65] underline underline-offset-4">Recycling &amp; Reuse Guides</Link>.</p>
          </div>
        </section>
      </main>
      <Footer alignWithPageContent />
    </>
  );
}
