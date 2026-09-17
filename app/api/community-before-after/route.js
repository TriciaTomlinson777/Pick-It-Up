import { supabaseServerFetch } from '@/lib/supabase-server';
import { createSignedPhotoUrl, deleteFuturePhoto, getFutureUploadStatus, isFutureUploadPath, storeAndModerateFutureImage } from '@/lib/future-photo-moderation';

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
    const pairs = await Promise.all((Array.isArray(rows) ? rows : []).map(async (row) => ({
      ...row,
      before_image_url: row.before_image_url || (isFutureUploadPath(row.before_image_path) ? await createSignedPhotoUrl(row.before_image_path) : null),
      after_image_url: row.after_image_url || (isFutureUploadPath(row.after_image_path) ? await createSignedPhotoUrl(row.after_image_path) : null),
    })));
    return Response.json({ pairs });
  } catch (error) {
    console.error('Unexpected error loading community before/after pairs.', error);
    return Response.json(
      { error: 'Unable to load community before/after pairs.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const storagePaths = [];
  try {
    const formData = await request.formData();
    const beforeFile = formData.get('before_file');
    const afterFile = formData.get('after_file');
    const pairCaption = String(formData.get('pair_caption') || '').trim() || null;
    const submissionId = crypto.randomUUID();
    const before = await storeAndModerateFutureImage(beforeFile, 'before-after', submissionId, 0);
    storagePaths.push(before.storagePath);
    const after = await storeAndModerateFutureImage(afterFile, 'before-after', submissionId, 1);
    storagePaths.push(after.storagePath);
    const statuses = [before.moderation, after.moderation].map(getFutureUploadStatus);
    const moderationStatus = statuses.includes('rejected')
      ? 'rejected'
      : statuses.includes('pending_review') ? 'pending_review' : 'approved';

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
        before_image_url: null,
        after_image_url: null,
        before_image_path: before.storagePath,
        after_image_path: after.storagePath,
        pair_caption: pairCaption,
        moderation_status: moderationStatus,
        rejection_reason: [before.moderation.reason, after.moderation.reason].filter(Boolean).join('; ') || null,
      }),
    });

    if (!response.ok) {
      const supabaseMessage = await parseSupabaseError(response);
      console.error('Failed to create community before/after pair.', supabaseMessage || response.status);
      throw new Error('Unable to submit before/after pair.');
    }

    const rows = await response.json();
    const createdRow = Array.isArray(rows) ? rows[0] : null;

    if (!createdRow?.id) {
      throw new Error('Unable to submit before/after pair.');
    }

    return Response.json({
      ok: true,
      id: createdRow.id,
      moderation_status: createdRow.moderation_status,
      before_image_path: before.storagePath,
      after_image_path: after.storagePath,
      before_image_url: createdRow.moderation_status === 'approved' ? await createSignedPhotoUrl(before.storagePath) : null,
      after_image_url: createdRow.moderation_status === 'approved' ? await createSignedPhotoUrl(after.storagePath) : null,
    });
  } catch (error) {
    await Promise.all(storagePaths.map(deleteFuturePhoto));
    console.error('Unexpected error creating community before/after pair.', error);
    return Response.json(
      { error: 'Unable to submit before/after pair.' },
      { status: 500 }
    );
  }
}
