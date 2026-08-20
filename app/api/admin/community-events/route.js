import { NextResponse } from 'next/server';
import { getAdminCommunityEvents } from '@/lib/community-event-repository';
import { getVerifiedAdminSession, requireAdminApiSession } from '@/lib/admin-request';

export async function GET() {
  const session = await getVerifiedAdminSession();
  const unauthorizedResponse = requireAdminApiSession(session);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    return NextResponse.json({ events: await getAdminCommunityEvents() });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to load events.' }, { status: 500 });
  }
}
