import { supabaseServerFetch } from '@/lib/supabase-server';

const TABLE_NAME = 'community_action_photos';
const PUBLIC_SELECT_FIELDS = 'id,image_url,image_path,caption,submitted_at';
const ALLOWED_POST_FIELDS = new Set([
  'image_url',
  'image_path',
  'caption',
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

  const imageUrl = String(body.image_url || '').trim();

  if (!imageUrl) {
    throw new Error('image_url is required.');
  }

  return {
    image_url: imageUrl,
    image_path: String(body.image_path || '').trim() || null,
    caption: String(body.caption || '').trim() || null,
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
      console.error('Failed to load community action photos.', supabaseMessage || response.status);
      return Response.json(
        { error: 'Unable to load community action photos.' },
        { status: 500 }
      );
    }

    const rows = await response.json();
    return Response.json({ photos: Array.isArray(rows) ? rows : [] });
  } catch (error) {
    console.error('Unexpected error loading community action photos.', error);
    return Response.json(
      { error: 'Unable to load community action photos.' },
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
      console.error('Failed to create community action photo.', supabaseMessage || response.status);
      return Response.json(
        { error: 'Unable to submit community action photo.' },
        { status: 500 }
      );
    }

    const rows = await response.json();
    const createdRow = Array.isArray(rows) ? rows[0] : null;

    if (!createdRow?.id) {
      return Response.json(
        { error: 'Unable to submit community action photo.' },
        { status: 500 }
      );
    }

    return Response.json({
      ok: true,
      id: createdRow.id,
      moderation_status: createdRow.moderation_status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to submit community action photo.';
    const isValidationError =
      message.includes('required')
      || message.includes('must be')
      || message.includes('unsupported fields')
      || message.includes('JSON object');

    if (isValidationError) {
      return Response.json({ error: message }, { status: 400 });
    }

    console.error('Unexpected error creating community action photo.', error);
    return Response.json(
      { error: 'Unable to submit community action photo.' },
      { status: 500 }
    );
  }
}
