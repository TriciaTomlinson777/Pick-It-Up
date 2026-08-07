import { supabaseServerFetch } from '@/lib/supabase-server';

const TABLE_NAME = 'community_before_after_pairs';
const PUBLIC_SELECT_FIELDS = 'id,before_image_url,after_image_url,pair_caption,submitted_at';
const ALLOWED_POST_FIELDS = new Set([
  'before_image_url',
  'after_image_url',
  'before_image_path',
  'after_image_path',
  'pair_caption',
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

function validatePostBody(body) {
  if (!isPlainObject(body)) {
    throw new Error('Request body must be a JSON object.');
  }

  const bodyKeys = Object.keys(body);
  const unknownKeys = bodyKeys.filter((key) => !ALLOWED_POST_FIELDS.has(key));
  if (unknownKeys.length > 0) {
    throw new Error('Request contains unsupported fields.');
  }

  const invalidTypeField = bodyKeys.find((key) => typeof body[key] !== 'string');
  if (invalidTypeField) {
    throw new Error('All submitted fields must be strings.');
  }

  const beforeImageUrl = String(body.before_image_url || '').trim();
  const afterImageUrl = String(body.after_image_url || '').trim();

  if (!beforeImageUrl || !afterImageUrl) {
    throw new Error('before_image_url and after_image_url are required.');
  }

  return {
    before_image_url: beforeImageUrl,
    after_image_url: afterImageUrl,
    before_image_path: String(body.before_image_path || '').trim() || null,
    after_image_path: String(body.after_image_path || '').trim() || null,
    pair_caption: String(body.pair_caption || '').trim() || null,
    moderation_status: 'approved',
  };
}

export async function GET() {
  try {
    const query = createQueryString({
      moderation_status: 'eq.approved',
      select: PUBLIC_SELECT_FIELDS,
      order: 'submitted_at.desc',
    });

    const response = await supabaseServerFetch(`/rest/v1/${TABLE_NAME}?${query}`);

    if (!response.ok) {
      const supabaseMessage = await parseSupabaseError(response);
      console.error('Failed to load community before/after pairs.', supabaseMessage || response.status);
      return Response.json(
        { error: 'Unable to load community before/after pairs.' },
        { status: 500 }
      );
    }

    const rows = await response.json();
    return Response.json({ pairs: Array.isArray(rows) ? rows : [] });
  } catch (error) {
    console.error('Unexpected error loading community before/after pairs.', error);
    return Response.json(
      { error: 'Unable to load community before/after pairs.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: 'Request body must contain valid JSON.' },
      { status: 400 }
    );
  }

  try {
    const payload = validatePostBody(body);

    const query = createQueryString({
      select: 'id,moderation_status',
    });

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
      console.error('Failed to create community before/after pair.', supabaseMessage || response.status);
      return Response.json(
        { error: 'Unable to submit before/after pair.' },
        { status: 500 }
      );
    }

    const rows = await response.json();
    const createdRow = Array.isArray(rows) ? rows[0] : null;

    if (!createdRow?.id) {
      return Response.json(
        { error: 'Unable to submit before/after pair.' },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      id: createdRow.id,
      moderation_status: createdRow.moderation_status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to submit before/after pair.';
    const isValidationError =
      message.includes('required')
      || message.includes('must be')
      || message.includes('unsupported fields')
      || message.includes('JSON object');

    if (isValidationError) {
      return Response.json({ error: message }, { status: 400 });
    }

    console.error('Unexpected error creating community before/after pair.', error);
    return Response.json(
      { error: 'Unable to submit before/after pair.' },
      { status: 500 }
    );
  }
}
