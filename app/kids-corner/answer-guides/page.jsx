import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Recycling & Reuse Guides | Pick It Up Seattle',
  description: 'Explore printable recycling and reuse guides for families and educators.',
};

const ANSWER_GUIDES = [
  { id: 'recycling', title: 'Recycling Answer Guide', description: 'Answers for the recycling coloring sheet, plus sorting reminders and a reuse tip.', image: '/answer-guides/seattle-recycling-answers.jpg', pdf: '/answer-guides/seattle-recycling-answers.pdf' },
  { id: 'trash', title: 'Trash Answer Guide', description: 'Answers for the trash coloring sheet, plus compost reminders and a reuse tip.', image: '/answer-guides/seattle-trash-answers.jpg', pdf: '/answer-guides/seattle-trash-answers.pdf' },
];

export default function AnswerGuides() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fdf7e8] text-[#002244]">
        <section className="container-custom py-10 sm:py-14">
          <Link href="/kids-corner#take-home-materials" className="inline-flex min-h-11 items-center font-bold text-[#075c65] underline underline-offset-4">Back to Kids Corner</Link>
          <div className="mx-auto mt-5 max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold text-[#0f7f86] sm:text-4xl">Recycling & Reuse Guides</h1>
            <p className="mt-4 text-lg">Explore our collection of recycling and reuse resources. Choose a guide to preview or print.</p>
            <p className="mt-2 font-medium">Sorting tips, reuse ideas, activity answers, and more for families and educators.</p>
          </div>
          <div className="mx-auto mt-9 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
            {ANSWER_GUIDES.map((page) => (
              <article key={page.id} className="flex flex-col rounded-2xl border border-[#0f9aa1]/20 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-2xl font-extrabold text-[#075c65]">{page.title}</h2>
                <p className="mt-2 leading-relaxed">{page.description}</p>
                <Link href={'/kids-corner/answer-guides/' + page.id} className="mt-5 block rounded-xl border border-[#0f9aa1]/15 p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
                  <Image src={page.image} alt={page.title + ' answer guide preview'} width={773} height={1000} sizes="(max-width: 639px) 90vw, 440px" className="h-auto w-full rounded-lg" />
                  <span className="mt-2 block text-center font-bold text-[#075c65] underline underline-offset-4">View Answer Guide</span>
                </Link>
                <a href={page.pdf} download className="btn-orange mt-5 inline-flex min-h-12 items-center justify-center text-center">Download &amp; Print This Guide</a>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-9 max-w-3xl text-center">
            <p>Ready to color? Choose an activity from our <Link href="/kids-corner/coloring-pages" className="font-bold text-[#075c65] underline underline-offset-4">Litter Hero Coloring Pages</Link>.</p>
          </div>
        </section>
      </main>
      <Footer alignWithPageContent />
    </>
  );
}
