import { DetectFacesCommand, DetectModerationLabelsCommand, RekognitionClient } from '@aws-sdk/client-rekognition';
import sharp from 'sharp';
import { getSupabaseServerConfig, supabaseServerFetch } from './supabase-server';

const DEFAULT_PRIVATE_BUCKET = 'Community Photos Private';
const SAFE_CONFIDENCE = 90;
const DEFAULT_PUBLIC_IMAGE_MAX_DIMENSION = 1600;
const DEFAULT_PUBLIC_IMAGE_QUALITY = 82;
const DEFAULT_CHILD_AGE_THRESHOLD = 18;
const CHILD_FACE_PATH_MARKER = 'child-face';
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

function getChildPrivacyTimeoutMs() {
  const configuredTimeout = Number.parseInt(getEnv('AWS_CHILD_FACE_PRIVACY_TIMEOUT_MS'), 10);
  return Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : getModerationTimeoutMs();
}

function getPublicImageMaxDimension() {
  const configuredDimension = Number.parseInt(getEnv('PUBLIC_PHOTO_MAX_DIMENSION_PX'), 10);
  return Number.isFinite(configuredDimension) && configuredDimension > 0
    ? configuredDimension
    : DEFAULT_PUBLIC_IMAGE_MAX_DIMENSION;
}

function getPublicImageQuality() {
  const configuredQuality = Number.parseInt(getEnv('PUBLIC_PHOTO_JPEG_QUALITY'), 10);
  return Number.isFinite(configuredQuality) && configuredQuality > 0 && configuredQuality <= 100
    ? configuredQuality
    : DEFAULT_PUBLIC_IMAGE_QUALITY;
}

function getChildAgeThreshold() {
  const configuredThreshold = Number.parseInt(getEnv('CHILD_FACE_AGE_THRESHOLD'), 10);
  return Number.isFinite(configuredThreshold) && configuredThreshold > 0
    ? configuredThreshold
    : DEFAULT_CHILD_AGE_THRESHOLD;
}

function getRekognitionClient() {
  const region = getEnv('AWS_REGION');
  const accessKeyId = getEnv('AWS_ACCESS_KEY_ID');
  const secretAccessKey = getEnv('AWS_SECRET_ACCESS_KEY');
  if (!region) throw new Error('AWS_REGION is not configured.');
  if (!accessKeyId || !secretAccessKey) throw new Error('AWS Rekognition credentials are not configured.');
  return new RekognitionClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

function sanitizeSegment(value) {
  return String(value || 'photo')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'photo';
}

function getBufferedJpegPipeline(buffer) {
  return sharp(buffer, { failOn: 'error' })
    .rotate()
    .resize({
      width: getPublicImageMaxDimension(),
      height: getPublicImageMaxDimension(),
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: getPublicImageQuality(), mozjpeg: true });
}

function boundingBoxToRegion(boundingBox, width, height) {
  const left = Number(boundingBox?.Left || 0) * width;
  const top = Number(boundingBox?.Top || 0) * height;
  const boxWidth = Number(boundingBox?.Width || 0) * width;
  const boxHeight = Number(boundingBox?.Height || 0) * height;
  const paddingX = boxWidth * 0.22;
  const paddingY = boxHeight * 0.28;
  const regionLeft = Math.max(0, Math.floor(left - paddingX));
  const regionTop = Math.max(0, Math.floor(top - paddingY));
  const regionRight = Math.min(width, Math.ceil(left + boxWidth + paddingX));
  const regionBottom = Math.min(height, Math.ceil(top + boxHeight + paddingY));

  return {
    left: regionLeft,
    top: regionTop,
    width: Math.max(1, regionRight - regionLeft),
    height: Math.max(1, regionBottom - regionTop),
  };
}

function isChildFace(face) {
  const ageLow = Number(face?.AgeRange?.Low);
  const ageHigh = Number(face?.AgeRange?.High);
  const threshold = getChildAgeThreshold();

  if (Number.isFinite(ageLow) && ageLow < threshold) {
    return true;
  }

  return Number.isFinite(ageHigh) && ageHigh < threshold;
}

async function detectFaces(buffer) {
  const abortController = new AbortController();
  let timeoutId;
  try {
    const command = new DetectFacesCommand({
      Image: { Bytes: buffer },
      Attributes: ['ALL'],
    });
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        abortController.abort();
        reject(new Error('Child face detection timed out.'));
      }, getChildPrivacyTimeoutMs());
    });

    const result = await Promise.race([
      getRekognitionClient().send(command, { abortSignal: abortController.signal }),
      timeout,
    ]);

    return Array.isArray(result.FaceDetails) ? result.FaceDetails : [];
  } finally {
    clearTimeout(timeoutId);
  }
}

