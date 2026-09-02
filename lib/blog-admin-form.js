const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const ALLOWED_STATUSES = new Set(['draft', 'pending_review', 'published', 'rejected', 'archived']);

export function parseStatus(value) {
  const normalized = String(value || 'draft').trim().toLowerCase();
  return ALLOWED_STATUSES.has(normalized) ? normalized : 'draft';
}

export async function parsePostFormData(formData) {
  const title = String(formData.get('title') || '').trim();
  const slug = String(formData.get('slug') || '').trim();
  const author = String(formData.get('author') || '').trim();
  const previewText = String(formData.get('previewText') || '').trim();
  const body = String(formData.get('body') || '').trim();
  const category = String(formData.get('category') || '').trim();
  const publishedAt = String(formData.get('publishedAt') || '').trim();
  const status = parseStatus(formData.get('status'));
  const isFeatured = String(formData.get('isFeatured') || '').trim().toLowerCase() === 'true';
  const removeFeaturedImage = String(formData.get('removeFeaturedImage') || '') === 'true';

  let submissionPhotoUrls;
  let submissionPhotoPaths;
  const submissionPhotoUrlsRaw = formData.get('submissionPhotoUrls');
  const submissionPhotoPathsRaw = formData.get('submissionPhotoPaths');
  if (typeof submissionPhotoUrlsRaw === 'string' && submissionPhotoUrlsRaw) {
    try {
      const parsed = JSON.parse(submissionPhotoUrlsRaw);
      if (Array.isArray(parsed)) {
        submissionPhotoUrls = parsed;
      }
    } catch {
      // Ignore malformed payload and leave submission photos unchanged.
    }
  }
  if (typeof submissionPhotoPathsRaw === 'string' && submissionPhotoPathsRaw) {
    try {
      const parsed = JSON.parse(submissionPhotoPathsRaw);
      if (Array.isArray(parsed)) {
        submissionPhotoPaths = parsed;
      }
    } catch {
      // Ignore malformed payload and leave submission photos unchanged.
    }
  }

  const imageFile = formData.get('featuredImage');
  const hasImageFile = imageFile && typeof imageFile === 'object' && typeof imageFile.arrayBuffer === 'function' && imageFile.size > 0;

  if (!title || !author || !body) {
    throw new Error('Title, author, and full article text are required.');
  }

  let uploadedImage = null;
  if (hasImageFile) {
    if (!ALLOWED_IMAGE_TYPES.has(imageFile.type)) {
      throw new Error('Featured image must be JPG, PNG, WEBP, or GIF.');
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    uploadedImage = {
      fileBuffer: buffer,
      contentType: imageFile.type,
      fileName: imageFile.name || `featured-${Date.now()}.jpg`,
    };
  }

  return {
    postInput: {
      title,
      slug,
      author,
      previewText,
      body,
      category,
      publishedAt,
      status,
      isFeatured,
      ...(Array.isArray(submissionPhotoUrls) ? { submissionPhotoUrls } : {}),
      ...(Array.isArray(submissionPhotoPaths) ? { submissionPhotoPaths } : {}),
    },
    uploadedImage,
    removeFeaturedImage,
  };
}
