"use client";

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

const ORGANIZE_OPTIONS = [
  {
    name: 'Seattle Public Utilities - Adopt a Street',
    description: 'Adopt a street and get the guidance and supplies you need to care for it.',
    href: 'https://seattle.gov/utilities/volunteer/adopt-a-street',
    button: 'Visit Organizing Information',
    accent: 'teal',
  },
  {
    name: 'Seattle Parks & Recreation / Green Seattle Partnership',
    description: 'Find restoration projects and learn how to organize stewardship work in Seattle parks.',
    href: 'https://greenseattle.org/get-involved/volunteer/',
    button: 'Visit Organizing Information',
    accent: 'green',
  },
];

const JOIN_OPTIONS = [
  {
    name: 'Seattle Public Utilities - Adopt a Street',
    description: 'Join neighbors who care for adopted streets across Seattle.',
    href: 'https://seattle.gov/utilities/volunteer/adopt-a-street',
  },
  {
    name: 'We Heart Seattle',
    description: 'Take part in volunteer cleanups that make Seattle parks and public spaces shine.',
    href: 'https://weheartseattle.org/community-involvement/',
  },
  {
    name: 'Seattle Parks / Green Seattle Partnership',
    description: 'Explore restoration and stewardship events in Seattle parks.',
    href: 'https://greenseattle.org/get-involved/volunteer/',
  },
];

function formatEventDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function formatEventTime(startTime, endTime) {
  const times = [startTime, endTime].map((time) => String(time || '').trim()).filter(Boolean);
  return times.join(' - ');
}

function OrganizationCard({ organization, organize = false }) {
  return (
    <article className="paint-card flex h-full flex-col p-6 sm:p-7">
      <div className={`mb-5 h-2 w-16 rounded-full ${organization.accent === 'green' ? 'bg-[#69be28]' : 'bg-[#0f9aa1]'}`} />
      <h3 className="text-2xl font-bold text-[#002244]">{organization.name}</h3>
      <p className="mt-3 flex-1 leading-7 text-[#516b7d]">{organization.description}</p>
      <a href={organization.href} target="_blank" rel="noreferrer" className={`${organize ? 'btn-secondary' : 'btn-green'} mt-6 w-full text-center`}>
        {organization.button || 'View Cleanup Opportunities'}
      </a>
    </article>
  );
}

