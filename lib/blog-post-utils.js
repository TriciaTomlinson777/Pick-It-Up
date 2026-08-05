const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function formatPublicationDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return DATE_FORMATTER.format(date);
}

export function articleTextToParagraphs(value) {
  return String(value || '')
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function sentencePreviewFallback(value, sentenceCount = 3) {
  const text = String(value || '').trim();
  if (!text) {
    return '';
  }

  const matches = text.match(/[^.!?]+[.!?]+/g);
  if (!matches || matches.length === 0) {
    return text;
  }

  return matches
    .slice(0, Math.max(1, sentenceCount))
    .map((sentence) => sentence.trim())
    .join(' ');
}
