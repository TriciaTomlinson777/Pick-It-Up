import { DetectModerationLabelsCommand, RekognitionClient } from '@aws-sdk/client-rekognition';
import { getSupabaseServerConfig, supabaseServerFetch } from './supabase-server';

const DEFAULT_PRIVATE_BUCKET = 'Community Photos Private';
const SAFE_CONFIDENCE = 90;
const DISALLOWED_LABELS = new Set([
  'Explicit Nudity',
  'Suggestive',
  'Violence',
  'Visually Disturbing',
  'Drugs',
  'Tobacco',
  'Alcohol',
  'Gambling',
  'Hate Symbols',
]);

function getEnv(name, fallback = '') {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : fallback;
}

function getPrivateBucketName() {
  return getEnv('SUPABASE_PRIVATE_PHOTOS_BUCKET', DEFAULT_PRIVATE_BUCKET);
}

function getModerationTimeoutMs() {
  const configuredTimeout = Number.parseInt(getEnv('SUPABASE_REKOGNITION_TIMEOUT_MS'), 10);
  return Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 10_000;
}

function getRekognitionClient() {
  const region = getEnv('AWS_REGION');
  if (!region) throw new Error('AWS_REGION is not configured.');
  return new RekognitionClient({ region });
}

function sanitizeSegment(value) {
  return String(value || 'photo')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'photo';
}

export async function moderateImage(buffer) {
  const abortController = new AbortController();
  let timeoutId;
  try {
    const command = new DetectModerationLabelsCommand({ Image: { Bytes: buffer }, MinConfidence: 50 });
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        abortController.abort();
        reject(new Error('Moderation timed out.'));
      }, getModerationTimeoutMs());
    });
    const result = await Promise.race([
      getRekognitionClient().send(command, { abortSignal: abortController.signal }),
      timeout,
    ]);
    const labels = Array.isArray(result.ModerationLabels) ? result.ModerationLabels : [];
    const disallowed = labels
      .filter((label) => DISALLOWED_LABELS.has(String(label.Name || '')))
      .sort((left, right) => Number(right.Confidence || 0) - Number(left.Confidence || 0))[0];

    if (labels.length === 0) return { status: 'approved', reason: null };
    if (!disallowed) return { status: 'pending_review', reason: 'Unclassified moderation label.' };
    if (Number(disallowed.Confidence || 0) >= SAFE_CONFIDENCE) {
      return { status: 'rejected', reason: `${disallowed.Name} (${Math.round(disallowed.Confidence)}%)` };
    }
    return { status: 'pending_review', reason: 'Borderline moderation confidence.' };
  } catch (error) {
    console.error('AWS Rekognition moderation failed.', error);
    return {
      status: 'pending_review',
      reason: abortController.signal.aborted ? 'Moderation timed out.' : 'Moderation provider error.',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function storeAndModerateFutureImage(file, folder, submissionId, index = 0) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('An image file is required.');
  }

  const contentType = String(file.type || 'application/octet-stream');
  if (!contentType.startsWith('image/')) throw new Error('Only image uploads are allowed.');

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = sanitizeSegment(file.name || `photo-${index + 1}.jpg`);
  const storagePath = `future-uploads/${sanitizeSegment(folder)}/${sanitizeSegment(submissionId)}/${index + 1}-${fileName}`;
  const bucket = getPrivateBucketName();
  const encodedBucket = encodeURIComponent(bucket);
  const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/');

  const uploadResponse = await supabaseServerFetch(
    `/storage/v1/object/${encodedBucket}/${encodedPath}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'x-upsert': 'false',
      },
      body: buffer,
    }
  );

  if (!uploadResponse.ok) {
    throw new Error(`Private image upload failed (${uploadResponse.status}).`);
  }

  const moderation = await moderateImage(buffer);
  return { storagePath, moderation };
}

export async function createSignedPhotoUrl(storagePath, expiresIn = 300) {
  if (!storagePath) return '';
  const bucket = getPrivateBucketName();
  const response = await supabaseServerFetch(`/storage/v1/object/sign/${encodeURIComponent(bucket)}/${storagePath.split('/').map(encodeURIComponent).join('/')}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiresIn }),
  });
  if (!response.ok) throw new Error(`Unable to sign private image URL (${response.status}).`);
  const data = await response.json();
  const { url } = getSupabaseServerConfig();
  return data?.signedURL?.startsWith('http')
    ? data.signedURL
    : `${url.replace(/\/$/, '')}/storage/v1${data?.signedURL || ''}`;
}

export async function deleteFuturePhoto(storagePath) {
  if (!isFutureUploadPath(storagePath)) return;
  const bucket = getPrivateBucketName();
  const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/');
  try {
    const response = await supabaseServerFetch(
      `/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`,
      { method: 'DELETE' }
    );
    if (!response.ok) console.error(`Unable to clean up future photo (${response.status}).`);
  } catch (error) {
    console.error('Unable to clean up future photo.', error);
  }
}

export function getFutureUploadStatus(moderation) {
  return ['approved', 'rejected', 'pending_review'].includes(moderation?.status)
    ? moderation.status
    : 'pending_review';
}

export function isFutureUploadPath(storagePath) {
  return String(storagePath || '').startsWith('future-uploads/');
}