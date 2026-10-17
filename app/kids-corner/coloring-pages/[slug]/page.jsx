import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PAGES = {
  compost: { title: 'What Goes in Compost?', image: '/coloring/seattle-compost-coloring.jpg', pdf: '/coloring/seattle-compost-coloring.pdf' },
  recycling: { title: 'What Goes in Recycling?', image: '/coloring/seattle-recycling-coloring.jpg', pdf: '/coloring/seattle-recycling-coloring.pdf' },
  trash: { title: 'What Goes in the Trash?', image: '/coloring/seattle-trash-coloring.jpg', pdf: '/coloring/seattle-trash-coloring.pdf' },
};
export function generateStaticParams() { return Object.keys(PAGES).map((slug) => ({ slug })); }
export default async function ColoringPage({ params }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  return <><Header /><main className="min-h-screen bg-[#fdf7e8] px-5 py-10 text-[#002244]"><div className="mx-auto max-w-4xl">
    <Link href="/kids-corner/coloring-pages" className="inline-flex min-h-11 items-center font-bold text-[#075c65] underline underline-offset-4">Back to All Coloring Pages</Link>
    <h1 className="mt-5 text-center text-3xl font-extrabold text-[#0f7f86] sm:text-4xl">{page.title}</h1>
    <div className="my-6 text-center"><a href={page.pdf} download className="btn-orange inline-flex min-h-12 items-center justify-center">Download &amp; Print This Page</a></div>
    <Image src={page.image} alt={page.title + ' printable coloring activity'} width={773} height={1000} sizes="(max-width: 895px) 95vw, 850px" className="h-auto w-full rounded-xl bg-white shadow-sm" priority />
  </div></main><Footer alignWithPageContent /></>;
}
