import { sentencePreviewFallback, slugify } from './blog-post-utils';
import { normalizeStoryCategory } from './story-categories';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_IMAGES = 4;

function isFileLike(value) {
  return value && typeof value === 'object' && typeof value.arrayBuffer === 'function' && Number(value.size) > 0;
}

export async function parseStorySubmissionFormData(formData) {
  const title = String(formData.get('title') || '').trim();
  const author = String(formData.get('author') || '').trim();
  const body = String(formData.get('body') || '').trim();
  const previewText = String(formData.get('previewText') || '').trim();
  const categoryValue = String(formData.get('category') || '').trim();

  if (!title || !author || !body) {
    throw new Error('Title, name or organization, and story text are required.');
  }

  const { categoryKey, categoryTitle } = normalizeStoryCategory(categoryValue);
  const storySlugBase = slugify(title) || 'story';

  const photoFiles = formData
    .getAll('photos')
    .filter(isFileLike)
    .slice(0, MAX_IMAGES);

  const uploadedPhotos = [];
  for (const file of photoFiles) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new Error('Photos must be JPG, PNG, WEBP, or GIF.');
    }

    uploadedPhotos.push({
      fileBuffer: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
      fileName: file.name || `story-photo-${Date.now()}.jpg`,
    });
  }

  return {
    postInput: {
      title,
      author,
      slug: `${storySlugBase}-${Date.now()}`,
      previewText: previewText || sentencePreviewFallback(body, 3),
      body,
      category: categoryTitle,
      categoryKey,
      status: 'pending_review',
      isFeatured: false,
    },
    uploadedPhotos,
  };
}
