'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { articleTextToParagraphs, formatPublicationDate, parseInlineFormatting } from '@/lib/blog-post-utils';
import { STORY_CATEGORIES } from '@/lib/story-categories';

const EMPTY_FORM = {
  id: '',
  title: '',
  slug: '',
  author: '',
  category: STORY_CATEGORIES[0].title,
  status: 'draft',
  publishedAt: '',
  previewText: '',
  body: '',
  featuredImageUrl: '',
  isFeatured: false,
};

const STATUS_LABELS = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  published: 'Published',
  rejected: 'Rejected',
  archived: 'Archived',
};

function toDateInputValue(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

function mapPostToForm(post) {
  return {
    id: post.id,
    title: post.title || '',
    slug: post.slug || '',
    author: post.author || '',
    category: post.category || STORY_CATEGORIES[0].title,
    status: post.status || 'draft',
    publishedAt: toDateInputValue(post.publishedAt),
    previewText: post.previewText || '',
    body: post.body || '',
    featuredImageUrl: post.featuredImageUrl || '',
    isFeatured: Boolean(post.isFeatured),
  };
}

function categoryTitleFromValue(value) {
  const found = STORY_CATEGORIES.find(
    (category) => category.title === value || category.key === value
  );
  return found ? found.title : STORY_CATEGORIES[0].title;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Renders stored text (which may contain **bold** markers and \n breaks) as real
// <strong> and <br> HTML so it appears bold in the editor instead of showing markers.
function storedTextToEditableHtml(value) {
  return String(value || '')
    .split('\n')
    .map((line) => (
      parseInlineFormatting(line)
        .map((segment) => (
          segment.bold ? `<strong>${escapeHtml(segment.text)}</strong>` : escapeHtml(segment.text)
        ))
        .join('')
    ))
    .join('<br>');
}

// Reverses storedTextToEditableHtml: walks the editable DOM node back into the same
// **bold**/\n plain-text format used by Preview and the published article.
function editableNodeToStoredText(root) {
  let text = '';

  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const tagName = node.tagName;
    if (tagName === 'BR') {
      text += '\n';
    } else if (tagName === 'B' || tagName === 'STRONG') {
      const inner = editableNodeToStoredText(node);
      text += inner ? `**${inner}**` : '';
    } else if (tagName === 'DIV' || tagName === 'P') {
      text += `${editableNodeToStoredText(node)}\n`;
    } else {
      text += editableNodeToStoredText(node);
    }
  });

  return text;
}

async function requestAdminPosts() {
  const response = await fetch('/api/admin/blog', {
    cache: 'no-store',
    credentials: 'include',
  });
  if (response.status === 401) {
    return { unauthorized: true, posts: [] };
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Unable to load stories.');
  }

  return {
    unauthorized: false,
    posts: Array.isArray(data.posts) ? data.posts : [],
  };
}

