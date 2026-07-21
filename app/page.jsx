"use client";

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Logo from '@/components/Logo';
import dynamic from 'next/dynamic';

const CommunityFootprintsMap = dynamic(() => import('@/components/CommunityFootprintsMap'), {
  ssr: false,
});

const TrackLocationPickerMap = dynamic(() => import('@/components/TrackLocationPickerMap'), {
  ssr: false,
});

const TRACK_SUBMISSIONS_KEY = 'pick-it-up-track-submissions';
const SEATTLE_BOUNDS = {
  minLat: 47.49,
  maxLat: 47.74,
  minLon: -122.44,
  maxLon: -122.22,
};

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
  const [isTrackCelebrationVisible, setIsTrackCelebrationVisible] = useState(false);
  const [isSubmittingTrackEntry, setIsSubmittingTrackEntry] = useState(false);
  const [shouldScrollToFootprints, setShouldScrollToFootprints] = useState(false);
  const [shouldAnimateNewFootprint, setShouldAnimateNewFootprint] = useState(false);
  const [hasNewFootprintMarker, setHasNewFootprintMarker] = useState(false);
  const [isMarkerDropping, setIsMarkerDropping] = useState(false);
  const [isRippleActive, setIsRippleActive] = useState(false);
  const [isMapCardAnimating, setIsMapCardAnimating] = useState(false);
  const [mapZoomPhase, setMapZoomPhase] = useState('idle');
  const [newFootprintLatLng, setNewFootprintLatLng] = useState([47.6062, -122.3321]);
  const [nearbyExistingFootprints, setNearbyExistingFootprints] = useState([]);
  const [showExpandedMapPreview, setShowExpandedMapPreview] = useState(false);
  const [runFootprintSequence, setRunFootprintSequence] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [resolvedTrackLatLng, setResolvedTrackLatLng] = useState(null);
  const [pendingReviewLatLng, setPendingReviewLatLng] = useState(null);
  const [locationReviewMessage, setLocationReviewMessage] = useState('');

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
    if (name === 'neighborhood' || name === 'city' || name === 'crossStreets' || name === 'locationDescription') {
      setResolvedTrackLatLng(null);
      setPendingReviewLatLng(null);
      setLocationReviewMessage('');
    }
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

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const isWithinSeattleBounds = (latitude, longitude) => {
    return (
      latitude >= SEATTLE_BOUNDS.minLat &&
      latitude <= SEATTLE_BOUNDS.maxLat &&
      longitude >= SEATTLE_BOUNDS.minLon &&
      longitude <= SEATTLE_BOUNDS.maxLon
    );
  };

  const buildGeocodeQuery = (entry) => {
    const neighborhood = entry?.neighborhood?.trim() || '';
    const city = entry?.city?.trim() || '';
    const crossStreets = entry?.crossStreets?.trim() || '';
    const locationDescription = entry?.locationDescription?.trim() || '';
    const queryParts = [];

    if (crossStreets) {
      queryParts.push(crossStreets);
    }

    if (neighborhood) {
      queryParts.push(neighborhood);
    }

    if (city) {
      queryParts.push(city);
    } else {
      queryParts.push('Seattle');
    }

    if (locationDescription) {
      queryParts.push(locationDescription);
    }

    queryParts.push('Washington');

    return queryParts.filter(Boolean).join(', ');
  };

  const isWaterLikeResult = (reverseData) => {
    if (!reverseData) {
      return false;
    }

    const classification = `${reverseData.class || ''} ${reverseData.type || ''}`.toLowerCase();
    const label = `${reverseData.display_name || ''}`.toLowerCase();

    return (
      classification.includes('natural water') ||
      classification.includes('waterway') ||
      /(lake|bay|sound|water|reservoir|strait|canal)/.test(label)
    );
  };

  const hashString = (value) => {
    let hash = 0;

    for (let index = 0; index < value.length; index += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(index);
      hash |= 0;
    }

    return Math.abs(hash);
  };

  const getFootprintLatLng = (entry) => {
    if (Array.isArray(entry?.resolvedLatLng) && entry.resolvedLatLng.length === 2) {
      return [entry.resolvedLatLng[0], entry.resolvedLatLng[1]];
    }

    if (entry?.gpsLocation) {
      return [
        clamp(entry.gpsLocation.latitude, SEATTLE_BOUNDS.minLat, SEATTLE_BOUNDS.maxLat),
        clamp(entry.gpsLocation.longitude, SEATTLE_BOUNDS.minLon, SEATTLE_BOUNDS.maxLon),
      ];
    }

    const fallbackText = [
      entry?.neighborhood || '',
      entry?.city || '',
      entry?.crossStreets || '',
      entry?.locationDescription || '',
    ]
      .join('|')
      .trim();

    const seed = fallbackText ? hashString(fallbackText) : Date.now();
    const latRatio = ((seed % 1000) + 1) / 1001;
    const lonRatio = ((Math.floor(seed / 1000) % 1000) + 1) / 1001;

    return [
      SEATTLE_BOUNDS.minLat + latRatio * (SEATTLE_BOUNDS.maxLat - SEATTLE_BOUNDS.minLat),
      SEATTLE_BOUNDS.minLon + lonRatio * (SEATTLE_BOUNDS.maxLon - SEATTLE_BOUNDS.minLon),
    ];
  };

  const milesBetween = (firstLatLng, secondLatLng) => {
    if (!firstLatLng || !secondLatLng) {
      return Number.POSITIVE_INFINITY;
    }

    const [firstLat, firstLon] = firstLatLng;
    const [secondLat, secondLon] = secondLatLng;
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const earthRadiusMiles = 3958.8;
    const dLat = toRadians(secondLat - firstLat);
    const dLon = toRadians(secondLon - firstLon);
    const originLat = toRadians(firstLat);
    const targetLat = toRadians(secondLat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(originLat) * Math.cos(targetLat) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusMiles * c;
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
      setResolvedTrackLatLng(null);
      setPendingReviewLatLng(null);
      setLocationReviewMessage('');

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
      setResolvedTrackLatLng(null);
      setPendingReviewLatLng(null);
      setLocationReviewMessage('');
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

  const reverseLookup = async (latitude, longitude) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=18`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  };

  const resolveTrackLocation = async (entry) => {
    if (entry?.gpsLocation) {
      const gpsLat = entry.gpsLocation.latitude;
      const gpsLon = entry.gpsLocation.longitude;
      const reverseData = await reverseLookup(gpsLat, gpsLon);

      return {
        latLng: [gpsLat, gpsLon],
        source: 'gps',
        needsReview: !isWithinSeattleBounds(gpsLat, gpsLon) || isWaterLikeResult(reverseData),
      };
    }

    const query = buildGeocodeQuery(entry);

    if (!query.trim()) {
      return null;
    }

    const boundedUrl =
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&bounded=1&viewbox=` +
      `${SEATTLE_BOUNDS.minLon},${SEATTLE_BOUNDS.maxLat},${SEATTLE_BOUNDS.maxLon},${SEATTLE_BOUNDS.minLat}&q=${encodeURIComponent(query)}`;

    let response = await fetch(boundedUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    let results = response.ok ? await response.json() : [];

    if (!results.length) {
      response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&q=${encodeURIComponent(query)}`, {
        headers: {
          Accept: 'application/json',
        },
      });

      results = response.ok ? await response.json() : [];
    }

    if (!results.length) {
      return null;
    }

    const topResult = results[0];
    const latitude = Number.parseFloat(topResult.lat);
    const longitude = Number.parseFloat(topResult.lon);
    const reverseData = await reverseLookup(latitude, longitude);

    return {
      latLng: [latitude, longitude],
      source: 'typed',
      needsReview: !isWithinSeattleBounds(latitude, longitude) || isWaterLikeResult(reverseData),
    };
  };

  const handleFindTrackLocation = async () => {
    if (isResolvingLocation) {
      return;
    }

    if (!hasLocationInput()) {
      setLocationError('Add a location first, then tap Find Location on Map.');
      return;
    }

    setIsResolvingLocation(true);
    setLocationError('');
    setSubmitMessage('');
    setLocationReviewMessage('');

    try {
      const resolution = await resolveTrackLocation({
        ...trackForm,
        gpsLocation,
      });

      if (!resolution?.latLng) {
        setResolvedTrackLatLng(null);
        setPendingReviewLatLng(null);
        setLocationError('We could not find that location yet. Add more detail like neighborhood, city, and nearby cross streets.');
        return;
      }

      if (resolution.needsReview) {
        setResolvedTrackLatLng(null);
        setPendingReviewLatLng(resolution.latLng);
        setLocationReviewMessage('This location may be outside Seattle or in water. Confirm it or adjust your details before submitting.');
        return;
      }

      setPendingReviewLatLng(null);
      setLocationReviewMessage('');
      setResolvedTrackLatLng(resolution.latLng);
    } catch {
      setResolvedTrackLatLng(null);
      setPendingReviewLatLng(null);
      setLocationError('Location lookup is temporarily unavailable. Please try again.');
    } finally {
      setIsResolvingLocation(false);
    }
  };

  const confirmPendingTrackLocation = () => {
    if (!pendingReviewLatLng) {
      return;
    }

    setResolvedTrackLatLng(pendingReviewLatLng);
    setPendingReviewLatLng(null);
    setLocationReviewMessage('');
    setLocationError('');
  };

  const closeTrackModal = () => {
    setIsTrackModalOpen(false);
    setIsGpsDetailsOpen(false);
    setLocationError('');
    setSubmitMessage('');
    setIsSubmissionSuccess(false);
    setIsTrackCelebrationVisible(false);
    setIsSubmittingTrackEntry(false);
    setIsResolvingLocation(false);
    setResolvedTrackLatLng(null);
    setPendingReviewLatLng(null);
    setLocationReviewMessage('');
  };

  const handleTrackSubmit = (event) => {
    event.preventDefault();

    if (isSubmittingTrackEntry) {
      return;
    }

    if (!hasLocationInput()) {
      setLocationError('Please add at least one location method before submitting.');
      return;
    }

    if (!resolvedTrackLatLng) {
      setLocationError('Find your location on the map and adjust the footprint before submitting.');
      return;
    }

    setIsSubmittingTrackEntry(true);

    const entry = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      ...trackForm,
      gpsLocation,
      resolvedLatLng: resolvedTrackLatLng,
    };

    try {
      const currentEntries = JSON.parse(localStorage.getItem(TRACK_SUBMISSIONS_KEY) || '[]');
      currentEntries.push(entry);
      localStorage.setItem(TRACK_SUBMISSIONS_KEY, JSON.stringify(currentEntries));
      const submittedLatLng = [resolvedTrackLatLng[0], resolvedTrackLatLng[1]];
      const existingNearbyLatLngs = currentEntries
        .filter((savedEntry) => savedEntry?.id !== entry.id)
        .map((savedEntry) => getFootprintLatLng(savedEntry))
        .filter((latLng) => milesBetween(submittedLatLng, latLng) <= 10);

      setNewFootprintLatLng(submittedLatLng);
      setNearbyExistingFootprints(existingNearbyLatLngs);
      setShowExpandedMapPreview(false);
      setSubmitMessage('Cleanup Recorded!');
      setIsSubmissionSuccess(true);
      setIsTrackCelebrationVisible(true);
      setShouldScrollToFootprints(false);
      setShouldAnimateNewFootprint(true);
      setHasNewFootprintMarker(false);
      setIsMarkerDropping(false);
      setIsRippleActive(false);
      setIsMapCardAnimating(false);
      setMapZoomPhase('idle');
      setRunFootprintSequence(false);
      setTrackForm(EMPTY_TRACK_FORM);
      setGpsLocation(null);
      setGpsStatus('');
      setGpsFriendlyLocation('');
      setIsGpsLoading(false);
      setResolvedTrackLatLng(null);
      setPendingReviewLatLng(null);
      setLocationReviewMessage('');
      setLocationError('');
      setIsGpsDetailsOpen(false);
      setIsTrackModalOpen(false);
    } catch {
      setSubmitMessage('Submission saved for this session, but persistent storage is unavailable.');
      setIsSubmissionSuccess(false);
    } finally {
      setIsSubmittingTrackEntry(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreferenceChange = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    setPrefersReducedMotion(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionPreferenceChange);
      return () => {
        mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
      };
    }

    mediaQuery.addListener(handleMotionPreferenceChange);
    return () => {
      mediaQuery.removeListener(handleMotionPreferenceChange);
    };
  }, []);

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
    if (!isTrackCelebrationVisible) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isTrackCelebrationVisible]);

  useEffect(() => {
    if (!isTrackCelebrationVisible || !isSubmissionSuccess) {
      return;
    }

    const celebrationTimer = window.setTimeout(() => {
      setIsTrackCelebrationVisible(false);
      setIsSubmissionSuccess(false);
      setSubmitMessage('');
      setShouldScrollToFootprints(true);
    }, 3000);

    return () => {
      window.clearTimeout(celebrationTimer);
    };
  }, [isTrackCelebrationVisible, isSubmissionSuccess]);

  useEffect(() => {
    if (!isTrackModalOpen || !isSubmissionSuccess || !submitMessage) {
      return;
    }

    const closeTimer = window.setTimeout(() => {
      closeTrackModal();
    }, 3000);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [isTrackModalOpen, isSubmissionSuccess, submitMessage]);

  useEffect(() => {
    if (isTrackModalOpen || !shouldScrollToFootprints) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      const footprintsSection = document.getElementById('community-footprints');

      if (footprintsSection) {
        footprintsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      if (shouldAnimateNewFootprint) {
        setRunFootprintSequence(true);
      }

      setShouldScrollToFootprints(false);
    }, 0);

    return () => {
      window.clearTimeout(scrollTimer);
    };
  }, [isTrackModalOpen, shouldScrollToFootprints, shouldAnimateNewFootprint]);

  useEffect(() => {
    if (!runFootprintSequence || isTrackModalOpen) {
      return;
    }

    if (prefersReducedMotion) {
      setHasNewFootprintMarker(false);
      setIsMarkerDropping(false);
      setIsRippleActive(false);
      setShowExpandedMapPreview(true);
      setIsMapCardAnimating(true);
      setMapZoomPhase('focus');

      const reduceMotionMarkerTimer = window.setTimeout(() => {
        setHasNewFootprintMarker(true);
      }, 650);

      const reduceMotionReturnTimer = window.setTimeout(() => {
        setMapZoomPhase('return');
      }, 1700);

      const reduceMotionFinishTimer = window.setTimeout(() => {
        setShowExpandedMapPreview(false);
        setIsMapCardAnimating(false);
        setIsMarkerDropping(false);
        setMapZoomPhase('idle');
        setShouldAnimateNewFootprint(false);
        setRunFootprintSequence(false);
      }, 2500);

      return () => {
        window.clearTimeout(reduceMotionMarkerTimer);
        window.clearTimeout(reduceMotionReturnTimer);
        window.clearTimeout(reduceMotionFinishTimer);
      };
    }

    let expandTimer;
    let markerShowTimer;
    let markerDropEndTimer;
    let returnTimer;
    let finishTimer;

    setHasNewFootprintMarker(false);
    setIsMarkerDropping(false);
    setIsRippleActive(false);

    expandTimer = window.setTimeout(() => {
      setShowExpandedMapPreview(true);
      setIsMapCardAnimating(true);
      setMapZoomPhase('focus');
    }, 140);

    markerShowTimer = window.setTimeout(() => {
      setHasNewFootprintMarker(true);
      setIsMarkerDropping(true);
    }, 1400);

    markerDropEndTimer = window.setTimeout(() => {
      setIsMarkerDropping(false);
    }, 2260);

    returnTimer = window.setTimeout(() => {
      setMapZoomPhase('return');
    }, 2800);

    finishTimer = window.setTimeout(() => {
      setShowExpandedMapPreview(false);
      setIsMapCardAnimating(false);
      setIsMarkerDropping(false);
      setMapZoomPhase('idle');
      setShouldAnimateNewFootprint(false);
      setRunFootprintSequence(false);
    }, 3800);

    return () => {
      if (expandTimer) {
        window.clearTimeout(expandTimer);
      }
      if (markerShowTimer) {
        window.clearTimeout(markerShowTimer);
      }
      if (markerDropEndTimer) {
        window.clearTimeout(markerDropEndTimer);
      }
      if (returnTimer) {
        window.clearTimeout(returnTimer);
      }
      if (finishTimer) {
        window.clearTimeout(finishTimer);
      }
    };
  }, [runFootprintSequence, isTrackModalOpen, prefersReducedMotion]);

  return (
    <>
      <Header />

      {isTrackCelebrationVisible && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#fffdf7]/96 px-6 text-center backdrop-blur-[2px]">
          <div className="flex w-full max-w-xl flex-col items-center rounded-[2rem] border border-[#002b49]/10 bg-white/90 px-6 py-10 shadow-[0_24px_70px_rgba(0,43,73,0.16)] sm:px-10 sm:py-12">
            <p className="text-3xl font-bold tracking-tight text-[#002b49] sm:text-4xl">Clean Up Recorded!</p>
            <p className="mt-3 text-base font-semibold text-[#2c7a3f] sm:text-lg">
              <span className="mr-2" role="img" aria-label="green heart">
                💚
              </span>
              Thanks for making our city better!
            </p>
          </div>
        </div>
      )}

      <main className="bg-[#fdf7e8] text-[#002244]">
        <section className="relative overflow-hidden border-b border-[#0f9aa1]/30 bg-[linear-gradient(135deg,_#fdf7e8_0%,_#d3f1f4_38%,_#d7f0c7_100%)] pb-8 pt-5 sm:pb-10 sm:pt-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_15%_0%,rgba(229,111,90,0.22),transparent_38%),radial-gradient(circle_at_88%_0%,rgba(15,154,161,0.2),transparent_42%)]" aria-hidden="true" />

          <div className="relative">
            <svg
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-14 w-full text-[#fdf7e8]/95 sm:h-20"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M0,80L60,74.7C120,69,240,59,360,53.3C480,48,600,48,720,58.7C840,69,960,91,1080,96C1200,101,1320,91,1380,85.3L1440,80L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
              />
            </svg>

            <div className="relative min-h-[25rem] sm:min-h-[30rem] lg:min-h-[36rem]">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/seattle-skyline-placeholder.svg')", backgroundPosition: 'center 60%' }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,34,68,0.44)_0%,rgba(0,34,68,0.3)_38%,rgba(0,34,68,0.46)_100%)]" aria-hidden="true" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(244,201,76,0.16),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(46,196,199,0.18),transparent_38%)]" aria-hidden="true" />

              <div className="container-custom relative z-20 flex min-h-[25rem] items-center justify-center py-14 text-center sm:min-h-[30rem] sm:py-16 lg:min-h-[36rem] lg:py-20">
                <div className="mx-auto max-w-4xl">
                  <h1 className="text-6xl font-semibold tracking-tight text-[#fff9ea] [text-shadow:0_6px_20px_rgba(0,34,68,0.55)] sm:text-7xl lg:text-8xl">
                    Imagine...
                  </h1>
                  <p className="mx-auto mt-5 max-w-3xl text-xl leading-relaxed text-[#fff7ea] [text-shadow:0_4px_16px_rgba(0,34,68,0.5)] sm:text-2xl lg:text-[1.85rem]">
                    A city where every person leaves every place a little better than they found it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="day-one" className="bg-[linear-gradient(180deg,_#fff6e4_0%,_#fff9ee_100%)] py-20 sm:py-24 lg:py-28">
          <div className="container-custom mx-auto">
            <div className="mx-auto w-full text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#157a9a]">
                DAY ONE
              </p>

              <div className="mt-9 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:gap-10">
                <div className="flex min-h-[23rem] flex-col justify-between rounded-[2rem] border border-[#f4c94c]/45 bg-[linear-gradient(180deg,_#fffef9_0%,_#fff1cd_100%)] p-6 shadow-[0_20px_44px_rgba(244,166,42,0.13)] sm:min-h-[28rem] sm:p-7 lg:min-h-[34rem] lg:p-9">
                  <div className="flex items-center justify-center rounded-[1.5rem] border-2 border-dashed border-[#d3b56a] bg-white/75 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#7b6630] sm:text-base">
                    Before
                  </div>
                  <div className="mt-5 flex flex-1 items-center justify-center rounded-[1.5rem] border border-[#f4c94c]/35 bg-[radial-gradient(circle_at_top,_rgba(248,201,72,0.24),_transparent_55%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(255,248,230,0.97))] text-center">
                    <span className="text-3xl font-semibold tracking-[0.25em] text-[#8b7350] sm:text-4xl lg:text-5xl">
                      BEFORE
                    </span>
                  </div>
                </div>

                <div className="flex min-h-[23rem] flex-col justify-between rounded-[2rem] border border-[#69BE28]/35 bg-[linear-gradient(180deg,_#fffef9_0%,_#e8f5e1_100%)] p-6 shadow-[0_20px_44px_rgba(105,190,40,0.13)] sm:min-h-[28rem] sm:p-7 lg:min-h-[34rem] lg:p-9">
                  <div className="flex items-center justify-center rounded-[1.5rem] border-2 border-dashed border-[#8bc66f] bg-white/75 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#447a25] sm:text-base">
                    After
                  </div>
                  <div className="mt-5 flex flex-1 items-center justify-center rounded-[1.5rem] border border-[#69BE28]/30 bg-[radial-gradient(circle_at_top,_rgba(46,196,199,0.16),_transparent_55%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(235,250,242,0.95))] text-center">
                    <span className="text-3xl font-semibold tracking-[0.25em] text-[#50834f] sm:text-4xl lg:text-5xl">
                      AFTER
                    </span>
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
                <p className="text-2xl leading-relaxed font-medium text-[#002b49] sm:text-3xl lg:text-[2.1rem]">
                  One person started picking up litter. Another person noticed and joined in. Four bags later, the block looked better... and the movement had begun.
                </p>
                <p className="mt-6 text-lg font-semibold text-[#1f5f7a] sm:text-xl lg:text-2xl">
                  We are just getting started.
                </p>
              </div>

              <div className="mx-auto mt-12 w-full">
                <h3 className="text-2xl font-bold text-[#002b49] sm:text-3xl lg:text-4xl">
                  Community in Action Photos!
                </h3>
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                  <div className="aspect-square rounded-[1.4rem] border border-[#0f9aa1]/28 bg-[linear-gradient(145deg,_#fffef8_0%,_#e8f5fb_100%)] shadow-[0_12px_28px_rgba(0,43,73,0.1)]" aria-label="Community photo placeholder" />
                  <div className="aspect-square rounded-[1.4rem] border border-[#69BE28]/28 bg-[linear-gradient(145deg,_#fffef8_0%,_#edf8e3_100%)] shadow-[0_12px_28px_rgba(0,43,73,0.1)]" aria-label="Community photo placeholder" />
                  <div className="aspect-square rounded-[1.4rem] border border-[#E56F5A]/28 bg-[linear-gradient(145deg,_#fffef8_0%,_#fde8e4_100%)] shadow-[0_12px_28px_rgba(0,43,73,0.1)]" aria-label="Community photo placeholder" />
                  <div className="aspect-square rounded-[1.4rem] border border-[#2ec4c7]/28 bg-[linear-gradient(145deg,_#fffef8_0%,_#e8f8f7_100%)] shadow-[0_12px_28px_rgba(0,43,73,0.1)]" aria-label="Community photo placeholder" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#0f9aa1]/45 bg-[linear-gradient(122deg,_#1aa1ab_0%,_#58c92e_50%,_#f0ab2f_100%)] py-14 text-[#002244] sm:py-16">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Every small act helps shape a brighter Seattle.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-[#fef9ee] lg:text-xl">
              Join the movement, share kindness, and help our city shine.
            </p>
            <div className="homepage-featured-gallery-row mx-auto mt-10 grid w-full gap-6 text-left md:grid-cols-2 md:gap-7 lg:gap-8">
              <Link
                href="/thank-yous"
                className="homepage-featured-gallery-card group relative min-h-[14.5rem] rounded-[1.5rem] border border-[#0f9aa1]/45 bg-white p-1.5 text-[#fffef8] shadow-[0_12px_24px_rgba(0,43,73,0.11)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,43,73,0.15)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0f9aa1]/24 sm:min-h-[16.5rem]"
              >
                <div className="relative h-full min-h-[calc(14.5rem-0.5rem)] overflow-hidden rounded-[1.2rem] border border-white/80 sm:min-h-[calc(16.5rem-0.5rem)]">
                  <div className="absolute inset-0 bg-[linear-gradient(116deg,_#0f9aa1_0%,_#2ec4c7_42%,_#69be28_100%)]" aria-hidden="true">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_18%_16%,_rgba(255,255,255,0.32),_transparent_37%),radial-gradient(circle_at_79%_22%,_rgba(255,255,255,0.2),_transparent_34%),linear-gradient(132deg,_rgba(1,68,84,0.06)_0%,_rgba(3,84,109,0.16)_100%)]" />
                  </div>
                  <div className="absolute right-4 top-4 max-w-[17.5rem] rounded-xl border border-white/45 bg-white/24 px-3 py-2 text-xs font-medium leading-relaxed text-[#002b49] sm:text-[13px]">
                    THANK YOU to Mario (pictured here) for donating the grabber today. It made picking up litter on the beach so much more fun! -Tricia.
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,_rgba(0,27,38,0.44)_100%)]" aria-hidden="true" />
                  <div className="relative z-10 flex min-h-[calc(14.5rem-0.5rem)] flex-col justify-end p-5 sm:min-h-[calc(16.5rem-0.5rem)] sm:p-6">
                    <h3 className="text-2xl font-bold leading-tight sm:text-3xl">Thank Yous</h3>
                    <p className="mt-3 max-w-md text-base text-[#fef9ee] sm:text-lg">
                      Read community gratitude notes and photo thank-you moments that celebrate local impact.
                    </p>
                    <span className="mt-6 inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-[#b9fff2]">
                      Explore Gallery →
                    </span>
                  </div>
                </div>
              </Link>

              <Link
                href="/volunteer-memorable-photos"
                className="homepage-featured-gallery-card group relative min-h-[14.5rem] rounded-[1.5rem] border border-[#f4c94c]/52 bg-white p-1.5 text-[#fffef8] shadow-[0_12px_24px_rgba(0,43,73,0.11)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,43,73,0.15)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4c94c]/25 sm:min-h-[16.5rem]"
              >
                <div className="relative h-full min-h-[calc(14.5rem-0.5rem)] overflow-hidden rounded-[1.2rem] border border-white/80 sm:min-h-[calc(16.5rem-0.5rem)]">
                  <div className="absolute inset-0 bg-[linear-gradient(145deg,_#fff6ce_0%,_#f2d46f_46%,_#ddb23a_100%)]" aria-hidden="true">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_20%_16%,_rgba(255,255,255,0.34),_transparent_37%),radial-gradient(circle_at_82%_22%,_rgba(255,255,255,0.24),_transparent_32%),linear-gradient(128deg,_rgba(173,136,22,0.04)_0%,_rgba(173,136,22,0.16)_100%)]" />
                  </div>
                  <div className="absolute right-4 top-4 max-w-[17.5rem] rounded-xl border border-white/45 bg-white/24 px-3 py-2 text-xs font-medium leading-relaxed text-[#002b49] sm:text-[13px]">
                    "Gorgeous tree on my walk today. Photographed in black & White. -Chris"
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,_rgba(38,33,8,0.35)_100%)]" aria-hidden="true" />
                  <div className="relative z-10 flex min-h-[calc(14.5rem-0.5rem)] flex-col justify-end p-5 sm:min-h-[calc(16.5rem-0.5rem)] sm:p-6">
                    <h3 className="text-2xl font-bold leading-tight sm:text-3xl">Volunteer Memorable Photos</h3>
                    <p className="mt-3 max-w-md text-base text-[#fef9ee] sm:text-lg">
                      Browse snapshots from cleanup days with optional notes from volunteers across Seattle.
                    </p>
                    <span className="mt-6 inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-[#ffe8b6]">
                      Explore Gallery →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[linear-gradient(180deg,_#ffe4af_0%,_#d7f3d4_52%,_#baeaf1_100%)] py-16 sm:py-20">
          <div className="container-custom mx-auto">
            <div className="mx-auto max-w-7xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f5f7a]">
                How It Works
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#002b49] sm:text-4xl lg:text-5xl">
                Three simple steps to keep Seattle cleaner.
              </h2>
              <p className="mx-auto mt-4 max-w-5xl text-lg text-slate-600 lg:text-xl">
                Pick it up wherever you are, add the location, and share your before and after photos with the community.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
              <div className="paint-card border-[#E56F5A]/35 p-7 text-center lg:p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E56F5A]/18 text-3xl text-[#E56F5A]">
                  🖐️
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#002b49] lg:text-2xl">
                  Pick It Up
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 lg:text-base">
                  Pick up one piece of litter.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTrackModalOpen(true)}
                className="paint-card block w-full border-[#0f9aa1]/35 p-7 text-center transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(0,111,143,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0f9aa1]/26 lg:p-8"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0f9aa1]/18 text-3xl text-[#0f9aa1]">
                  📍
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#002b49] lg:text-2xl">
                  Track It
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 lg:text-base">
                  Log your cleanup with a neighborhood, nearest corners, or an optional map pin. No photo required.
                </p>
                <span className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#0f9aa1] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,154,161,0.24)]">
                  Open Tracker
                </span>
              </button>

              <div className="paint-card border-[#2ec4c7]/35 p-7 text-center lg:p-8">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2ec4c7]/18 text-3xl text-[#2ec4c7]">
                  📸
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#002b49] lg:text-2xl">
                  Share It
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600 lg:text-base">
                  Share your before and after photos.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.4rem] border border-[#E56F5A]/45 bg-[linear-gradient(145deg,_#E56F5A_0%,_#CF5F4C_100%)] px-5 py-5 text-left text-white shadow-[0_14px_34px_rgba(229,111,90,0.28)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Photo Placeholder</p>
                <p className="mt-2 text-lg font-semibold">Volunteer Street Cleanup Photo</p>
              </div>
              <div className="rounded-[1.4rem] border border-[#0f9aa1]/45 bg-[linear-gradient(145deg,_#0f9aa1_0%,_#0a5065_100%)] px-5 py-5 text-left text-white shadow-[0_14px_34px_rgba(15,154,161,0.28)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">Photo Placeholder</p>
                <p className="mt-2 text-lg font-semibold">Neighborhood Cleanup Before/After Photo</p>
              </div>
            </div>
          </div>
        </section>

        <section id="impact" className="impact-section pb-8 pt-10 sm:pt-12 lg:pb-20">
          <div className="container-custom mx-auto">
            <div className="impact-banner text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#fff9ea]">
                Impact
              </p>
              <h2 className="mt-3 flex items-center justify-center gap-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                <span>What we've done so far</span>
                <img
                  src="/green-footprints-marker.png"
                  alt=""
                  aria-hidden="true"
                  className="impact-heading-icon h-10 w-auto sm:h-11 lg:h-12"
                />
              </h2>
              <p className="mx-auto mt-4 max-w-4xl text-lg text-[#fff9ea] lg:text-xl">
                Every footprint helps spread pride across our neighborhoods
              </p>
            </div>

            <div className="relative mt-8 grid w-full grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
                <div className="impact-counter impact-counter-bags w-full rounded-[1.25rem] border border-[#002b49]/10 bg-white px-4 py-3 text-center shadow-[0_15px_35px_rgba(0,43,73,0.08)]">
                  <p className="text-3xl font-black text-[#002b49] lg:text-4xl">0</p>
                  <p className="mt-1 text-sm font-semibold text-[#1f5f7a] lg:text-base">Bags of Trash</p>
                </div>

                <div className="impact-counter impact-counter-neighborhoods w-full rounded-[1.25rem] border border-[#002b49]/10 bg-white px-4 py-3 text-center shadow-[0_15px_35px_rgba(0,43,73,0.08)]">
                  <p className="text-3xl font-black text-[#002b49] lg:text-4xl">0</p>
                  <p className="mt-1 text-sm font-semibold text-[#1f5f7a] lg:text-base">Neighborhoods Reached</p>
                </div>

                <div className="rounded-[1.2rem] border border-[#0f9aa1]/35 bg-[linear-gradient(145deg,_#0f9aa1_0%,_#0b5f78_100%)] px-4 py-4 text-left text-white shadow-[0_14px_28px_rgba(15,154,161,0.3)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">Photo Placeholder</p>
                  <p className="mt-2 text-sm font-semibold">Community Cleanup Snapshot</p>
                </div>
              </div>

              <div id="community-footprints" className="impact-map-card w-full rounded-[2rem] border border-[#002b49]/10 bg-white p-3 shadow-[0_15px_35px_rgba(0,43,73,0.08)] sm:p-4 lg:col-span-9 lg:p-5">
                <CommunityFootprintsMap
                  footprintLatLng={newFootprintLatLng}
                  existingFootprintLatLngs={nearbyExistingFootprints}
                  showExistingFootprints={showExpandedMapPreview}
                  hasNewFootprintMarker={hasNewFootprintMarker}
                  isMarkerDropping={isMarkerDropping}
                  isRippleActive={isRippleActive}
                  isMapCardAnimating={isMapCardAnimating}
                  mapZoomPhase={mapZoomPhase}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </div>

              <div className="rounded-[1.2rem] border border-[#E56F5A]/45 bg-[linear-gradient(145deg,_#E56F5A_0%,_#CF5F4C_100%)] px-4 py-4 text-left text-white shadow-[0_14px_30px_rgba(229,111,90,0.32)] lg:absolute lg:-bottom-8 lg:right-6 lg:w-[17rem] lg:rotate-[-3deg]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">Photo Placeholder</p>
                <p className="mt-2 text-sm font-semibold">Volunteer Group Celebration Photo</p>
              </div>
            </div>

            <style jsx global>{`
              #impact {
                background: radial-gradient(circle at 10% 20%, rgba(46, 196, 199, 0.4) 0%, rgba(46, 196, 199, 0) 46%),
                  radial-gradient(circle at 88% 72%, rgba(229, 111, 90, 0.34) 0%, rgba(229, 111, 90, 0) 44%),
                  linear-gradient(180deg, #ffd785 0%, #c9eef4 100%);
              }

              #impact .impact-banner {
                position: relative;
                overflow: hidden;
                border-radius: 1.6rem;
                border: 1px solid rgba(0, 43, 73, 0.24);
                background: linear-gradient(116deg, #0f9aa1 0%, #2ec4c7 42%, #69be28 100%);
                padding: 1rem 1.1rem 1.2rem;
                box-shadow: 0 16px 36px rgba(0, 111, 143, 0.24);
              }

              #impact .impact-banner::before {
                content: '';
                position: absolute;
                inset: 0;
                background: repeating-linear-gradient(
                  -12deg,
                  rgba(255, 249, 234, 0.14) 0,
                  rgba(255, 249, 234, 0.14) 2px,
                  transparent 2px,
                  transparent 16px
                );
                opacity: 0.2;
                pointer-events: none;
              }

              #impact .impact-heading-icon {
                filter: brightness(0) saturate(100%) invert(97%) sepia(24%) saturate(375%) hue-rotate(316deg) brightness(105%) contrast(104%);
                filter: drop-shadow(0 1px 2px rgba(0, 34, 68, 0.35)) brightness(0) saturate(100%) invert(97%) sepia(24%) saturate(375%) hue-rotate(316deg)
                  brightness(105%) contrast(104%);
              }

              #impact .impact-counter {
                position: relative;
                overflow: hidden;
                background: linear-gradient(180deg, #ffffff 0%, #fffaf0 100%);
                box-shadow: 0 12px 28px rgba(0, 34, 68, 0.12);
              }

              #impact .impact-counter::before {
                content: '';
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                height: 0.34rem;
              }

              #impact .impact-counter::after {
                content: '';
                position: absolute;
                right: 0.65rem;
                top: 0.65rem;
                width: 0.62rem;
                height: 0.62rem;
                border-radius: 999px;
                opacity: 0.85;
              }

              #impact .impact-counter-bags::before,
              #impact .impact-counter-bags::after {
                background: #159b9b;
              }

              #impact .impact-counter-litter::before,
              #impact .impact-counter-litter::after {
                background: #2ec4c7;
              }

              #impact .impact-counter-neighborhoods::before,
              #impact .impact-counter-neighborhoods::after {
                background: #E56F5A;
              }

              #impact .impact-map-card {
                background: linear-gradient(180deg, #fff9eb 0%, #ffe8bc 100%);
                border-color: rgba(15, 154, 161, 0.44);
                box-shadow: 0 18px 34px rgba(46, 196, 199, 0.24);
              }

              #community-footprints .map-stage {
                margin-top: 0;
              }

              #community-footprints .leaflet-container {
                height: 20rem !important;
              }

              @media (min-width: 1024px) {
                .homepage-featured-gallery-row {
                  grid-template-columns: repeat(2, max-content);
                  justify-content: space-between;
                  column-gap: 4.5rem;
                }

                .homepage-featured-gallery-card {
                  width: 39rem;
                }
              }

              @media (min-width: 1024px) {
                #community-footprints .leaflet-container {
                  height: 25rem !important;
                }

                #impact .impact-banner {
                  padding: 1.25rem 1.6rem 1.4rem;
                }
              }
            `}</style>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,_#ffd993_0%,_#fff1cf_100%)] py-12 sm:py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {quickLinks.map((link, index) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-[1.3rem] px-5 py-4 text-center text-lg font-semibold shadow-[0_12px_30px_rgba(0,43,73,0.16)] transition duration-200 hover:-translate-y-1 lg:px-6 lg:py-5 lg:text-xl ${
                    index % 5 === 0
                      ? 'bg-[#0f9aa1] text-white hover:bg-[#0a868d]'
                      : index % 5 === 1
                        ? 'bg-[#61b826] text-[#002244] hover:bg-[#4ca11e]'
                        : index % 5 === 2
                          ? 'bg-[#E56F5A] text-white hover:bg-[#CF5F4C]'
                          : index % 5 === 3
                            ? 'bg-[#1fb8c2] text-white hover:bg-[#0fa5af]'
                            : 'bg-[#f4c94c] text-[#002244] hover:bg-[#e7ba36]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Footer />

        {isTrackModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#002b49]/60 p-3 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="track-it-title">
            <div className="paint-card relative w-full max-w-3xl overflow-hidden rounded-[1.8rem] border border-[#0f9aa1]/26 bg-[#fffdf7] shadow-[0_24px_70px_rgba(0,43,73,0.3)]">
              <div className="flex items-center justify-between border-b border-[#002b49]/10 px-4 py-3 sm:px-6 sm:py-4">
                <h3 id="track-it-title" className="text-xl font-semibold text-[#002b49] sm:text-2xl">
                  Where did you clean up?
                </h3>
                <button
                  type="button"
                  onClick={closeTrackModal}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#002b49]/20 text-xl text-[#002b49] transition hover:bg-[#eef7fb]"
                  aria-label="Close tracker"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleTrackSubmit} aria-busy={isSubmittingTrackEntry} className="max-h-[84vh] space-y-2.5 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                <p className="text-sm leading-5 text-slate-600 sm:text-base">
                  Choose whichever option is easiest. Only one location method is required.
                </p>

                <div className="rounded-xl border border-[#002b49]/15 bg-white px-3 py-2.5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-[#002b49]">Use My Location (GPS)</p>
                    <button type="button" onClick={handleUseGps} disabled={isGpsLoading} className="btn-aqua min-h-11 px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70">
                      Use My Location
                    </button>
                  </div>
                  {gpsStatus && (
                    <div className="mt-2 space-y-1">
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
                      className="mt-2 text-sm font-semibold text-[#1f5f7a] underline underline-offset-2"
                    >
                      View GPS Details
                    </button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#002b49]">Neighborhood (optional)</span>
                    <input
                      type="text"
                      name="neighborhood"
                      value={trackForm.neighborhood}
                      onChange={handleTrackFieldChange}
                      placeholder="Enter neighborhood"
                      className="w-full rounded-xl border border-[#002b49]/15 bg-white px-4 py-2.5 text-base text-[#002b49] placeholder:text-base focus:outline-none focus:ring-2 focus:ring-[#1f5f7a]/35"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#002b49]">City (optional)</span>
                    <input
                      type="text"
                      name="city"
                      value={trackForm.city}
                      onChange={handleTrackFieldChange}
                      placeholder="Enter city"
                      className="w-full rounded-xl border border-[#002b49]/15 bg-white px-4 py-2.5 text-base text-[#002b49] placeholder:text-base focus:outline-none focus:ring-2 focus:ring-[#1f5f7a]/35"
                    />
                  </label>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#002b49]">Nearby Cross Streets (optional)</span>
                    <input
                      type="text"
                      name="crossStreets"
                      value={trackForm.crossStreets}
                      onChange={handleTrackFieldChange}
                      placeholder="Enter nearby cross streets"
                      className="w-full rounded-xl border border-[#002b49]/15 bg-white px-4 py-2.5 text-base text-[#002b49] placeholder:text-base focus:outline-none focus:ring-2 focus:ring-[#1f5f7a]/35"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#002b49]">Short Location Description (optional)</span>
                    <textarea
                      name="locationDescription"
                      value={trackForm.locationDescription}
                      onChange={handleTrackFieldChange}
                      rows="3"
                      placeholder="Describe where you cleaned up"
                      className="w-full rounded-xl border border-[#002b49]/15 bg-white px-4 py-2.5 text-base text-[#002b49] placeholder:text-base focus:outline-none focus:ring-2 focus:ring-[#1f5f7a]/35"
                    />
                  </label>
                </div>

                <div className="rounded-xl border border-[#002b49]/15 bg-white px-3 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-[#002b49]">
                      Find and confirm your cleanup spot on the map
                    </p>
                    <button
                      type="button"
                      onClick={handleFindTrackLocation}
                      disabled={isResolvingLocation}
                      className="btn-secondary min-h-11 px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isResolvingLocation ? 'Finding...' : 'Find Location on Map'}
                    </button>
                  </div>

                  {locationReviewMessage && pendingReviewLatLng && (
                    <div className="mt-2 rounded-xl border border-[#bc7f1a]/30 bg-[#fff8e7] px-3 py-2">
                      <p className="text-sm font-medium text-[#7a5211]">{locationReviewMessage}</p>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={confirmPendingTrackLocation}
                          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#7a5211]/25 bg-white px-4 py-2 text-sm font-semibold text-[#7a5211]"
                        >
                          Confirm and Use This Spot
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPendingReviewLatLng(null);
                            setLocationReviewMessage('');
                          }}
                          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#7a5211]/25 px-4 py-2 text-sm font-semibold text-[#7a5211]"
                        >
                          Adjust Location Details
                        </button>
                      </div>
                    </div>
                  )}

                  {resolvedTrackLatLng && (
                    <div className="mt-3 rounded-xl border border-[#002b49]/10 bg-[#f7fbfd] p-2.5">
                      <p className="px-1 pb-2 text-sm font-medium text-[#1f5f7a]">
                        Drag the footprint to the exact cleanup spot, then submit.
                      </p>
                      <div className="h-56 overflow-hidden rounded-lg border border-[#002b49]/10 sm:h-64">
                        <TrackLocationPickerMap
                          markerLatLng={resolvedTrackLatLng}
                          onMarkerMoved={setResolvedTrackLatLng}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#002b49]">Upload a Map Screenshot or Photo (optional)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMapImageChange}
                      className="w-full rounded-xl border border-[#002b49]/15 bg-white px-4 py-2.5 text-base text-[#002b49] file:mr-4 file:rounded-full file:border-0 file:bg-[#f8c948] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#002b49] hover:file:bg-[#f2be2b]"
                    />
                    {trackForm.mapImageName && <p className="mt-1 text-sm text-slate-600">Selected: {trackForm.mapImageName}</p>}
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-[#002b49]">Litter Notes (Optional)</span>
                    <textarea
                      name="litterNotes"
                      value={trackForm.litterNotes}
                      onChange={handleTrackFieldChange}
                      rows="3"
                      placeholder="Add any notes about what you cleaned up"
                      className="w-full rounded-xl border border-[#002b49]/15 bg-white px-4 py-2.5 text-base text-[#002b49] placeholder:text-base focus:outline-none focus:ring-2 focus:ring-[#1f5f7a]/35"
                    />
                  </label>
                </div>

                {locationError && (
                  <p className="rounded-xl border border-[#bc3d2f]/25 bg-[#fff3f0] px-4 py-2.5 text-sm font-medium text-[#8f2f24]">
                    {locationError}
                  </p>
                )}

                {submitMessage && (
                  isSubmissionSuccess ? (
                    <div className="rounded-xl border border-[#1f5f7a]/20 bg-[#eef7fb] px-4 py-2.5 text-center">
                      <p className="text-lg font-bold text-[#1f5f7a] sm:text-xl">{submitMessage}</p>
                      <p className="mt-1 text-sm font-semibold text-[#62b275] sm:text-base">
                        <span className="mr-2" role="img" aria-label="green heart">
                          💚
                        </span>
                        Thanks for making your city better!
                      </p>
                    </div>
                  ) : (
                    <p className="rounded-xl border border-[#1f5f7a]/20 bg-[#eef7fb] px-4 py-2.5 text-sm font-medium text-[#1f5f7a]">
                      {submitMessage}
                    </p>
                  )
                )}

                <div className="flex flex-col-reverse gap-2 border-t border-[#002b49]/10 pt-3 sm:flex-row sm:justify-end">
                  <button type="button" onClick={closeTrackModal} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#002b49]/20 px-5 py-2 text-sm font-semibold text-[#002b49] transition hover:bg-[#f2f7fa]">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmittingTrackEntry} className="btn-green min-h-11 px-6 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70">
                    Submit
                  </button>
                </div>
              </form>

              {isGpsDetailsOpen && gpsLocation && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#002b49]/35 p-4">
                  <div className="w-full max-w-sm rounded-2xl border border-[#1f5f7a]/20 bg-[#eef7fb] p-4 shadow-[0_18px_40px_rgba(0,43,73,0.2)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#002b49]">GPS Details</p>
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
