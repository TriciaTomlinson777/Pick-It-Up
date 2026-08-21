'use client';

import { useMemo, useState } from 'react';

function formatDate(value) {
  if (!value) return 'No date';
  const dateOnlyMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = dateOnlyMatch
    ? new Date(Number(dateOnlyMatch[1]), Number(dateOnlyMatch[2]) - 1, Number(dateOnlyMatch[3]))
    : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTimeRange(event) {
  return [event.startTime, event.endTime].filter(Boolean).join(' - ');
}

function statusLabel(value) {
  return String(value || 'approved').replace(/_/g, ' ');
}

function itemTitle(item) {
  if (item.note) return item.note;
  if (item.caption) return item.caption;
  return 'Photo submission';
}

function imageSet(item) {
  if (item.beforeImageUrl || item.afterImageUrl) {
    return [item.beforeImageUrl, item.afterImageUrl].filter(Boolean);
  }
  return item.imageUrl ? [item.imageUrl] : [];
}

export default function AdminDashboardClient({ initialPendingEvents = [], initialContentSections = [] }) {
  const [pendingEvents, setPendingEvents] = useState(initialPendingEvents);
  const [contentSections, setContentSections] = useState(initialContentSections);
  const [editingEventId, setEditingEventId] = useState('');
  const [eventDraft, setEventDraft] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busyKey, setBusyKey] = useState('');

  const submissionCount = useMemo(
    () => contentSections.reduce((total, section) => total + (section.items?.length || 0), 0),
    [contentSections]
  );

  function startEditingEvent(event) {
    setEditingEventId(event.id);
    setEventDraft({ ...event, status: 'pending_review' });
    setMessage('');
    setError('');
  }

  function cancelEditingEvent() {
    setEditingEventId('');
    setEventDraft(null);
    setError('');
  }

  function updateEventDraftField(event) {
    const { name, value } = event.target;
    setEventDraft((current) => ({ ...current, [name]: value }));
  }

  async function saveEventDraft(event) {
    event.preventDefault();
    if (!eventDraft?.id) return;

    setBusyKey(`event-${eventDraft.id}-edit`);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/admin/community-events/${eventDraft.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...eventDraft, status: 'pending_review' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save event.');

      setPendingEvents((current) => current.map((eventItem) => (
        eventItem.id === eventDraft.id ? data.event : eventItem
      )));
      setEditingEventId('');
      setEventDraft(null);
      setMessage('Event saved. It is still pending review.');
    } catch (saveError) {
      setError(saveError.message || 'Unable to save event.');
    } finally {
      setBusyKey('');
    }
  }

  async function updateEvent(eventId, action) {
    setBusyKey(`event-${eventId}-${action}`);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/admin/community-events/${eventId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update event.');

      setPendingEvents((current) => current.filter((event) => event.id !== eventId));
      setMessage(action === 'approve' ? 'Event approved and now public.' : 'Event rejected.');
    } catch (updateError) {
      setError(updateError.message || 'Unable to update event.');
    } finally {
      setBusyKey('');
    }
  }

  async function moderateContent(sectionKey, itemId, action) {
    const isDelete = action === 'delete';
    if (isDelete && !window.confirm('Permanently delete this submission?')) return;

    setBusyKey(`${sectionKey}-${itemId}-${action}`);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`/api/admin/community-content/${sectionKey}/${itemId}`, {
        method: isDelete ? 'DELETE' : 'PATCH',
        credentials: 'include',
        headers: isDelete ? undefined : { 'Content-Type': 'application/json' },
        body: isDelete ? undefined : JSON.stringify({ action: 'remove' }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Unable to moderate submission.');
      }

      if (isDelete) {
        setContentSections((current) => current.map((section) => (
          section.key === sectionKey
            ? { ...section, items: section.items.filter((item) => item.id !== itemId) }
            : section
        )));
        setMessage('Submission deleted.');
        return;
      }

      const data = await response.json();
      setContentSections((current) => current.map((section) => (
        section.key === sectionKey
          ? { ...section, items: section.items.map((item) => (item.id === itemId ? data.item : item)) }
          : section
      )));
      setMessage('Submission removed from the public site.');
    } catch (moderationError) {
      setError(moderationError.message || 'Unable to moderate submission.');
    } finally {
      setBusyKey('');
    }
  }

  return (
    <div className="min-h-screen bg-[#f7fcfb]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-[#0f9aa1]/20 bg-white px-5 py-5 shadow-sm sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0f9aa1]">Pick It Up Seattle</p>
              <h1 className="mt-2 text-3xl font-bold text-[#002244]">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-[#1f5f7a]">Review user-submitted stories, events, photos, notes, and discoveries.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/admin/blog" className="btn-primary">Blog Admin</a>
              <a href="/admin/community-events" className="btn-secondary">Event Admin</a>
              <a href="/api/admin/session/logout" className="rounded-full border border-[#002244]/25 px-4 py-2 text-sm font-semibold text-[#002244]">Sign Out</a>
            </div>
          </div>
        </header>

        {message ? <p className="rounded-xl border border-[#1f8f3c]/20 bg-[#ecf9f0] px-4 py-3 text-sm font-semibold text-[#1f8f3c]" role="status">{message}</p> : null}
        {error ? <p className="rounded-xl border border-[#b23d31]/20 bg-[#fff2f0] px-4 py-3 text-sm font-semibold text-[#b23d31]" role="alert">{error}</p> : null}

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#0f9aa1]/20 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#1f5f7a]">Pending Events</p>
            <p className="mt-2 text-4xl font-bold text-[#002244]">{pendingEvents.length}</p>
          </div>
          <div className="rounded-2xl border border-[#0f9aa1]/20 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#1f5f7a]">Community Submissions</p>
            <p className="mt-2 text-4xl font-bold text-[#002244]">{submissionCount}</p>
          </div>
          <div className="rounded-2xl border border-[#0f9aa1]/20 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#1f5f7a]">Stories</p>
            <a href="/admin/blog" className="mt-3 inline-flex font-semibold text-[#0f9aa1] hover:underline">Open Blog / Stories</a>
          </div>
        </section>

        <section className="rounded-2xl border border-[#0f9aa1]/20 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#002244]">Event Submissions</h2>
              <p className="mt-1 text-sm text-[#1f5f7a]">Pending community event submissions awaiting review.</p>
            </div>
            <a href="/admin/community-events" className="font-semibold text-[#0f9aa1] hover:underline">Open full event admin</a>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pendingEvents.map((event) => {
              const eventTime = formatTimeRange(event);
              const isEditing = editingEventId === event.id;

              return (
                <article key={event.id} className="rounded-xl border border-[#002244]/10 bg-[#fbfefd] p-4">
                  {isEditing ? (
                    <form className="space-y-4" onSubmit={saveEventDraft}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-[#002244]">Edit Event Submission</h3>
                          <p className="mt-1 text-sm font-semibold text-[#0b6e85]">This event will stay pending after saving.</p>
                        </div>
                        <span className="w-fit rounded-full bg-[#fff4d8] px-3 py-1 text-xs font-bold text-[#8d6111]">Pending review</span>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {[
                          ['name', 'Event name', 'text', true],
                          ['organizationName', 'Organization/host name', 'text', true],
                          ['eventDate', 'Date', 'date', true],
                          ['startTime', 'Start time', 'time', false],
                          ['endTime', 'End time', 'time', false],
                          ['location', 'Location', 'text', true],
                          ['eventUrl', 'Event/registration link', 'url', false],
                          ['contactName', 'Contact name', 'text', false],
                          ['contactEmail', 'Contact email', 'email', false],
                          ['contactPhone', 'Contact phone', 'tel', false],
                        ].map(([name, label, type, required]) => (
                          <label key={name} className={`block ${name === 'location' || name === 'eventUrl' ? 'sm:col-span-2' : ''}`}>
                            <span className="mb-1 block text-sm font-semibold text-[#002244]">{label}</span>
                            <input
                              className="w-full rounded-xl border border-[#002244]/18 bg-white px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
                              name={name}
                              type={type}
                              value={eventDraft?.[name] || ''}
                              onChange={updateEventDraftField}
                              required={required}
                            />
                          </label>
                        ))}
                      </div>
                      <label className="block">
                        <span className="mb-1 block text-sm font-semibold text-[#002244]">Description</span>
                        <textarea
                          className="w-full rounded-xl border border-[#002244]/18 bg-white px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35"
                          name="description"
                          rows="5"
                          value={eventDraft?.description || ''}
                          onChange={updateEventDraftField}
                          required
                        />
                      </label>
                      <div className="flex flex-wrap gap-3">
                        <button disabled={Boolean(busyKey)} className="btn-primary" type="submit">Save Edit</button>
                        <button disabled={Boolean(busyKey)} className="rounded-full border border-[#002244]/20 px-5 py-3 font-semibold text-[#002244]" type="button" onClick={cancelEditingEvent}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-[#002244]">{event.name}</h3>
                          <p className="mt-1 text-sm font-semibold text-[#0b6e85]">Hosted by {event.organizationName}</p>
                        </div>
                        <span className="w-fit rounded-full bg-[#fff4d8] px-3 py-1 text-xs font-bold text-[#8d6111]">Pending review</span>
                      </div>
                      <div className="mt-4 space-y-1 text-sm text-[#516b7d]">
                        <p>Date: {formatDate(event.eventDate)}{eventTime ? `, ${eventTime}` : ''}</p>
                        <p>Location: {event.location}</p>
                        {event.eventUrl ? <p>Link: <a href={event.eventUrl} target="_blank" rel="noreferrer" className="text-[#0f9aa1] underline">{event.eventUrl}</a></p> : null}
                        {event.contactName || event.contactEmail || event.contactPhone ? <p>Contact: {[event.contactName, event.contactEmail, event.contactPhone].filter(Boolean).join(' | ')}</p> : null}
                      </div>
                      <p className="mt-4 text-sm leading-6 text-[#516b7d]">{event.description}</p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <button disabled={Boolean(busyKey)} className="rounded-full border border-[#002244]/20 px-5 py-3 font-semibold text-[#002244]" type="button" onClick={() => startEditingEvent(event)}>Edit</button>
                        <button disabled={Boolean(busyKey)} className="btn-green" type="button" onClick={() => updateEvent(event.id, 'approve')}>Approve</button>
                        <button disabled={Boolean(busyKey)} className="rounded-full border border-[#c84d42]/40 px-5 py-3 font-semibold text-[#c84d42]" type="button" onClick={() => updateEvent(event.id, 'reject')}>Reject</button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
          {pendingEvents.length === 0 ? <p className="mt-5 rounded-xl bg-[#f4fbfc] px-4 py-3 text-sm text-[#1f5f7a]">No pending event submissions.</p> : null}
        </section>

        {contentSections.map((section) => (
          <section key={section.key} className="rounded-2xl border border-[#0f9aa1]/20 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#002244]">{section.title}</h2>
                <p className="mt-1 text-sm text-[#1f5f7a]">Submitted items with remove/delete moderation controls.</p>
              </div>
              <p className="text-sm font-semibold text-[#1f5f7a]">{section.items.length} total</p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => {
                const images = imageSet(item);
                const isRemoved = item.status === 'removed';

                return (
                  <article key={item.id} className="flex h-full flex-col rounded-xl border border-[#002244]/10 bg-[#fbfefd] p-4">
                    {images.length ? (
                      <div className={`grid gap-2 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {images.map((imageUrl, index) => (
                          <img key={`${item.id}-${imageUrl}-${index}`} src={imageUrl} alt="" className="h-36 w-full rounded-lg object-cover" />
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-4 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1f5f7a]">{formatDate(item.submittedAt)}</p>
                        <span className="rounded-full bg-[#edf6f8] px-2 py-0.5 text-[10px] font-semibold capitalize text-[#1f5f7a]">{statusLabel(item.status)}</span>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#516b7d]">{itemTitle(item)}</p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button disabled={Boolean(busyKey) || isRemoved} className="rounded-full border border-[#c84d42]/40 px-4 py-2 text-sm font-semibold text-[#c84d42] disabled:opacity-50" type="button" onClick={() => moderateContent(section.key, item.id, 'remove')}>Remove</button>
                      <button disabled={Boolean(busyKey)} className="rounded-full border border-[#002244]/20 px-4 py-2 text-sm font-semibold text-[#002244] disabled:opacity-50" type="button" onClick={() => moderateContent(section.key, item.id, 'delete')}>Delete</button>
                    </div>
                  </article>
                );
              })}
            </div>
            {section.items.length === 0 ? <p className="mt-5 rounded-xl bg-[#f4fbfc] px-4 py-3 text-sm text-[#1f5f7a]">No submissions yet.</p> : null}
          </section>
        ))}
      </div>
    </div>
  );
}