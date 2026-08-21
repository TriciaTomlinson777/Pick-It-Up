import { NextResponse } from 'next/server';
import { getVerifiedAdminSession, requireAdminApiSession } from '@/lib/admin-request';
import {
  deleteAdminCommunityContent,
  updateAdminCommunityContentStatus,
} from '@/lib/community-content-admin-repository';

async function requireSession() {
  const session = await getVerifiedAdminSession();
  return requireAdminApiSession(session);
}

export async function PATCH(request, context) {
  const unauthorizedResponse = await requireSession();
  if (unauthorizedResponse) return unauthorizedResponse;

  const { type, id } = await context.params;

  try {
    const body = await request.json();
    const action = String(body.action || '').trim().toLowerCase();
    if (action !== 'remove') {
      return NextResponse.json({ error: 'Unsupported moderation action.' }, { status: 400 });
    }

    const item = await updateAdminCommunityContentStatus(type, id, 'removed');
    if (!item) return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unable to update submission.' },
      { status: 400 }
    );
  }
}

export async function DELETE(_, context) {
  const unauthorizedResponse = await requireSession();
  if (unauthorizedResponse) return unauthorizedResponse;

  const { type, id } = await context.params;

  try {
    await deleteAdminCommunityContent(type, id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Unable to delete submission.' },
      { status: 400 }
    );
  }
}