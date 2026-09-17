import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabaseServerFetch } from '@/lib/supabase-server';
import { createSignedPhotoUrl, hasDetectedChildFace, isFutureUploadPath } from '@/lib/future-photo-moderation';

export const dynamic = 'force-dynamic';

async function getScenicDiscovery(id) {
  const query = new URLSearchParams({
    id: `eq.${id}`,
    moderation_status: 'eq.approved',
    select: 'id,caption,image_url,image_path,submitted_at',
    limit: '1',
  });

  const response = await supabaseServerFetch(`/rest/v1/scenic_discoveries?${query.toString()}`, {
    requireServiceRole: false,
  });

  if (!response.ok) {
    return null;
  }

  const rows = await response.json();
  const row = Array.isArray(rows) ? rows[0] || null : null;
  if (!row) return null;

  return {
    ...row,
    image_url: row.image_url || (isFutureUploadPath(row.image_path) ? await createSignedPhotoUrl(row.image_path) : ''),
  };
}

async function getPageUrl(id) {
  const requestHeaders = await headers();
  const host = requestHeaders.get('host') || 'pickitupseattle.org';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  return `${protocol}://${host}/scenic-discoveries/${id}`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const discovery = await getScenicDiscovery(id);

  if (!discovery) {
    return { title: 'Scenic Discovery | Pick It Up Seattle' };
  }

  const pageUrl = await getPageUrl(id);
  const description = discovery.caption || 'A scenic discovery shared by the Pick It Up Seattle community.';
  const previewImage = new URL('/pick-it-up-seattle-logo.png', pageUrl).toString();
  const ogImage = hasDetectedChildFace(discovery.image_path) ? previewImage : discovery.image_url;

  return {
    title: 'Scenic Discovery | Pick It Up Seattle',
    description,
    openGraph: {
      title: 'Pick It Up Seattle',
      description,
      url: pageUrl,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function ScenicDiscoveryPage({ params }) {
  const { id } = await params;
  const discovery = await getScenicDiscovery(id);

  if (!discovery) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="container-custom py-12">
        <div className="mx-auto max-w-2xl rounded-[1.4rem] border border-[#002b49]/14 bg-white/88 p-4 shadow-[0_16px_34px_rgba(0,43,73,0.12)]">
          {discovery.image_url ? (
            <div className="w-full rounded-xl border border-[#002b49]/10 bg-[#f7fbfc] p-2">
              <img
                src={discovery.image_url}
                alt="Scenic discovery submission photo"
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>
          ) : null}
          {discovery.caption ? (
            <p className="mt-3 text-[15px] leading-7 text-[#1d4254] whitespace-pre-wrap break-words">{discovery.caption}</p>
          ) : null}
          <div className="mt-6 text-center">
            <Link href="/volunteer-memorable-photos" className="text-sm font-semibold text-[#1f5f7a] hover:text-[#002b49]">
              See all Scenic Discoveries
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
