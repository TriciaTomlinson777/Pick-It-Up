import { supabaseServerFetch } from '@/lib/supabase-server';
import { createSignedPhotoUrl, deleteFuturePhoto, getFutureUploadStatus, isFutureUploadPath, storeAndModerateFutureImage } from '@/lib/future-photo-moderation';

const TABLE_NAME = 'community_shares';
const PUBLIC_SELECT_FIELDS = 'id,note,image_url,image_path,submitted_at';
const ALLOWED_POST_FIELDS = new Set(['note', 'image_url', 'image_path']);

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

  const note = String(body.note || '').trim();
  if (!note) {
    throw new Error('note is required.');
  }

  return {
    note,
    image_url: String(body.image_url || '').trim() || null,
    image_path: String(body.image_path || '').trim() || null,
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

    const response = await supabaseServerFetch(`/rest/v1/${TABLE_NAME}?${query}`, {
      requireServiceRole: false,
    });

    if (!response.ok) {
      const supabaseMessage = await parseSupabaseError(response);
      console.error('Failed to load community shares.', supabaseMessage || response.status);
      return Response.json(
        { error: 'Unable to load community thank-you notes.' },
        { status: 500 }
      );
    }

    const rows = await response.json();
    const submissions = await Promise.all((Array.isArray(rows) ? rows : []).map(async (row) => ({
      ...row,
      image_url: row.image_url || (isFutureUploadPath(row.image_path) ? await createSignedPhotoUrl(row.image_path) : null),
    })));
    return Response.json({ submissions });
  } catch (error) {
    console.error('Unexpected error loading community shares.', error);
    return Response.json(
      { error: 'Unable to load community thank-you notes.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let storagePath = '';
  try {
    const formData = await request.formData();
    const note = String(formData.get('note') || '').trim();
    if (!note) return Response.json({ error: 'note is required.' }, { status: 400 });
    const file = formData.get('file');
    const submissionId = crypto.randomUUID();
    const uploaded = file?.arrayBuffer
      ? await storeAndModerateFutureImage(file, 'thank-yous', submissionId)
      : null;
    storagePath = uploaded?.storagePath || '';
    const moderation = uploaded?.moderation || { status: 'approved', reason: null };

    const query = createQueryString({
      select: 'id,moderation_status',
    });

    const response = await supabaseServerFetch(`/rest/v1/${TABLE_NAME}?${query}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        note,
        image_url: null,
        image_path: uploaded?.storagePath || null,
        moderation_status: getFutureUploadStatus(moderation),
        rejection_reason: moderation.reason,
      }),
    });

    if (!response.ok) {
      const supabaseMessage = await parseSupabaseError(response);
      console.error('Failed to create community share.', supabaseMessage || response.status);
      throw new Error('Unable to submit thank-you note.');
    }

    const rows = await response.json();
    const createdRow = Array.isArray(rows) ? rows[0] : null;

    if (!createdRow?.id) {
      throw new Error('Unable to submit thank-you note.');
    }

    return Response.json({
      ok: true,
      id: createdRow.id,
      moderation_status: createdRow.moderation_status,
    });
  } catch (error) {
    await deleteFuturePhoto(storagePath);
    console.error('Unexpected error creating community share.', error);
    return Response.json(
      { error: 'Unable to submit thank-you note.' },
      { status: 500 }
    );
  }
}
