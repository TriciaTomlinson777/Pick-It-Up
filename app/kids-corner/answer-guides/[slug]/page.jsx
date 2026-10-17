import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PAGES = {
  compost: { title: 'Compost Answer Guide', image: '/answer-guides/seattle-compost-answers-completed.jpg', pdf: '/answer-guides/seattle-compost-answers-completed.pdf' },
  recycling: { title: 'Recycling Answer Guide', image: '/answer-guides/seattle-recycling-answers-completed.jpg', pdf: '/answer-guides/seattle-recycling-answers-completed.pdf' },
  trash: { title: 'Trash Answer Guide', image: '/answer-guides/seattle-trash-answers-completed.jpg', pdf: '/answer-guides/seattle-trash-answers-completed.pdf' },
};
export function generateStaticParams() { return Object.keys(PAGES).map((slug) => ({ slug })); }
export default async function AnswerGuide({ params }) {
  const { slug } = await params;
  if (slug === 'why-compost') redirect('/kids-corner/learning-cleanup');
  const page = PAGES[slug];
  if (!page) notFound();
  return <><Header /><main className="min-h-screen bg-[#fdf7e8] px-5 py-10 text-[#002244]"><div className="mx-auto max-w-4xl">
    <Link href="/kids-corner/answer-guides" className="inline-flex min-h-11 items-center font-bold text-[#075c65] underline underline-offset-4">Back to All Answer Guides</Link>
    <h1 className="mt-5 text-center text-3xl font-extrabold text-[#0f7f86] sm:text-4xl">{page.title}</h1>
    <div className="my-6 text-center"><a href={page.pdf} download className="btn-orange inline-flex min-h-12 items-center justify-center">Download &amp; Print This Guide</a></div>
    <Image src={page.image} alt={page.title + ' printable answer guide'} width={773} height={1000} sizes="(max-width: 895px) 95vw, 850px" className="h-auto w-full rounded-xl bg-white shadow-sm" priority />
  </div></main><Footer alignWithPageContent /></>;
}
