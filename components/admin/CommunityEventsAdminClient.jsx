'use client';

import { useState } from 'react';

const EMPTY_FORM = {
  id: '', name: '', organizationName: '', eventDate: '', startTime: '', endTime: '', location: '',
  description: '', eventUrl: '', contactName: '', contactEmail: '', contactPhone: '', imageUrl: '', publicContactAllowed: false, status: 'pending_review', isPinned: false,
};

function mapEvent(event) {
  return { ...EMPTY_FORM, ...event, name: event.name || '' };
}

const STATUS_LABELS = { pending_review: 'Pending review', approved: 'Approved', rejected: 'Rejected' };

export default function CommunityEventsAdminClient({ initialEvents = [] }) {
  const [events, setEvents] = useState(initialEvents);
  const [form, setForm] = useState(EMPTY_FORM);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function editEvent(event) {
    setForm(mapEvent(event));
    setMessage('');
    setError('');
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  async function refresh() {
    const response = await fetch('/api/admin/community-events', { credentials: 'include', cache: 'no-store' });
    if (!response.ok) throw new Error('Unable to refresh events.');
    const data = await response.json();
    setEvents(data.events || []);
  }

  async function save(event) {
    event.preventDefault();
    setIsSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch(`/api/admin/community-events/${form.id}`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to save event.');
      await refresh();
      setForm(mapEvent(data.event));
      setMessage('Event saved.');
    } catch (saveError) {
      setError(saveError.message || 'Unable to save event.');
    } finally {
      setIsSaving(false);
    }
  }

  async function action(actionName) {
    if (!form.id) return;
    setIsSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch(`/api/admin/community-events/${form.id}`, {
        method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: actionName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update event.');
      await refresh();
      setForm(mapEvent(data.event));
      setMessage(actionName === 'approve' ? 'Event approved and now public.' : `Event ${actionName}d.`);
    } catch (actionError) {
      setError(actionError.message || 'Unable to update event.');
    } finally {
      setIsSaving(false);
    }
  }

  async function removeEvent() {
    if (!form.id || !window.confirm('Permanently delete this event submission?')) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/community-events/${form.id}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) throw new Error('Unable to delete event.');
      await refresh();
      setForm(EMPTY_FORM);
      setMessage('Event deleted.');
    } catch (removeError) {
      setError(removeError.message || 'Unable to delete event.');
    } finally {
      setIsSaving(false);
    }
  }

  const inputClass = 'w-full rounded-xl border border-[#002244]/18 bg-white px-4 py-2.5 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35';
  return (
    <div className="min-h-screen bg-[#f7fcfb]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-[#0f9aa1]/20 bg-white px-5 py-5 shadow-sm sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h1 className="text-3xl font-bold text-[#002244]">Community Events</h1><p className="mt-1 text-sm text-[#1f5f7a]">Review, edit, approve, and feature community event submissions.</p></div>
            <a href="/api/admin/session/logout" className="rounded-full border border-[#002244]/25 px-4 py-2 text-sm font-semibold text-[#002244]">Sign Out</a>
          </div>
        </header>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-2xl border border-[#0f9aa1]/20 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-bold text-[#002244]">Submissions</h2>
            <ul className="mt-3 space-y-2">
              {events.map((event) => <li key={event.id}><button type="button" onClick={() => editEvent(event)} className="w-full rounded-xl border border-[#002244]/10 px-3 py-3 text-left hover:bg-[#f4fbfc]"><p className="text-sm font-semibold text-[#002244]">{event.name}</p><p className="mt-1 text-xs text-[#1f5f7a]">{event.organizationName}</p><span className="mt-2 inline-flex rounded-full bg-[#edf6f8] px-2 py-0.5 text-[10px] font-semibold text-[#1f5f7a]">{STATUS_LABELS[event.status] || event.status}</span>{event.isPinned ? <span className="ml-1 inline-flex rounded-full bg-[#fff4d8] px-2 py-0.5 text-[10px] font-semibold text-[#8d6111]">Pinned</span> : null}</button></li>)}
            </ul>
            {events.length === 0 ? <p className="mt-3 text-sm text-[#1f5f7a]">No submissions yet.</p> : null}
          </aside>
          <section className="rounded-2xl border border-[#0f9aa1]/20 bg-white p-5 shadow-sm sm:p-6">
            {!form.id ? <p className="text-[#1f5f7a]">Select a submission to review.</p> : <form onSubmit={save} className="space-y-4"><h2 className="text-2xl font-bold text-[#002244]">Edit Event</h2><div className="grid grid-cols-1 gap-4 md:grid-cols-2">{[['name','Event name'],['organizationName','Organization or group'],['eventDate','Event date'],['startTime','Start time'],['endTime','End time'],['location','Location'],['eventUrl','Event or Registration Link (optional)'],['contactName','Contact Name (optional)'],['contactEmail','Email (optional)'],['contactPhone','Phone Number (optional)'],['imageUrl','Image URL (optional)']].map(([name,label]) => <label key={name} className="block"><span className="mb-1 block text-sm font-semibold text-[#002244]">{label}</span><input className={inputClass} name={name} type={name === 'eventDate' ? 'date' : name.includes('Time') ? 'time' : name === 'contactEmail' ? 'email' : name === 'contactPhone' ? 'tel' : name === 'eventUrl' || name === 'imageUrl' ? 'url' : 'text'} value={form[name]} onChange={updateField} required={['name', 'organizationName', 'eventDate', 'startTime', 'endTime', 'location'].includes(name)} /></label>)}</div><label className="block"><span className="mb-1 block text-sm font-semibold text-[#002244]">Description</span><textarea className={inputClass} name="description" rows="5" value={form.description} onChange={updateField} required /></label><div className="grid grid-cols-1 gap-4 md:grid-cols-2"><label className="block"><span className="mb-1 block text-sm font-semibold text-[#002244]">Status</span><select className={inputClass} name="status" value={form.status} onChange={updateField}><option value="pending_review">Pending review</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></label><label className="flex items-center gap-2 pt-7 text-sm font-semibold text-[#002244]"><input type="checkbox" name="isPinned" checked={form.isPinned} onChange={updateField} /> Pin approved event</label></div><label className="flex items-start gap-2 text-sm leading-6 text-[#1f5f7a]"><input className="mt-1 h-4 w-4" type="checkbox" name="publicContactAllowed" checked={form.publicContactAllowed} onChange={updateField} /><span>Submitter authorized public display of contact information.</span></label>{message ? <p className="font-semibold text-[#1f8f3c]" role="status">{message}</p> : null}{error ? <p className="font-semibold text-[#c84d42]" role="alert">{error}</p> : null}<div className="flex flex-wrap gap-3"><button disabled={isSaving} className="btn-primary" type="submit">Save Changes</button><button disabled={isSaving} className="btn-green" type="button" onClick={() => action('approve')}>Approve</button><button disabled={isSaving} className="btn-secondary" type="button" onClick={() => action(form.isPinned ? 'unpin' : 'pin')}>{form.isPinned ? 'Unpin' : 'Pin'}</button><button disabled={isSaving} className="rounded-full border border-[#c84d42]/40 px-5 py-3 font-semibold text-[#c84d42]" type="button" onClick={() => action('reject')}>Reject</button><button disabled={isSaving} className="rounded-full border border-[#002244]/20 px-5 py-3 font-semibold text-[#002244]" type="button" onClick={removeEvent}>Delete</button></div></form>}
          </section>
        </div>
      </div>
    </div>
  );
}
