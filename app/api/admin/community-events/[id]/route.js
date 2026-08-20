import { NextResponse } from 'next/server';
import {
  deleteCommunityEvent,
  getAdminCommunityEventById,
  updateCommunityEvent,
  updateCommunityEventStatus,
} from '@/lib/community-event-repository';
import { getVerifiedAdminSession, requireAdminApiSession } from '@/lib/admin-request';

async function requireSession() {
  const session = await getVerifiedAdminSession();
  return requireAdminApiSession(session);
}

export async function PATCH(request, context) {
  const unauthorizedResponse = await requireSession();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await context.params;

  try {
    const body = await request.json();
    if (body.action) {
      const current = await getAdminCommunityEventById(id);
      if (!current) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
      const action = String(body.action).trim().toLowerCase();
      const supportedActions = new Set(['approve', 'reject', 'remove', 'pin', 'unpin']);
      if (!supportedActions.has(action)) {
        return NextResponse.json({ error: 'Unsupported event action.' }, { status: 400 });
      }
      if (['pin', 'unpin'].includes(action) && current.status !== 'approved') {
        return NextResponse.json({ error: 'Only approved events can be pinned or unpinned.' }, { status: 400 });
      }
      const status = action === 'approve' ? 'approved' : ['reject', 'remove'].includes(action) ? 'rejected' : current.status;
      const isPinned = action === 'pin' ? true : action === 'unpin' || ['reject', 'remove'].includes(action) ? false : current.isPinned;
      const event = await updateCommunityEventStatus(id, status, isPinned);
      return NextResponse.json({ event });
    }

    const event = await updateCommunityEvent(id, body);
    if (!event) return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to update event.' }, { status: 400 });
  }
}

export async function DELETE(_, context) {
  const unauthorizedResponse = await requireSession();
  if (unauthorizedResponse) return unauthorizedResponse;
  const { id } = await context.params;

  try {
    await deleteCommunityEvent(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to delete event.' }, { status: 400 });
  }
}
