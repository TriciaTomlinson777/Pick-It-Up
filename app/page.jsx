"use client";

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Logo from '@/components/Logo';

const TRACK_SUBMISSIONS_KEY = 'pick-it-up-track-submissions';

const EMPTY_TRACK_FORM = {
  neighborhood: '',
  city: '',
  crossStreets: '',
  locationDescription: '',
  litterNotes: '',
  mapImageName: '',
};

export default function Home() {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [trackForm, setTrackForm] = useState(EMPTY_TRACK_FORM);
  const [gpsLocation, setGpsLocation] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('');
  const [gpsFriendlyLocation, setGpsFriendlyLocation] = useState('');
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [isGpsDetailsOpen, setIsGpsDetailsOpen] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);

  const quickLinks = [
    { label: 'Our Community', href: '/volunteer' },
    { label: 'Community Resources', href: '/community-resources' },
    { label: 'Shop Merch', href: '/shop' },
    { label: 'Donate', href: '/donate' },
    { label: 'Share Photos', href: '/contact' },
    { label: 'Join Us', href: '/volunteer' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const handleTrackFieldChange = (event) => {
    const { name, value } = event.target;
    setTrackForm((current) => ({ ...current, [name]: value }));
    setLocationError('');
    setSubmitMessage('');
  };

  const handleMapImageChange = (event) => {
    const file = event.target.files?.[0];
    setTrackForm((current) => ({
      ...current,
      mapImageName: file ? file.name : '',
    }));
    setSubmitMessage('');
  };

  const buildFriendlyLocation = (address = {}) => {
    const neighborhood = address.neighbourhood || address.suburb || address.city_district || address.quarter;
    const city = address.city || address.town || address.village || address.county;
    const road = address.road || address.pedestrian || address.footway;
    const crossStreet = address.crossing;

    if (neighborhood && city) {
      return `${neighborhood}, ${city}`;
    }

    if (road && crossStreet) {
      return `${road} & ${crossStreet}`;
    }

    if (road) {
      return road;
    }

    if (neighborhood) {
      return neighborhood;
    }

    if (city) {
      return city;
    }

    return '';
  };

  const formatLatLong = (latitude, longitude) => {
    const latDirection = latitude >= 0 ? 'N' : 'S';
    const lonDirection = longitude >= 0 ? 'E' : 'W';
    return `${Math.abs(latitude).toFixed(5)}° ${latDirection}, ${Math.abs(longitude).toFixed(5)}° ${lonDirection}`;
  };

  const handleUseGps = async () => {
    if (!navigator.geolocation) {
      setGpsStatus("We couldn't determine your exact location. No-problem - you can enter your neighborhood, nearby cross streets, or a short description instead.");
      setGpsFriendlyLocation('');
      return;
    }

    setIsGpsLoading(true);
    setGpsStatus('Getting your location...');
    setGpsFriendlyLocation('');
    setLocationError('');

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      setGpsLocation(locationData);

      let friendlyLocation = '';
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${locationData.latitude}&lon=${locationData.longitude}&addressdetails=1&zoom=18`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          friendlyLocation = buildFriendlyLocation(data.address);
        }
      } catch {
        // Keep fallback formatting if reverse geocoding fails.
      }

      if (!friendlyLocation) {
        friendlyLocation = formatLatLong(locationData.latitude, locationData.longitude);
      }

      setGpsFriendlyLocation(friendlyLocation);
      setGpsStatus('Location captured!');
    } catch {
      setGpsLocation(null);
      setGpsStatus("We couldn't determine your exact location. No-problem - you can enter your neighborhood, nearby cross streets, or a short description instead.");
      setGpsFriendlyLocation('');
    } finally {
      setIsGpsLoading(false);
    }
  };

  const hasLocationInput = () => {
    return Boolean(
      gpsLocation ||
        trackForm.neighborhood.trim() ||
        trackForm.city.trim() ||
        trackForm.crossStreets.trim() ||
        trackForm.locationDescription.trim() ||
        trackForm.mapImageName
    );
  };

  const closeTrackModal = () => {
    setIsTrackModalOpen(false);
    setIsGpsDetailsOpen(false);
    setLocationError('');
    setSubmitMessage('');
    setIsSubmissionSuccess(false);
  };

  const handleTrackSubmit = (event) => {
    event.preventDefault();

    if (!hasLocationInput()) {
      setLocationError('Please add at least one location method before submitting.');
      return;
    }

    const entry = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      ...trackForm,
      gpsLocation,
    };

    try {
      const currentEntries = JSON.parse(localStorage.getItem(TRACK_SUBMISSIONS_KEY) || '[]');
      currentEntries.push(entry);
      localStorage.setItem(TRACK_SUBMISSIONS_KEY, JSON.stringify(currentEntries));
      setSubmitMessage('Cleanup Recorded!');
      setIsSubmissionSuccess(true);
      setTrackForm(EMPTY_TRACK_FORM);
      setGpsLocation(null);
      setGpsStatus('');
      setGpsFriendlyLocation('');
      setIsGpsLoading(false);
      setLocationError('');
    } catch {
      setSubmitMessage('Submission saved for this session, but persistent storage is unavailable.');
      setIsSubmissionSuccess(false);
    }
  };

  useEffect(() => {
    if (!isTrackModalOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isTrackModalOpen]);

  useEffect(() => {
    if (!isTrackModalOpen || !isSubmissionSuccess || !submitMessage) {
      return;
    }

    const closeTimer = window.setTimeout(() => {
      closeTrackModal();
    }, 2500);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [isTrackModalOpen, isSubmissionSuccess, submitMessage]);

  return (
    <>
      <Header />

      <main className="bg-[#fdf8eb] text-[#0f2b45]">
        <section className="relative overflow-visible border-b border-[#0f2b45]/10 bg-[linear-gradient(135deg,_#fffdf7_0%,_#f4fbff_35%,_#eefbf3_70%,_#fff3c4_100%)] py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,201,72,0.42),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(109,182,217,0.32),_transparent_30%),radial-gradient(circle_at_center_right,_rgba(98,178,117,0.28),_transparent_26%)]" />

          <div className="container-custom relative">
            <div className="mx-auto max-w-7xl text-center">
              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-[#0f2b45] sm:text-7xl lg:text-8xl">
                Imagine...
              </h1>
              <p className="mx-auto mt-4 max-w-5xl text-lg leading-relaxed text-[#27445f] sm:text-xl lg:text-2xl">
                A city where every person leaves every place a little better than they found it.
              </p>
              <div className="mt-5 flex justify-center overflow-visible">
                <Logo href="/" showText className="w-full max-w-[88rem] justify-center" imgClassName="w-full" />
              </div>
            </div>
          </div>
        </section>

        <section id="day-one" className="bg-[#f7fbfd] py-16 sm:py-20 lg:py-24">
          <div className="container-custom mx-auto">
            <div className="paint-card px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
              <div className="mx-auto w-full text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f5f7a]">
                  DAY ONE
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
                  <div className="flex min-h-[18rem] flex-col justify-between rounded-[2rem] border border-[#0f2b45]/10 bg-[linear-gradient(180deg,_#fffdf7_0%,_#f5ead4_100%)] p-5 shadow-[0_18px_40px_rgba(15,43,69,0.06)] sm:min-h-[22rem] sm:p-6 lg:min-h-[26rem] lg:p-8">
                    <div className="flex items-center justify-center rounded-[1.5rem] border-2 border-dashed border-[#d3b56a] bg-white/55 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#7b6630]">
                      Before
                    </div>
                    <div className="mt-4 flex flex-1 items-center justify-center rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_rgba(248,201,72,0.18),_transparent_55%),linear-gradient(135deg,_rgba(255,255,255,0.9),_rgba(255,248,230,0.95))] text-center">
                      <span className="text-2xl font-semibold tracking-[0.25em] text-[#8b7350] sm:text-3xl lg:text-4xl">
                        BEFORE
                      </span>
                    </div>
                  </div>

                  <div className="flex min-h-[18rem] flex-col justify-between rounded-[2rem] border border-[#0f2b45]/10 bg-[linear-gradient(180deg,_#fffdf7_0%,_#e8f5ee_100%)] p-5 shadow-[0_18px_40px_rgba(15,43,69,0.06)] sm:min-h-[22rem] sm:p-6 lg:min-h-[26rem] lg:p-8">
                    <div className="flex items-center justify-center rounded-[1.5rem] border-2 border-dashed border-[#92c6a5] bg-white/55 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#4f7c61]">
                      After
                    </div>
                    <div className="mt-4 flex flex-1 items-center justify-center rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_rgba(109,182,217,0.16),_transparent_55%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(235,250,242,0.95))] text-center">
                      <span className="text-2xl font-semibold tracking-[0.25em] text-[#5c8f72] sm:text-3xl lg:text-4xl">
                        AFTER
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mx-auto mt-6 max-w-6xl rounded-[1.75rem] border border-[#0f2b45]/10 bg-[#fffdf7] px-6 py-8 shadow-[0_18px_40px_rgba(15,43,69,0.06)] sm:px-10 sm:py-10 lg:px-12 lg:py-12">
                  <p className="text-2xl leading-relaxed font-medium text-[#0f2b45] sm:text-3xl lg:text-[2.1rem]">
                    One person started picking up litter. Another person noticed and joined in. Four bags later, the block looked better-and the movement had begun.
                  </p>
                  <p className="mt-6 text-lg font-semibold text-[#1f5f7a] sm:text-xl lg:text-2xl">
                    We are just getting started.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0f2b45] py-14 sm:py-16 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Every small act helps shape a brighter Seattle.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-200 lg:text-xl">
              Join the movement, share kindness, and help our city shine.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/volunteer" className="btn-primary">
                Join Us
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#eef7fb] py-16 sm:py-20">
          <div className="container-custom mx-auto">
            <div className="mx-auto max-w-7xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f5f7a]">
                How It Works
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#0f2b45] sm:text-4xl lg:text-5xl">
                Three simple steps to keep Seattle cleaner.
              </h2>
              <p className="mx-auto mt-4 max-w-5xl text-lg text-slate-600 lg:text-xl">
                Pick it up wherever you are, add the location, and share your before and after photos with the community.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
              <div className="paint-card p-7 text-center lg:p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8c948]/10 text-3xl text-[#f8c948]">
                  🖐️
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#0f2b45] lg:text-2xl">
                  Pick It Up
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 lg:text-base">
                  Pick up one piece of litter.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTrackModalOpen(true)}
                className="paint-card block w-full p-7 text-center transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,43,69,0.14)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1f5f7a]/20 lg:p-8"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1f5f7a]/10 text-3xl text-[#1f5f7a]">
                  📍
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#0f2b45] lg:text-2xl">
                  Track It
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 lg:text-base">
                  Log your cleanup with a neighborhood, nearest corners, or an optional map pin. No photo required.
                </p>
                <span className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#1f5f7a] px-5 py-3 text-sm font-semibold text-white">
                  Open Tracker
                </span>
              </button>

              <div className="paint-card p-7 text-center lg:p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#6db6d9]/10 text-3xl text-[#6db6d9]">
                  📸
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#0f2b45] lg:text-2xl">
                  Share It
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 lg:text-base">
                  Share your before and after photos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="impact" className="bg-[#f7fbfd] pb-0 pt-12 sm:pt-16">
          <div className="container-custom mx-auto">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f5f7a]">
                Impact
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#0f2b45] sm:text-4xl lg:text-5xl">
                What we’ve done together so far.
              </h2>
              <p className="mx-auto mt-4 max-w-4xl text-lg text-slate-600 lg:text-xl">
                Every count helps spread pride across our neighborhoods.
              </p>
            </div>

            <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-3 lg:gap-8">
              <div className="w-full rounded-[2rem] border border-[#0f2b45]/10 bg-white p-8 text-center shadow-[0_15px_35px_rgba(15,43,69,0.08)] lg:p-10">
                <p className="text-5xl font-black text-[#0f2b45] lg:text-6xl">0</p>
                <p className="mt-4 text-lg font-semibold text-[#1f5f7a] lg:text-2xl">Bags of Trash</p>
              </div>

              <div className="w-full rounded-[2rem] border border-[#0f2b45]/10 bg-white p-8 text-center shadow-[0_15px_35px_rgba(15,43,69,0.08)] lg:p-10">
                <p className="text-5xl font-black text-[#0f2b45] lg:text-6xl">0</p>
                <p className="mt-4 text-lg font-semibold text-[#1f5f7a] lg:text-2xl">Pounds of Litter</p>
              </div>

              <div className="w-full rounded-[2rem] border border-[#0f2b45]/10 bg-white p-8 text-center shadow-[0_15px_35px_rgba(15,43,69,0.08)] lg:p-10">
                <p className="text-5xl font-black text-[#0f2b45] lg:text-6xl">0</p>
                <p className="mt-4 text-lg font-semibold text-[#1f5f7a] lg:text-2xl">Neighborhoods</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-[#fdf8eb]">
          <div className="container-custom">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-[1.3rem] border border-[#0f2b45]/10 bg-[#f8f2e3] px-5 py-4 text-center text-lg font-semibold text-[#0f2b45] shadow-[0_12px_30px_rgba(15,43,69,0.08)] transition duration-200 hover:-translate-y-1 hover:bg-[#f2e6c7] lg:px-6 lg:py-5 lg:text-xl"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />

        {isTrackModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0f2b45]/60 p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="track-it-title">
            <div className="paint-card relative w-full max-w-2xl overflow-hidden rounded-[1.8rem] border border-[#0f2b45]/15 bg-[#fffdf7] shadow-[0_24px_70px_rgba(15,43,69,0.3)]">
              <div className="flex items-center justify-between border-b border-[#0f2b45]/10 px-5 py-4 sm:px-7 sm:py-5">
                <h3 id="track-it-title" className="text-xl font-semibold text-[#0f2b45] sm:text-2xl">
                  Where did you clean up?
                </h3>
                <button
                  type="button"
                  onClick={closeTrackModal}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#0f2b45]/20 text-xl text-[#0f2b45] transition hover:bg-[#eef7fb]"
                  aria-label="Close tracker"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleTrackSubmit} className="max-h-[80vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                <p className="text-sm leading-6 text-slate-600 sm:text-base">
                  Choose whichever option is easiest. Only one location method is required.
                </p>

                <div className="rounded-xl border border-[#0f2b45]/15 bg-white px-4 py-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-[#0f2b45]">Use My Location (GPS)</p>
                    <button type="button" onClick={handleUseGps} disabled={isGpsLoading} className="btn-secondary min-h-11 px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70">
                      Use My Location
                    </button>
                  </div>
                  {gpsStatus && (
                    <div className="mt-3 space-y-1">
                      <p className={`text-sm ${gpsLocation ? 'font-semibold text-[#2c7a3f]' : 'text-[#1f5f7a]'}`}>
                        {isGpsLoading && (
                          <span className="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1f5f7a]/30 border-t-[#1f5f7a] align-[-2px]" aria-hidden="true" />
                        )}
                        {gpsLocation && !isGpsLoading ? '✓ ' : ''}
                        {gpsStatus}
                      </p>
                      {gpsFriendlyLocation && !isGpsLoading && <p className="text-sm text-slate-600">{gpsFriendlyLocation}</p>}
                    </div>
                  )}
                  {gpsLocation && (
                    <button
                      type="button"
                      onClick={() => setIsGpsDetailsOpen(true)}
                      className="mt-3 text-sm font-semibold text-[#1f5f7a] underline underline-offset-2"
                    >
                      View GPS Details
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#0f2b45]">Neighborhood (optional)</span>
                    <input
                      type="text"
                      name="neighborhood"
                      value={trackForm.neighborhood}
                      onChange={handleTrackFieldChange}
                      placeholder="Enter neighborhood"
                      className="w-full rounded-xl border border-[#0f2b45]/15 bg-white px-4 py-3 text-sm text-[#0f2b45] focus:outline-none focus:ring-2 focus:ring-[#1f5f7a]/35"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#0f2b45]">City (optional)</span>
                    <input
                      type="text"
                      name="city"
                      value={trackForm.city}
                      onChange={handleTrackFieldChange}
                      placeholder="Enter city"
                      className="w-full rounded-xl border border-[#0f2b45]/15 bg-white px-4 py-3 text-sm text-[#0f2b45] focus:outline-none focus:ring-2 focus:ring-[#1f5f7a]/35"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#0f2b45]">Nearby Cross Streets (optional)</span>
                  <input
                    type="text"
                    name="crossStreets"
                    value={trackForm.crossStreets}
                    onChange={handleTrackFieldChange}
                    placeholder="Enter nearby cross streets"
                    className="w-full rounded-xl border border-[#0f2b45]/15 bg-white px-4 py-3 text-sm text-[#0f2b45] focus:outline-none focus:ring-2 focus:ring-[#1f5f7a]/35"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#0f2b45]">Short Location Description (optional)</span>
                  <textarea
                    name="locationDescription"
                    value={trackForm.locationDescription}
                    onChange={handleTrackFieldChange}
                    rows="3"
                    placeholder="Describe where you cleaned up"
                    className="w-full rounded-xl border border-[#0f2b45]/15 bg-white px-4 py-3 text-sm text-[#0f2b45] focus:outline-none focus:ring-2 focus:ring-[#1f5f7a]/35"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#0f2b45]">Upload a Map Screenshot or Photo (optional)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMapImageChange}
                    className="w-full rounded-xl border border-[#0f2b45]/15 bg-white px-4 py-3 text-sm text-[#0f2b45] file:mr-4 file:rounded-full file:border-0 file:bg-[#f8c948] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#0f2b45] hover:file:bg-[#f2be2b]"
                  />
                  {trackForm.mapImageName && <p className="mt-2 text-sm text-slate-600">Selected: {trackForm.mapImageName}</p>}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-[#0f2b45]">Litter Notes (Optional)</span>
                  <textarea
                    name="litterNotes"
                    value={trackForm.litterNotes}
                    onChange={handleTrackFieldChange}
                    rows="3"
                    placeholder="Add any notes about what you cleaned up"
                    className="w-full rounded-xl border border-[#0f2b45]/15 bg-white px-4 py-3 text-sm text-[#0f2b45] focus:outline-none focus:ring-2 focus:ring-[#1f5f7a]/35"
                  />
                </label>

                {locationError && (
                  <p className="rounded-xl border border-[#bc3d2f]/25 bg-[#fff3f0] px-4 py-3 text-sm font-medium text-[#8f2f24]">
                    {locationError}
                  </p>
                )}

                {submitMessage && (
                  isSubmissionSuccess ? (
                    <div className="rounded-xl border border-[#1f5f7a]/20 bg-[#eef7fb] px-4 py-3 text-center">
                      <p className="text-lg font-bold text-[#1f5f7a] sm:text-xl">{submitMessage}</p>
                      <p className="mt-1 text-sm font-semibold text-[#62b275] sm:text-base">
                        <span className="mr-2" role="img" aria-label="green heart">
                          💚
                        </span>
                        Thanks for making your city better!
                      </p>
                    </div>
                  ) : (
                    <p className="rounded-xl border border-[#1f5f7a]/20 bg-[#eef7fb] px-4 py-3 text-sm font-medium text-[#1f5f7a]">
                      {submitMessage}
                    </p>
                  )
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-[#0f2b45]/10 pt-4 sm:flex-row sm:justify-end">
                  <button type="button" onClick={closeTrackModal} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#0f2b45]/20 px-5 py-2 text-sm font-semibold text-[#0f2b45] transition hover:bg-[#f2f7fa]">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary min-h-11 px-6 py-2 text-sm">
                    Submit
                  </button>
                </div>
              </form>

              {isGpsDetailsOpen && gpsLocation && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0f2b45]/35 p-4">
                  <div className="w-full max-w-sm rounded-2xl border border-[#1f5f7a]/20 bg-[#eef7fb] p-4 shadow-[0_18px_40px_rgba(15,43,69,0.2)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#0f2b45]">GPS Details</p>
                        <p className="mt-2 text-sm text-slate-600">Latitude: {gpsLocation.latitude.toFixed(6)}</p>
                        <p className="text-sm text-slate-600">Longitude: {gpsLocation.longitude.toFixed(6)}</p>
                        <p className="text-sm text-slate-600">Accuracy: {Math.round(gpsLocation.accuracy)} meters</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsGpsDetailsOpen(false)}
                        className="text-sm font-semibold text-[#1f5f7a] underline underline-offset-2"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
