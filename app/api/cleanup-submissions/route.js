import { supabaseServerFetch, getSupabaseServerConfig } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

const TABLE_NAME = 'cleanup_submissions';

// Only these fields are sent back to the client; raw_payload and GPS fixes stay server-side.
const PUBLIC_SELECT_FIELDS =
  'id,submitted_at,action_type,bag_count,marker_lat,marker_lng,neighborhood,city,cross_streets,location_description';

const ALLOWED_POST_STRING_FIELDS = new Set([
  'action_type',
  'neighborhood',
  'city',
  'cross_streets',
  'location_description',
]);

const ALLOWED_POST_NUMBER_FIELDS = new Set([
  'bag_count',
  'marker_lat',
  'marker_lng',
  'resolved_lat',
  'resolved_lng',
  'gps_lat',
  'gps_lng',
]);

const ALL_ALLOWED_POST_FIELDS = new Set([
  ...ALLOWED_POST_STRING_FIELDS,
  ...ALLOWED_POST_NUMBER_FIELDS,
  'raw_payload',
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
  if (!text) return '';
  try {
    const data = JSON.parse(text);
    return String(data?.message || data?.hint || '').trim();
  } catch {
    return '';
  }
}

function validatePostBody(body) {
  if (!isPlainObject(body)) {
    throw new Error('Request body must be a JSON object.');
  }

  const unknownKeys = Object.keys(body).filter((key) => !ALL_ALLOWED_POST_FIELDS.has(key));
  if (unknownKeys.length > 0) {
    throw new Error('Request contains unsupported fields.');
  }

  const action_type = String(body.action_type || '').trim();
  if (!action_type) {
    throw new Error('action_type is required.');
  }

  const bag_count = body.bag_count;
  if (bag_count === undefined || bag_count === null || !Number.isInteger(bag_count) || bag_count < 0) {
    throw new Error('bag_count must be a non-negative integer.');
  }

  const marker_lat = body.marker_lat;
  const marker_lng = body.marker_lng;
  if (typeof marker_lat !== 'number' || !Number.isFinite(marker_lat)) {
    throw new Error('marker_lat must be a finite number.');
  }
  if (typeof marker_lng !== 'number' || !Number.isFinite(marker_lng)) {
    throw new Error('marker_lng must be a finite number.');
  }

  const optionalNumbers = {};
  for (const key of ['resolved_lat', 'resolved_lng', 'gps_lat', 'gps_lng']) {
    const val = body[key];
    if (val !== undefined && val !== null) {
      if (typeof val !== 'number' || !Number.isFinite(val)) {
        throw new Error(`${key} must be a finite number or null.`);
      }
      optionalNumbers[key] = val;
    } else {
      optionalNumbers[key] = null;
    }
  }

  const optionalStrings = {};
  for (const key of ['neighborhood', 'city', 'cross_streets', 'location_description']) {
    const val = body[key];
    optionalStrings[key] = typeof val === 'string' ? val.trim() || null : null;
  }

  const raw_payload = body.raw_payload !== undefined ? body.raw_payload : {};
  if (!isPlainObject(raw_payload) && !Array.isArray(raw_payload)) {
    throw new Error('raw_payload must be a JSON object.');
  }

  return {
    action_type,
    bag_count,
    marker_lat,
    marker_lng,
    ...optionalNumbers,
    ...optionalStrings,
    raw_payload,
  };
}

export async function GET() {
  const { isConfigured } = getSupabaseServerConfig();
  if (!isConfigured) {
    console.error('cleanup-submissions GET: Supabase service-role not configured.');
    return NextResponse.json({ error: 'Service temporarily unavailable.' }, { status: 503 });
  }

  try {
    const query = createQueryString({
      select: PUBLIC_SELECT_FIELDS,
      order: 'submitted_at.desc',
    });

    const response = await supabaseServerFetch(`/rest/v1/${TABLE_NAME}?${query}`);

    if (!response.ok) {
      const supabaseMessage = await parseSupabaseError(response);
      console.error('Failed to load cleanup submissions.', supabaseMessage || response.status);
      return NextResponse.json({ error: 'Unable to load cleanup submissions.' }, { status: 500 });
    }

    const rows = await response.json();
    return NextResponse.json({ submissions: Array.isArray(rows) ? rows : [] });
  } catch (error) {
    console.error('Unexpected error loading cleanup submissions.', error);
    return NextResponse.json({ error: 'Unable to load cleanup submissions.' }, { status: 500 });
  }
}

export async function POST(request) {
  const { isConfigured } = getSupabaseServerConfig();
  if (!isConfigured) {
    console.error('cleanup-submissions POST: Supabase service-role not configured.');
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

  try {
    const payload = validatePostBody(body);

    const query = createQueryString({ select: 'id,submitted_at' });

    const response = await supabaseServerFetch(`/rest/v1/${TABLE_NAME}?${query}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const supabaseMessage = await parseSupabaseError(response);
      console.error('Failed to insert cleanup submission.', supabaseMessage || response.status);
      return NextResponse.json({ error: 'Unable to save cleanup submission.' }, { status: 500 });
    }

    const rows = await response.json();
    const created = Array.isArray(rows) ? rows[0] : null;

    if (!created?.id) {
      return NextResponse.json({ error: 'Unable to save cleanup submission.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: created.id, submitted_at: created.submitted_at });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save cleanup submission.';
    const isValidation =
      message.includes('required') ||
      message.includes('must be') ||
      message.includes('unsupported fields') ||
      message.includes('JSON object');

    return NextResponse.json({ error: message }, { status: isValidation ? 400 : 500 });
  }
}
