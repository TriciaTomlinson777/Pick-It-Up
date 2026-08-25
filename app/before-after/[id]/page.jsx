import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabaseServerFetch } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

async function getBeforeAfterPair(id) {
  const query = new URLSearchParams({
    id: `eq.${id}`,
    moderation_status: 'eq.approved',
    select: 'id,before_image_url,after_image_url,pair_caption,submitted_at',
    limit: '1',
  });

  const response = await supabaseServerFetch(`/rest/v1/community_before_after_pairs?${query.toString()}`, {
    requireServiceRole: false,
  });

  if (!response.ok) {
    return null;
  }

  const rows = await response.json();
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function getPageUrl(id) {
  const requestHeaders = await headers();
  const host = requestHeaders.get('host') || 'pickitupseattle.org';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  return `${protocol}://${host}/before-after/${id}`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const pair = await getBeforeAfterPair(id);

  if (!pair) {
    return { title: 'See the Difference | Pick It Up Seattle' };
  }

  const pageUrl = await getPageUrl(id);
  const description = pair.pair_caption || 'A before-and-after cleanup moment shared by the Pick It Up Seattle community.';
  const ogImage = pair.after_image_url || pair.before_image_url || '';

  return {
    title: 'See the Difference | Pick It Up Seattle',
    description,
    openGraph: {
      title: 'Pick It Up Seattle',
      description,
      url: pageUrl,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function BeforeAfterPairPage({ params }) {
  const { id } = await params;
  const pair = await getBeforeAfterPair(id);

  if (!pair) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="container-custom py-12">
        <div className="mx-auto max-w-2xl rounded-[1.4rem] border border-[#002b49]/14 bg-white/88 p-4 shadow-[0_16px_34px_rgba(0,43,73,0.12)]">
          <div className="grid grid-cols-2 gap-2">
            {pair.before_image_url ? (
              <div className="overflow-hidden rounded-xl border border-[#002b49]/10 bg-[#f7fbfc] p-2">
                <img src={pair.before_image_url} alt="Cleanup before photo" className="h-auto w-full rounded-lg object-contain" />
              </div>
            ) : null}
            {pair.after_image_url ? (
              <div className="overflow-hidden rounded-xl border border-[#002b49]/10 bg-[#f7fbfc] p-2">
                <img src={pair.after_image_url} alt="Cleanup after photo" className="h-auto w-full rounded-lg object-contain" />
              </div>
            ) : null}
          </div>
          {pair.pair_caption ? (
            <p className="mt-3 text-[15px] leading-7 text-[#1d4254] whitespace-pre-wrap break-words">{pair.pair_caption}</p>
          ) : null}
          <div className="mt-6 text-center">
            <Link href="/#how-it-works" className="text-sm font-semibold text-[#1f5f7a] hover:text-[#002b49]">
              See more before-and-after photos
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
