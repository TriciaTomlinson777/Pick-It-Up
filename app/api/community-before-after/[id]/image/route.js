import { NextResponse } from 'next/server';
import { getVerifiedAdminSession } from '@/lib/admin-request';
import { createSignedPhotoUrl, isFutureUploadPath } from '@/lib/future-photo-moderation';
import { supabaseServerFetch } from '@/lib/supabase-server';

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const side = new URL(request.url).searchParams.get('side');
    if (!id || !['before', 'after'].includes(side)) {
      return new NextResponse(null, { status: 404 });
    }

    const query = new URLSearchParams({
      id: `eq.${id}`,
      select: 'moderation_status,before_image_path,after_image_path',
      limit: '1',
    });
    const response = await supabaseServerFetch(`/rest/v1/community_before_after_pairs?${query}`);
    if (!response.ok) {
      return NextResponse.json({ error: 'Unable to load this photo.' }, { status: 502 });
    }

    const rows = await response.json();
    const pair = Array.isArray(rows) ? rows[0] : null;
    if (!pair) return new NextResponse(null, { status: 404 });

    if (pair.moderation_status !== 'approved' && !(await getVerifiedAdminSession())) {
      return new NextResponse(null, { status: 404 });
    }

    const storagePath = side === 'before' ? pair.before_image_path : pair.after_image_path;
    if (!isFutureUploadPath(storagePath)) return new NextResponse(null, { status: 404 });

    const signedUrl = await createSignedPhotoUrl(storagePath);
    const redirect = NextResponse.redirect(signedUrl, 302);
    redirect.headers.set('Cache-Control', 'private, no-store');
    return redirect;
  } catch (error) {
    console.error('Unable to resolve community before/after photo.', error);
    return NextResponse.json({ error: 'Unable to load this photo.' }, { status: 500 });
  }
}