async function blurChildFaces(buffer, metadata, childFaces) {
  const overlays = await Promise.all(childFaces.map(async (face) => {
    const region = boundingBoxToRegion(face.BoundingBox, metadata.width, metadata.height);
    const input = await sharp(buffer)
      .extract(region)
      .blur(24)
      .jpeg({ quality: getPublicImageQuality(), mozjpeg: true })
      .toBuffer();

    return { input, left: region.left, top: region.top };
  }));

  return sharp(buffer)
    .composite(overlays)
    .jpeg({ quality: getPublicImageQuality(), mozjpeg: true })
    .toBuffer();
}

export async function createPrivacySafePublicImage(buffer) {
  const { data: processedBuffer, info } = await getBufferedJpegPipeline(buffer).toBuffer({ resolveWithObject: true });
  const metadata = {
    width: info.width,
    height: info.height,
  };

  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to read processed image dimensions.');
  }

  let faces;
  try {
    faces = await detectFaces(processedBuffer);
  } catch (error) {
    console.error('AWS Rekognition child face detection failed.');
    return {
      buffer: processedBuffer,
      contentType: 'image/jpeg',
      extension: 'jpg',
      containsChild: false,
      requiresReview: true,
      reviewReason: 'Child face privacy check could not be completed.',
    };
  }
  const childFaces = faces.filter(isChildFace);

  if (childFaces.some((face) => !face.BoundingBox)) {
    return {
      buffer: processedBuffer,
      contentType: 'image/jpeg',
      extension: 'jpg',
      containsChild: false,
      requiresReview: true,
      reviewReason: 'Child face privacy check could not locate every child face.',
    };
  }

  const publicBuffer = childFaces.length > 0
    ? await blurChildFaces(processedBuffer, metadata, childFaces)
    : processedBuffer;

  return {
    buffer: publicBuffer,
    contentType: 'image/jpeg',
    extension: 'jpg',
    containsChild: childFaces.length > 0,
    requiresReview: false,
    reviewReason: null,
  };
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
    console.error('AWS Rekognition moderation failed.');
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
  const publicImage = await createPrivacySafePublicImage(buffer);
  const fileName = `${sanitizeSegment(String(file.name || `photo-${index + 1}`).replace(/\.[^.]+$/, ''))}.${publicImage.extension}`;
  const storageFileName = publicImage.containsChild
    ? `${CHILD_FACE_PATH_MARKER}-${index + 1}-${fileName}`
    : `${index + 1}-${fileName}`;
  const storagePath = `future-uploads/${sanitizeSegment(folder)}/${sanitizeSegment(submissionId)}/${storageFileName}`;
  const bucket = getPrivateBucketName();
  const encodedBucket = encodeURIComponent(bucket);
  const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/');

  const uploadResponse = await supabaseServerFetch(
    `/storage/v1/object/${encodedBucket}/${encodedPath}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': publicImage.contentType,
        'x-upsert': 'false',
      },
      body: publicImage.buffer,
    }
  );

  if (!uploadResponse.ok) {
    throw new Error(`Private image upload failed (${uploadResponse.status}).`);
  }

  const imageModeration = await moderateImage(publicImage.buffer);
  const moderation = imageModeration.status === 'rejected' || !publicImage.requiresReview
    ? imageModeration
    : {
      status: 'pending_review',
      reason: publicImage.reviewReason,
    };
  return { storagePath, moderation, privacy: { containsChild: publicImage.containsChild } };
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

export function hasDetectedChildFace(storagePath) {
  return String(storagePath || '').split('/').some((segment) => segment.startsWith(`${CHILD_FACE_PATH_MARKER}-`));
}