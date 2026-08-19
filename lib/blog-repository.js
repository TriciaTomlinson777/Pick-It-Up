import { articleTextToParagraphs, sentencePreviewFallback, slugify } from './blog-post-utils';
import { getBlogImagesBucketName, supabaseServerFetch } from './supabase-server';
import { normalizeStoryCategory } from './story-categories';

const BLOG_TABLE = 'blog_posts';
const ALLOWED_STATUSES = new Set(['draft', 'pending_review', 'published', 'rejected', 'archived']);

export const FIRST_POST_SLUG = 'what-i-didnt-expect-when-i-started-picking-up-litter';
const FIRST_POST_TITLE = 'What I Didn’t Expect When I Started Picking Up Litter';
const FIRST_POST_AUTHOR = 'Tricia Tomlinson';
const FIRST_POST_CATEGORY = 'Volunteer Stories';
const FIRST_POST_PUBLISHED_AT = new Date('2026-08-01T00:00:00.000Z').toISOString();
const FIRST_POST_PREVIEW =
  'I expected cleaner streets. I didn’t expect a better workout, or to discover that once a street is cleaned, it often stays clean. Picking up litter has taught me that small acts can have a much longer impact than we realize.';
const FIRST_POST_BODY = `When I started Pick It Up Seattle, I expected to see cleaner streets. What I didn’t expect was how much I would enjoy the process myself.

Like many people, I usually walk to the gym each day. One morning, I decided to put on a pair of gloves and pick up a few pieces of litter along the way. I figured I’d make a small difference before starting my workout.

What I didn’t realize was that every few steps I’d be bending, reaching, carrying, and moving just a little bit more than I normally would. By the time I arrived at the gym, I was already sweating.

I actually laughed and thought to myself, “Good news… no aerobics needed today!”

It turns out I was probably burning nearly twice as many calories as I would on my normal walk. Who knew cleaning up your community could double as a workout?

That was my first surprise. The second surprise was even bigger.

After cleaning up a street, I kept expecting it to be littered again a day or two later. It wasn’t.

That made me realize something I hadn’t considered before. Maybe we aren’t creating as much new litter as it appears. Maybe old litter simply remains until someone decides to remove it.

Once an area is clean, something interesting happens: people seem to respect it.

I’ve noticed that when people walk through a clean neighborhood, along a downtown sidewalk, through a business district, in a park, or along the waterfront, they seem much less likely to throw something on the ground. Clean places tend to stay clean.

That was an incredibly encouraging discovery. It reminded me that one person’s effort can last much longer than we might expect.

Every time one of us picks up a piece of litter, we aren’t just cleaning a sidewalk for a few minutes. We may be helping create a place that others naturally want to keep clean too.

Those discoveries have reinforced why I started Pick It Up Seattle.

What began as a simple idea has already given me unexpected rewards: a better workout, a cleaner city, and a growing belief that people really do respond to kindness.

Sometimes the smallest actions teach us the biggest lessons.

So tomorrow, when you head out for a walk, maybe pick up just one piece of litter.

I wonder what you’ll discover.`;

function buildFirstPostFallback() {
  return {
    id: `seed-${FIRST_POST_SLUG}`,
    slug: FIRST_POST_SLUG,
    title: FIRST_POST_TITLE,
    author: FIRST_POST_AUTHOR,
    category: FIRST_POST_CATEGORY,
    categoryKey: 'volunteer-stories',
    previewText: FIRST_POST_PREVIEW,
    body: FIRST_POST_BODY,
    featuredImageUrl: '',
    featuredImagePath: '',
    isFeatured: false,
    submissionPhotoUrls: [],
    submissionPhotoPaths: [],
    status: 'published',
    publishedAt: FIRST_POST_PUBLISHED_AT,
    submittedAt: FIRST_POST_PUBLISHED_AT,
    reviewedAt: FIRST_POST_PUBLISHED_AT,
    rejectionReason: '',
    createdAt: FIRST_POST_PUBLISHED_AT,
    updatedAt: FIRST_POST_PUBLISHED_AT,
  };
}

function isMissingBlogPostsTableError(error) {
  const message = String(error?.message || '');
  return message.includes('PGRST205') || message.includes("Could not find the table 'public.blog_posts'");
}

