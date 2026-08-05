"use client";

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const PUBLIC_CLEANUPS_KEY = 'pick-it-up-organized-cleanups-v1';
const PRIVATE_ORGANIZERS_KEY = 'pick-it-up-organizer-contacts-private-v1';
const JOINED_CLEANUPS_KEY = 'pick-it-up-joined-cleanups-v1';

function readStoredArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function parseMaxVolunteers(value) {
  const parsed = Number.parseInt(String(value || '').trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatPublicDate(isoDate) {
  if (!isoDate) {
    return '';
  }

  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function EventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedView = String(searchParams.get('view') || '').trim().toLowerCase();
  const highlightCleanupId = String(searchParams.get('cleanupId') || '').trim();
  const isJoinView = selectedView === 'join';
  const isOrganizeView = selectedView === 'organize';
  const [submittedCleanups, setSubmittedCleanups] = useState([]);
  const [joinedCleanupIds, setJoinedCleanupIds] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [latestCleanupId, setLatestCleanupId] = useState('');

  useEffect(() => {
    setSubmittedCleanups(readStoredArray(PUBLIC_CLEANUPS_KEY));
    setJoinedCleanupIds(readStoredArray(JOINED_CLEANUPS_KEY));
  }, []);

  useEffect(() => {
    if (!isJoinView || !highlightCleanupId) {
      return;
    }

    const card = document.getElementById(`cleanup-card-${highlightCleanupId}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightCleanupId, isJoinView, submittedCleanups]);

  async function submitOrganizeCleanupForm(event) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const cleanupId = `cleanup-${Date.now()}`;

    const publicCleanup = {
      id: cleanupId,
      title: String(formData.get('cleanupTitle') || '').trim(),
      date: String(formData.get('eventDate') || '').trim(),
      startTime: String(formData.get('startTime') || '').trim(),
      endTime: String(formData.get('endTime') || '').trim(),
      generalLocation: String(formData.get('generalLocation') || '').trim(),
      meetingPlace: String(formData.get('meetingPlace') || '').trim(),
      description: String(formData.get('eventDescription') || '').trim(),
      organizerName: String(formData.get('organizerName') || '').trim(),
      maxVolunteers: String(formData.get('maxVolunteers') || '').trim(),
      signedUpCount: 0,
      createdAt: new Date().toISOString(),
    };

    const privateOrganizerData = {
      cleanupId,
      organizerEmail: String(formData.get('organizerEmail') || '').trim(),
      organizerPhone: String(formData.get('organizerPhone') || '').trim(),
      createdAt: new Date().toISOString(),
    };

    const existingPublicCleanups = readStoredArray(PUBLIC_CLEANUPS_KEY);
    const updatedPublicCleanups = [publicCleanup, ...existingPublicCleanups];
    writeStoredArray(PUBLIC_CLEANUPS_KEY, updatedPublicCleanups);
    setSubmittedCleanups(updatedPublicCleanups);

    const existingPrivateContacts = readStoredArray(PRIVATE_ORGANIZERS_KEY);
    const updatedPrivateContacts = [privateOrganizerData, ...existingPrivateContacts];
    writeStoredArray(PRIVATE_ORGANIZERS_KEY, updatedPrivateContacts);

    try {
      const emailResponse = await fetch('/api/organize-cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cleanupTitle: publicCleanup.title,
          eventDate: publicCleanup.date,
          startTime: publicCleanup.startTime,
          meetingPlace: publicCleanup.meetingPlace,
          organizerName: publicCleanup.organizerName,
          organizerEmail: privateOrganizerData.organizerEmail,
        }),
      });

      if (emailResponse.ok) {
        const emailResult = await emailResponse.json();
        if (emailResult?.message) {
          console.info(emailResult.message);
        }
      } else {
        const emailFailure = await emailResponse.text();
        console.error('Cleanup saved, but confirmation email failed:', emailFailure);
      }
    } catch (error) {
      console.error('Cleanup saved, but confirmation email request failed:', error);
    }

    setLatestCleanupId(cleanupId);
    setShowSuccessDialog(true);
  }

  function handleViewCleanup() {
    if (!latestCleanupId) {
      router.push('/events?view=join#join-cleanup');
      return;
    }

    router.push(`/events?view=join&cleanupId=${encodeURIComponent(latestCleanupId)}#join-cleanup`);
    setShowSuccessDialog(false);
  }

  function handleJoinCleanup(cleanupId) {
    const alreadyJoined = joinedCleanupIds.includes(cleanupId);
    if (alreadyJoined) {
      return;
    }

    let updatedJoinedIds = joinedCleanupIds;

    const updatedCleanups = submittedCleanups.map((event) => {
      if (event.id !== cleanupId) {
        return event;
      }

      const maxVolunteers = parseMaxVolunteers(event.maxVolunteers);
      const currentCount = Number.parseInt(String(event.signedUpCount || 0), 10) || 0;

      if (maxVolunteers !== null && currentCount >= maxVolunteers) {
        return event;
      }

      updatedJoinedIds = [...joinedCleanupIds, cleanupId];

      return {
        ...event,
        signedUpCount: currentCount + 1,
      };
    });

    if (updatedJoinedIds === joinedCleanupIds) {
      return;
    }

    setSubmittedCleanups(updatedCleanups);
    setJoinedCleanupIds(updatedJoinedIds);
    writeStoredArray(PUBLIC_CLEANUPS_KEY, updatedCleanups);
    writeStoredArray(JOINED_CLEANUPS_KEY, updatedJoinedIds);
  }

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-seattle-green to-green-700 text-white py-16">
        <div className="container-custom">
          <h1 className="heading-xl mb-4 text-[#0f9aa1]">Upcoming Events</h1>
          <p className="text-[1.18rem] font-semibold text-[#002244] sm:text-[1.24rem]">
            Find and join cleanup events across Seattle
          </p>
        </div>
      </section>

      {/* Event Pathways */}
      <section className="py-10 sm:py-12">
        <div className="container-custom">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
            <Link
              href="/events?view=organize#organize-cleanup"
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#0f9aa1]/20 bg-white shadow-[0_14px_30px_rgba(0,43,73,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,43,73,0.16)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0f9aa1]/25"
            >
              <div className="flex min-h-[10.5rem] items-center justify-center bg-[linear-gradient(145deg,_#0f9aa1_0%,_#2ec4c7_48%,_#69be28_100%)] px-6 py-8 text-center text-white sm:px-8">
                <h2 className="text-2xl font-bold leading-tight sm:text-[1.9rem]">Organize a Clean Up</h2>
              </div>
              <div className="flex h-full flex-col p-6">
                <div className="flex-1">
                  <p className="text-base leading-7 text-[#516b7d] sm:text-[1.04rem]">
                    Create a cleanup event and invite others in the community to join you.
                  </p>
                </div>
                <div className="mt-auto pt-6">
                  <span className="btn-primary w-full rounded-xl px-5 py-3 text-center text-sm font-extrabold sm:text-base">
                    Organize a Cleanup
                  </span>
                </div>
              </div>
            </Link>

            <Link
              href="/events?view=join#join-cleanup"
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#0f9aa1]/20 bg-white shadow-[0_14px_30px_rgba(0,43,73,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(0,43,73,0.16)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#69be28]/25"
            >
              <div className="flex min-h-[10.5rem] items-center justify-center bg-[linear-gradient(145deg,_#69be28_0%,_#0f9aa1_55%,_#002244_100%)] px-6 py-8 text-center text-white sm:px-8">
                <h2 className="text-2xl font-bold leading-tight sm:text-[1.9rem]">Join a Cleanup Adventure</h2>
              </div>
              <div className="flex h-full flex-col p-6">
                <div className="flex-1">
                  <p className="text-base leading-7 text-[#516b7d] sm:text-[1.04rem]">
                    Find an upcoming cleanup event and sign up to participate.
                  </p>
                </div>
                <div className="mt-auto pt-6">
                  <span className="btn-green w-full rounded-xl px-5 py-3 text-center text-sm font-extrabold sm:text-base">
                    Join a Cleanup Adventure
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {isOrganizeView ? (
        <section id="organize-cleanup" className="py-16 sm:py-24">
          <div className="container-custom">
            <div className="mx-auto max-w-3xl rounded-2xl border border-seattle-green/20 bg-white p-6 sm:p-8 shadow-md">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Organize a Clean Up</h2>
                <p className="mt-3 text-gray-700">
                  Share your event details so volunteers can discover and join your cleanup.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  Fields marked Required must be completed. Fields marked Optional can be left blank.
                </p>
              </div>

              <form className="space-y-6" onSubmit={submitOrganizeCleanupForm}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="cleanup-title" className="mb-2 block text-sm font-semibold text-gray-900">
                      Cleanup title (Required)
                    </label>
                    <input
                      id="cleanup-title"
                      name="cleanupTitle"
                      type="text"
                      required
                      placeholder="Green Lake Cleanup"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-seattle-green focus:outline-none focus:ring-2 focus:ring-seattle-green/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="event-date" className="mb-2 block text-sm font-semibold text-gray-900">
                      Date (Required)
                    </label>
                    <input
                      id="event-date"
                      name="eventDate"
                      type="date"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-seattle-green focus:outline-none focus:ring-2 focus:ring-seattle-green/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="start-time" className="mb-2 block text-sm font-semibold text-gray-900">
                      Start time (Required)
                    </label>
                    <input
                      id="start-time"
                      name="startTime"
                      type="time"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-seattle-green focus:outline-none focus:ring-2 focus:ring-seattle-green/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="end-time" className="mb-2 block text-sm font-semibold text-gray-900">
                      End time (Required)
                    </label>
                    <input
                      id="end-time"
                      name="endTime"
                      type="time"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-seattle-green focus:outline-none focus:ring-2 focus:ring-seattle-green/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="general-location" className="mb-2 block text-sm font-semibold text-gray-900">
                      General location (Required)
                    </label>
                    <input
                      id="general-location"
                      name="generalLocation"
                      type="text"
                      required
                      placeholder="Green Lake Park, Seattle"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-seattle-green focus:outline-none focus:ring-2 focus:ring-seattle-green/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="meeting-place" className="mb-2 block text-sm font-semibold text-gray-900">
                      Exact meeting place (Required)
                    </label>
                    <textarea
                      id="meeting-place"
                      name="meetingPlace"
                      required
                      rows={4}
                      placeholder="Meet by the Green Lake Community Center entrance near the basketball courts."
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-seattle-green focus:outline-none focus:ring-2 focus:ring-seattle-green/20"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="event-description" className="mb-2 block text-sm font-semibold text-gray-900">
                      Event description (Required)
                    </label>
                    <textarea
                      id="event-description"
                      name="eventDescription"
                      required
                      rows={5}
                      placeholder="Explain what area will be cleaned and what volunteers can expect."
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-seattle-green focus:outline-none focus:ring-2 focus:ring-seattle-green/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="organizer-name" className="mb-2 block text-sm font-semibold text-gray-900">
                      Organizer name (Required)
                    </label>
                    <input
                      id="organizer-name"
                      name="organizerName"
                      type="text"
                      required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:border-seattle-green focus:outline-none focus:ring-2 focus:ring-seattle-green/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="max-volunteers" className="mb-2 block text-sm font-semibold text-gray-900">
                      Maximum number of volunteers (Optional)
                    </label>
                    <input
                      id="max-volunteers"
                      name="maxVolunteers"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Optional"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-seattle-green focus:outline-none focus:ring-2 focus:ring-seattle-green/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="organizer-email" className="mb-2 block text-sm font-semibold text-gray-900">
                      Organizer email (Required)
                    </label>
                    <input
                      id="organizer-email"
                      name="organizerEmail"
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-seattle-green focus:outline-none focus:ring-2 focus:ring-seattle-green/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="organizer-phone" className="mb-2 block text-sm font-semibold text-gray-900">
                      Organizer phone (Optional)
                    </label>
                    <input
                      id="organizer-phone"
                      name="organizerPhone"
                      type="tel"
                      placeholder="(206) 555-0123"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-seattle-green focus:outline-none focus:ring-2 focus:ring-seattle-green/20"
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Your contact information will only be used by Pick It Up Seattle to confirm your cleanup or contact you about the event. It will not be publicly displayed.
                </p>

                <button type="submit" className="btn-primary w-full sm:w-auto">
                  Post Clean Up
                </button>
              </form>
            </div>
          </div>
        </section>
      ) : null}

      {isJoinView ? (
        <>
          {/* Join a Clean Up View */}
          <section id="join-cleanup" className="py-16 sm:py-24">
            <div className="container-custom">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-3">Join a Cleanup Adventure</h2>
                <p className="text-gray-600">
                  Find an upcoming cleanup event and sign up to participate.
                </p>
              </div>

              {submittedCleanups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 items-stretch">
                  {submittedCleanups.map((event) => {
                    const maxVolunteers = parseMaxVolunteers(event.maxVolunteers);
                    const signedUpCount = Number.parseInt(String(event.signedUpCount || 0), 10) || 0;
                    const isJoined = joinedCleanupIds.includes(event.id);
                    const isFull = maxVolunteers !== null && signedUpCount >= maxVolunteers;
                    const buttonLabel = isFull
                      ? 'Cleanup Full'
                      : isJoined
                        ? "You're Signed Up!"
                        : 'Join Cleanup Adventure';

                    return (
                      <div
                        key={event.id}
                        id={`cleanup-card-${event.id}`}
                        className="bg-white rounded-lg border border-seattle-green/20 shadow-md overflow-hidden hover:shadow-lg transition h-full min-h-[28rem] flex flex-col"
                      >
                        <div className="bg-gradient-to-r from-seattle-green to-green-600 h-24 flex items-center justify-center">
                          <span className="text-sm font-semibold tracking-wide text-white px-4 text-center">
                            Community Organized Cleanup
                          </span>
                        </div>
                        <div className="p-6 min-h-[320px] flex flex-1 flex-col">
                          <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                          <div className="space-y-2 mb-4 text-sm text-gray-600">
                            <p>📅 {formatPublicDate(event.date)}</p>
                            <p>⏰ {event.startTime} - {event.endTime}</p>
                            <p>📍 {event.generalLocation}</p>
                            <p>📌 {event.meetingPlace}</p>
                            <p>👤 Organizer: {event.organizerName}</p>
                            {event.maxVolunteers ? <p>🙌 Max volunteers: {event.maxVolunteers}</p> : null}
                            <p>👥 {signedUpCount} signed up</p>
                          </div>
                          <p className="text-gray-700 mb-6">{event.description}</p>
                          <div className="mt-auto pt-2">
                            <button
                              type="button"
                              onClick={() => handleJoinCleanup(event.id)}
                              disabled={isJoined || isFull}
                              className="btn-primary mx-auto flex min-h-[3rem] justify-center text-center disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {buttonLabel}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gray-50 py-12">
            <div className="container-custom text-center">
              <h2 className="text-2xl font-bold mb-4">Can't find an event you like?</h2>
              <p className="text-gray-600 mb-6">
                Let us know what neighborhood or area you'd like to see cleaned up!
              </p>
              <Link href="/contact" className="btn-secondary">
                Suggest an Event
              </Link>
            </div>
          </section>
        </>
      ) : null}

      {showSuccessDialog ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-seattle-green/20 bg-white p-6 sm:p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900">🎉 Cleanup Posted!</h2>
            <div className="mt-4 space-y-3 text-gray-700 leading-relaxed">
              <p>Thank you for organizing a Pick It Up Seattle cleanup!</p>
              <p>
                Your event has been added to the Join a Cleanup page where volunteers can find and
                participate.
              </p>
              <p>
                Your email address and phone number remain private and are visible only to Pick It
                Up Seattle.
              </p>
            </div>
            <button type="button" className="btn-primary mt-6 w-full sm:w-auto" onClick={handleViewCleanup}>
              View My Cleanup
            </button>
          </div>
        </div>
      ) : null}

      <Footer />
    </>
  );
}

export default function Events() {
  return (
    <Suspense fallback={null}>
      <EventsContent />
    </Suspense>
  );
}
