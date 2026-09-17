import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { supabaseServerFetch } from '@/lib/supabase-server';
import { createSignedPhotoUrl, hasDetectedChildFace, isFutureUploadPath } from '@/lib/future-photo-moderation';

export const dynamic = 'force-dynamic';

async function getCommunityActionPhoto(id) {
  const query = new URLSearchParams({
    id: `eq.${id}`,
    moderation_status: 'eq.approved',
    select: 'id,caption,image_url,image_path,submitted_at',
    limit: '1',
  });

  const response = await supabaseServerFetch(`/rest/v1/community_action_photos?${query.toString()}`, {
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
  return `${protocol}://${host}/community-in-action/${id}`;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const photo = await getCommunityActionPhoto(id);

  if (!photo) {
    return { title: 'Community in Action | Pick It Up Seattle' };
  }

  const pageUrl = await getPageUrl(id);
  const description = photo.caption || 'A Community in Action photo shared by the Pick It Up Seattle community.';
  const previewImage = new URL('/pick-it-up-seattle-logo.png', pageUrl).toString();
  const ogImage = hasDetectedChildFace(photo.image_path) ? previewImage : photo.image_url;

  return {
    title: 'Community in Action | Pick It Up Seattle',
    description,
    openGraph: {
      title: 'Pick It Up Seattle',
      description,
      url: pageUrl,
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function CommunityInActionPhotoPage({ params }) {
  const { id } = await params;
  const photo = await getCommunityActionPhoto(id);

  if (!photo) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="container-custom py-12">
        <div className="mx-auto max-w-2xl rounded-[1.4rem] border border-[#002b49]/14 bg-white/88 p-4 shadow-[0_16px_34px_rgba(0,43,73,0.12)]">
          {photo.image_url ? (
            <div className="w-full rounded-xl border border-[#002b49]/10 bg-[#f7fbfc] p-2">
              <img
                src={photo.image_url}
                alt="Community in Action photo"
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>
          ) : null}
          {photo.caption ? (
            <p className="mt-3 text-[15px] leading-7 text-[#1d4254] whitespace-pre-wrap break-words">{photo.caption}</p>
          ) : null}
          <div className="mt-6 text-center">
            <Link href="/#day-one" className="text-sm font-semibold text-[#1f5f7a] hover:text-[#002b49]">
              See all Community in Action photos
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