function normalizePost(post) {
  const category = normalizeStoryCategory(post.category || '');

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    author: post.author,
    category: category.categoryTitle,
    categoryKey: category.categoryKey,
    previewText: post.preview_text,
    body: post.body,
    featuredImageUrl: post.featured_image_url || '',
    featuredImagePath: post.featured_image_path || '',
    isFeatured: Boolean(post.is_featured),
    submissionPhotoUrls: Array.isArray(post.submission_photo_urls) ? post.submission_photo_urls : [],
    submissionPhotoPaths: Array.isArray(post.submission_photo_paths) ? post.submission_photo_paths : [],
    status: post.status,
    publishedAt: post.published_at,
    submittedAt: post.submitted_at,
    reviewedAt: post.reviewed_at,
    rejectionReason: post.rejection_reason || '',
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };
}

function buildPostPayload(input, { statusOverride } = {}) {
  const title = String(input.title || '').trim();
  const author = String(input.author || '').trim();
  const previewText = String(input.previewText || '').trim();
  const body = String(input.body || '').trim();
  const status = statusOverride || String(input.status || 'draft').trim().toLowerCase();
  const category = normalizeStoryCategory(input.category);
  const slugInput = String(input.slug || '').trim();
  const slug = slugInput ? slugify(slugInput) : slugify(title);
  const publishedAtRaw = String(input.publishedAt || '').trim();
  const isFeatured = input.isFeatured === true || String(input.isFeatured || '').trim().toLowerCase() === 'true';

  if (!title || !author || !body) {
    throw new Error('Title, author, and full article text are required.');
  }

  if (!slug) {
    throw new Error('A valid slug could not be generated for this post.');
  }

  if (!ALLOWED_STATUSES.has(status)) {
    throw new Error('Invalid post status.');
  }

  const normalizedPreview = previewText || sentencePreviewFallback(body, 3);
  if (!normalizedPreview) {
    throw new Error('A preview could not be generated.');
  }

  const featuredImageUrl = String(input.featuredImageUrl || '').trim();
  const featuredImagePath = String(input.featuredImagePath || '').trim();

  const payload = {
    slug,
    title,
    author,
    category: category.categoryTitle,
    preview_text: normalizedPreview,
    body,
    featured_image_url: featuredImageUrl || null,
    featured_image_path: featuredImagePath || null,
    is_featured: isFeatured,
    status,
  };

  if (status === 'published') {
    payload.published_at = publishedAtRaw || new Date().toISOString();
    payload.reviewed_at = new Date().toISOString();
    payload.rejection_reason = null;
  } else if (status === 'pending_review') {
    payload.published_at = null;
    payload.reviewed_at = null;
    payload.rejection_reason = null;
  } else if (status === 'rejected') {
    payload.published_at = null;
    payload.reviewed_at = new Date().toISOString();
  } else {
    payload.published_at = publishedAtRaw || null;
    payload.rejection_reason = null;
  }

  return payload;
}

