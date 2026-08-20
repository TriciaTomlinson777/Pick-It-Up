import { NextResponse } from 'next/server';
import { createCommunityEvent, getPublicCommunityEvents } from '@/lib/community-event-repository';

export async function GET() {
  try {
    return NextResponse.json({ events: await getPublicCommunityEvents() });
  } catch (error) {
    console.error('Unable to load approved community events.', error);
    return NextResponse.json({ error: 'Unable to load community events.', events: [] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const event = await createCommunityEvent(await request.json());
    return NextResponse.json({ ok: true, event: { id: event.id } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Unable to submit event.' }, { status: 400 });
  }
}