export default function BlogAdminClient({ initialPosts = [] }) {
  const [posts, setPosts] = useState(() =>
    Array.isArray(initialPosts) ? initialPosts : []
  );
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedPost, setSelectedPost] = useState(null);
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredImagePreviewUrl, setFeaturedImagePreviewUrl] = useState('');
  const [removeFeaturedImage, setRemoveFeaturedImage] = useState(false);
  const [featuredImageStatusMessage, setFeaturedImageStatusMessage] = useState('');
  const [featuredImageErrorMessage, setFeaturedImageErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [removedSubmissionPhotoUrls, setRemovedSubmissionPhotoUrls] = useState([]);
  const selectedPostRef = useRef(selectedPost);
  const previewTextTextareaRef = useRef(null);
  const bodyTextareaRef = useRef(null);

  const isEditing = Boolean(form.id);

  const previewFeaturedImageUrl = featuredImagePreviewUrl
    || (!removeFeaturedImage ? form.featuredImageUrl : '');
  const previewParagraphs = useMemo(
    () => articleTextToParagraphs(form.body),
    [form.body]
  );

  useEffect(() => {
    return () => {
      if (featuredImagePreviewUrl) {
        URL.revokeObjectURL(featuredImagePreviewUrl);
      }
    };
  }, [featuredImagePreviewUrl]);

  useEffect(() => {
    selectedPostRef.current = selectedPost;
  }, [selectedPost]);

  const pendingCount = useMemo(
    () => posts.filter((post) => post.status === 'pending_review').length,
    [posts]
  );

  const publishedCount = useMemo(
    () => posts.filter((post) => post.status === 'published').length,
    [posts]
  );

  const filteredPosts = useMemo(() => {
    if (statusFilter === 'all') {
      return posts;
    }
    return posts.filter((post) => post.status === statusFilter);
  }, [posts, statusFilter]);

  async function loadPosts() {
    setIsLoadingPosts(true);
    setErrorMessage('');

    try {
      const { unauthorized, posts: nextPosts } = await requestAdminPosts();

      if (unauthorized) {
        window.location.href = '/admin/blog/login';
        return;
      }

      setPosts(nextPosts);

      const currentSelection = selectedPostRef.current;
      if (currentSelection) {
        const refreshedSelection = nextPosts.find((post) => post.id === currentSelection.id);
        if (refreshedSelection) {
          setSelectedPost(refreshedSelection);
          setForm(mapPostToForm(refreshedSelection));
        }
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load stories.');
    } finally {
      setIsLoadingPosts(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  // Reflects stored text (which may contain **bold** markers and \n breaks) into the
  // rich text editors as real <strong> and <br> elements.
  function resetEditableContent(nextForm) {
    if (previewTextTextareaRef.current) {
      previewTextTextareaRef.current.innerHTML = storedTextToEditableHtml(nextForm.previewText || '');
    }
    if (bodyTextareaRef.current) {
      bodyTextareaRef.current.innerHTML = storedTextToEditableHtml(nextForm.body || '');
    }
  }

  function handleEditableInput(field, event) {
    updateField(field, editableNodeToStoredText(event.currentTarget));
  }

  function handleEditableKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      document.execCommand('insertLineBreak');
    }
  }

  function handleEditablePaste(event) {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }

  function applyBoldToSelection() {
    document.execCommand('styleWithCSS', false, false);
    document.execCommand('bold');

    if (previewTextTextareaRef.current) {
      updateField('previewText', editableNodeToStoredText(previewTextTextareaRef.current));
    }
    if (bodyTextareaRef.current) {
      updateField('body', editableNodeToStoredText(bodyTextareaRef.current));
    }
  }

  function startNewPost() {
    setSelectedPost(null);
    setForm(EMPTY_FORM);
    setFeaturedImageFile(null);
    setFeaturedImagePreviewUrl('');
    setRemoveFeaturedImage(false);
    setFeaturedImageStatusMessage('');
    setFeaturedImageErrorMessage('');
    setRemovedSubmissionPhotoUrls([]);
    setStatusMessage('');
    setErrorMessage('');
    resetEditableContent(EMPTY_FORM);
  }

  function editPost(post) {
    const nextForm = mapPostToForm(post);
    setSelectedPost(post);
    setForm(nextForm);
    setFeaturedImageFile(null);
    setFeaturedImagePreviewUrl('');
    setRemoveFeaturedImage(false);
    setFeaturedImageStatusMessage('');
    setFeaturedImageErrorMessage('');
    setRemovedSubmissionPhotoUrls([]);
    setStatusMessage('');
    setErrorMessage('');
    resetEditableContent(nextForm);
  }

  async function submitPost(nextStatus) {
    setIsSaving(true);
    setStatusMessage('');
    setErrorMessage('');
    setFeaturedImageStatusMessage('');
    setFeaturedImageErrorMessage('');

    const hasFeaturedImageUpdate = Boolean(featuredImageFile) || removeFeaturedImage;

    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('slug', form.slug);
      payload.append('author', form.author);
      payload.append('category', categoryTitleFromValue(form.category));
      payload.append('publishedAt', form.publishedAt);
      payload.append('previewText', form.previewText);
      payload.append('body', form.body);
      payload.append('status', nextStatus);
      payload.append('isFeatured', String(form.isFeatured));
      payload.append('removeFeaturedImage', String(removeFeaturedImage));

      if (featuredImageFile) {
        payload.append('featuredImage', featuredImageFile);
      }

      if (selectedPost && removedSubmissionPhotoUrls.length > 0) {
        const remainingUrls = [];
        const remainingPaths = [];
        (selectedPost.submissionPhotoUrls || []).forEach((photoUrl, index) => {
          if (!removedSubmissionPhotoUrls.includes(photoUrl)) {
            remainingUrls.push(photoUrl);
            remainingPaths.push((selectedPost.submissionPhotoPaths || [])[index] || '');
          }
        });
        payload.append('submissionPhotoUrls', JSON.stringify(remainingUrls));
        payload.append('submissionPhotoPaths', JSON.stringify(remainingPaths));
      }

      const endpoint = isEditing ? `/api/admin/blog/${form.id}` : '/api/admin/blog';
      const method = isEditing ? 'PATCH' : 'POST';
      const response = await fetch(endpoint, {
        method,
        credentials: 'include',
        body: payload,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to save story.');
      }

      await loadPosts();
      if (data.post) {
        const nextForm = mapPostToForm(data.post);
        setSelectedPost(data.post);
        setForm(nextForm);
        resetEditableContent(nextForm);
      }

      setFeaturedImageFile(null);
      if (featuredImagePreviewUrl) {
        URL.revokeObjectURL(featuredImagePreviewUrl);
      }
      setFeaturedImagePreviewUrl('');
      setRemoveFeaturedImage(false);
      setRemovedSubmissionPhotoUrls([]);
      setStatusMessage(nextStatus === 'published' ? 'Story published or scheduled.' : 'Story saved.');

      if (featuredImageFile) {
        setFeaturedImageStatusMessage('Featured image uploaded and saved to this story.');
      } else if (removeFeaturedImage) {
        setFeaturedImageStatusMessage('Featured image removed from this story.');
      }
    } catch (error) {
      const message = error.message || 'Unable to save story.';
      setErrorMessage(message);
      if (hasFeaturedImageUpdate) {
        setFeaturedImageErrorMessage(`Featured image update failed: ${message}`);
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function runAction(action, successText, extras = {}) {
    if (!form.id) {
      return;
    }

    setIsSaving(true);
    setStatusMessage('');
    setErrorMessage('');

    try {
      const payload = new FormData();
      payload.append('action', action);
      if (extras.publishedAt) {
        payload.append('publishedAt', extras.publishedAt);
      }
      if (extras.rejectionReason) {
        payload.append('rejectionReason', extras.rejectionReason);
      }

      const response = await fetch(`/api/admin/blog/${form.id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: payload,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to update story status.');
      }

      await loadPosts();
      if (data.post) {
        setSelectedPost(data.post);
        setForm(mapPostToForm(data.post));
      }

      setStatusMessage(successText);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to update story status.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7fcfb]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-[#0f9aa1]/20 bg-white px-5 py-5 shadow-sm sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#002244]">Story Admin</h1>
              <p className="mt-1 text-sm text-[#1f5f7a]">Review submissions, edit stories, publish, schedule, feature, and archive content.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={startNewPost}
                className="rounded-full border border-[#0f9aa1]/30 px-4 py-2 text-sm font-semibold text-[#0f9aa1] transition hover:bg-[#e8f8f9]"
              >
                New Story
              </button>
              <a
                href="/api/admin/session/logout"
                className="rounded-full border border-[#002244]/25 px-4 py-2 text-sm font-semibold text-[#002244] transition hover:bg-[#edf4f7]"
              >
                Sign Out
              </a>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#1f5f7a]">
            <p>Pending review: <span className="font-semibold text-[#002244]">{pendingCount}</span></p>
            <p>Published: <span className="font-semibold text-[#002244]">{publishedCount}</span></p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-2xl border border-[#0f9aa1]/20 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-[#002244]">Story Queue</h2>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-[#002244]/18 px-2 py-1 text-xs text-[#002244]"
              >
                <option value="all">All</option>
                <option value="pending_review">Pending Review</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {isLoadingPosts ? (
              <p className="mt-3 text-sm text-[#1f5f7a]">Loading stories...</p>
            ) : filteredPosts.length === 0 ? (
              <p className="mt-3 text-sm text-[#1f5f7a]">No stories in this filter.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {filteredPosts.map((post) => (
                  <li key={post.id}>
                    <button
                      type="button"
                      onClick={() => editPost(post)}
                      className="w-full rounded-xl border border-[#002244]/10 px-3 py-2 text-left transition hover:bg-[#f4fbfc]"
                    >
                      <p className="text-sm font-semibold text-[#002244]">{post.title}</p>
                      <p className="mt-1 text-xs text-[#1f5f7a]">{post.author}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        <span className="rounded-full bg-[#edf6f8] px-2 py-0.5 text-[10px] font-semibold text-[#1f5f7a]">
                          {STATUS_LABELS[post.status] || post.status}
                        </span>
                        {post.isFeatured ? (
                          <span className="rounded-full bg-[#fff4d8] px-2 py-0.5 text-[10px] font-semibold text-[#8d6111]">
                            Featured
                          </span>
                        ) : null}
                        {post.publishedAt ? (
                          <span className="rounded-full bg-[#ecf9f0] px-2 py-0.5 text-[10px] font-semibold text-[#1f8f3c]">
                            {formatPublicationDate(post.publishedAt)}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <section className="rounded-2xl border border-[#0f9aa1]/20 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-bold text-[#002244]">
              {isEditing ? 'Edit Story' : 'Create New Story'}
            </h2>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#002244]">Title</span>
                <input
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  className="w-full rounded-xl border border-[#002244]/18 px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
                  required
                />
              </label>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-[#002244]">Author or Organization</span>
                  <input
                    value={form.author}
                    onChange={(event) => updateField('author', event.target.value)}
                    className="w-full rounded-xl border border-[#002244]/18 px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-[#002244]">Category</span>
                  <select
                    value={form.category}
                    onChange={(event) => updateField('category', event.target.value)}
                    className="w-full rounded-xl border border-[#002244]/18 bg-white px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
                  >
                    {STORY_CATEGORIES.map((category) => (
                      <option key={category.key} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-[#002244]">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) => updateField('status', event.target.value)}
                    className="w-full rounded-xl border border-[#002244]/18 bg-white px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-semibold text-[#002244]">Publication Date (for scheduling)</span>
                  <input
                    type="date"
                    value={form.publishedAt}
                    onChange={(event) => updateField('publishedAt', event.target.value)}
                    className="w-full rounded-xl border border-[#002244]/18 px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#002244]">Slug (optional)</span>
                <input
                  value={form.slug}
                  onChange={(event) => updateField('slug', event.target.value)}
                  placeholder="auto-generated-from-title"
                  className="w-full rounded-xl border border-[#002244]/18 px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#002244]">Short Preview (2-4 sentences)</span>
                <div
                  ref={previewTextTextareaRef}
                  contentEditable
                  suppressContentEditableWarning
                  role="textbox"
                  aria-multiline="true"
                  onInput={(event) => handleEditableInput('previewText', event)}
                  onKeyDown={handleEditableKeyDown}
                  onPaste={handleEditablePaste}
                  className="min-h-[6rem] w-full rounded-xl border border-[#002244]/18 px-4 py-3 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#002244]">Full Story</span>
                <div
                  ref={bodyTextareaRef}
                  contentEditable
                  suppressContentEditableWarning
                  role="textbox"
                  aria-multiline="true"
                  onInput={(event) => handleEditableInput('body', event)}
                  onKeyDown={handleEditableKeyDown}
                  onPaste={handleEditablePaste}
                  className="min-h-[22rem] w-full rounded-xl border border-[#002244]/18 px-4 py-3 text-[1rem] leading-7 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
                />
              </label>

              {form.slug === 'apparently-david-sedaris-picks-up-litter-too' ? (
                <div className="rounded-xl border border-[#0f9aa1]/20 bg-[#f3fbfc] px-4 py-3 text-sm text-[#123e56]">
                  <p className="font-semibold text-[#002244]">
                    Embedded Video: David Sedaris&apos; New Passion Is Picking Up Garbage — Late Night with Seth Meyers
                  </p>
                  <p className="mt-1">Status: Will appear on the published story page</p>
                </div>
              ) : null}

              <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#002244]">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) => updateField('isFeatured', event.target.checked)}
                />
                Feature this story
              </label>

              <div className="rounded-xl border border-[#002244]/12 bg-[#f9fdfc] p-4">
                <p className="text-sm font-semibold text-[#002244]">Featured Image (optional)</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;

                    if (featuredImagePreviewUrl) {
                      URL.revokeObjectURL(featuredImagePreviewUrl);
                    }

                    setFeaturedImageFile(file);
                    if (file) {
                      const localPreviewUrl = URL.createObjectURL(file);
                      setFeaturedImagePreviewUrl(localPreviewUrl);
                      setRemoveFeaturedImage(false);
                      setFeaturedImageStatusMessage('Selected image ready. Click Save Story to upload and attach it.');
                      setFeaturedImageErrorMessage('');
                    } else {
                      setFeaturedImagePreviewUrl('');
                      setFeaturedImageStatusMessage('');
                    }
                  }}
                  className="mt-2 block w-full text-sm text-[#1f5f7a] file:mr-3 file:rounded-full file:border-0 file:bg-[#0f9aa1] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-[#0b8a90]"
                />

                {featuredImagePreviewUrl ? (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-[#1f5f7a]">Selected image preview</p>
                    <img
                      src={featuredImagePreviewUrl}
                      alt="Selected featured preview"
                      style={{
                        width: '100%',
                        maxWidth: '420px',
                        height: 'auto',
                        maxHeight: '260px',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        display: 'block',
                        margin: '0 auto',
                      }}
                      className="mt-2 rounded-lg"
                    />
                  </div>
                ) : null}

                {!removeFeaturedImage && form.featuredImageUrl ? (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-[#1f5f7a]">Current saved featured image</p>
                    <img
                      src={form.featuredImageUrl}
                      alt="Current featured"
                      style={{
                        width: '100%',
                        maxWidth: '420px',
                        height: 'auto',
                        maxHeight: '260px',
                        objectFit: 'contain',
                        objectPosition: 'center',
                        display: 'block',
                        margin: '0 auto',
                      }}
                      className="mt-2 rounded-lg"
                    />
                    <label className="mt-2 inline-flex items-center gap-2 text-sm text-[#1f5f7a]">
                      <input
                        type="checkbox"
                        checked={removeFeaturedImage}
                        onChange={(event) => setRemoveFeaturedImage(event.target.checked)}
                      />
                      Remove current featured image
                    </label>
                  </div>
                ) : null}

                {featuredImageStatusMessage ? (
                  <p className="mt-3 rounded-xl border border-[#1f8f3c]/20 bg-[#ecf9f0] px-3 py-2 text-xs font-semibold text-[#1f8f3c]">
                    {featuredImageStatusMessage}
                  </p>
                ) : null}

                {featuredImageErrorMessage ? (
                  <p className="mt-3 rounded-xl border border-[#b23d31]/20 bg-[#fff2f0] px-3 py-2 text-xs font-semibold text-[#b23d31]">
                    {featuredImageErrorMessage}
                  </p>
                ) : null}
              </div>

              {selectedPost?.submissionPhotoUrls?.length > 0 ? (
                <div className="rounded-xl border border-[#002244]/12 bg-[#f9fdfc] p-4">
                  <p className="text-sm font-semibold text-[#002244]">Submitted Photos</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectedPost.submissionPhotoUrls.map((photoUrl) => {
                      const isRemoved = removedSubmissionPhotoUrls.includes(photoUrl);
                      return (
                        <div key={photoUrl} className="relative">
                          <img
                            src={photoUrl}
                            alt="Submitted"
                            className={`h-24 w-full rounded-lg object-cover ${isRemoved ? 'opacity-30' : ''}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setRemovedSubmissionPhotoUrls((current) => (
                                isRemoved
                                  ? current.filter((url) => url !== photoUrl)
                                  : [...current, photoUrl]
                              ));
                            }}
                            className={`absolute right-1 top-1 rounded-full px-2 py-1 text-[10px] font-semibold shadow-sm transition ${
                              isRemoved
                                ? 'bg-white text-[#1f5f7a] hover:bg-[#edf5f9]'
                                : 'bg-[#b23d31] text-white hover:bg-[#8f2f26]'
                            }`}
                          >
                            {isRemoved ? 'Undo' : 'Remove'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {removedSubmissionPhotoUrls.length > 0 ? (
                    <p className="mt-3 rounded-xl border border-[#1f8f3c]/20 bg-[#ecf9f0] px-3 py-2 text-xs font-semibold text-[#1f8f3c]">
                      Click Save Story to remove the marked photo(s) from this story.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            {statusMessage ? (
              <p className="mt-4 rounded-xl border border-[#1f8f3c]/20 bg-[#ecf9f0] px-4 py-2.5 text-sm font-semibold text-[#1f8f3c]">
                {statusMessage}
              </p>
            ) : null}

            {errorMessage ? (
              <p className="mt-4 rounded-xl border border-[#b23d31]/20 bg-[#fff2f0] px-4 py-2.5 text-sm font-semibold text-[#b23d31]">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => submitPost(form.status || 'draft')}
                className="rounded-full border border-[#002244]/24 px-5 py-2.5 text-sm font-semibold text-[#002244] transition hover:bg-[#edf4f7] disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : 'Save Story'}
              </button>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={applyBoldToSelection}
                className="rounded-full border border-[#002244]/24 px-5 py-2.5 text-sm font-extrabold text-[#002244] transition hover:bg-[#edf4f7]"
                title="Bold the selected text in Short Preview or Full Story"
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="rounded-full border border-[#1f5f7a]/30 px-5 py-2.5 text-sm font-semibold text-[#1f5f7a] transition hover:bg-[#edf5f9]"
              >
                Preview
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => runAction('approve', 'Story approved and published.', { publishedAt: form.publishedAt })}
                className="rounded-full bg-[#0f9aa1] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c8890] disabled:opacity-70"
              >
                Approve and Publish
              </button>
              {isEditing ? (
                <>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => runAction('reject', 'Story rejected.')}
                    className="rounded-full border border-[#b23d31]/30 px-5 py-2.5 text-sm font-semibold text-[#b23d31] transition hover:bg-[#fff2f0] disabled:opacity-70"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => runAction('archive', 'Story archived.')}
                    className="rounded-full border border-[#6d7081]/30 px-5 py-2.5 text-sm font-semibold text-[#4e5268] transition hover:bg-[#f4f5f8] disabled:opacity-70"
                  >
                    Archive
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => runAction(form.isFeatured ? 'unfeature' : 'feature', form.isFeatured ? 'Story no longer featured.' : 'Story featured.')}
                    className="rounded-full border border-[#8d6111]/35 px-5 py-2.5 text-sm font-semibold text-[#8d6111] transition hover:bg-[#fff9e8] disabled:opacity-70"
                  >
                    {form.isFeatured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => runAction('restore', 'Story moved to draft.')}
                    className="rounded-full border border-[#1f5f7a]/30 px-5 py-2.5 text-sm font-semibold text-[#1f5f7a] transition hover:bg-[#edf5f9] disabled:opacity-70"
                  >
                    Restore to Draft
                  </button>
                </>
              ) : null}
            </div>
          </section>
        </div>
      </div>

      {isPreviewOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#002244]/70 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-label="Story preview"
        >
          <div className="relative w-full max-w-3xl">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute -top-2 right-0 z-10 rounded-full border border-white/40 bg-white px-4 py-2 text-sm font-semibold text-[#002244] shadow-sm transition hover:bg-[#edf4f7]"
            >
              Close Preview
            </button>

            <article className="mt-10 rounded-2xl border border-[#0f9aa1]/18 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10">
              <h1 className="text-4xl font-bold leading-tight text-[#002244] sm:text-5xl">
                {form.title || 'Untitled Story'}
              </h1>
              <p className="mt-3 inline-flex rounded-full bg-[#eaf8f9] px-3 py-1 text-xs font-semibold text-[#0f9aa1]">
                {categoryTitleFromValue(form.category)}
              </p>
              <p className="mt-3 text-sm font-semibold text-[#1f5f7a]">
                {form.publishedAt ? `${formatPublicationDate(form.publishedAt)} • ` : ''}By {form.author || 'Unknown'}
              </p>

              {previewFeaturedImageUrl ? (
                <img
                  src={previewFeaturedImageUrl}
                  alt={form.title}
                  style={{
                    width: '100%',
                    maxWidth: '800px',
                    height: 'auto',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    display: 'block',
                    margin: '1.5rem auto 0',
                  }}
                  className="rounded-xl"
                />
              ) : null}

              {form.previewText ? (
                <p className="mt-6 text-lg italic leading-8 text-[#1f5f7a]">{form.previewText}</p>
              ) : null}

              <div className="mt-8 space-y-6 text-[1.14rem] leading-[1.88] text-[#123e56]">
                {previewParagraphs.length > 0 ? (
                  previewParagraphs.map((paragraph, index) => (
                    <p key={`preview-paragraph-${index}`}>
                      {parseInlineFormatting(paragraph).map((segment, segmentIndex) => (
                        segment.bold ? (
                          <strong key={segmentIndex}>{segment.text}</strong>
                        ) : (
                          <span key={segmentIndex}>{segment.text}</span>
                        )
                      ))}
                    </p>
                  ))
                ) : (
                  <p className="italic text-[#6d7081]">No story text yet.</p>
                )}
              </div>

              {selectedPost?.submissionPhotoUrls?.length > 0 ? (
                <div className="mt-10 rounded-xl border border-[#002244]/12 bg-[#f9fdfc] p-4">
                  <p className="text-sm font-semibold text-[#002244]">Submitted Photos</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectedPost.submissionPhotoUrls.map((photoUrl) => (
                      <img key={photoUrl} src={photoUrl} alt="Submitted" className="h-24 w-full rounded-lg object-cover" />
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          </div>
        </div>
      ) : null}
    </div>
  );
}
