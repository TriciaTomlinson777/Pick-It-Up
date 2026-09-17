import { ComprehendClient, DetectToxicContentCommand } from '@aws-sdk/client-comprehend';

const DEFAULT_LANGUAGE_CODE = 'en';
const DEFAULT_TEXT_MODERATION_TIMEOUT_MS = 10_000;
const DEFAULT_REVIEW_THRESHOLD = 0.65;
const DEFAULT_REJECT_THRESHOLD = 0.92;
const MAX_SEGMENTS = 10;
const MAX_SEGMENT_LENGTH = 4_500;

const DISALLOWED_TOXICITY_LABELS = new Set([
  'GRAPHIC',
  'HARASSMENT_OR_ABUSE',
  'HATE_SPEECH',
  'INSULT',
  'PROFANITY',
  'SEXUAL',
  'VIOLENCE_OR_THREAT',
]);

function getEnv(name, fallback = '') {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : fallback;
}

function getNumberEnv(name, fallback) {
  const value = Number.parseFloat(getEnv(name));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getTextModerationTimeoutMs() {
  const configuredTimeout = Number.parseInt(getEnv('TEXT_MODERATION_TIMEOUT_MS'), 10);
  return Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : DEFAULT_TEXT_MODERATION_TIMEOUT_MS;
}

function getComprehendClient() {
  const region = getEnv('AWS_REGION');
  if (!region) throw new Error('AWS_REGION is not configured.');
  return new ComprehendClient({ region });
}

function normalizeSegments(value) {
  const text = String(value || '').trim();
  if (!text) return [];

  const segments = [];
  for (let index = 0; index < text.length && segments.length < MAX_SEGMENTS; index += MAX_SEGMENT_LENGTH) {
    segments.push({ Text: text.slice(index, index + MAX_SEGMENT_LENGTH) });
  }
  return segments;
}

function normalizeScore(value) {
  const score = Number(value || 0);
  return Number.isFinite(score) ? score : 0;
}

function getHighestToxicSignal(result) {
  const resultList = Array.isArray(result?.ResultList) ? result.ResultList : [];
  const signals = [];

  resultList.forEach((item) => {
    if (Number.isFinite(Number(item?.Toxicity))) {
      signals.push({ name: 'TOXICITY', score: normalizeScore(item.Toxicity) });
    }

    (Array.isArray(item?.Labels) ? item.Labels : []).forEach((label) => {
      const name = String(label?.Name || 'TOXICITY');
      if (DISALLOWED_TOXICITY_LABELS.has(name)) {
        signals.push({ name, score: normalizeScore(label.Score) });
      }
    });
  });

  return signals.sort((left, right) => right.score - left.score)[0] || null;
}

export async function screenText(value, options = {}) {
  const segments = normalizeSegments(value);
  if (segments.length === 0) return { status: 'approved', reason: null };

  const reviewThreshold = getNumberEnv('TEXT_MODERATION_REVIEW_THRESHOLD', DEFAULT_REVIEW_THRESHOLD);
  const rejectThreshold = getNumberEnv('TEXT_MODERATION_REJECT_THRESHOLD', DEFAULT_REJECT_THRESHOLD);
  const languageCode = String(options.languageCode || getEnv('TEXT_MODERATION_LANGUAGE_CODE', DEFAULT_LANGUAGE_CODE)).trim() || DEFAULT_LANGUAGE_CODE;
  const abortController = new AbortController();
  let timeoutId;

  try {
    const command = new DetectToxicContentCommand({
      LanguageCode: languageCode,
      TextSegments: segments,
    });
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        abortController.abort();
        reject(new Error('Text moderation timed out.'));
      }, getTextModerationTimeoutMs());
    });
    const result = await Promise.race([
      getComprehendClient().send(command, { abortSignal: abortController.signal }),
      timeout,
    ]);
    const signal = getHighestToxicSignal(result);

    if (!signal || signal.score < reviewThreshold) return { status: 'approved', reason: null };
    if (signal.score >= rejectThreshold) {
      return { status: 'rejected', reason: `${signal.name} (${Math.round(signal.score * 100)}%)` };
    }
    return { status: 'pending_review', reason: `${signal.name} requires review (${Math.round(signal.score * 100)}%).` };
  } catch (error) {
    console.error('AWS Comprehend text moderation failed.', error);
    return {
      status: 'pending_review',
      reason: abortController.signal.aborted ? 'Text moderation timed out.' : 'Text moderation provider error.',
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getTextModerationStatus(moderation) {
  return ['approved', 'rejected', 'pending_review'].includes(moderation?.status)
    ? moderation.status
    : 'pending_review';
}