async function supabaseJson(path, options = {}) {
  const response = await supabaseServerFetch(path, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${text}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getBlogAdminLoginPath() {
  return '/admin/blog/login';
}

async function upsertFirstPostWithFallback(payload) {
  const payloadVariants = [
    payload,
    {
      slug: payload.slug,
      title: payload.title,
      author: payload.author,
      category: payload.category,
      preview_text: payload.preview_text,
      body: payload.body,
      featured_image_url: payload.featured_image_url,
      featured_image_path: payload.featured_image_path,
      status: payload.status,
      published_at: payload.published_at,
    },
    {
      slug: payload.slug,
      title: payload.title,
      author: payload.author,
      preview_text: payload.preview_text,
      body: payload.body,
      status: payload.status,
      published_at: payload.published_at,
    },
  ];

  let lastError = null;

  for (const variant of payloadVariants) {
    try {
      await supabaseJson(`/rest/v1/${BLOG_TABLE}?on_conflict=slug`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify(variant),
      });
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Unable to upsert first post.');
}

export async function ensureFirstPostExists() {
  const payload = {
    slug: FIRST_POST_SLUG,
    title: FIRST_POST_TITLE,
    author: FIRST_POST_AUTHOR,
    category: FIRST_POST_CATEGORY,
    preview_text: FIRST_POST_PREVIEW,
    body: FIRST_POST_BODY,
    featured_image_url: null,
    featured_image_path: null,
    is_featured: false,
    status: 'published',
    published_at: FIRST_POST_PUBLISHED_AT,
    submitted_at: FIRST_POST_PUBLISHED_AT,
    reviewed_at: FIRST_POST_PUBLISHED_AT,
    submission_photo_urls: [],
    submission_photo_paths: [],
    rejection_reason: null,
  };

  try {
    const existingCanonicalPost = await supabaseJson(
      `/rest/v1/${BLOG_TABLE}?slug=eq.${encodeURIComponent(FIRST_POST_SLUG)}&select=id&limit=1`
    );
    if (Array.isArray(existingCanonicalPost) && existingCanonicalPost.length > 0) {
      return;
    }

    // Skip upsert if the article is already published under a different slug (e.g. via story submission)
    const existing = await supabaseJson(
      `/rest/v1/${BLOG_TABLE}?title=eq.${encodeURIComponent(FIRST_POST_TITLE)}&status=eq.published&slug=neq.${FIRST_POST_SLUG}&select=id&limit=1`
    );
    if (Array.isArray(existing) && existing.length > 0) {
      return;
    }
  } catch (error) {
    if (!isMissingBlogPostsTableError(error)) {
      throw error;
    }
  }

  try {
    await upsertFirstPostWithFallback(payload);
  } catch (error) {
    if (isMissingBlogPostsTableError(error)) {
      return;
    }

    throw error;
  }
}

export async function getPublishedPosts() {
  const nowIso = encodeURIComponent(new Date().toISOString());
  try {
    const rows = await supabaseJson(
      `/rest/v1/${BLOG_TABLE}?status=eq.published&published_at=lte.${nowIso}&select=*&order=published_at.desc.nullslast,created_at.desc`,
      { requireServiceRole: false }
    );

    return Array.isArray(rows) ? rows.map(normalizePost) : [];
  } catch (error) {
    if (isMissingBlogPostsTableError(error)) {
      return [buildFirstPostFallback()];
    }

    throw error;
  }
}

export async function getPublishedPostBySlug(slug) {
  const safeSlug = encodeURIComponent(String(slug || '').trim());
  const nowIso = encodeURIComponent(new Date().toISOString());
  try {
    const rows = await supabaseJson(
      `/rest/v1/${BLOG_TABLE}?status=eq.published&published_at=lte.${nowIso}&slug=eq.${safeSlug}&select=*&limit=1`,
      { requireServiceRole: false }
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return null;
    }

    return normalizePost(rows[0]);
  } catch (error) {
    if (isMissingBlogPostsTableError(error) && String(slug || '').trim() === FIRST_POST_SLUG) {
      return buildFirstPostFallback();
    }

    throw error;
  }
}

export async function getAdminPosts() {
  const rows = await supabaseJson(
    `/rest/v1/${BLOG_TABLE}?select=*&order=submitted_at.desc.nullslast,created_at.desc`
  );

  return Array.isArray(rows) ? rows.map(normalizePost) : [];
}

export async function getAdminPostById(id) {
  const safeId = encodeURIComponent(String(id || '').trim());
  const rows = await supabaseJson(
    `/rest/v1/${BLOG_TABLE}?id=eq.${safeId}&select=*&limit=1`
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return normalizePost(rows[0]);
}

export async function createPost(input) {
  const payload = buildPostPayload(input);
  const rows = await supabaseJson(`/rest/v1/${BLOG_TABLE}?select=*`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  return normalizePost(rows[0]);
}

export async function updatePost(id, input) {
  const safeId = encodeURIComponent(String(id || '').trim());
  const payload = buildPostPayload(input);
  const rows = await supabaseJson(`/rest/v1/${BLOG_TABLE}?id=eq.${safeId}&select=*`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return normalizePost(rows[0]);
}

export async function unpublishPost(id) {
  const safeId = encodeURIComponent(String(id || '').trim());
  const rows = await supabaseJson(`/rest/v1/${BLOG_TABLE}?id=eq.${safeId}&select=*`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      status: 'draft',
      published_at: null,
      reviewed_at: new Date().toISOString(),
    }),
  });

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return normalizePost(rows[0]);
}

export async function applyAdminPostAction(id, action, options = {}) {
  const safeId = encodeURIComponent(String(id || '').trim());
  const normalizedAction = String(action || '').trim().toLowerCase();

  let patch = null;
  if (normalizedAction === 'approve') {
    const scheduledPublishAt = String(options.publishedAt || '').trim() || new Date().toISOString();
    patch = {
      status: 'published',
      published_at: scheduledPublishAt,
      reviewed_at: new Date().toISOString(),
      rejection_reason: null,
    };
  } else if (normalizedAction === 'reject') {
    patch = {
      status: 'rejected',
      published_at: null,
      reviewed_at: new Date().toISOString(),
      rejection_reason: String(options.rejectionReason || '').trim() || null,
    };
  } else if (normalizedAction === 'archive') {
    patch = {
      status: 'archived',
      reviewed_at: new Date().toISOString(),
    };
  } else if (normalizedAction === 'restore') {
    patch = {
      status: 'draft',
      reviewed_at: new Date().toISOString(),
      rejection_reason: null,
    };
  } else if (normalizedAction === 'feature') {
    patch = {
      is_featured: true,
    };
  } else if (normalizedAction === 'unfeature') {
    patch = {
      is_featured: false,
    };
  } else if (normalizedAction === 'mark_pending_review') {
    patch = {
      status: 'pending_review',
      published_at: null,
      reviewed_at: null,
      rejection_reason: null,
    };
  } else {
    throw new Error('Unsupported post action.');
  }

  const rows = await supabaseJson(`/rest/v1/${BLOG_TABLE}?id=eq.${safeId}&select=*`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(patch),
  });

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return normalizePost(rows[0]);
}

export async function createStorySubmission(input, uploadedPhotoMeta = []) {
  const payload = buildPostPayload(
    {
      ...input,
      status: 'pending_review',
      isFeatured: false,
      publishedAt: '',
    },
    { statusOverride: 'pending_review' }
  );

  payload.submitted_at = new Date().toISOString();
  payload.submission_photo_urls = uploadedPhotoMeta.map((photo) => photo.url);
  payload.submission_photo_paths = uploadedPhotoMeta.map((photo) => photo.path);

  const rows = await supabaseJson(`/rest/v1/${BLOG_TABLE}?select=*`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  return normalizePost(rows[0]);
}

async function uploadImageObject({ fileBuffer, contentType, fileName, folder = 'blog-images' }) {
  const bucketName = encodeURIComponent(getBlogImagesBucketName());
  const safeFileName = slugify(fileName.replace(/\.[^.]+$/, '')) || `image-${Date.now()}`;
  const extensionMatch = fileName.toLowerCase().match(/\.([a-z0-9]+)$/);
  const extension = extensionMatch ? extensionMatch[1] : 'jpg';
  const objectPath = `${folder}/${Date.now()}-${safeFileName}.${extension}`;

  const uploadResponse = await supabaseServerFetch(
    `/storage/v1/object/${bucketName}/${encodeURIComponent(objectPath).replace(/%2F/g, '/')}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'x-upsert': 'false',
      },
      body: fileBuffer,
    }
  );

  if (!uploadResponse.ok) {
    const text = await uploadResponse.text();
    throw new Error(`Failed to upload image: ${text}`);
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicUrl = `${String(supabaseUrl || '').replace(/\/$/, '')}/storage/v1/object/public/${bucketName}/${encodeURIComponent(objectPath).replace(/%2F/g, '/')}`;

  return {
    path: objectPath,
    url: publicUrl,
  };
}

export async function uploadFeaturedImage({ fileBuffer, contentType, fileName }) {
  const uploaded = await uploadImageObject({
    fileBuffer,
    contentType,
    fileName,
    folder: 'blog-images',
  });

  return {
    featuredImagePath: uploaded.path,
    featuredImageUrl: uploaded.url,
  };
}

export async function uploadSubmissionImages(images) {
  const uploads = [];
  for (const image of images) {
    const uploaded = await uploadImageObject({
      fileBuffer: image.fileBuffer,
      contentType: image.contentType,
      fileName: image.fileName,
      folder: 'story-submissions',
    });

    uploads.push(uploaded);
  }

  return uploads;
}

export function normalizeBodyParagraphs(body) {
  return articleTextToParagraphs(body);
}
