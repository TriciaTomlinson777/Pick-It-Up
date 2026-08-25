import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabaseServerFetch } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

async function getThankYouShare(id) {
  const query = new URLSearchParams({
    id: `eq.${id}`,
    moderation_status: 'eq.approved',
    select: 'id,note,image_url,submitted_at',
    limit: '1',
  });

  const response = await supabaseServerFetch(`/rest/v1/community_shares?${query.toString()}`, {
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
  return `${protocol}://${host}/thank-yous/${id}`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const share = await getThankYouShare(id);

  if (!share) {
    return { title: 'Thank You | Pick It Up Seattle' };
  }

  const pageUrl = await getPageUrl(id);
  const description = share.note || 'A thank-you note shared by the Pick It Up Seattle community.';

  return {
    title: 'Thank You | Pick It Up Seattle',
    description,
    openGraph: {
      title: 'Pick It Up Seattle',
      description,
      url: pageUrl,
      images: share.image_url ? [{ url: share.image_url }] : [],
    },
  };
}

export default async function ThankYouSharePage({ params }) {
  const { id } = await params;
  const share = await getThankYouShare(id);

  if (!share) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="container-custom py-12">
        <div className="mx-auto max-w-2xl rounded-[1.4rem] border border-[#002b49]/14 bg-white/88 p-4 shadow-[0_16px_34px_rgba(0,43,73,0.12)]">
          {share.image_url ? (
            <div className="w-full rounded-xl border border-[#002b49]/10 bg-[#f7fbfc] p-2">
              <img
                src={share.image_url}
                alt="Thank you submission photo"
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>
          ) : null}
          {share.note ? (
            <p className="mt-3 text-[15px] leading-7 text-[#1d4254] whitespace-pre-wrap break-words">{share.note}</p>
          ) : null}
          <div className="mt-6 text-center">
            <Link href="/thank-yous" className="text-sm font-semibold text-[#1f5f7a] hover:text-[#002b49]">
              See all thank-you notes
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
