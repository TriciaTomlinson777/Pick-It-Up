'use client';

import { useState } from 'react';
import { STORY_CATEGORIES } from '@/lib/story-categories';

export default function StorySubmissionForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState(STORY_CATEGORIES[0].key);
  const [previewText, setPreviewText] = useState('');
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState([]);
  const [hasConfirmedPhotoGuidelines, setHasConfirmedPhotoGuidelines] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (photos.length > 0 && !hasConfirmedPhotoGuidelines) {
        throw new Error('Please confirm the Community Photo Guidelines checkbox before submitting photos.');
      }

      const payload = new FormData();
      payload.append('title', title);
      payload.append('author', author);
      payload.append('category', category);
      payload.append('previewText', previewText);
      payload.append('body', body);

      for (const photo of photos) {
        payload.append('photos', photo);
      }

      const response = await fetch('/api/story-submissions', {
        method: 'POST',
        body: payload,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit story.');
      }

      setTitle('');
      setAuthor('');
      setCategory(STORY_CATEGORIES[0].key);
      setPreviewText('');
      setBody('');
      setPhotos([]);
      setHasConfirmedPhotoGuidelines(false);
      setSuccessMessage('Thank you. Your story has been submitted for admin review.');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to submit story.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-full bg-[#0f9aa1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0b868d]"
      >
        {isOpen ? 'Close Form' : 'Share Your Story'}
      </button>

      {isOpen ? (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#002244]">Story Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-[#002244]/18 bg-white px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
            >
              {STORY_CATEGORIES.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.icon} {item.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#002244]">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-xl border border-[#002244]/18 px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#002244]">Your Name or Organization</span>
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              required
              className="w-full rounded-xl border border-[#002244]/18 px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#002244]">Short Preview (optional)</span>
            <textarea
              rows={3}
              value={previewText}
              onChange={(event) => setPreviewText(event.target.value)}
              className="w-full rounded-xl border border-[#002244]/18 px-4 py-3 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#002244]">Your Story</span>
            <textarea
              rows={10}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              required
              className="w-full rounded-xl border border-[#002244]/18 px-4 py-3 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-[#002244]">Photos (optional)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(event) => {
                setPhotos(Array.from(event.target.files || []));
                setHasConfirmedPhotoGuidelines(false);
              }}
              className="block w-full text-sm text-[#1f5f7a] file:mr-3 file:rounded-full file:border-0 file:bg-[#e2f4f5] file:px-4 file:py-2 file:font-semibold file:text-[#0f9aa1] hover:file:bg-[#d5eef0]"
            />
          </label>

          {photos.length > 0 ? (
            <div className="rounded-xl border border-[#0f9aa1]/25 bg-[#eef9fc] px-3.5 py-3 text-sm text-[#1f5f7a]">
              <p className="leading-6">
                Submitted photos may be processed for privacy and safety before public display.
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 leading-6">
                <li>Children's faces will be blurred before public display.</li>
                <li>Location and camera metadata will be removed.</li>
                <li>Publicly displayed images may be resized or compressed.</li>
                <li>The person submitting the photo confirms they have permission to submit it.</li>
                <li>If a photo intentionally features a child, the submitter confirms they are the parent or legal guardian.</li>
                <li>Children may participate in Pick It Up Seattle activities without agreeing to have an identifiable photo published.</li>
                <li>Do not include a child's full name with a photo unless separate permission has been obtained.</li>
              </ul>
            </div>
          ) : null}

          {photos.length > 0 ? (
            <label className="flex items-start gap-2.5 rounded-xl border border-[#002b49]/12 bg-[#fffdf7] px-3 py-3 text-sm text-[#002b49]">
              <input
                type="checkbox"
                checked={hasConfirmedPhotoGuidelines}
                onChange={(event) => setHasConfirmedPhotoGuidelines(event.target.checked)}
                required
                className="mt-0.5 h-4 w-4 rounded border-[#002b49]/25"
              />
              <span>
                I confirm that my photos follow the Community Photo Guidelines, that I have permission to submit them, and that I am the parent or legal guardian if a photo intentionally features a child.
              </span>
            </label>
          ) : null}

          {successMessage ? (
            <p className="rounded-xl border border-[#1f8f3c]/20 bg-[#ecf9f0] px-4 py-2.5 text-sm font-semibold text-[#1f8f3c]">
              {successMessage}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="rounded-xl border border-[#b23d31]/20 bg-[#fff2f0] px-4 py-2.5 text-sm font-semibold text-[#b23d31]">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[#0f9aa1] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b868d] disabled:opacity-70"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </form>
      ) : null}
    </div>
  );
}
