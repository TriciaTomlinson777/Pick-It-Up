import { NextResponse } from 'next/server';
import { supabaseServerFetch, getSupabaseServerConfig } from '@/lib/supabase-server';
import { isValidEmailAddress } from '@/lib/form-mailer';

const EVENTS_TABLE_NAME = 'cleanup_adventures_events';
const ORGANIZERS_TABLE_NAME = 'cleanup_adventures_organizers';
const PUBLIC_SELECT_FIELDS =
  'id,title,event_date,start_time,end_time,general_location,meeting_place,description,organizer_name,max_volunteers,signed_up_count,created_at';

const ALLOWED_POST_FIELDS = new Set([
  'cleanupTitle',
  'eventDate',
  'startTime',
  'endTime',
  'generalLocation',
  'meetingPlace',
  'eventDescription',
  'organizerName',
  'maxVolunteers',
  'organizerEmail',
  'organizerPhone',
]);

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function createQueryString(values) {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  return params.toString();
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

function normalizeTimeDisplay(value) {
  const text = String(value || '').trim();
  if (!text) {
    return '';
  }

  const match = text.match(/^(\d{2}:\d{2}):\d{2}(?:\.\d+)?$/);
  if (match) {
    return match[1];
  }

  return text;
}

function mapEventRowToPublicEvent(row) {
  return {
    id: String(row.id || '').trim(),
    title: String(row.title || '').trim(),
    date: String(row.event_date || '').trim(),
    startTime: normalizeTimeDisplay(row.start_time),
    endTime: normalizeTimeDisplay(row.end_time),
    generalLocation: String(row.general_location || '').trim(),
    meetingPlace: String(row.meeting_place || '').trim(),
    description: String(row.description || '').trim(),
    organizerName: String(row.organizer_name || '').trim(),
    maxVolunteers:
      row.max_volunteers === null || row.max_volunteers === undefined
        ? ''
        : String(row.max_volunteers),
    signedUpCount: Number.isInteger(row.signed_up_count) ? row.signed_up_count : 0,
    createdAt: String(row.created_at || '').trim(),
  };
}

function parsePositiveInteger(value) {
  const parsed = Number.parseInt(String(value || '').trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function validateCreateBody(body) {
  if (!isPlainObject(body)) {
    throw new Error('Request body must be a JSON object.');
  }

  const bodyKeys = Object.keys(body);
  const unknownKeys = bodyKeys.filter((key) => !ALLOWED_POST_FIELDS.has(key));
  if (unknownKeys.length > 0) {
    throw new Error('Request contains unsupported fields.');
  }

  const cleanupTitle = String(body.cleanupTitle || '').trim();
  const eventDate = String(body.eventDate || '').trim();
  const startTime = String(body.startTime || '').trim();
  const endTime = String(body.endTime || '').trim();
  const generalLocation = String(body.generalLocation || '').trim();
  const meetingPlace = String(body.meetingPlace || '').trim();
  const eventDescription = String(body.eventDescription || '').trim();
  const organizerName = String(body.organizerName || '').trim();
  const organizerEmail = String(body.organizerEmail || '').trim();
  const organizerPhone = String(body.organizerPhone || '').trim();
  const maxVolunteers = parsePositiveInteger(body.maxVolunteers);

  if (!cleanupTitle || !eventDate || !startTime || !endTime || !generalLocation || !meetingPlace || !eventDescription || !organizerName || !organizerEmail) {
    throw new Error('Missing one or more required fields.');
  }

  if (!isValidEmailAddress(organizerEmail)) {
    throw new Error('organizerEmail must be a valid email address.');
  }

  return {
    cleanupTitle,
    eventDate,
    startTime,
    endTime,
    generalLocation,
    meetingPlace,
    eventDescription,
    organizerName,
    organizerEmail,
    organizerPhone: organizerPhone || null,
    maxVolunteers,
  };
}

export async function GET() {
  const { isConfigured } = getSupabaseServerConfig();
  if (!isConfigured) {
    console.error('cleanup-adventures GET: Supabase service-role not configured.');
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  try {
    const query = createQueryString({
      select: PUBLIC_SELECT_FIELDS,
      order: 'created_at.desc',
    });

    const response = await supabaseServerFetch(`/rest/v1/${EVENTS_TABLE_NAME}?${query}`);

    if (!response.ok) {
      const supabaseMessage = await parseSupabaseError(response);
      console.error('Failed to load cleanup adventures.', supabaseMessage || response.status);
      return NextResponse.json({ error: 'Unable to load cleanup adventures.' }, { status: 500 });
    }

    const rows = await response.json();
    const events = Array.isArray(rows) ? rows.map(mapEventRowToPublicEvent) : [];
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Unexpected error loading cleanup adventures.', error);
    return NextResponse.json({ error: 'Unable to load cleanup adventures.' }, { status: 500 });
  }
}

export async function POST(request) {
  const { isConfigured } = getSupabaseServerConfig();
  if (!isConfigured) {
    console.error('cleanup-adventures POST: Supabase service-role not configured.');
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body must contain valid JSON.' },
      { status: 400 }
    );
  }

  let payload;
  try {
    payload = validateCreateBody(body);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid request body.' },
      { status: 400 }
    );
  }

  let createdEventRow = null;

  try {
    const eventInsertQuery = createQueryString({ select: PUBLIC_SELECT_FIELDS });
    const eventInsertResponse = await supabaseServerFetch(
      `/rest/v1/${EVENTS_TABLE_NAME}?${eventInsertQuery}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          title: payload.cleanupTitle,
          event_date: payload.eventDate,
          start_time: payload.startTime,
          end_time: payload.endTime,
          general_location: payload.generalLocation,
          meeting_place: payload.meetingPlace,
          description: payload.eventDescription,
          organizer_name: payload.organizerName,
          max_volunteers: payload.maxVolunteers,
          signed_up_count: 0,
        }),
      }
    );

    if (!eventInsertResponse.ok) {
      const supabaseMessage = await parseSupabaseError(eventInsertResponse);
      console.error('Failed to create cleanup adventure event.', supabaseMessage || eventInsertResponse.status);
      return NextResponse.json({ error: 'Unable to create cleanup adventure.' }, { status: 500 });
    }

    const createdRows = await eventInsertResponse.json();
    createdEventRow = Array.isArray(createdRows) ? createdRows[0] : null;

    if (!createdEventRow?.id) {
      return NextResponse.json({ error: 'Unable to create cleanup adventure.' }, { status: 500 });
    }

    const organizerInsertQuery = createQueryString({ select: 'event_id' });
    const organizerInsertResponse = await supabaseServerFetch(
      `/rest/v1/${ORGANIZERS_TABLE_NAME}?${organizerInsertQuery}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          event_id: createdEventRow.id,
          organizer_email: payload.organizerEmail,
          organizer_phone: payload.organizerPhone,
        }),
      }
    );

    if (!organizerInsertResponse.ok) {
      const supabaseMessage = await parseSupabaseError(organizerInsertResponse);
      console.error('Failed to store cleanup adventure organizer contact.', supabaseMessage || organizerInsertResponse.status);

      try {
        await supabaseServerFetch(`/rest/v1/${EVENTS_TABLE_NAME}?id=eq.${encodeURIComponent(createdEventRow.id)}`, {
          method: 'DELETE',
        });
      } catch (rollbackError) {
        console.error('Failed rollback for cleanup adventure event after organizer insert error.', rollbackError);
      }

      return NextResponse.json({ error: 'Unable to create cleanup adventure.' }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      event: mapEventRowToPublicEvent(createdEventRow),
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error creating cleanup adventure.', error);

    if (createdEventRow?.id) {
      try {
        await supabaseServerFetch(`/rest/v1/${EVENTS_TABLE_NAME}?id=eq.${encodeURIComponent(createdEventRow.id)}`, {
          method: 'DELETE',
        });
      } catch (rollbackError) {
        console.error('Failed rollback for cleanup adventure event after unexpected error.', rollbackError);
      }
    }

    return NextResponse.json({ error: 'Unable to create cleanup adventure.' }, { status: 500 });
  }
}
