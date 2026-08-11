import { NextResponse } from 'next/server';
import { supabaseServerFetch, getSupabaseServerConfig } from '@/lib/supabase-server';

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || '').trim());
}

async function parseSupabaseError(response) {
  const text = await response.text();
  if (!text) {
    return '';
  }

  try {
    const data = JSON.parse(text);
    return String(data?.message || data?.hint || '').trim();
  } catch {
    return '';
  }
}

export async function POST(_request, context) {
  const { isConfigured } = getSupabaseServerConfig();
  if (!isConfigured) {
    console.error('cleanup-adventures signup POST: Supabase service-role not configured.');
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  const params = await context?.params;
  const eventId = String(params?.id || '').trim();
  if (!isUuid(eventId)) {
    return NextResponse.json({ error: 'Invalid event id.' }, { status: 400 });
  }

  try {
    const response = await supabaseServerFetch('/rest/v1/rpc/increment_cleanup_adventure_signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p_event_id: eventId }),
    });

    if (!response.ok) {
      const supabaseMessage = await parseSupabaseError(response);
      console.error('Failed to increment cleanup adventure signup count.', supabaseMessage || response.status);
      return NextResponse.json({ error: 'Unable to join cleanup adventure.' }, { status: 500 });
    }

    const rows = await response.json();
    const resultRow = Array.isArray(rows) ? rows[0] : null;

    if (!resultRow?.result_status) {
      return NextResponse.json({ error: 'Unable to join cleanup adventure.' }, { status: 500 });
    }

    const signedUpCount = Number.parseInt(String(resultRow.signed_up_count ?? ''), 10);
    const maxVolunteers = Number.parseInt(String(resultRow.max_volunteers ?? ''), 10);

    if (resultRow.result_status === 'not_found') {
      return NextResponse.json({
        error: 'Cleanup adventure not found.',
      }, { status: 404 });
    }

    if (resultRow.result_status === 'full') {
      return NextResponse.json({
        error: 'Cleanup adventure is full.',
        signedUpCount: Number.isFinite(signedUpCount) ? signedUpCount : 0,
        isFull: true,
        maxVolunteers: Number.isFinite(maxVolunteers) ? maxVolunteers : null,
      }, { status: 409 });
    }

    if (resultRow.result_status !== 'ok') {
      return NextResponse.json({ error: 'Unable to join cleanup adventure.' }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      eventId,
      signedUpCount: Number.isFinite(signedUpCount) ? signedUpCount : 0,
      isFull: Number.isFinite(maxVolunteers)
        ? (Number.isFinite(signedUpCount) ? signedUpCount >= maxVolunteers : false)
        : false,
      maxVolunteers: Number.isFinite(maxVolunteers) ? maxVolunteers : null,
    });
  } catch (error) {
    console.error('Unexpected error incrementing cleanup adventure signup count.', error);
    return NextResponse.json({ error: 'Unable to join cleanup adventure.' }, { status: 500 });
  }
}
