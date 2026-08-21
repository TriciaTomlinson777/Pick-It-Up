import { NextResponse } from 'next/server';
import { getVerifiedAdminSession, requireAdminApiSession } from '@/lib/admin-request';
import { getAdminCommunityContent } from '@/lib/community-content-admin-repository';

export async function GET() {
  const session = await getVerifiedAdminSession();
  const unauthorizedResponse = requireAdminApiSession(session);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    return NextResponse.json({ sections: await getAdminCommunityContent() });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unable to load community submissions.' },
      { status: 500 }
    );
  }
}