function CommunityEventCard({ event }) {
  const eventTime = formatEventTime(event.startTime, event.endTime);

  return (
    <article className="paint-card overflow-hidden">
      {event.imageUrl ? <img src={event.imageUrl} alt="" className="h-48 w-full object-cover" /> : null}
      <div className="p-6 sm:p-7">
        {event.isPinned ? <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[#ef7f2d]">Featured event</p> : null}
        <h3 className="text-2xl font-bold text-[#002244]">{event.name}</h3>
        <p className="mt-2 font-semibold text-[#0b6e85]">Hosted by {event.organizationName}</p>
        <div className="mt-5 space-y-2 text-sm text-[#516b7d]">
          <p>📅 {formatEventDate(event.eventDate)}</p>
          {eventTime ? <p>⏰ {eventTime}</p> : null}
          <p>📍 {event.location}</p>
        </div>
        <p className="mt-5 leading-7 text-[#516b7d]">{event.description}</p>
        {event.eventUrl ? <a href={event.eventUrl} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full text-center">View Event Details</a> : null}
        {event.publicContact ? (
          <div className="mt-5 border-t border-[#002244]/10 pt-4 text-sm text-[#516b7d]">
            {event.publicContact.name ? <p>Contact: {event.publicContact.name}</p> : null}
            {event.publicContact.email ? <p>Email: {event.publicContact.email}</p> : null}
            {event.publicContact.phone ? <p>Phone: {event.publicContact.phone}</p> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

const EMPTY_FORM = {
  eventName: '', organizationName: '', eventDate: '', startTime: '', endTime: '', location: '',
  description: '', eventUrl: '', contactName: '', contactEmail: '', contactPhone: '', publicContactAllowed: false,
};

function EventSubmissionForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  function updateField(event) {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  }

  async function submit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/community-events', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to submit your event.');
      setShowSuccessModal(true);
    } catch (submitError) {
      setError(submitError.message || 'Unable to submit your event.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = 'w-full rounded-xl border border-[#002244]/18 bg-white px-4 py-3 text-[#002244] focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/35';
  const fields = [
    ['eventName', 'Event name', 'text'], ['organizationName', 'Organization or group name', 'text'],
    ['eventDate', 'Event date', 'date'], ['startTime', 'Start time (optional)', 'time'], ['endTime', 'End time (optional)', 'time'],
    ['location', 'Location', 'text'], ['eventUrl', 'Event or Registration Link (optional)', 'url'],
    ['contactName', 'Contact Name (optional)', 'text'], ['contactEmail', 'Email (optional)', 'email'], ['contactPhone', 'Phone Number (optional)', 'tel'],
  ];
  const optionalFields = ['startTime', 'endTime', 'eventUrl', 'contactName', 'contactEmail', 'contactPhone'];

  return (
    <form onSubmit={submit} className="paint-card p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {fields.map(([name, label, type]) => (
          <label key={name} className={`block ${name === 'eventUrl' || name === 'location' ? 'md:col-span-2' : ''}`}>
            <span className="mb-1.5 block text-sm font-semibold text-[#002244]">{label}</span>
            <input className={inputClass} name={name} type={type} value={form[name]} onChange={updateField} required={!optionalFields.includes(name)} />
          </label>
        ))}
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-sm font-semibold text-[#002244]">Short event description</span>
          <textarea className={inputClass} name="description" rows="4" value={form.description} onChange={updateField} required />
        </label>
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-[#1f5f7a]">
        <input className="mt-1 h-4 w-4 rounded border-[#002244]/25" name="publicContactAllowed" type="checkbox" checked={form.publicContactAllowed} onChange={updateField} />
        <span>You may display my contact information publicly with this event listing.</span>
      </label>
      <p className="mt-5 text-sm leading-6 text-[#516b7d]">Please provide enough information for us to verify the event. Incomplete submissions may not be published.</p>
      <p className="mt-6 rounded-xl bg-[#fff8e3] px-4 py-3 text-sm leading-6 text-[#6a5316]">Submitting an event does not guarantee publication. Pick It Up Seattle reviews community event submissions before posting.</p>
      {error ? <p className="mt-4 font-semibold text-[#c84d42]" role="alert">{error}</p> : null}
      <button type="submit" disabled={isSubmitting} className="btn-primary mt-5 disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? 'Submitting...' : 'Submit Event for Review'}</button>
      {showSuccessModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#002244]/45 px-4" role="dialog" aria-modal="true" aria-labelledby="event-submission-success-title">
          <div className="w-full max-w-md rounded-2xl border border-[#0f9aa1]/20 bg-white p-6 text-center shadow-2xl sm:p-8">
            <h3 id="event-submission-success-title" className="text-2xl font-bold text-[#002244]">Thanks! Your event was submitted for review.</h3>
            <p className="mt-4 leading-7 text-[#516b7d]">Pick It Up Seattle reviews community event submissions before posting.</p>
            <button
              type="button"
              className="btn-primary mt-6 w-full sm:w-auto"
              onClick={() => {
                setShowSuccessModal(false);
                setForm(EMPTY_FORM);
              }}
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </form>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/community-events', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : { events: [] })
      .then((data) => setEvents(Array.isArray(data.events) ? data.events : []))
      .catch(() => setEvents([]));
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="hero-surface py-16 sm:py-24">
          <div className="container-custom">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#0f9aa1]">Pick It Up Seattle</p>
            <h1 className="heading-xl">Events</h1>
            <p className="mt-4 max-w-2xl text-lg font-semibold leading-8 text-[#1f5f7a]">Find ways to get involved, support Seattle, and connect with community events.</p>
          </div>
        </section>

        <section className="py-16 sm:py-20" id="organize-cleanup">
          <div className="container-custom">
            <div className="mb-8 max-w-3xl">
              <h2 className="heading-lg">Want to Organize a Cleanup?</h2>
              <p className="mt-3 text-lg leading-8 text-[#516b7d]">These organizations can help you plan and lead a cleanup. They manage their own events, safety requirements, and volunteer coordination.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{ORGANIZE_OPTIONS.map((organization) => <OrganizationCard key={organization.name} organization={organization} organize />)}</div>
          </div>
        </section>

        <section className="bg-[#eaf7f4] py-16 sm:py-20" id="join-cleanup">
          <div className="container-custom">
            <div className="mb-8 max-w-3xl">
              <h2 className="heading-lg">Want to Join a Cleanup?</h2>
              <p className="mt-3 text-lg leading-8 text-[#516b7d]">Find an existing opportunity and register directly with the organization hosting it.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{JOIN_OPTIONS.map((organization) => <OrganizationCard key={organization.name} organization={organization} />)}</div>
            <p className="mt-8 rounded-2xl border border-[#0f9aa1]/20 bg-white/75 px-5 py-4 text-sm leading-6 text-[#1f5f7a]">Events listed here may be organized by independent community organizations. Please use the organizer&apos;s link for registration, event details, and participation requirements.</p>
          </div>
        </section>

        <section className="py-16 sm:py-20" id="community-events">
          <div className="container-custom">
            <div className="mb-8 max-w-3xl">
              <h2 className="heading-lg">Other Community Events</h2>
              <p className="mt-3 text-lg leading-8 text-[#516b7d]">Explore community events shared with Pick It Up Seattle for the community to discover.</p>
            </div>
            {events.length > 0 ? <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{events.map((event) => <CommunityEventCard key={event.id} event={event} />)}</div> : <div className="paint-card px-6 py-8 text-[#516b7d]">No community events are posted yet. Check back soon.</div>}
          </div>
        </section>

        <section className="bg-[#fff8e3] py-16 sm:py-20" id="post-event">
          <div className="container-custom">
            <div className="mb-8 max-w-3xl">
              <h2 className="heading-lg">Post Your Event Here</h2>
              <p className="mt-3 text-lg leading-8 text-[#516b7d]">Share a community event for consideration. This form requests that Pick It Up Seattle feature your event; it is not an event registration form.</p>
            </div>
            <div className="mx-auto max-w-4xl"><EventSubmissionForm /></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
