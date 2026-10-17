import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Learning & Cleanup Activities | Pick It Up Seattle' };
const GUIDES = [
  { title: 'Why Compost?', image: '/answer-guides/why-compost-learning-guide.jpg', pdf: '/answer-guides/why-compost-learning-guide.pdf', description: 'Discover how compost helps plants, soil, water, and our planet.' },
  { title: 'Why Recycle?', image: '/answer-guides/why-recycle-learning-guide.jpg', pdf: '/answer-guides/why-recycle-learning-guide.pdf', description: 'Learn how recycling saves materials and energy and gives useful things another life.' },
  { title: 'What Happens to Trash?', image: '/answer-guides/what-happens-to-trash-learning-guide.jpg', pdf: '/answer-guides/what-happens-to-trash-learning-guide.pdf', description: 'Follow Seattle’s trash from the garbage bin to the landfill—and discover how we can make less trash.' },
];
export default function LearningCleanup() {
  return <><Header /><main className="min-h-screen bg-[#fdf7e8] px-5 py-10 text-[#002244]"><div className="mx-auto max-w-4xl">
    <Link href="/kids-corner#take-home-materials" className="inline-flex min-h-11 items-center font-bold text-[#075c65] underline underline-offset-4">Back to Kids Corner</Link>
    <h1 className="mt-5 text-center text-3xl font-extrabold text-[#0f7f86] sm:text-4xl">Learning &amp; Cleanup Activities</h1>
    {GUIDES.map((page) => <section key={page.title} className="mt-10">
      <h2 className="text-center text-2xl font-extrabold text-[#075c65]">{page.title}</h2>
      <p className="mt-3 text-center text-lg">{page.description}</p>
      <div className="my-6 text-center"><a href={page.pdf} download className="btn-orange inline-flex min-h-12 items-center justify-center" aria-label={`Download and print ${page.title}`}>Download &amp; Print This Guide</a></div>
      <Image src={page.image} alt={`${page.title} printable learning guide`} width={773} height={1000} sizes="(max-width: 895px) 95vw, 850px" className="h-auto w-full rounded-xl bg-white shadow-sm" />
    </section>)}
  </div></main><Footer alignWithPageContent /></>;
}
