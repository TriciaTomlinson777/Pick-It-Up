"use client";

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ShareButton from '@/components/ShareButton';
import dynamic from 'next/dynamic';
import { Baloo_2 } from 'next/font/google';
import { Poppins } from 'next/font/google';

const balooDisplay = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700'],
});

const poppinsHero = Poppins({
  subsets: ['latin'],
  weight: ['400'],
});

const CommunityFootprintsMap = dynamic(() => import('@/components/CommunityFootprintsMap'), {
  ssr: false,
});

const TrackLocationPicker = dynamic(() => import('@/components/TrackLocationPicker'), {
  ssr: false,
});

const TRACK_SUBMISSIONS_KEY = 'pick-it-up-cleanup-submissions-v2';
const SEATTLE_BOUNDS = {
  minLat: 47.49,
  maxLat: 47.74,
  minLon: -122.44,
  maxLon: -122.22,
};

const EMPTY_TRACK_FORM = {
  actionType: '',
  bagCount: '',
};

const MAX_PHOTO_UPLOADS = 2;
const NEIGHBORHOOD_CLEANUP_PHOTOS_KEY = 'pick-it-up-neighborhood-cleanup-photos-v1';
const COMMUNITY_ACTION_SUBMISSIONS_KEY = 'pick-it-up-community-action-submissions-v1';
const PHOTO_OWNER_ID_KEY = 'pick-it-up-browser-owner-id-v1';
const PHOTO_TYPE_VOLUNTEER = 'volunteer-group';
const PHOTO_TYPE_BEFORE_AFTER = 'before-after';
const PHOTO_TYPE_COMMUNITY_ACTION = 'community-action';
const PHOTO_MODAL_MODE_TRACK_BEFORE_AFTER = 'track-before-after';
const PHOTO_MODAL_MODE_COMMUNITY_ACTION_ONLY = 'community-action-only';
const PHOTO_MODAL_MODE_GENERAL = 'general';
const MAX_IMAGE_FILE_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_DIMENSION_PX = 1600;
const JPEG_COMPRESSION_QUALITY = 0.8;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const HEIC_IMAGE_TYPES = new Set(['image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence']);
const DEFAULT_PHOTO_CROP_POSITION = { x: 50, y: 50 };
const SUPABASE_UPLOAD_TIMEOUT_MS = 30000;
const SUPABASE_STORAGE_BUCKET = 'Community Photos';
const COMMUNITY_SHARE_TYPE_THANK_YOU = 'thank-you';
const COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY = 'scenic-discovery';
const IMAGINE_SLIDES = [
  { src: '/SS!.jpg', objectPosition: '50% 68%' },
  { src: '/Seattle2.jpeg', objectPosition: '50% 68%' },
  { src: '/0.jpg', objectPosition: '50% 68%' },
];
const IMAGINE_SLIDE_INTERVAL_MS = 6000;
const IMAGINE_SLIDE_FADE_MS = 2500;
const COMMUNITY_ACTION_RECENT_RANDOM_WINDOW = 8;
const COMMUNITY_ACTION_FEATURED_COUNT = 4;
const BEFORE_AFTER_RECENT_RANDOM_WINDOW = 8;
const BEFORE_AFTER_FEATURED_COUNT = 2;
const DAY_ONE_FIXED_PAIR_CAPTIONS = {
  before: 'Even parking lots can look better!',
  after: 'So simple!',
};
const DAY_ONE_FIXED_BEFORE_IMAGE = {
  publicUrl: '/1817.jpg',
};
const DAY_ONE_FIXED_AFTER_IMAGE = {
  publicUrl: '/1720.jpg',
};

const SHARE_DESTINATION_BY_TYPE = {
  [COMMUNITY_SHARE_TYPE_THANK_YOU]: '/thank-yous#community-gratitude',
  [COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY]: '/volunteer-memorable-photos#scenic-discoveries',
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
  const [sharedSubmissions, setSharedSubmissions] = useState([]);
  const [showExpandedMapPreview, setShowExpandedMapPreview] = useState(false);
  const [runFootprintSequence, setRunFootprintSequence] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isResolvingLocation, setIsResolvingLocation] = useState(false);
  const [resolvedTrackLatLng, setResolvedTrackLatLng] = useState(null);
  const [hasSelectedTrackMarker, setHasSelectedTrackMarker] = useState(false);
  const [pendingReviewLatLng, setPendingReviewLatLng] = useState(null);
  const [locationReviewMessage, setLocationReviewMessage] = useState('');
  const [savedCleanupSubmissionCount, setSavedCleanupSubmissionCount] = useState(0);
  const [savedCleanupBagTotal, setSavedCleanupBagTotal] = useState(0);
  const [showPostPhotosStep, setShowPostPhotosStep] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedimages, setSelectedimages] = useState([null, null]);
  const [beforeAfterCaption, setBeforeAfterCaption] = useState('');
  const [photoCropPositions, setPhotoCropPositions] = useState([
    { ...DEFAULT_PHOTO_CROP_POSITION },
    { ...DEFAULT_PHOTO_CROP_POSITION },
  ]);
  const [activePhotoDrag, setActivePhotoDrag] = useState(null);
  const [dragSwapSourceIndex, setDragSwapSourceIndex] = useState(null);
  const [communityActionSelectedPhoto, setCommunityActionSelectedPhoto] = useState(null);
  const [latestNeighborhoodCleanupPhotos, setLatestNeighborhoodCleanupPhotos] = useState(null);
  const [photoSubmissions, setPhotoSubmissions] = useState([]);
  const [approvedBeforeAfterSubmissions, setApprovedBeforeAfterSubmissions] = useState([]);
  const [communityActionSubmissions, setCommunityActionSubmissions] = useState([]);
  const [photoFormError, setPhotoFormError] = useState('');
  const [isUploadingCleanupPhotos, setIsUploadingCleanupPhotos] = useState(false);
  const [photoStorageWarning, setPhotoStorageWarning] = useState('');
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState(false);
  const [photoGalleryView, setPhotoGalleryView] = useState('before-after');
  const [photoModalMode, setPhotoModalMode] = useState(PHOTO_MODAL_MODE_GENERAL);
  const [photoSubmissionType, setPhotoSubmissionType] = useState('');
  const [hasConfirmedPhotoGuidelines, setHasConfirmedPhotoGuidelines] = useState(false);
  const [isPhotoGuidelinesPopupOpen, setIsPhotoGuidelinesPopupOpen] = useState(false);
  const [pendingTrackPhotoSubmission, setPendingTrackPhotoSubmission] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalStage, setShareModalStage] = useState('choose');
  const [shareSubmissionType, setShareSubmissionType] = useState('');
  const [shareThankYouMessage, setShareThankYouMessage] = useState('');
  const [shareScenicCaption, setShareScenicCaption] = useState('');
  const [shareSelectedPhoto, setShareSelectedPhoto] = useState(null);
  const [sharePhotoCropPosition, setSharePhotoCropPosition] = useState({
    ...DEFAULT_PHOTO_CROP_POSITION,
  });
  const [sharePhotoDrag, setSharePhotoDrag] = useState(null);
  const [hasConfirmedSharePhotoGuidelines, setHasConfirmedSharePhotoGuidelines] = useState(false);
  const [openShareGuidelineIndex, setOpenShareGuidelineIndex] = useState(null);
  const [isSubmittingShareSubmission, setIsSubmittingShareSubmission] = useState(false);
  const [shareFormError, setShareFormError] = useState('');
  const [communityShareSubmissions, setCommunityShareSubmissions] = useState([]);
  const [browserOwnerId, setBrowserOwnerId] = useState('');
  const [volunteerPhotoIndex, setVolunteerPhotoIndex] = useState(0);
  const [beforeAfterPairIndex, setBeforeAfterPairIndex] = useState(0);
  const [featuredCommunityActionPhotoIds, setFeaturedCommunityActionPhotoIds] = useState([]);
  const [featuredBeforeAfterSecondaryPairId, setFeaturedBeforeAfterSecondaryPairId] = useState('');
  const [queuedVolunteerHighlightKey, setQueuedVolunteerHighlightKey] = useState('');
  const [queuedBeforeAfterHighlightKey, setQueuedBeforeAfterHighlightKey] = useState('');
  const [activeVolunteerHighlightKey, setActiveVolunteerHighlightKey] = useState('');
  const [activeBeforeAfterHighlightKey, setActiveBeforeAfterHighlightKey] = useState('');
  const [imagineSlideIndex, setImagineSlideIndex] = useState(0);
  const scrollLockStateRef = useRef({
    isLocked: false,
    bodyOverflow: '',
    htmlOverflow: '',
  });

  const quickLinks = [
    { label: 'Our Partners', href: '/volunteer' },
    { label: 'Community Resources', href: '/community-resources' },
    { label: 'Shop Merch', href: '/shop' },
    { label: 'Donate', href: '/donate' },
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

  const handleTrackActionSelect = (actionType) => {
    setTrackForm((current) => ({ ...current, actionType }));
    setLocationError('');
    setSubmitMessage('');
  };

  const handleTrackMarkerMoved = (latLng) => {
    setResolvedTrackLatLng(latLng);
    setHasSelectedTrackMarker(true);
    setPendingReviewLatLng(null);
    setLocationReviewMessage('');
    setLocationError('');
  };

  const handleConfirmCurrentTrackMarker = () => {
    if (!resolvedTrackLatLng) {
      return;
    }

    setHasSelectedTrackMarker(true);
    setLocationError('');
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

  const createDefaultCropPosition = () => ({ ...DEFAULT_PHOTO_CROP_POSITION });

  const normalizePhotoCropPosition = (cropPosition) => ({
    x: clamp(Number.isFinite(cropPosition?.x) ? cropPosition.x : DEFAULT_PHOTO_CROP_POSITION.x, 0, 100),
    y: clamp(Number.isFinite(cropPosition?.y) ? cropPosition.y : DEFAULT_PHOTO_CROP_POSITION.y, 0, 100),
  });

  const getPhotoPairCaptionText = (beforeImage, afterImage) => {
    const beforeCaption = (beforeImage?.caption || '').trim();
    const afterCaption = (afterImage?.caption || '').trim();

    if (beforeCaption && afterCaption && beforeCaption !== afterCaption) {
      return `Before: ${beforeCaption}\nAfter: ${afterCaption}`;
    }

    return beforeCaption || afterCaption || 'Cleanup photo submission';
  };

  const getPhotoObjectPosition = (image) => {
    const cropPosition = normalizePhotoCropPosition(image?.cropPosition);
    return `${cropPosition.x}% ${cropPosition.y}%`;
  };

  const getStoredImageUrl = (image) => {
    return image?.publicUrl || image?.src || '';
  };

  const sanitizeStoragePathSegment = (value) => {
    return String(value || '')
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'file';
  };

  const encodeStoragePath = (path) => {
    return String(path || '')
      .split('/')
      .filter(Boolean)
      .map((segment) => encodeURIComponent(segment))
      .join('/');
  };

  const getFileExtension = (fileName = '') => {
    const match = String(fileName).trim().match(/\.([a-z0-9]+)$/i);
    return match ? match[1].toLowerCase() : '';
  };

  const isHeicLikeFile = (file) => {
    return HEIC_IMAGE_TYPES.has(file?.type) || ['heic', 'heif'].includes(getFileExtension(file?.name || ''));
  };

  const loadImageFromBlob = (blob) => {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(blob);
      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('The browser could not read this image file.'));
      };

      image.src = objectUrl;
    });
  };

  const canvasToBlob = (canvas, type, quality) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('The browser could not generate a processed image.'));
          return;
        }

        resolve(blob);
      }, type, quality);
    });
  };

  const convertHeicFileToBlob = async (file) => {
    try {
      const module = await import('heic2any');
      const heic2any = module.default || module;
      const conversionResult = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: JPEG_COMPRESSION_QUALITY,
      });

      const convertedBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;

      if (!(convertedBlob instanceof Blob)) {
        throw new Error('The HEIC/HEIF conversion did not return an image.');
      }

      return convertedBlob;
    } catch {
      throw new Error('HEIC/HEIF conversion failed in this browser. Please try another image or export it as JPG.');
    }
  };

  const processCleanupPhotoFile = async (file, index) => {
    const sourceLabel = file?.name || `photo-${index + 1}`;

    try {
      const sourceBlob = isHeicLikeFile(file) ? await convertHeicFileToBlob(file) : file;
      const image = await loadImageFromBlob(sourceBlob);
      const sourceWidth = image.naturalWidth || image.width;
      const sourceHeight = image.naturalHeight || image.height;

      if (!sourceWidth || !sourceHeight) {
        throw new Error('The image dimensions could not be read.');
      }

      const longestSide = Math.max(sourceWidth, sourceHeight);
      const scale = longestSide > MAX_IMAGE_DIMENSION_PX ? MAX_IMAGE_DIMENSION_PX / longestSide : 1;
      const targetWidth = Math.max(1, Math.round(sourceWidth * scale));
      const targetHeight = Math.max(1, Math.round(sourceHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('The browser could not prepare the image canvas.');
      }

      context.drawImage(image, 0, 0, targetWidth, targetHeight);

      const processedBlob = await canvasToBlob(canvas, 'image/jpeg', JPEG_COMPRESSION_QUALITY);
      const baseName = sanitizeStoragePathSegment(sourceLabel.replace(/\.[^.]+$/, ''));

      return new File([processedBlob], `${baseName}.jpg`, {
        type: 'image/jpeg',
        lastModified: Date.now(),
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`"${sourceLabel}" could not be processed for upload. ${error.message}`);
      }

      throw new Error(`"${sourceLabel}" could not be processed for upload.`);
    }
  };

  const uploadCleanupPhotoToSupabase = async (file, submissionId, index, storageFolder = 'cleanup-submissions', uploadLabel = 'Photo') => {
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim();

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
    }

    const safeName = sanitizeStoragePathSegment(file?.name || `photo-${index + 1}`);
    const objectPath = `${storageFolder}/${submissionId}/${index + 1}-${Date.now()}-${safeName}`;
    const encodedBucket = encodeURIComponent(SUPABASE_STORAGE_BUCKET);
    const encodedObjectPath = encodeStoragePath(objectPath);
    const supabaseBaseUrl = supabaseUrl.replace(/\/$/, '');
    const uploadUrl = `${supabaseBaseUrl}/storage/v1/object/${encodedBucket}/${encodedObjectPath}`;
    const uploadAbortController = new AbortController();
    const timeoutMessage = `${uploadLabel} ${index + 1} (${file?.name || `photo-${index + 1}`}) timed out after ${Math.ceil(SUPABASE_UPLOAD_TIMEOUT_MS / 1000)} seconds.`;
    let uploadTimeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      uploadTimeoutId = window.setTimeout(() => {
        uploadAbortController.abort();
        reject(new Error(timeoutMessage));
      }, SUPABASE_UPLOAD_TIMEOUT_MS);
    });

    console.info('Supabase Storage upload URL:', uploadUrl);

    try {
      const uploadResult = await Promise.race([
        (async () => {
          const uploadResponse = await fetch(
            uploadUrl,
            {
              method: 'POST',
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                'Content-Type': file.type || 'application/octet-stream',
                'x-upsert': 'false',
              },
              body: file,
              signal: uploadAbortController.signal,
            }
          );

          if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`${uploadLabel} ${index + 1} (${file?.name || `photo-${index + 1}`}) failed to upload: ${uploadResponse.status} ${uploadResponse.statusText}${errorText ? ` - ${errorText}` : ''}`);
          }

          return {
            storagePath: objectPath,
            publicUrl: `${supabaseBaseUrl}/storage/v1/object/public/${encodedBucket}/${encodedObjectPath}`,
          };
        })(),
        timeoutPromise,
      ]);

      return uploadResult;
    } catch (error) {
      if (uploadAbortController.signal.aborted) {
        throw new Error(timeoutMessage);
      }

      throw new Error(`${uploadLabel} ${index + 1} (${file?.name || `photo-${index + 1}`}) failed to upload: ${error instanceof Error ? error.message : 'Unknown network error'}`);
    } finally {
      if (uploadTimeoutId) {
        window.clearTimeout(uploadTimeoutId);
      }
    }
  };

  const getSubmissionType = (submission) => {
    if (
      submission?.photoType === PHOTO_TYPE_VOLUNTEER
      || submission?.photoType === PHOTO_TYPE_BEFORE_AFTER
      || submission?.photoType === PHOTO_TYPE_COMMUNITY_ACTION
    ) {
      return submission.photoType;
    }

    if (submission?.images?.length === 1) {
      return PHOTO_TYPE_COMMUNITY_ACTION;
    }

    return PHOTO_TYPE_BEFORE_AFTER;
  };

  const normalizeBagCount = (value) => {
    const parsedValue = Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 0) {
      return 0;
    }

    return parsedValue;
  };

  const uploadedVolunteerPhotos = communityActionSubmissions
    .flatMap((submission, submissionIndex) => {
    const submissionKey = submission.submittedAt || `submission-${submissionIndex}`;

    return (submission.images || []).map((image, imageIndex) => ({
      id: `${submissionKey}-${imageIndex}`,
      src: getStoredImageUrl(image),
      cropPosition: normalizePhotoCropPosition(image?.cropPosition),
      submittedAt: submission.submittedAt,
      ownerId: submission.ownerId || '',
      submissionId: submission.id || submissionKey,
    }));
  });

  const volunteerGroupPhotos = uploadedVolunteerPhotos;
  const featuredCommunityActionPhotoIdSet = new Set(featuredCommunityActionPhotoIds);
  const selectedFeaturedCommunityActionPhotos = volunteerGroupPhotos
    .filter((photo) => featuredCommunityActionPhotoIdSet.has(photo.id))
    .sort((first, second) => {
      const firstIndex = featuredCommunityActionPhotoIds.indexOf(first.id);
      const secondIndex = featuredCommunityActionPhotoIds.indexOf(second.id);
      return firstIndex - secondIndex;
    });
  const remainingCommunityActionPhotos = volunteerGroupPhotos.filter(
    (photo) => !featuredCommunityActionPhotoIdSet.has(photo.id)
  );
  const featuredCommunityActionPhotos = [
    ...selectedFeaturedCommunityActionPhotos,
    ...remainingCommunityActionPhotos,
  ].slice(0, COMMUNITY_ACTION_FEATURED_COUNT);

  const beforeAfterPhotoPairs = approvedBeforeAfterSubmissions
    .filter((submission) => submission && Array.isArray(submission.images) && submission.images.length)
    .filter((submission) => getSubmissionType(submission) === PHOTO_TYPE_BEFORE_AFTER && submission.images.length >= 2)
    .map((submission, submissionIndex) => {
      const beforeImage = submission.images.find((image) => image?.role === 'before') || submission.images[0] || null;
      const afterImage = submission.images.find((image) => image?.role === 'after') || submission.images[1] || null;
      const beforeCaption = typeof submission.beforeCaption === 'string' ? submission.beforeCaption.trim() : '';
      const afterCaption = typeof submission.afterCaption === 'string' ? submission.afterCaption.trim() : '';
      const pairCaption = typeof submission.pairCaption === 'string'
        ? submission.pairCaption.trim()
        : beforeCaption && beforeCaption === afterCaption
          ? beforeCaption
          : '';

      return {
        id: submission.submittedAt || `pair-${submissionIndex}`,
        beforeImage,
        afterImage,
        pairCaption,
        beforeCaption,
        afterCaption,
        submittedAt: submission.submittedAt,
        ownerId: submission.ownerId || '',
        submissionId: submission.id || submission.submittedAt || `pair-${submissionIndex}`,
      };
    });

  const newestBeforeAfterPair = beforeAfterPhotoPairs[0] || null;
  const featuredBeforeAfterSecondaryPair = beforeAfterPhotoPairs.find(
    (pair) => pair.id === featuredBeforeAfterSecondaryPairId && pair.id !== newestBeforeAfterPair?.id
  ) || null;
  const featuredBeforeAfterPhotoPairs = [
    newestBeforeAfterPair,
    featuredBeforeAfterSecondaryPair,
  ].filter(Boolean);
  const featuredBeforeAfterPairIdSet = new Set(featuredBeforeAfterPhotoPairs.map((pair) => pair.id));
  const remainingBeforeAfterPhotoPairs = beforeAfterPhotoPairs.filter(
    (pair) => !featuredBeforeAfterPairIdSet.has(pair.id)
  );
  const visibleBeforeAfterGalleryPairs = [
    ...featuredBeforeAfterPhotoPairs,
    ...remainingBeforeAfterPhotoPairs,
  ];

  const dayOneFixedBeforeImage = DAY_ONE_FIXED_BEFORE_IMAGE;
  const dayOneFixedAfterImage = DAY_ONE_FIXED_AFTER_IMAGE;

  const beforeAfterPairsPerView = 2;
  const beforeAfterGalleryPageCount = Math.max(1, Math.ceil(visibleBeforeAfterGalleryPairs.length / beforeAfterPairsPerView));
  const beforeAfterGalleryStartIndex = beforeAfterPairIndex * beforeAfterPairsPerView;
  const visibleBeforeAfterPairs = visibleBeforeAfterGalleryPairs.slice(
    beforeAfterGalleryStartIndex,
    beforeAfterGalleryStartIndex + beforeAfterPairsPerView
  );

  const activeVolunteerPhoto = volunteerGroupPhotos[volunteerPhotoIndex] || null;
  const activeBeforeAfterPair = visibleBeforeAfterGalleryPairs[beforeAfterPairIndex] || null;
  const isTrackBeforeAfterPhotoModal = photoModalMode === PHOTO_MODAL_MODE_TRACK_BEFORE_AFTER;
  const thankYouShareSubmissions = communityShareSubmissions.filter(
    (submission) => submission.type === COMMUNITY_SHARE_TYPE_THANK_YOU
  );
  const scenicDiscoveryShareSubmissions = communityShareSubmissions.filter(
    (submission) => submission.type === COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY
  );
  const latestThankYouShareSubmission = thankYouShareSubmissions[0] || null;
  const latestScenicDiscoveryShareSubmission = scenicDiscoveryShareSubmissions[0] || null;

  const getUsableStoredPhotoUrl = (image) => {
    const publicUrl = typeof image?.publicUrl === 'string' ? image.publicUrl.trim() : '';
    if (publicUrl && !/^data:|^blob:/i.test(publicUrl)) {
      return publicUrl;
    }

    const legacySrc = typeof image?.src === 'string' ? image.src.trim() : '';
    if (legacySrc && !/^data:|^blob:/i.test(legacySrc)) {
      return legacySrc;
    }

    return '';
  };

  const normalizePhotoSubmissions = (possibleSubmissions = []) => {
    return possibleSubmissions
      .filter((submission) => submission && Array.isArray(submission.images) && submission.images.length)
      .map((submission) => {
        const normalizedImages = submission.images
          .map((image) => {
            const publicUrl = getUsableStoredPhotoUrl(image);
            const storagePath = typeof image?.storagePath === 'string' ? image.storagePath.trim() : '';

            if (!publicUrl && !storagePath) {
              return null;
            }

            return {
              publicUrl,
              storagePath,
              caption: image?.caption || '',
              role: image?.role || '',
              cropPosition: normalizePhotoCropPosition(image?.cropPosition),
            };
          })
          .filter(Boolean);

        if (!normalizedImages.length) {
          return null;
        }

        const normalizedBeforeCaption = typeof submission.beforeCaption === 'string'
          ? submission.beforeCaption
          : ((submission.images?.find((image) => image?.role === 'before') || submission.images?.[0])?.caption || '');
        const normalizedAfterCaption = typeof submission.afterCaption === 'string'
          ? submission.afterCaption
          : ((submission.images?.find((image) => image?.role === 'after') || submission.images?.[1])?.caption || '');
        const normalizedPairCaption = typeof submission.pairCaption === 'string'
          ? submission.pairCaption
          : normalizedBeforeCaption && normalizedBeforeCaption === normalizedAfterCaption
            ? normalizedBeforeCaption
            : '';

        return {
          id: submission.id || `${submission.submittedAt || Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          submittedAt: submission.submittedAt || new Date().toISOString(),
          photoType: getSubmissionType(submission),
          ownerId: submission.ownerId || '',
          beforeCaption: normalizedBeforeCaption,
          afterCaption: normalizedAfterCaption,
          pairCaption: normalizedPairCaption,
          images: normalizedImages,
        };
      })
      .filter(Boolean)
      .sort((first, second) => {
        const firstTime = new Date(first.submittedAt || 0).getTime();
        const secondTime = new Date(second.submittedAt || 0).getTime();
        return secondTime - firstTime;
      });
  };

  const normalizeCommunityActionSubmissions = (possibleSubmissions = []) => {
    return possibleSubmissions
      .filter((submission) => submission && Array.isArray(submission.images) && submission.images.length)
      .map((submission) => {
        const normalizedImages = (submission.images || [])
          .map((image) => {
            const publicUrl = getUsableStoredPhotoUrl(image);
            const storagePath = typeof image?.storagePath === 'string' ? image.storagePath.trim() : '';

            if (!publicUrl && !storagePath) {
              return null;
            }

            return {
              publicUrl,
              storagePath,
              cropPosition: normalizePhotoCropPosition(image?.cropPosition),
            };
          })
          .filter(Boolean)
          .slice(0, 1);

        if (!normalizedImages.length) {
          return null;
        }

        return {
          id: submission.id || `${submission.submittedAt || Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          submittedAt: submission.submittedAt || new Date().toISOString(),
          photoType: PHOTO_TYPE_COMMUNITY_ACTION,
          ownerId: submission.ownerId || '',
          images: normalizedImages,
        };
      })
      .filter(Boolean)
      .sort((first, second) => {
        const firstTime = new Date(first.submittedAt || 0).getTime();
        const secondTime = new Date(second.submittedAt || 0).getTime();
        return secondTime - firstTime;
      });
  };

  const persistNormalizedCommunityActionSubmissions = (submissions) => {
    const normalized = normalizeCommunityActionSubmissions(submissions);

    if (!normalized.length) {
      localStorage.removeItem(COMMUNITY_ACTION_SUBMISSIONS_KEY);
      setCommunityActionSubmissions([]);
      return;
    }

    localStorage.setItem(
      COMMUNITY_ACTION_SUBMISSIONS_KEY,
      JSON.stringify({
        ...normalized[0],
        submissions: normalized,
      })
    );
    setCommunityActionSubmissions(normalized);
  };

  const saveCommunityActionSubmissionToStorage = (newSubmission) => {
    try {
      let existingSubmissions = Array.isArray(communityActionSubmissions) ? [...communityActionSubmissions] : [];

      if (!existingSubmissions.length) {
        try {
          const savedCommunityPhotos = JSON.parse(localStorage.getItem(COMMUNITY_ACTION_SUBMISSIONS_KEY) || 'null');
          if (savedCommunityPhotos && Array.isArray(savedCommunityPhotos.submissions)) {
            existingSubmissions = savedCommunityPhotos.submissions;
          } else if (savedCommunityPhotos && Array.isArray(savedCommunityPhotos.images)) {
            existingSubmissions = [savedCommunityPhotos];
          }
        } catch {
          existingSubmissions = [];
        }
      }

      const submissionId = newSubmission?.id || newSubmission?.submittedAt || '';
      const deduplicatedSubmissions = submissionId
        ? existingSubmissions.filter((submission) => {
            const existingId = submission?.id || submission?.submittedAt || '';
            return existingId !== submissionId;
          })
        : existingSubmissions;

      persistNormalizedCommunityActionSubmissions([...deduplicatedSubmissions, newSubmission]);
      setVolunteerPhotoIndex(0);

      const submissionKey = newSubmission.submittedAt || '';
      if (submissionKey) {
        setQueuedVolunteerHighlightKey(`${submissionKey}-0`);
      }

      return true;
    } catch {
      return false;
    }
  };

  const persistNormalizedPhotoSubmissions = (submissions) => {
    const normalized = normalizePhotoSubmissions(submissions);

    if (!normalized.length) {
      localStorage.removeItem(NEIGHBORHOOD_CLEANUP_PHOTOS_KEY);
      setLatestNeighborhoodCleanupPhotos(null);
      setPhotoSubmissions([]);
      return;
    }

    const newestSubmission = normalized[0];
    localStorage.setItem(
      NEIGHBORHOOD_CLEANUP_PHOTOS_KEY,
      JSON.stringify({
        ...newestSubmission,
        submissions: normalized,
      })
    );

    setLatestNeighborhoodCleanupPhotos({
      ...newestSubmission,
      images: newestSubmission.images.slice(0, MAX_PHOTO_UPLOADS),
    });
    setPhotoSubmissions(normalized);
  };

  const savePhotoSubmissionToStorage = (newSubmission) => {
    try {
      let existingSubmissions = Array.isArray(photoSubmissions) ? [...photoSubmissions] : [];

      if (!existingSubmissions.length) {
        try {
          const savedPhotos = JSON.parse(localStorage.getItem(NEIGHBORHOOD_CLEANUP_PHOTOS_KEY) || 'null');
          if (savedPhotos && Array.isArray(savedPhotos.submissions)) {
            existingSubmissions = savedPhotos.submissions;
          } else if (savedPhotos && Array.isArray(savedPhotos.images)) {
            existingSubmissions = [savedPhotos];
          }
        } catch {
          existingSubmissions = [];
        }
      }

      const submissionId = newSubmission?.id || newSubmission?.submittedAt || '';
      const deduplicatedSubmissions = submissionId
        ? existingSubmissions.filter((submission) => {
            const existingId = submission?.id || submission?.submittedAt || '';
            return existingId !== submissionId;
          })
        : existingSubmissions;

      const submissions = normalizePhotoSubmissions([...deduplicatedSubmissions, newSubmission]);
      persistNormalizedPhotoSubmissions(submissions);
      setVolunteerPhotoIndex(0);
      setBeforeAfterPairIndex(0);

      const submissionKey = newSubmission.submittedAt || '';
      if (submissionKey) {
        if (getSubmissionType(newSubmission) === PHOTO_TYPE_BEFORE_AFTER) {
          setQueuedBeforeAfterHighlightKey(submissionKey);
        }
      }

      return true;
    } catch {
      return false;
    }
  };

  const getCommunityShareType = (submission) => {
    if (
      submission?.type === COMMUNITY_SHARE_TYPE_THANK_YOU ||
      submission?.type === COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY
    ) {
      return submission.type;
    }

    if (
      submission?.shareType === COMMUNITY_SHARE_TYPE_THANK_YOU ||
      submission?.shareType === COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY
    ) {
      return submission.shareType;
    }

    return '';
  };

  const normalizeCommunitySharePhoto = (photo) => {
    if (!photo) {
      return null;
    }

    const publicUrl = typeof photo?.publicUrl === 'string' ? photo.publicUrl.trim() : typeof photo?.src === 'string' ? photo.src.trim() : '';
    const storagePath = typeof photo?.storagePath === 'string' ? photo.storagePath.trim() : '';

    if (!publicUrl && !storagePath) {
      return null;
    }

    return {
      publicUrl,
      storagePath,
      cropPosition: normalizePhotoCropPosition(photo?.cropPosition),
    };
  };

  const normalizeCommunityShareSubmission = (submission) => {
    const type = getCommunityShareType(submission);

    if (!type) {
      return null;
    }

    const photo = normalizeCommunitySharePhoto(submission?.photo || submission?.image || submission?.images?.[0] || null);
    const submittedAt = submission?.submittedAt || submission?.createdAt || new Date().toISOString();
    const message = typeof submission?.message === 'string' ? submission.message.trim() : '';
    const caption = typeof submission?.caption === 'string' ? submission.caption.trim() : '';

    if (type === COMMUNITY_SHARE_TYPE_THANK_YOU && !message && !photo) {
      return null;
    }

    if (type === COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY && !photo) {
      return null;
    }

    return {
      id: submission?.id || `${submittedAt}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      submittedAt,
      ownerId: submission?.ownerId || '',
      message,
      caption,
      photo,
    };
  };

  const normalizeCommunityShareSubmissions = (possibleSubmissions = []) => {
    return possibleSubmissions
      .map((submission) => normalizeCommunityShareSubmission(submission))
      .filter(Boolean)
      .sort((first, second) => {
        const firstTime = new Date(first.submittedAt || 0).getTime();
        const secondTime = new Date(second.submittedAt || 0).getTime();

        return secondTime - firstTime;
      });
  };

  const persistNormalizedCommunityShareSubmissions = (submissions) => {
    const normalized = normalizeCommunityShareSubmissions(submissions);
    setCommunityShareSubmissions(normalized);
  };

  const saveCommunityShareSubmissionToStorage = async (newSubmission) => {
    try {
      const submissionId = newSubmission?.id || newSubmission?.submittedAt || '';
      const deduplicatedSubmissions = submissionId
        ? communityShareSubmissions.filter((submission) => {
            const existingId = submission?.id || submission?.submittedAt || '';
            return existingId !== submissionId;
          })
        : communityShareSubmissions;

      const submissions = normalizeCommunityShareSubmissions([...deduplicatedSubmissions, newSubmission]);
      persistNormalizedCommunityShareSubmissions(submissions);

      const endpoint = newSubmission?.type === COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY
        ? '/api/scenic-discoveries'
        : '/api/community-shares';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          newSubmission?.type === COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY
            ? {
                caption: newSubmission?.caption || '',
                image_url: newSubmission?.photo?.publicUrl || null,
                image_path: newSubmission?.photo?.storagePath || null,
              }
            : {
                note: newSubmission?.message || '',
                image_url: newSubmission?.photo?.publicUrl || null,
                image_path: newSubmission?.photo?.storagePath || null,
              }
        ),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || 'Unable to save share.');
      }

      return true;
    } catch {
      return false;
    }
  };

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
    const normalizedTrackLatLng =
      (Array.isArray(entry?.resolvedTrackLatLng) && entry.resolvedTrackLatLng.length === 2
        ? entry.resolvedTrackLatLng
        : Array.isArray(entry?.['resolved' + 'LatLng']) && entry['resolved' + 'LatLng'].length === 2
          ? entry['resolved' + 'LatLng']
          : null);

    if (normalizedTrackLatLng) {
      return [normalizedTrackLatLng[0], normalizedTrackLatLng[1]];
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

  useEffect(() => {
    fetch('/api/cleanup-submissions')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(({ submissions }) => {
        const rows = Array.isArray(submissions) ? submissions : [];
        setSharedSubmissions(rows);
        const footprints = rows
          .filter((row) => Number.isFinite(row.marker_lat) && Number.isFinite(row.marker_lng))
          .map((row) => [row.marker_lat, row.marker_lng]);
        setNearbyExistingFootprints(footprints);
        setSavedCleanupSubmissionCount(rows.length);
        setSavedCleanupBagTotal(rows.reduce((total, row) => total + (row.bag_count || 0), 0));
      })
      .catch(() => {
        setNearbyExistingFootprints([]);
        setSavedCleanupSubmissionCount(0);
        setSavedCleanupBagTotal(0);
      });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setImagineSlideIndex(0);
      return undefined;
    }

    const slideTimer = window.setInterval(() => {
      setImagineSlideIndex((currentSlideIndex) => (currentSlideIndex + 1) % IMAGINE_SLIDES.length);
    }, IMAGINE_SLIDE_INTERVAL_MS);

    return () => {
      window.clearInterval(slideTimer);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    try {
      const savedCommunityPhotos = JSON.parse(localStorage.getItem(COMMUNITY_ACTION_SUBMISSIONS_KEY) || 'null');
      let storedCommunityActionSubmissions = [];
      if (savedCommunityPhotos && Array.isArray(savedCommunityPhotos.submissions)) {
        storedCommunityActionSubmissions = savedCommunityPhotos.submissions;
      } else if (savedCommunityPhotos && Array.isArray(savedCommunityPhotos.images)) {
        storedCommunityActionSubmissions = [savedCommunityPhotos];
      }

      const normalizedStoredCommunityActionSubmissions = normalizeCommunityActionSubmissions(storedCommunityActionSubmissions);

      const savedPhotos = JSON.parse(localStorage.getItem(NEIGHBORHOOD_CLEANUP_PHOTOS_KEY) || 'null');
      let normalizedSubmissions = [];
      if (savedPhotos && Array.isArray(savedPhotos.submissions)) {
        normalizedSubmissions = savedPhotos.submissions;
      } else if (savedPhotos && Array.isArray(savedPhotos.images)) {
        normalizedSubmissions = [savedPhotos];
      }

      const sortedSubmissions = normalizePhotoSubmissions(normalizedSubmissions);
      const migratedCommunityActionFromPhotoSubmissions = sortedSubmissions
        .filter((submission) => getSubmissionType(submission) !== PHOTO_TYPE_BEFORE_AFTER || submission.images.length < 2)
        .map((submission) => ({
          ...submission,
          photoType: PHOTO_TYPE_COMMUNITY_ACTION,
          images: (submission.images || []).slice(0, 1),
        }));

      const validBeforeAfterSubmissions = sortedSubmissions
        .filter((submission) => getSubmissionType(submission) === PHOTO_TYPE_BEFORE_AFTER && submission.images.length >= 2)
        .map((submission) => ({
          ...submission,
          photoType: PHOTO_TYPE_BEFORE_AFTER,
        }));

      persistNormalizedPhotoSubmissions(validBeforeAfterSubmissions);

      const mergedCommunityActionSubmissions = normalizeCommunityActionSubmissions([
        ...normalizedStoredCommunityActionSubmissions,
        ...migratedCommunityActionFromPhotoSubmissions,
      ]);

      persistNormalizedCommunityActionSubmissions(mergedCommunityActionSubmissions);
    } catch {
      setLatestNeighborhoodCleanupPhotos(null);
      setPhotoSubmissions([]);
      setCommunityActionSubmissions([]);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const loadApprovedBeforeAfterPairs = async () => {
      try {
        const response = await fetch('/api/community-before-after', {
          signal: abortController.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Unable to load approved before/after pairs.');
        }

        const data = await response.json();
        const approvedPairs = Array.isArray(data?.pairs) ? data.pairs : [];

        const approvedPairSubmissions = approvedPairs
          .map((pair) => {
            const beforeImageUrl = String(pair?.before_image_url || '').trim();
            const afterImageUrl = String(pair?.after_image_url || '').trim();

            if (!beforeImageUrl || !afterImageUrl) {
              return null;
            }

            const pairCaption = String(pair?.pair_caption || '').trim();
            const submittedAt = String(pair?.submitted_at || '').trim() || new Date().toISOString();

            return {
              id: pair?.id || submittedAt,
              submittedAt,
              photoType: PHOTO_TYPE_BEFORE_AFTER,
              ownerId: '',
              beforeCaption: pairCaption,
              afterCaption: pairCaption,
              pairCaption,
              images: [
                {
                  publicUrl: beforeImageUrl,
                  storagePath: '',
                  caption: pairCaption,
                  role: 'before',
                  cropPosition: createDefaultCropPosition(),
                },
                {
                  publicUrl: afterImageUrl,
                  storagePath: '',
                  caption: pairCaption,
                  role: 'after',
                  cropPosition: createDefaultCropPosition(),
                },
              ],
            };
          })
          .filter(Boolean);

        setApprovedBeforeAfterSubmissions(normalizePhotoSubmissions(approvedPairSubmissions));
      } catch {
        if (!abortController.signal.aborted) {
          setApprovedBeforeAfterSubmissions([]);
        }
      }
    };

    loadApprovedBeforeAfterPairs();

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const loadCommunityActionPhotos = async () => {
      try {
        const response = await fetch('/api/community-action-photos', {
          signal: abortController.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Unable to load Community in Action photos.');
        }

        const data = await response.json();
        const photos = Array.isArray(data?.photos) ? data.photos : [];

        const submissions = photos
          .map((photo) => {
            const publicUrl = String(photo?.image_url || '').trim();
            const storagePath = String(photo?.image_path || '').trim();
            const submittedAt = String(photo?.submitted_at || '').trim() || new Date().toISOString();

            if (!publicUrl && !storagePath) {
              return null;
            }

            return {
              id: photo?.id || submittedAt,
              submittedAt,
              photoType: PHOTO_TYPE_COMMUNITY_ACTION,
              ownerId: '',
              images: [
                {
                  publicUrl,
                  storagePath,
                  cropPosition: createDefaultCropPosition(),
                },
              ],
            };
          })
          .filter(Boolean);

        setCommunityActionSubmissions(normalizeCommunityActionSubmissions(submissions));
      } catch {
        if (!abortController.signal.aborted) {
          // Keep local fallback data when server loading fails.
        }
      }
    };

    loadCommunityActionPhotos();

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const loadCommunityShares = async () => {
      try {
        const [thankYouResponse, scenicResponse] = await Promise.all([
          fetch('/api/community-shares', {
            signal: abortController.signal,
            cache: 'no-store',
          }),
          fetch('/api/scenic-discoveries', {
            signal: abortController.signal,
            cache: 'no-store',
          }),
        ]);

        const thankYouData = thankYouResponse.ok ? await thankYouResponse.json() : { submissions: [] };
        const scenicData = scenicResponse.ok ? await scenicResponse.json() : { submissions: [] };

        const thankYouSubmissions = Array.isArray(thankYouData?.submissions) ? thankYouData.submissions : [];
        const scenicSubmissions = Array.isArray(scenicData?.submissions) ? scenicData.submissions : [];

        const normalizedShares = [
          ...thankYouSubmissions.map((submission) => ({
            id: submission?.id || '',
            type: COMMUNITY_SHARE_TYPE_THANK_YOU,
            submittedAt: submission?.submitted_at || submission?.submittedAt || '',
            ownerId: '',
            message: typeof submission?.note === 'string' ? submission.note.trim() : '',
            caption: '',
            photo: submission?.image_url
              ? {
                  publicUrl: submission.image_url,
                  storagePath: submission?.image_path || '',
                  cropPosition: createDefaultCropPosition(),
                }
              : null,
          })),
          ...scenicSubmissions.map((submission) => ({
            id: submission?.id || '',
            type: COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY,
            submittedAt: submission?.submitted_at || submission?.submittedAt || '',
            ownerId: '',
            message: '',
            caption: typeof submission?.caption === 'string' ? submission.caption.trim() : '',
            photo: submission?.image_url
              ? {
                  publicUrl: submission.image_url,
                  storagePath: submission?.image_path || '',
                  cropPosition: createDefaultCropPosition(),
                }
              : null,
          })),
        ];

        setCommunityShareSubmissions(normalizeCommunityShareSubmissions(normalizedShares));
      } catch {
        if (!abortController.signal.aborted) {
          setCommunityShareSubmissions([]);
        }
      }
    };

    loadCommunityShares();

    return () => {
      abortController.abort();
    };
  }, []);

  const getPhotoFileValidationError = (file) => {
    if (!ALLOWED_IMAGE_TYPES.has(file.type) && !isHeicLikeFile(file)) {
      return `\"${file.name}\" is not a supported image type. Please upload a JPG, PNG, WEBP, GIF, HEIC, or HEIF image.`;
    }

    if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
      return `\"${file.name}\" is too large. Please keep each image under 8MB.`;
    }

    return '';
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
    return Boolean(resolvedTrackLatLng);
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

  const clearPreparedPhotoSelection = () => {
    setSelectedimages((current) => {
      current.forEach((image) => {
        if (image?.previewUrl) {
          URL.revokeObjectURL(image.previewUrl);
        }
      });
      return [null, null];
    });
    setPhotoCropPositions([createDefaultCropPosition(), createDefaultCropPosition()]);
    setActivePhotoDrag(null);
    setDragSwapSourceIndex(null);
  };

  const clearCommunityActionPhotoSelection = () => {
    setCommunityActionSelectedPhoto((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return null;
    });
  };

  const handleDeletePhotoSubmission = (submissionId, label) => {
    if (!browserOwnerId) {
      return;
    }

    const shouldDelete = window.confirm(`Delete this ${label}? This cannot be undone.`);
    if (!shouldDelete) {
      return;
    }

    const remainingSubmissions = photoSubmissions.filter((submission) => {
      const candidateId = submission.id || submission.submittedAt;
      return candidateId !== submissionId;
    });

    persistNormalizedPhotoSubmissions(remainingSubmissions);
  };

  const handleDeleteCommunityActionSubmission = (submissionId) => {
    if (!browserOwnerId) {
      return;
    }

    const shouldDelete = window.confirm('Delete this Community in Action photo? This cannot be undone.');
    if (!shouldDelete) {
      return;
    }

    const remainingSubmissions = communityActionSubmissions.filter((submission) => {
      const candidateId = submission.id || submission.submittedAt;
      return candidateId !== submissionId;
    });

    persistNormalizedCommunityActionSubmissions(remainingSubmissions);
  };

  const resetPhotoModalState = () => {
    clearPreparedPhotoSelection();
    clearCommunityActionPhotoSelection();
    setBeforeAfterCaption('');
    setPhotoModalMode(PHOTO_MODAL_MODE_GENERAL);
    setPhotoSubmissionType(PHOTO_TYPE_BEFORE_AFTER);
    setPhotoFormError('');
    setHasConfirmedPhotoGuidelines(false);
    setIsPhotoGuidelinesPopupOpen(false);
  };

  const openCommunityActionPhotoModal = () => {
    resetPhotoModalState();
    setPhotoModalMode(PHOTO_MODAL_MODE_COMMUNITY_ACTION_ONLY);
    setPhotoSubmissionType(PHOTO_TYPE_COMMUNITY_ACTION);
    setIsModalOpen(true);
  };

  const openTrackPhotoModal = () => {
    resetPhotoModalState();
    setPhotoModalMode(PHOTO_MODAL_MODE_TRACK_BEFORE_AFTER);
    setPhotoSubmissionType(PHOTO_TYPE_BEFORE_AFTER);
    setIsModalOpen(true);
  };

  const clearSharePhotoSelection = () => {
    setShareSelectedPhoto((current) => {
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      return null;
    });
    setSharePhotoCropPosition(createDefaultCropPosition());
    setSharePhotoDrag(null);
    setHasConfirmedSharePhotoGuidelines(false);
  };

  const resetShareModalState = () => {
    clearSharePhotoSelection();
    setShareModalStage('choose');
    setShareSubmissionType('');
    setShareThankYouMessage('');
    setShareScenicCaption('');
    setShareFormError('');
    setHasConfirmedSharePhotoGuidelines(false);
    setOpenShareGuidelineIndex(null);
    setIsSubmittingShareSubmission(false);
  };

  const openShareModal = () => {
    resetShareModalState();
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    resetShareModalState();
  };

  const handleShareTypeSelect = (type) => {
    setShareSubmissionType(type);
    setShareModalStage('form');
    setShareFormError('');
    setHasConfirmedSharePhotoGuidelines(false);
    setOpenShareGuidelineIndex(null);
  };

  const handleShareMessageChange = (value) => {
    setShareThankYouMessage(value);
    setShareFormError('');
  };

  const handleShareCaptionChange = (value) => {
    setShareScenicCaption(value);
    setShareFormError('');
  };

  const handleSharePhotoInputChange = async (event) => {
    const newFiles = Array.from(event.target.files || []);

    if (!newFiles.length) {
      return;
    }

    const invalidFile = newFiles.find((file) => getPhotoFileValidationError(file));
    if (invalidFile) {
      setShareFormError(getPhotoFileValidationError(invalidFile));
      event.target.value = '';
      return;
    }

    const [selectedFile] = newFiles;

    try {
      const processedFile = await processCleanupPhotoFile(selectedFile, 0);

      setShareSelectedPhoto((current) => {
        if (current?.previewUrl) {
          URL.revokeObjectURL(current.previewUrl);
        }

        return {
          file: processedFile,
          previewUrl: URL.createObjectURL(processedFile),
        };
      });
      setSharePhotoCropPosition(createDefaultCropPosition());
      setShareFormError('');
      setHasConfirmedSharePhotoGuidelines(false);
    } catch (error) {
      setShareFormError(error instanceof Error ? error.message : 'That image could not be prepared. Please try a different photo.');
      setShareSelectedPhoto((current) => {
        if (current?.previewUrl) {
          URL.revokeObjectURL(current.previewUrl);
        }

        return null;
      });
    } finally {
      event.target.value = '';
    }
  };

  const handleSharePhotoPreviewPointerDown = (event) => {
    if (!shareSelectedPhoto) {
      return;
    }

    const frameRect = event.currentTarget.getBoundingClientRect();
    const startPosition = normalizePhotoCropPosition(sharePhotoCropPosition);

    setSharePhotoDrag({
      startX: event.clientX,
      startY: event.clientY,
      frameWidth: frameRect.width,
      frameHeight: frameRect.height,
      startPosition,
    });

    event.currentTarget.setPointerCapture?.(event.pointerId);
    setShareFormError('');
  };

  const handleSharePhotoPreviewPointerMove = (event) => {
    if (!sharePhotoDrag || !shareSelectedPhoto) {
      return;
    }

    event.preventDefault();

    const deltaX = event.clientX - sharePhotoDrag.startX;
    const deltaY = event.clientY - sharePhotoDrag.startY;
    const safeWidth = sharePhotoDrag.frameWidth || 1;
    const safeHeight = sharePhotoDrag.frameHeight || 1;

    const nextX = clamp(sharePhotoDrag.startPosition.x + (deltaX / safeWidth) * 100, 0, 100);
    const nextY = clamp(sharePhotoDrag.startPosition.y + (deltaY / safeHeight) * 100, 0, 100);

    setSharePhotoCropPosition({ x: nextX, y: nextY });
  };

  const handleSharePhotoPreviewPointerUp = (event) => {
    if (!sharePhotoDrag) {
      return;
    }

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setSharePhotoDrag(null);
  };

  const handleRemoveSharePhoto = () => {
    clearSharePhotoSelection();
    setShareFormError('');
  };

  const handleShareSubmit = async (event) => {
    event.preventDefault();

    if (isSubmittingShareSubmission) {
      return;
    }

    if (!shareSubmissionType) {
      setShareFormError('Please choose what you would like to share.');
      return;
    }

    const trimmedThankYouMessage = shareThankYouMessage.trim();
    const trimmedScenicCaption = shareScenicCaption.trim();
    const hasPhoto = Boolean(shareSelectedPhoto);

    if (shareSubmissionType === COMMUNITY_SHARE_TYPE_THANK_YOU && !trimmedThankYouMessage) {
      setShareFormError('Please add your Thank You Message before submitting.');
      return;
    }

    if (shareSubmissionType === COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY && !hasPhoto) {
      setShareFormError('Please add one scenic photo before submitting.');
      return;
    }

    if (hasPhoto && !hasConfirmedSharePhotoGuidelines) {
      setShareFormError('Please confirm the Community Photo Guidelines checkbox before submitting.');
      return;
    }

    if (hasPhoto) {
      const invalidFile = getPhotoFileValidationError(shareSelectedPhoto.file);
      if (invalidFile) {
        setShareFormError(invalidFile);
        return;
      }
    }

    setShareFormError('');
    setIsSubmittingShareSubmission(true);

    const submissionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    try {
      let uploadedPhoto = null;

      if (hasPhoto) {
        uploadedPhoto = await uploadCleanupPhotoToSupabase(
          shareSelectedPhoto.file,
          submissionId,
          0,
          'community-shares',
          'Share photo'
        );
      }

      const newSubmission = {
        id: submissionId,
        submittedAt: new Date().toISOString(),
        type: shareSubmissionType,
        ownerId: browserOwnerId || '',
        message: shareSubmissionType === COMMUNITY_SHARE_TYPE_THANK_YOU ? trimmedThankYouMessage : '',
        caption: shareSubmissionType === COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY ? trimmedScenicCaption : '',
        photo: uploadedPhoto
          ? {
              publicUrl: uploadedPhoto.publicUrl,
              storagePath: uploadedPhoto.storagePath,
              cropPosition: normalizePhotoCropPosition(sharePhotoCropPosition),
            }
          : null,
      };

      const didPersistShare = await saveCommunityShareSubmissionToStorage(newSubmission);

      if (!didPersistShare) {
        throw new Error('Your share was uploaded, but it could not be saved. Please try again.');
      }

      const destination = SHARE_DESTINATION_BY_TYPE[shareSubmissionType] || '/';
      closeShareModal();

      if (typeof window !== 'undefined') {
        window.location.assign(destination);
      }

      setShareFormError('');
    } catch (error) {
      setShareFormError(error instanceof Error ? error.message : 'Your share could not be saved. Please try again.');
    } finally {
      setIsSubmittingShareSubmission(false);
    }
  };

  const closePhotoModal = () => {
    setIsModalOpen(false);
    resetPhotoModalState();
  };

  const closePhotoGallery = () => {
    setIsPhotoGalleryOpen(false);
  };

  const openVolunteerGallery = () => {
    setPhotoGalleryView('volunteer');
    setIsPhotoGalleryOpen(true);
  };

  const openBeforeAfterGallery = () => {
    setPhotoGalleryView('before-after');
    setIsPhotoGalleryOpen(true);
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let ownerId = '';

    try {
      ownerId = localStorage.getItem(PHOTO_OWNER_ID_KEY) || '';

      if (!ownerId) {
        ownerId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem(PHOTO_OWNER_ID_KEY, ownerId);
      }
    } catch {
      ownerId = '';
    }

    setBrowserOwnerId(ownerId);
  }, []);

  useEffect(() => {
    setVolunteerPhotoIndex((current) => Math.min(current, Math.max(volunteerGroupPhotos.length - 1, 0)));
  }, [volunteerGroupPhotos.length]);

  useEffect(() => {
    if (volunteerGroupPhotos.length <= 1) {
      setFeaturedCommunityActionPhotoIds((current) => (current.length ? [] : current));
      return;
    }

    const recentPhotos = volunteerGroupPhotos.slice(
      0,
      Math.min(volunteerGroupPhotos.length, COMMUNITY_ACTION_RECENT_RANDOM_WINDOW)
    );

    const shuffledRecentPhotos = [...recentPhotos];
    for (let index = shuffledRecentPhotos.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const currentPhoto = shuffledRecentPhotos[index];
      shuffledRecentPhotos[index] = shuffledRecentPhotos[randomIndex];
      shuffledRecentPhotos[randomIndex] = currentPhoto;
    }

    const nextFeaturedIds = shuffledRecentPhotos
      .slice(0, Math.min(COMMUNITY_ACTION_FEATURED_COUNT, shuffledRecentPhotos.length))
      .map((photo) => photo.id);

    setFeaturedCommunityActionPhotoIds((current) => {
      if (
        current.length === nextFeaturedIds.length
        && current.every((id, index) => id === nextFeaturedIds[index])
      ) {
        return current;
      }

      return nextFeaturedIds;
    });
  }, [communityActionSubmissions]);

  useEffect(() => {
    setBeforeAfterPairIndex((current) => Math.min(current, Math.max(beforeAfterGalleryPageCount - 1, 0)));
  }, [beforeAfterGalleryPageCount]);

  useEffect(() => {
    if (beforeAfterPhotoPairs.length <= 1) {
      setFeaturedBeforeAfterSecondaryPairId((current) => (current ? '' : current));
      return;
    }

    setFeaturedBeforeAfterSecondaryPairId((current) => {
      if (
        current
        && beforeAfterPhotoPairs.some((pair) => pair.id === current)
        && current !== beforeAfterPhotoPairs[0]?.id
      ) {
        return current;
      }

      const recentPairs = beforeAfterPhotoPairs.slice(
        1,
        Math.min(beforeAfterPhotoPairs.length, BEFORE_AFTER_RECENT_RANDOM_WINDOW)
      );

      if (!recentPairs.length) {
        return '';
      }

      const randomIndex = Math.floor(Math.random() * recentPairs.length);
      const nextPair = recentPairs[randomIndex] || null;
      return nextPair?.id || '';
    });
  }, [approvedBeforeAfterSubmissions]);

  useEffect(() => {
    if (!queuedVolunteerHighlightKey && !queuedBeforeAfterHighlightKey) {
      return;
    }

    const section = document.getElementById('how-it-works');

    if (!section || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setActiveVolunteerHighlightKey(queuedVolunteerHighlightKey);
      setActiveBeforeAfterHighlightKey(queuedBeforeAfterHighlightKey);
      setQueuedVolunteerHighlightKey('');
      setQueuedBeforeAfterHighlightKey('');
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);

        if (!isVisible) {
          return;
        }

        setActiveVolunteerHighlightKey(queuedVolunteerHighlightKey);
        setActiveBeforeAfterHighlightKey(queuedBeforeAfterHighlightKey);
        setQueuedVolunteerHighlightKey('');
        setQueuedBeforeAfterHighlightKey('');
        observer.disconnect();
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [queuedVolunteerHighlightKey, queuedBeforeAfterHighlightKey]);

  useEffect(() => {
    if (!activeVolunteerHighlightKey && !activeBeforeAfterHighlightKey) {
      return;
    }

    const glowTimer = window.setTimeout(() => {
      setActiveVolunteerHighlightKey('');
      setActiveBeforeAfterHighlightKey('');
    }, 2000);

    return () => {
      window.clearTimeout(glowTimer);
    };
  }, [activeVolunteerHighlightKey, activeBeforeAfterHighlightKey]);

  const handleBeforeAfterPhotoInputChange = async (slotIndex, event) => {
    const newFiles = Array.from(event.target.files || []);

    if (!newFiles.length) {
      return;
    }

    const invalidFile = newFiles.find((file) => getPhotoFileValidationError(file));
    if (invalidFile) {
      setPhotoFormError(getPhotoFileValidationError(invalidFile));
      event.target.value = '';
      return;
    }

    const [selectedFile] = newFiles;
    const processedResult = await Promise.allSettled([
      processCleanupPhotoFile(selectedFile, slotIndex),
    ]);

    if (processedResult[0]?.status === 'rejected') {
      setPhotoFormError(
        processedResult[0].reason instanceof Error
          ? processedResult[0].reason.message
          : 'One of your selected images could not be processed for upload. Please try a different image.'
      );
      event.target.value = '';
      return;
    }

    const processedFile = processedResult[0].value;
    const preparedImage = {
      file: processedFile,
      previewUrl: URL.createObjectURL(processedFile),
    };

    setPhotoFormError('');

    setSelectedimages((current) => {
      const nextImages = [...current];

      if (nextImages[slotIndex]?.previewUrl) {
        URL.revokeObjectURL(nextImages[slotIndex].previewUrl);
      }

      nextImages[slotIndex] = preparedImage;
      return nextImages;
    });

    setPhotoCropPositions((currentCropPositions) => {
      const nextCropPositions = [...currentCropPositions];
      nextCropPositions[slotIndex] = createDefaultCropPosition();
      return nextCropPositions;
    });

    event.target.value = '';
  };

  const handleCommunityActionPhotoInputChange = async (event) => {
    const newFiles = Array.from(event.target.files || []);

    if (!newFiles.length) {
      return;
    }

    const invalidFile = newFiles.find((file) => getPhotoFileValidationError(file));
    if (invalidFile) {
      setPhotoFormError(getPhotoFileValidationError(invalidFile));
      event.target.value = '';
      return;
    }

    const [selectedFile] = newFiles;

    try {
      const processedFile = await processCleanupPhotoFile(selectedFile, 0);

      setCommunityActionSelectedPhoto((current) => {
        if (current?.previewUrl) {
          URL.revokeObjectURL(current.previewUrl);
        }

        return {
          file: processedFile,
          previewUrl: URL.createObjectURL(processedFile),
        };
      });

      setPhotoFormError('');
    } catch (error) {
      setPhotoFormError(error instanceof Error ? error.message : 'That image could not be prepared. Please try a different photo.');
      clearCommunityActionPhotoSelection();
    } finally {
      event.target.value = '';
    }
  };

  const handleRemoveSelectedPhoto = (index) => {
    setSelectedimages((current) => {
      const next = [...current];
      if (next[index]?.previewUrl) {
        URL.revokeObjectURL(next[index].previewUrl);
      }
      next[index] = null;
      return next;
    });

    setPhotoCropPositions((current) => {
      const next = [...current];
      next[index] = createDefaultCropPosition();
      return next;
    });

    setActivePhotoDrag(null);
    setDragSwapSourceIndex(null);
    setPhotoFormError('');
  };

  const handleStartOverPhotoPreparation = () => {
    setSelectedimages((current) => {
      current.forEach((image) => {
        if (image?.previewUrl) {
          URL.revokeObjectURL(image.previewUrl);
        }
      });

      return [null, null];
    });
    setPhotoCropPositions([createDefaultCropPosition(), createDefaultCropPosition()]);
    setActivePhotoDrag(null);
    setDragSwapSourceIndex(null);
    setPhotoFormError('');
  };

  const handleRemoveCommunityActionPhoto = () => {
    clearCommunityActionPhotoSelection();
    setPhotoFormError('');
  };

  const swapPhotoSlots = (firstIndex, secondIndex) => {
    if (firstIndex === secondIndex) {
      return;
    }

    setSelectedimages((current) => {
      const next = [...current];
      [next[firstIndex], next[secondIndex]] = [next[secondIndex], next[firstIndex]];
      return next;
    });

    setPhotoCropPositions((current) => {
      const next = [...current];
      [next[firstIndex], next[secondIndex]] = [next[secondIndex], next[firstIndex]];
      return next;
    });

    setPhotoFormError('');
  };

  const handleSwapSelectedPhotos = () => {
    if (photoSubmissionType !== PHOTO_TYPE_BEFORE_AFTER) {
      return;
    }

    const selectedCount = selectedimages.filter(Boolean).length;
    if (selectedCount < 2) {
      setPhotoFormError('Add both Before and After photos first, then use SWAP PHOTOS if needed.');
      return;
    }

    swapPhotoSlots(0, 1);
  };

  const handlePhotoPreviewPointerDown = (index, event) => {
    if (!selectedimages[index]) {
      return;
    }

    const frameRect = event.currentTarget.getBoundingClientRect();
    const startPosition = normalizePhotoCropPosition(photoCropPositions[index]);

    setActivePhotoDrag({
      index,
      startX: event.clientX,
      startY: event.clientY,
      frameWidth: frameRect.width,
      frameHeight: frameRect.height,
      startPosition,
    });

    event.currentTarget.setPointerCapture?.(event.pointerId);
    setPhotoFormError('');
  };

  const handlePhotoPreviewPointerMove = (index, event) => {
    if (!activePhotoDrag || activePhotoDrag.index !== index || !selectedimages[index]) {
      return;
    }

    event.preventDefault();

    const deltaX = event.clientX - activePhotoDrag.startX;
    const deltaY = event.clientY - activePhotoDrag.startY;
    const safeWidth = activePhotoDrag.frameWidth || 1;
    const safeHeight = activePhotoDrag.frameHeight || 1;

    const nextX = clamp(activePhotoDrag.startPosition.x + (deltaX / safeWidth) * 100, 0, 100);
    const nextY = clamp(activePhotoDrag.startPosition.y + (deltaY / safeHeight) * 100, 0, 100);

    setPhotoCropPositions((current) => {
      const next = [...current];
      next[index] = { x: nextX, y: nextY };
      return next;
    });
  };

  const handlePhotoPreviewPointerUp = (index, event) => {
    if (activePhotoDrag?.index !== index) {
      return;
    }

    event.currentTarget.releasePointerCapture?.(event.pointerId);
    setActivePhotoDrag(null);
  };

  const handlePhotoPreviewDragStart = (index, event) => {
    if (!selectedimages[index]) {
      event.preventDefault();
      return;
    }

    setDragSwapSourceIndex(index);

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
    }
  };

  const handlePhotoPreviewDrop = (targetIndex, event) => {
    event.preventDefault();

    const transferSource = Number.parseInt(event.dataTransfer?.getData('text/plain') || '', 10);
    const sourceIndex = Number.isInteger(transferSource) ? transferSource : dragSwapSourceIndex;

    if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || sourceIndex >= MAX_PHOTO_UPLOADS) {
      setDragSwapSourceIndex(null);
      return;
    }

    if (sourceIndex !== targetIndex && selectedimages[sourceIndex] && selectedimages[targetIndex]) {
      swapPhotoSlots(sourceIndex, targetIndex);
    }

    setDragSwapSourceIndex(null);
  };

  const handlePhotoPreviewDragEnd = () => {
    setDragSwapSourceIndex(null);
  };

  const buildBeforeAfterSubmission = async (submissionId) => {
    const beforeImage = selectedimages[0];
    const afterImage = selectedimages[1];

    if (!beforeImage || !afterImage) {
      throw new Error('Please upload both a BEFORE photo and an AFTER photo before submitting.');
    }

    const beforeError = getPhotoFileValidationError(beforeImage.file);
    if (beforeError) {
      throw new Error(beforeError);
    }

    const afterError = getPhotoFileValidationError(afterImage.file);
    if (afterError) {
      throw new Error(afterError);
    }

    const pairCaption = beforeAfterCaption.trim();
    const filesToUpload = [
      { image: beforeImage, index: 0, role: 'before' },
      { image: afterImage, index: 1, role: 'after' },
    ];

    const uploadResults = await Promise.allSettled(
      filesToUpload.map(async ({ image, index, role }) => {
        const uploadedImage = await uploadCleanupPhotoToSupabase(
          image.file,
          submissionId,
          index,
          'neighborhood-cleanup-photos',
          role === 'before' ? 'Before photo' : 'After photo'
        );

        return {
          storagePath: uploadedImage.storagePath,
          publicUrl: uploadedImage.publicUrl,
          role,
          caption: pairCaption,
          cropPosition: normalizePhotoCropPosition(photoCropPositions[index]),
        };
      })
    );

    const rejectedUploads = uploadResults
      .map((result, uploadIndex) => ({ result, uploadIndex }))
      .filter(({ result }) => result.status === 'rejected');

    if (rejectedUploads.length) {
      const rejectedMessages = rejectedUploads.map(({ result, uploadIndex }) => {
        const file = filesToUpload[uploadIndex]?.image?.file;
        const baseLabel = `Photo ${uploadIndex + 1}${file?.name ? ` (${file.name})` : ''}`;

        if (result.status === 'rejected' && result.reason instanceof Error) {
          return result.reason.message || `${baseLabel} failed to upload.`;
        }

        return `${baseLabel} failed to upload.`;
      });

      throw new Error(rejectedMessages.join(' '));
    }

    const storedImages = uploadResults
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    if (storedImages.length !== 2) {
      throw new Error('Please upload exactly one BEFORE photo and one AFTER photo.');
    }

    return {
      id: submissionId,
      submittedAt: new Date().toISOString(),
      photoType: PHOTO_TYPE_BEFORE_AFTER,
      ownerId: browserOwnerId || '',
      pairCaption,
      beforeCaption: pairCaption,
      afterCaption: pairCaption,
      images: storedImages,
    };
  };

  const submitBeforeAfterPairForReview = async (submission) => {
    const images = Array.isArray(submission?.images) ? submission.images : [];
    const beforeImage = images.find((image) => image?.role === 'before') || images[0] || null;
    const afterImage = images.find((image) => image?.role === 'after') || images[1] || null;
    const beforeImageUrl = String(beforeImage?.publicUrl || '').trim();
    const afterImageUrl = String(afterImage?.publicUrl || '').trim();

    if (!beforeImageUrl || !afterImageUrl) {
      throw new Error('Please upload both a BEFORE photo and an AFTER photo before submitting.');
    }

    const response = await fetch('/api/community-before-after', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        before_image_url: beforeImageUrl,
        after_image_url: afterImageUrl,
        before_image_path: String(beforeImage?.storagePath || ''),
        after_image_path: String(afterImage?.storagePath || ''),
        pair_caption: String(submission?.pairCaption || ''),
      }),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Unable to submit before/after pair.');
    }

    return {
      id: String(data?.id || '').trim(),
      moderationStatus: String(data?.moderation_status || '').trim(),
    };
  };

  const submitCommunityActionPhotoForReview = async (submission) => {
    const images = Array.isArray(submission?.images) ? submission.images : [];
    const image = images[0] || null;
    const imageUrl = String(image?.publicUrl || '').trim();

    if (!imageUrl) {
      throw new Error('Please add one Community in Action photo before submitting.');
    }

    const response = await fetch('/api/community-action-photos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        image_path: String(image?.storagePath || ''),
        caption: '',
      }),
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Unable to submit community action photo.');
    }
  };

  const buildCommunityActionSubmission = async (submissionId) => {
    if (!communityActionSelectedPhoto) {
      throw new Error('Please add one Community in Action photo before submitting.');
    }

    const invalidFile = getPhotoFileValidationError(communityActionSelectedPhoto.file);
    if (invalidFile) {
      throw new Error(invalidFile);
    }

    const uploadedImage = await uploadCleanupPhotoToSupabase(
      communityActionSelectedPhoto.file,
      submissionId,
      0,
      'community-action-submissions',
      'Community in Action photo'
    );

    return {
      id: submissionId,
      submittedAt: new Date().toISOString(),
      photoType: PHOTO_TYPE_COMMUNITY_ACTION,
      ownerId: browserOwnerId || '',
      images: [{
        storagePath: uploadedImage.storagePath,
        publicUrl: uploadedImage.publicUrl,
        role: PHOTO_TYPE_COMMUNITY_ACTION,
        cropPosition: createDefaultCropPosition(),
      }],
    };
  };

  const handleTrackBeforeAfterPhotoSubmit = async (event) => {
    event.preventDefault();

    if (isUploadingCleanupPhotos) {
      return;
    }

    if (!hasConfirmedPhotoGuidelines) {
      setPhotoFormError('Please confirm the Community Photo Guidelines checkbox before submitting.');
      return;
    }

    setPhotoFormError('');
    setIsUploadingCleanupPhotos(true);
    const submissionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    try {
      const newSubmission = await buildBeforeAfterSubmission(submissionId);
      const createdPair = await submitBeforeAfterPairForReview(newSubmission);
      const approvedSubmission = {
        ...newSubmission,
        id: createdPair?.id || newSubmission.id,
      };

      setApprovedBeforeAfterSubmissions((current) => normalizePhotoSubmissions([
        approvedSubmission,
        ...current,
      ]));
      setPendingTrackPhotoSubmission(newSubmission);
      closePhotoModal();
      finalizeTrackSubmission(newSubmission);
    } catch (error) {
      setPhotoFormError(error instanceof Error ? error.message : 'Photo upload failed. Please try again.');
    } finally {
      setIsUploadingCleanupPhotos(false);
    }
  };

  const handleCommunityActionPhotoSubmit = async (event) => {
    event.preventDefault();

    if (isUploadingCleanupPhotos) {
      return;
    }

    if (!hasConfirmedPhotoGuidelines) {
      setPhotoFormError('Please confirm the Community Photo Guidelines checkbox before submitting.');
      return;
    }

    setPhotoFormError('');
    setIsUploadingCleanupPhotos(true);
    const submissionId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    try {
      const newSubmission = await buildCommunityActionSubmission(submissionId);
      await submitCommunityActionPhotoForReview(newSubmission);
      saveCommunityActionSubmissionToStorage(newSubmission);

      closePhotoModal();
    } catch (error) {
      setPhotoFormError(error instanceof Error ? error.message : 'Photo upload failed. Please try again.');
    } finally {
      setIsUploadingCleanupPhotos(false);
    }
  };

  const closeTrackModal = () => {
    setIsTrackModalOpen(false);
    setIsGpsDetailsOpen(false);
    setLocationError('');
    setSubmitMessage('');
    setPhotoStorageWarning('');
    setIsSubmissionSuccess(false);
    setIsTrackCelebrationVisible(false);
    setIsSubmittingTrackEntry(false);
    setIsResolvingLocation(false);
    setResolvedTrackLatLng(null);
    setHasSelectedTrackMarker(false);
    setPendingReviewLatLng(null);
    setLocationReviewMessage('');
    setPendingTrackPhotoSubmission(null);
    setPhotoStorageWarning('');
  };

  const finalizeTrackSubmission = (photoSubmissionOverride = pendingTrackPhotoSubmission) => {
    setIsSubmittingTrackEntry(true);
    setPhotoStorageWarning('');

    const normalizedCleanupPhotos = (Array.isArray(photoSubmissionOverride?.images)
      ? photoSubmissionOverride.images
      : Array.isArray(photoSubmissionOverride?.cleanupPhotos)
        ? photoSubmissionOverride.cleanupPhotos
        : [])
      .map((image) => ({
        storagePath: image?.storagePath || '',
        publicUrl: image?.publicUrl || image?.src || '',
        caption: image?.caption || '',
        role: image?.role || '',
        cropPosition: normalizePhotoCropPosition(image?.cropPosition),
      }))
      .filter((image) => image.publicUrl || image.storagePath);

    const normalizedPhotoSubmission = photoSubmissionOverride
      ? {
          ...photoSubmissionOverride,
          photoType: photoSubmissionOverride.photoType || getSubmissionType(photoSubmissionOverride),
          ownerId: photoSubmissionOverride.ownerId || '',
          images: normalizedCleanupPhotos,
        }
      : null;

    const entry = {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      ...trackForm,
      gpsLocation,
      resolvedTrackLatLng,
      bagCount: normalizeBagCount(trackForm.bagCount),
      cleanupPhotos: normalizedCleanupPhotos,
      cleanupPhotoType: normalizedPhotoSubmission?.photoType || '',
    };

    try {
      const parsedEntries = JSON.parse(localStorage.getItem(TRACK_SUBMISSIONS_KEY) || '[]');
      const currentEntries = Array.isArray(parsedEntries) ? parsedEntries : [];
      currentEntries.push(entry);
      localStorage.setItem(TRACK_SUBMISSIONS_KEY, JSON.stringify(currentEntries));

      // On success, re-fetch to rebuild shared counters and map from confirmed server rows.
      fetch('/api/cleanup-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: entry.actionType,
          bag_count: entry.bagCount,
          marker_lat: resolvedTrackLatLng[0],
          marker_lng: resolvedTrackLatLng[1],
          gps_lat: gpsLocation?.latitude ?? null,
          gps_lng: gpsLocation?.longitude ?? null,
          neighborhood: String(trackForm.neighborhood || '').trim() || null,
          city: String(trackForm.city || '').trim() || null,
          cross_streets: String(trackForm.crossStreets || '').trim() || null,
          location_description: String(trackForm.locationDescription || '').trim() || null,
          raw_payload: entry,
        }),
      })
        .then((res) => (res.ok ? fetch('/api/cleanup-submissions') : Promise.reject()))
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then(({ submissions }) => {
          const rows = Array.isArray(submissions) ? submissions : [];
          setSharedSubmissions(rows);
          const footprints = rows
            .filter((row) => Number.isFinite(row.marker_lat) && Number.isFinite(row.marker_lng))
            .map((row) => [row.marker_lat, row.marker_lng]);
          setNearbyExistingFootprints(footprints);
          setSavedCleanupSubmissionCount(rows.length);
          setSavedCleanupBagTotal(rows.reduce((total, row) => total + (row.bag_count || 0), 0));
        })
        .catch(() => {});

      if (normalizedPhotoSubmission?.images?.length) {
        const submissionToPersist = {
          ...normalizedPhotoSubmission,
          submittedAt: entry.submittedAt,
        };
        const submissionType = getSubmissionType(submissionToPersist);
        const didPersistPhotoSubmission =
          submissionType === PHOTO_TYPE_BEFORE_AFTER
            ? savePhotoSubmissionToStorage(submissionToPersist)
            : saveCommunityActionSubmissionToStorage({
                ...submissionToPersist,
                photoType: PHOTO_TYPE_COMMUNITY_ACTION,
                images: (submissionToPersist.images || []).slice(0, 1),
              });

        if (!didPersistPhotoSubmission) {
          setPhotoStorageWarning('Your photos are attached for this submission, but they may not remain after you close or refresh this page.');
        }

        setPendingTrackPhotoSubmission(null);
      }

      setNewFootprintLatLng([resolvedTrackLatLng[0], resolvedTrackLatLng[1]]);
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
      setHasSelectedTrackMarker(false);
      setPendingReviewLatLng(null);
      setLocationReviewMessage('');
      setLocationError('');
      setPendingTrackPhotoSubmission(null);
      setShowPostPhotosStep(false);
      setIsGpsDetailsOpen(false);
      setIsTrackModalOpen(false);
      return true;
    } catch {
      setIsSubmissionSuccess(false);
      setLocationError('We could not save your cleanup right now. Please try again.');
      return false;
    } finally {
      setIsSubmittingTrackEntry(false);
    }
  };

  const handleTrackSubmit = (event) => {
    event.preventDefault();

    if (isSubmittingTrackEntry) {
      return;
    }

    if (!trackForm.actionType) {
      setLocationError('Select one action before submitting.');
      return;
    }

    if (!hasLocationInput() || !hasSelectedTrackMarker) {
      setLocationError('Choose and confirm a map marker location before submitting.');
      return;
    }

    finalizeTrackSubmission();
  };

  useEffect(() => {
    if (!photoStorageWarning) {
      return;
    }

    const warningTimer = window.setTimeout(() => {
      setPhotoStorageWarning('');
    }, 6000);

    return () => {
      window.clearTimeout(warningTimer);
    };
  }, [photoStorageWarning]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const shouldLockScroll = isTrackModalOpen || isModalOpen || isShareModalOpen || isPhotoGalleryOpen || isTrackCelebrationVisible;
    const lockState = scrollLockStateRef.current;

    if (shouldLockScroll && !lockState.isLocked) {
      lockState.bodyOverflow = document.body.style.overflow;
      lockState.htmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      lockState.isLocked = true;
    }

    if (!shouldLockScroll && lockState.isLocked) {
      document.body.style.overflow = lockState.bodyOverflow;
      document.documentElement.style.overflow = lockState.htmlOverflow;
      lockState.isLocked = false;
    }

    return () => {
      if (!scrollLockStateRef.current.isLocked) {
        return;
      }

      document.body.style.overflow = scrollLockStateRef.current.bodyOverflow;
      document.documentElement.style.overflow = scrollLockStateRef.current.htmlOverflow;
      scrollLockStateRef.current.isLocked = false;
    };
  }, [isTrackModalOpen, isModalOpen, isShareModalOpen, isPhotoGalleryOpen, isTrackCelebrationVisible]);

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

    setResolvedTrackLatLng([47.6062, -122.3321]);
    setHasSelectedTrackMarker(false);
    setPendingReviewLatLng(null);
    setLocationReviewMessage('');
    setLocationError('');
  }, [isTrackModalOpen]);

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

  useEffect(() => {
    if (!hasNewFootprintMarker) {
      return;
    }

    setShowPostPhotosStep(true);
  }, [hasNewFootprintMarker]);

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
        <section className="relative overflow-hidden border-b border-[#0f9aa1]/30 bg-[linear-gradient(135deg,_#fdf7e8_0%,_#d3f1f4_38%,_#d7f0c7_100%)] pb-0 pt-0 sm:pb-10 sm:pt-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-[radial-gradient(circle_at_15%_0%,rgba(183,225,237,0.34),transparent_42%),radial-gradient(circle_at_88%_0%,rgba(106,190,224,0.28),transparent_46%)] sm:h-28 sm:bg-[radial-gradient(circle_at_15%_0%,rgba(229,111,90,0.22),transparent_38%),radial-gradient(circle_at_88%_0%,rgba(15,154,161,0.2),transparent_42%)]" aria-hidden="true" />

          <div className="relative">
            <svg
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-9 w-full text-[#cdeaf2]/95 sm:h-20 sm:text-[#fdf7e8]/95"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M0,80L60,74.7C120,69,240,59,360,53.3C480,48,600,48,720,58.7C840,69,960,91,1080,96C1200,101,1320,91,1380,85.3L1440,80L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
              />
            </svg>

            <div className="relative h-[240px] w-full sm:min-h-[30rem] lg:min-h-[36rem]">
              <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                {IMAGINE_SLIDES.map((slide, slideIndex) => {
                  const isActiveSlide = slideIndex === imagineSlideIndex;

                  return (
                    <div
                      key={`imagine-slide-${slideIndex}`}
                      className={`absolute inset-0 h-full w-full transition-opacity ease-in-out motion-reduce:transition-none ${isActiveSlide ? 'opacity-100' : 'opacity-0'}`}
                      style={{ transitionDuration: `${IMAGINE_SLIDE_FADE_MS}ms` }}
                    >
                      {slide?.src ? (
                        <img
                          src={slide.src}
                          alt=""
                          aria-hidden="true"
                          className="h-full w-full object-cover object-center"
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div
                className={`absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,245,0.12)_0%,rgba(255,252,245,0.08)_38%,rgba(255,252,245,0.12)_100%)] transition-opacity ease-in-out motion-reduce:transition-none ${imagineSlideIndex === 1 ? 'opacity-0' : 'opacity-100'}`}
                style={{ transitionDuration: `${IMAGINE_SLIDE_FADE_MS}ms` }}
                aria-hidden="true"
              />
              <div
                className={`absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(244,201,76,0.1),transparent_36%),radial-gradient(circle_at_80%_15%,rgba(46,196,199,0.12),transparent_40%)] transition-opacity ease-in-out motion-reduce:transition-none ${imagineSlideIndex === 1 ? 'opacity-0' : 'opacity-100'}`}
                style={{ transitionDuration: `${IMAGINE_SLIDE_FADE_MS}ms` }}
                aria-hidden="true"
              />

              <div className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center sm:container-custom sm:relative sm:min-h-[30rem] sm:px-0 sm:py-16 lg:min-h-[36rem] lg:py-20">
                <div className="mx-auto max-w-4xl">
                  <h1 className={`${poppinsHero.className} text-[2.6rem] font-normal tracking-[0.02em] text-[#fff9ea] [text-shadow:0_6px_20px_rgba(0,34,68,0.55)] sm:text-[4.1rem] lg:text-[5.3rem]`}>
                    Imagine...
                  </h1>
                  <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-[#fff7ea] [text-shadow:0_4px_16px_rgba(0,34,68,0.5)] sm:mt-5 sm:text-2xl lg:text-[1.85rem]">
                    A city where every person leaves every place a little better than they found it.
                  </p>
                </div>
              </div>

              <svg
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 w-full text-[#d7eef5]/95 sm:hidden"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M0,80L60,74.7C120,69,240,59,360,53.3C480,48,600,48,720,58.7C840,69,960,91,1080,96C1200,101,1320,91,1380,85.3L1440,80L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
                />
              </svg>
            </div>
          </div>
        </section>

        <section id="day-one" className="bg-[linear-gradient(180deg,_#fff6e4_0%,_#fff9ee_100%)] py-20 sm:py-24 lg:py-28">
          <div className="container-custom mx-auto">
            <div className="mx-auto w-full text-center">
              <p className="hidden text-sm font-semibold uppercase tracking-[0.3em] text-[#157a9a] sm:block">
                DAY ONE
              </p>
              <p className="text-lg font-bold leading-relaxed text-[#157a9a] sm:hidden">
                One person. One piece. One better Seattle.
              </p>

              <div className="mt-9 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:gap-10">
                <div className="flex min-h-[23rem] flex-col justify-between rounded-[2rem] border border-[#f4c94c]/45 bg-[linear-gradient(180deg,_#fffef9_0%,_#fff1cd_100%)] p-6 shadow-[0_20px_44px_rgba(244,166,42,0.13)] sm:min-h-[28rem] sm:p-7 lg:min-h-[34rem] lg:p-9">
                  <div className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#7b6630] sm:text-base">
                    BEFORE
                  </div>
                  <div className="mt-5 flex flex-1 items-center justify-center rounded-[1.5rem] border border-[#f4c94c]/35 bg-[radial-gradient(circle_at_top,_rgba(248,201,72,0.24),_transparent_55%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(255,248,230,0.97))] text-center">
                    {dayOneFixedBeforeImage ? (
                      <img
                        src={getStoredImageUrl(dayOneFixedBeforeImage)}
                        alt="Neighborhood cleanup before photo"
                        className="h-full w-full rounded-[1.2rem] object-cover"
                        style={{ objectPosition: getPhotoObjectPosition(dayOneFixedBeforeImage) }}
                      />
                    ) : (
                      <span className="text-3xl font-semibold tracking-[0.25em] text-[#8b7350] sm:text-4xl lg:text-5xl">
                        BEFORE
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex min-h-[23rem] flex-col justify-between rounded-[2rem] border border-[#69BE28]/35 bg-[linear-gradient(180deg,_#fffef9_0%,_#e8f5e1_100%)] p-6 shadow-[0_20px_44px_rgba(105,190,40,0.13)] sm:min-h-[28rem] sm:p-7 lg:min-h-[34rem] lg:p-9">
                  <div className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#447a25] sm:text-base">
                    AFTER
                  </div>
                  <div className="mt-5 flex flex-1 items-center justify-center rounded-[1.5rem] border border-[#69BE28]/30 bg-[radial-gradient(circle_at_top,_rgba(46,196,199,0.16),_transparent_55%),linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(235,250,242,0.95))] text-center">
                    {dayOneFixedAfterImage ? (
                      <img
                        src={getStoredImageUrl(dayOneFixedAfterImage)}
                        alt="Neighborhood cleanup after photo"
                        className="h-full w-full rounded-[1.2rem] object-cover"
                        style={{ objectPosition: getPhotoObjectPosition(dayOneFixedAfterImage) }}
                      />
                    ) : (
                      <span className="text-3xl font-semibold tracking-[0.25em] text-[#50834f] sm:text-4xl lg:text-5xl">
                        AFTER
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
                <p className="text-2xl leading-relaxed font-medium text-[#002b49] sm:text-3xl lg:text-[2.1rem]">
                  One person started picking up litter. Another person noticed and joined in. Four bags later, the block looked better... and the movement had begun.
                </p>
                <p className="mt-6 text-lg font-semibold text-[#61b826] sm:text-xl lg:text-2xl">
                  We are just getting started.
                </p>
              </div>

              <div className="mx-auto mt-12 w-full">
                <h3 className={`${balooDisplay.className} text-3xl font-bold text-[#0f9aa1] sm:text-4xl lg:text-5xl`}>
                  Community in Action Photos!
                </h3>
                <div className="mt-4 flex w-full justify-center">
                  <div className="share-button-visible-center">
                    <ShareButton
                      url="/#day-one"
                      title="Community in Action | Pick It Up Seattle"
                      text="Check out Community in Action photos from Pick It Up Seattle."
                      label="Share Community in Action"
                    />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                  {[0, 1, 2, 3].map((slotIndex) => {
                    const photo = featuredCommunityActionPhotos[slotIndex] || null;

                    if (!photo) {
                      const placeholderClasses = [
                        'border-[#0f9aa1]/28 bg-[linear-gradient(145deg,_#fffef8_0%,_#e8f5fb_100%)]',
                        'border-[#69BE28]/28 bg-[linear-gradient(145deg,_#fffef8_0%,_#edf8e3_100%)]',
                        'border-[#D9665B]/28 bg-[linear-gradient(145deg,_#fffef8_0%,_#fde8e4_100%)]',
                        'border-[#2ec4c7]/28 bg-[linear-gradient(145deg,_#fffef8_0%,_#e8f8f7_100%)]',
                      ];

                      return (
                        <div
                          key={`community-photo-placeholder-${slotIndex}`}
                          className={`aspect-square rounded-[1.4rem] border shadow-[0_12px_28px_rgba(0,43,73,0.1)] ${placeholderClasses[slotIndex]}`}
                          aria-label="Community photo placeholder"
                        />
                      );
                    }

                    return (
                      <div key={`community-in-action-featured-${photo.id}-${slotIndex}`} className="rounded-[1.4rem] border border-[#0f9aa1]/28 bg-white p-2 shadow-[0_12px_28px_rgba(0,43,73,0.1)]">
                        <div className="aspect-square overflow-hidden rounded-xl border border-[#0f9aa1]/20 bg-white">
                          <img
                            src={getStoredImageUrl(photo)}
                            alt="Community in Action photo"
                            className="h-full w-full object-contain object-center"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {volunteerGroupPhotos.length ? (
                  <div className="mt-4 flex justify-center">
                    <button
                      type="button"
                      onClick={openVolunteerGallery}
                      className="text-sm font-semibold text-[#1f5f7a] transition hover:text-[#002b49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f9aa1]/30"
                    >
                      View All Community in Action Photos
                    </button>
                  </div>
                ) : null}
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={openCommunityActionPhotoModal}
                    className="w-full max-w-sm rounded-2xl border border-[#0f9aa1]/18 bg-[linear-gradient(145deg,_#2ec4c7_0%,_#7cd157_62%,_#69be28_100%)] px-2 py-2 text-center text-[#002244] shadow-[0_8px_16px_rgba(15,154,161,0.12)] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0f9aa1]/26 sm:px-3 sm:py-3"
                  >
                    <p className="text-2xl leading-none sm:text-3xl" aria-hidden="true">📸</p>
                    <p className="mt-2 text-sm font-semibold text-[#002244] sm:text-base">Share Your Photos</p>
                  </button>
                </div>
                <p className="mx-auto mt-8 max-w-7xl px-4 text-center text-lg font-medium leading-relaxed text-[#002b49] sm:px-6 sm:text-xl lg:text-2xl">
                  Every transformation begins with someone who simply decided to help. Meet our community.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#0f9aa1]/45 bg-[linear-gradient(122deg,_#1aa1ab_0%,_#58c92e_50%,_#f0ab2f_100%)] py-14 text-[#002244] sm:py-16">
          <div className="container-custom text-center">
            <h2 className={`${balooDisplay.className} text-3xl font-bold text-white sm:text-4xl lg:text-5xl`}>
              Every small act helps build a brighter Seattle.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-xl font-semibold leading-relaxed text-[#fef9ee] sm:text-2xl lg:text-2xl">
              Join the movement, share kindness, and help our city shine.
            </p>
            <div className="mt-5 flex w-full justify-center">
              <div className="share-button-visible-center">
                <ShareButton
                  url="/"
                  title="Pick It Up Seattle"
                  text="Join me in supporting Pick It Up Seattle."
                  label="Share Pick It Up Seattle"
                  style={{
                    backgroundImage: 'linear-gradient(145deg, #f4c94c 0%, #f59a2d 55%, #0f9aa1 100%)',
                    borderColor: 'rgba(244, 201, 76, 0.55)',
                    color: '#002244',
                  }}
                />
              </div>
            </div>
            <div className="homepage-featured-gallery-row relative mx-auto mt-10 grid w-full gap-7 text-left md:gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-8">
              <Link
                href="/thank-yous"
                className="homepage-featured-gallery-card group relative flex h-full w-full rounded-[1.5rem] border border-[#0f9aa1]/45 bg-white p-1.5 text-[#fffef8] shadow-[0_12px_24px_rgba(0,43,73,0.11)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,43,73,0.15)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0f9aa1]/24"
              >
                <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-[1.2rem] border border-white/80 lg:min-h-[20rem]">
                  <div className="absolute inset-0 bg-[linear-gradient(116deg,_#0f9aa1_0%,_#2ec4c7_42%,_#69be28_100%)]" aria-hidden="true">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_18%_16%,_rgba(255,255,255,0.32),_transparent_37%),radial-gradient(circle_at_79%_22%,_rgba(255,255,255,0.2),_transparent_34%),linear-gradient(132deg,_rgba(1,68,84,0.06)_0%,_rgba(3,84,109,0.16)_100%)]" />
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,_rgba(0,27,38,0.44)_100%)]" aria-hidden="true" />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center p-5 text-center sm:p-6">
                    <h3 className="text-2xl font-bold leading-tight sm:text-3xl">Thank You Notes</h3>
                    <p className="mt-3 max-w-md text-base text-[#fef9ee] sm:text-lg">
                      Browse heartfelt thank-you notes with optional photos celebrating kindness and generosity from our community.
                    </p>
                    <span className="mt-6 inline-flex items-center text-sm font-semibold uppercase tracking-[0.14em] text-[#b9fff2]">
                      Explore Gallery →
                    </span>
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={openShareModal}
                className="btn-orange relative z-20 mx-auto my-4 inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full px-0 py-0 text-lg font-bold leading-none shadow-[0_12px_26px_rgba(239,127,45,0.34)] transition sm:my-5 sm:h-[4.75rem] sm:w-[4.75rem] sm:text-xl lg:absolute lg:left-1/2 lg:top-1/2 lg:m-0 lg:-translate-x-1/2 lg:-translate-y-1/2"
              >
                Share
              </button>

              <Link
                href="/volunteer-memorable-photos"
                className="homepage-featured-gallery-card group relative flex h-full w-full rounded-[1.5rem] border border-[#f4c94c]/52 bg-white p-1.5 text-[#fffef8] shadow-[0_12px_24px_rgba(0,43,73,0.11)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(0,43,73,0.15)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f4c94c]/25"
              >
                <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden rounded-[1.2rem] border border-white/80 lg:min-h-[20rem]">
                  <div className="absolute inset-0 bg-[linear-gradient(145deg,_#fff6ce_0%,_#f2d46f_46%,_#ddb23a_100%)]" aria-hidden="true">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_20%_16%,_rgba(255,255,255,0.34),_transparent_37%),radial-gradient(circle_at_82%_22%,_rgba(255,255,255,0.24),_transparent_32%),linear-gradient(128deg,_rgba(173,136,22,0.04)_0%,_rgba(173,136,22,0.16)_100%)]" />
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-[linear-gradient(180deg,_rgba(0,0,0,0)_0%,_rgba(38,33,8,0.35)_100%)]" aria-hidden="true" />
                  <div className="relative z-10 flex h-full flex-col items-center justify-center p-5 text-center sm:p-6">
                    <h3 className="text-2xl font-bold leading-tight sm:text-3xl">Scenic Discoveries</h3>
                    <p className="mt-3 max-w-md text-base text-[#fef9ee] sm:text-lg">
                      Browse amazing snapshots from cleanup days that capture the beauty volunteers discovered along the way.
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

        <section id="how-it-works" className="bg-[linear-gradient(180deg,_#f2fdff_0%,_#d7f3d4_52%,_#baeaf1_100%)] py-16 sm:py-20">
          <div className="container-custom mx-auto">
            <div className="mx-auto max-w-7xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f5f7a]">
                How It Works
              </p>
              <h2 className={`${balooDisplay.className} mt-3 text-3xl font-bold text-[#0f9aa1] sm:text-4xl lg:text-5xl`}>
                Three simple steps to keep Seattle cleaner.
              </h2>
              <p className="mx-auto mt-4 max-w-5xl text-lg text-slate-600 lg:text-xl">
                Pick it up wherever you are, add the location, and share your before and after photos with the community.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
              <div className="paint-card border-[#D9665B]/35 p-7 text-center lg:p-8" style={{ background: 'linear-gradient(145deg, #69be28 0%, #0f9aa1 50%, #002244 100%)' }}>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl text-white">
                  🖐️
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white lg:text-2xl">
                  Pick It Up
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#f2fdff] lg:text-base">
                  Pick up one piece of litter.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTrackModalOpen(true)}
                className="paint-card block w-full border-[#0f9aa1]/35 p-7 text-center transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(0,111,143,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0f9aa1]/26 lg:p-8"
                style={{ background: 'linear-gradient(145deg, #1f5f7a 0%, #0f9aa1 55%, #f4c94c 100%)' }}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl text-white">
                  📍
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white lg:text-2xl">
                  Track It
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#fef7df] lg:text-base">
                  Log your cleanup with a neighborhood, nearest corners, or an optional map pin. No photo required.
                </p>
                <span className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#0f9aa1] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,154,161,0.24)]">
                  Open Tracker
                </span>
              </button>

              <div
                className="paint-card border-[#2ec4c7]/35 p-7 text-center lg:p-8"
                style={{ background: 'linear-gradient(145deg, #002244 0%, #0f9aa1 48%, #69be28 82%, #f4c94c 100%)' }}
                onClick={() => setIsTrackModalOpen(true)}
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl text-white">
                  📸
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white lg:text-2xl">
                  Share My Cleanup.
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#fff8e8] lg:text-base">
                  Share your before and after photos.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
              {photoStorageWarning ? (
                <p className="md:col-span-2 rounded-xl border border-[#D9665B]/30 bg-[#fff3f0] px-4 py-2.5 text-sm font-medium text-[#D9665B]">
                  {photoStorageWarning}
                </p>
              ) : null}

              <div className="md:col-span-2">
                <h3 className={`${balooDisplay.className} text-center text-3xl font-bold text-[#0f9aa1] sm:text-4xl lg:text-5xl`}>See the Difference.</h3>
                <div className="mt-4 flex w-full justify-center">
                  <div className="share-button-visible-center">
                    <ShareButton
                      url="/#how-it-works"
                      title="See the Difference | Pick It Up Seattle"
                      text="See these cleanup before-and-after moments from Pick It Up Seattle."
                      label="Share See the Difference"
                    />
                  </div>
                </div>
                <div className="relative mt-6 w-full min-w-0 max-w-[100vw] overflow-x-hidden box-border px-2 md:px-10">
                  <div className="grid w-full min-w-0 max-w-full box-border grid-cols-1 gap-4 md:grid-cols-2">
                    {[0, 1].map((slotIndex) => {
                      const pair = visibleBeforeAfterPairs[slotIndex] || null;

                      return (
                        <div key={pair?.id || `before-after-slot-${slotIndex}`} className={`mx-auto flex h-full w-full min-w-0 max-w-full box-border flex-col rounded-[1.4rem] border border-[#0f9aa1]/45 bg-[linear-gradient(145deg,_#0f9aa1_0%,_#0a5065_100%)] px-3 pb-2 pt-2 text-left text-white shadow-[0_14px_34px_rgba(15,154,161,0.28)] transition-shadow duration-700 md:max-w-none md:px-4 md:pb-3 md:pt-3 ${pair?.id === activeBeforeAfterHighlightKey ? 'shadow-[0_0_0_3px_rgba(244,201,76,0.7),0_18px_45px_rgba(244,201,76,0.38)]' : ''}`}>
                          <div className="relative mt-0.5 aspect-video min-h-[16rem] w-full min-w-0 max-w-full box-border overflow-hidden rounded-[1rem] border border-[#002b49]/45 bg-[linear-gradient(145deg,_#0f9aa1_0%,_#0a5065_100%)] sm:min-h-[18rem] lg:min-h-[21rem]" aria-label="Before and after photo pair">
                            {pair ? (
                              <div className="grid h-full min-w-0 max-w-full box-border grid-cols-2 gap-1">
                                <div className="flex h-full min-w-0 max-w-full box-border flex-col">
                                  <div className="h-full overflow-hidden rounded-[0.8rem] border border-[#002b49]/35 bg-[#0b6d87]/30">
                                    {pair.beforeImage ? (
                                      <img src={getStoredImageUrl(pair.beforeImage)} alt="Neighborhood cleanup before photo" className="h-full w-full max-w-full object-cover" style={{ objectPosition: getPhotoObjectPosition(pair.beforeImage) }} />
                                    ) : (
                                      <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.14em] text-white/80">Before</div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex h-full min-w-0 max-w-full box-border flex-col">
                                  <div className="h-full overflow-hidden rounded-[0.8rem] border border-[#002b49]/35 bg-[#2b7e22]/25">
                                    {pair.afterImage ? (
                                      <img src={getStoredImageUrl(pair.afterImage)} alt="Neighborhood cleanup after photo" className="h-full w-full max-w-full object-cover" style={{ objectPosition: getPhotoObjectPosition(pair.afterImage) }} />
                                    ) : (
                                      <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.14em] text-white/80">After</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="grid h-full min-w-0 max-w-full box-border grid-cols-2 gap-1">
                                <div className="flex h-full min-w-0 max-w-full box-border flex-col">
                                  <div className="flex h-full items-center justify-center rounded-[0.8rem] border border-[#002b49]/35 bg-[#0b6d87]/30 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
                                    Before
                                  </div>
                                </div>

                                <div className="flex h-full min-w-0 max-w-full box-border flex-col">
                                  <div className="flex h-full items-center justify-center rounded-[0.8rem] border border-[#002b49]/35 bg-[#2b7e22]/25 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
                                    After
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {pair?.pairCaption ? (
                            <div className="mt-2 px-1 pb-1">
                              <p className="text-center text-sm font-medium leading-5 text-[#fff9ea] whitespace-pre-wrap break-words">
                                {pair.pairCaption}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setBeforeAfterPairIndex((current) => Math.max(0, current - 1))}
                    disabled={beforeAfterPairIndex === 0}
                    aria-label="Previous before and after photo pairs"
                    className={`absolute left-0 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-[#002b49]/48 text-lg font-bold text-white transition sm:h-10 sm:w-10 ${beforeAfterPairIndex === 0 ? 'pointer-events-none opacity-0' : 'hover:bg-[#002b49]/68 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30'}`}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => setBeforeAfterPairIndex((current) => Math.min(beforeAfterGalleryPageCount - 1, current + 1))}
                    disabled={beforeAfterPairIndex >= beforeAfterGalleryPageCount - 1}
                    aria-label="Next before and after photo pairs"
                    className={`absolute right-0 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/45 bg-[#002b49]/48 text-lg font-bold text-white transition sm:h-10 sm:w-10 ${beforeAfterPairIndex >= beforeAfterGalleryPageCount - 1 ? 'pointer-events-none opacity-0' : 'hover:bg-[#002b49]/68 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30'}`}
                  >
                    ›
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-center gap-2 text-[10px] font-medium leading-4 text-[#1f5f7a] sm:text-[11px] sm:leading-5">
                  <p>
                    {visibleBeforeAfterGalleryPairs.length
                      ? `${Math.min(beforeAfterPairIndex + 1, beforeAfterGalleryPageCount)} of ${beforeAfterGalleryPageCount}`
                      : '0 of 0'}
                  </p>
                  <button
                    type="button"
                    onClick={openBeforeAfterGallery}
                    className="text-[10px] font-medium leading-4 text-[#1f5f7a] transition hover:text-[#002b49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f9aa1]/30 sm:text-[11px] sm:leading-5"
                  >
                    View All
                  </button>
                </div>
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
              <h2 className={`${balooDisplay.className} mt-3 flex items-center justify-center gap-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl`}>
                <span>What we've done so far!</span>
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-3 lg:h-full lg:grid-cols-1 lg:grid-rows-2">
                <div
                  className="impact-counter impact-counter-bags flex min-h-[13.6rem] w-full items-stretch gap-4 rounded-[2rem] border-[2.5px] border-white px-4 py-4 shadow-[0_18px_34px_rgba(46,196,199,0.24)] sm:min-h-[14.4rem] sm:px-5 sm:py-5 lg:h-full lg:min-h-0"
                >
                  <div
                    className="min-w-0 flex-[1.15] rounded-[1.5rem] bg-no-repeat bg-contain bg-center"
                    style={{
                      backgroundImage: "url('/Messes.png')",
                    }}
                  />
                  <div className="min-w-0 flex-[0.85] flex flex-col items-center justify-center text-center">
                    <p className="text-4xl font-black leading-none text-[#1f2733] [text-shadow:0_1px_2px_rgba(255,255,255,0.52)] sm:text-5xl lg:text-[3.1rem]">{savedCleanupBagTotal}</p>
                    <p className="mt-1.5 text-sm font-bold leading-tight text-[#1f2733] [text-shadow:0_1px_2px_rgba(255,255,255,0.52)] sm:text-base lg:text-lg">Messes Messed With!</p>
                  </div>
                </div>

                <div
                  className="impact-counter impact-counter-neighborhoods flex min-h-[13.6rem] w-full items-stretch gap-4 rounded-[2rem] border-[2.5px] border-white px-4 py-4 shadow-[0_18px_34px_rgba(46,196,199,0.24)] sm:min-h-[14.4rem] sm:px-5 sm:py-5 lg:h-full lg:min-h-0"
                >
                  <div className="min-w-0 flex-[1.15] overflow-hidden rounded-[1.5rem]">
                    <img
                      src="/Correct Cleanup Adventures.png"
                      alt="Cleanup Adventures"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="min-w-0 flex-[0.85] flex flex-col items-center justify-center text-center">
                    <p className="text-4xl font-black leading-none text-[#1f2733] [text-shadow:0_1px_2px_rgba(255,255,255,0.52)] sm:text-5xl lg:text-[3.1rem]">{savedCleanupSubmissionCount}</p>
                    <p className="mt-1.5 text-sm font-bold leading-tight text-[#1f2733] [text-shadow:0_1px_2px_rgba(255,255,255,0.52)] sm:text-base lg:text-lg">Cleanup Adventures!</p>
                  </div>
                </div>
              </div>

              <div id="community-footprints" className="impact-map-card relative w-full rounded-[2rem] border border-[#002b49]/10 bg-white p-3 shadow-[0_15px_35px_rgba(0,43,73,0.08)] sm:p-4 lg:col-span-9 lg:p-5">
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
                background-color: transparent;
                box-shadow: 0 12px 28px rgba(0, 34, 68, 0.12);
              }

              #impact .impact-counter::before {
                content: none;
              }

              #impact .impact-counter::after {
                content: none;
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
                height: 22rem !important;
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

              .share-button-visible-center > .inline-flex {
                position: relative;
              }

              .share-button-visible-center > .inline-flex > span {
                position: absolute;
                left: calc(100% + 0.5rem);
                top: 50%;
                transform: translateY(-50%);
              }

              @media (min-width: 1024px) {
                #community-footprints .leaflet-container {
                  height: 30rem !important;
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
                          ? 'bg-[#D9665B] text-white hover:bg-[#D9665B]'
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

        <Footer showHomeShareButton />

        {isTrackModalOpen && (
          <div className="fixed inset-0 z-50 bg-[#002b49]/72 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="track-it-title">
            <div className="flex h-full w-full items-end justify-center p-0 sm:items-center sm:p-4">
              <div className="paint-card relative flex h-full w-full flex-col overflow-hidden rounded-none border border-[#0f9aa1]/22 bg-[#f6fcff] shadow-[0_28px_80px_rgba(0,43,73,0.42)] sm:h-auto sm:max-h-[95vh] sm:max-w-4xl sm:rounded-[2rem]">
                <form onSubmit={handleTrackSubmit} aria-busy={isSubmittingTrackEntry} className="max-h-[88vh] overflow-y-auto bg-[#fffdf7] px-4 pb-5 pt-4 sm:max-h-[90vh] sm:px-6 sm:pb-6 sm:pt-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 id="track-it-title" className="text-2xl font-bold leading-tight text-[#002b49] sm:text-[1.75rem]">
                        Where did you clean up?
                      </h3>
                      <p className="mt-1 text-base leading-6 text-[#1f5f7a] sm:text-lg">
                        After selecting an action button above, you may change the Seattle default map and move your marker. Pan or zoom to your cleanup location. Then click Submit.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[#e9f7fb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#1f5f7a]">
                        Track It
                      </span>
                      <button
                        type="button"
                        onClick={closeTrackModal}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#002b49]/20 bg-white text-xl font-semibold text-[#002b49] shadow-[0_8px_18px_rgba(0,43,73,0.18)] transition hover:bg-[#eef7fb]"
                        aria-label="Close tracker"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => handleTrackActionSelect('pick-up-trash')}
                      className={`rounded-2xl border px-2 py-2 text-center shadow-[0_8px_16px_rgba(15,154,161,0.12)] transition sm:px-3 sm:py-3 ${
                        trackForm.actionType === 'pick-up-trash'
                          ? 'border-[#0f9aa1]/45 bg-[#dff8fd] ring-2 ring-[#0f9aa1]/35'
                          : 'border-[#0f9aa1]/18 bg-[#ecfbfe]'
                      }`}
                      aria-pressed={trackForm.actionType === 'pick-up-trash'}
                    >
                      <p className="text-xl leading-none sm:text-2xl" aria-hidden="true">🗑️</p>
                      <p className="mt-1 text-[11px] font-semibold text-[#0b7485] sm:text-xs">Picked Up Trash</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTrackActionSelect('cleaned-area')}
                      className={`rounded-2xl border px-2 py-2 text-center shadow-[0_8px_16px_rgba(97,184,38,0.12)] transition sm:px-3 sm:py-3 ${
                        trackForm.actionType === 'cleaned-area'
                          ? 'border-[#61b826]/48 bg-[#e7f7d8] ring-2 ring-[#61b826]/32'
                          : 'border-[#61b826]/22 bg-[#f1fae8]'
                      }`}
                      aria-pressed={trackForm.actionType === 'cleaned-area'}
                    >
                      <p className="text-xl leading-none sm:text-2xl" aria-hidden="true">🧹</p>
                      <p className="mt-1 text-[11px] font-semibold text-[#3f7d1a] sm:text-xs">Cleaned Area</p>
                    </button>
                  </div>

                  <div className="mb-4 rounded-2xl border border-[#0f9aa1]/26 bg-[#eef9fc] p-3 sm:p-4">
                    <button
                      type="button"
                      onClick={openTrackPhotoModal}
                      aria-pressed={Boolean(pendingTrackPhotoSubmission?.images?.length)}
                      className={`w-full rounded-2xl border px-2 py-2 text-center shadow-[0_8px_16px_rgba(15,154,161,0.12)] transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0f9aa1]/26 sm:px-3 sm:py-3 ${
                        pendingTrackPhotoSubmission?.images?.length
                          ? 'border-[#0f9aa1]/45 bg-[#dff8fd] ring-2 ring-[#0f9aa1]/35'
                          : 'border-[#0f9aa1]/18 bg-[#ecfbfe]'
                      }`}
                    >
                      <p className="text-xl leading-none sm:text-2xl" aria-hidden="true">📸</p>
                      <p className="mt-1 text-[11px] font-semibold text-[#0b7485] sm:text-xs">Post Your Photos</p>
                    </button>
                    {pendingTrackPhotoSubmission?.images?.length ? (
                      <p className="mt-2 text-sm font-medium text-[#1f5f7a]">
                        {`Before/After photos ready to submit with cleanup: ${pendingTrackPhotoSubmission.images.length} selected.`}
                      </p>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-[#0f9aa1]/26 bg-[#eef9fc] px-4 py-3 shadow-[0_10px_20px_rgba(0,43,73,0.06)]">
                    <label htmlFor="bag-count-input" className="block text-sm font-semibold text-[#002b49]">
                      How many bags did you collect?
                    </label>
                    <input
                      id="bag-count-input"
                      name="bagCount"
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      value={trackForm.bagCount}
                      onChange={handleTrackFieldChange}
                      placeholder="0"
                      className="mt-2 block w-full rounded-xl border border-[#002b49]/16 bg-white px-4 py-2.5 text-base text-[#002b49] placeholder:text-base focus:outline-none focus:ring-2 focus:ring-[#1f5f7a]/35"
                    />
                  </div>

                  <div className="space-y-3.5">
                    <div className="rounded-2xl border border-[#002b49]/12 bg-white px-4 py-3 shadow-[0_10px_20px_rgba(0,43,73,0.06)]">
                      <p className="text-sm text-[#1f5f7a]">
                        The map opens to a broader Seattle area by default. Pan anywhere, zoom in or out, and adjust the marker as needed.
                      </p>
                      <div className="mt-3 h-60 overflow-hidden rounded-lg border border-[#002b49]/10 sm:h-72">
                        {resolvedTrackLatLng && (
                          <TrackLocationPicker
                            markerLatLng={resolvedTrackLatLng}
                            onMarkerMoved={handleTrackMarkerMoved}
                          />
                        )}
                      </div>
                      {hasSelectedTrackMarker && (
                        <p className="mt-3 text-sm font-medium text-[#2c7a3f]">✓ Marker location selected</p>
                      )}
                    </div>

                    {locationError && (
                      <p className="rounded-xl border border-[#D9665B]/25 bg-[#fff3f0] px-4 py-2.5 text-sm font-medium text-[#D9665B]">
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
                      <button
                        type="submit"
                        disabled={isSubmittingTrackEntry || !trackForm.actionType || !hasLocationInput() || !hasSelectedTrackMarker}
                        className="btn-green min-h-11 rounded-full px-6 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
            </div>
          </div>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[95] bg-[#002b49]/72 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="post-photos-title">
            <div className="flex h-full w-full items-end justify-center p-0 sm:items-center sm:p-4">
              <form onSubmit={isTrackBeforeAfterPhotoModal ? handleTrackBeforeAfterPhotoSubmit : handleCommunityActionPhotoSubmit} className="paint-card relative flex h-full w-full flex-col overflow-hidden rounded-none border border-[#0f9aa1]/22 bg-[#f6fcff] shadow-[0_28px_80px_rgba(0,43,73,0.42)] sm:h-auto sm:max-h-[95vh] sm:max-w-4xl sm:rounded-[2rem]">
                <div className="max-h-[88vh] overflow-y-auto bg-[#fffdf7] px-4 pb-5 pt-4 sm:max-h-[90vh] sm:px-6 sm:pb-6 sm:pt-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 id="post-photos-title" className="text-2xl font-bold leading-tight text-[#002b49] sm:text-[1.75rem]">
                        Post Your Photos
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={closePhotoModal}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#002b49]/20 bg-white text-xl font-semibold text-[#002b49] shadow-[0_8px_18px_rgba(0,43,73,0.18)] transition hover:bg-[#eef7fb]"
                      aria-label="Close photo modal"
                    >
                      ×
                    </button>
                  </div>

                  <div className="rounded-2xl border border-[#002b49]/12 bg-white px-4 py-4 shadow-[0_10px_20px_rgba(0,43,73,0.06)]">
                    <input
                      id="before-photo-input"
                      type="file"
                      accept="image/*"
                      disabled={isUploadingCleanupPhotos || !isTrackBeforeAfterPhotoModal}
                      onChange={(event) => handleBeforeAfterPhotoInputChange(0, event)}
                      className="sr-only"
                    />
                    <input
                      id="after-photo-input"
                      type="file"
                      accept="image/*"
                      disabled={isUploadingCleanupPhotos || !isTrackBeforeAfterPhotoModal}
                      onChange={(event) => handleBeforeAfterPhotoInputChange(1, event)}
                      className="sr-only"
                    />
                    {!isTrackBeforeAfterPhotoModal ? (
                      <input
                        id="community-action-photo-input"
                        type="file"
                        accept="image/*"
                        disabled={isUploadingCleanupPhotos || isTrackBeforeAfterPhotoModal}
                        onChange={handleCommunityActionPhotoInputChange}
                        className="sr-only"
                      />
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setIsPhotoGuidelinesPopupOpen(true)}
                      className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full border border-[#0f9aa1]/26 px-4 py-2 text-sm font-semibold text-[#0b6e85] transition hover:bg-[#eef9fc]"
                    >
                      Community Photo Guidelines
                    </button>

                    <label className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#002b49]/12 bg-[#fffdf7] px-3 py-3 text-sm text-[#002b49]">
                      <input
                        type="checkbox"
                        checked={hasConfirmedPhotoGuidelines}
                        onChange={(event) => {
                          setHasConfirmedPhotoGuidelines(event.target.checked);
                          setPhotoFormError('');
                        }}
                        required
                        className="mt-0.5 h-4 w-4 rounded border-[#002b49]/25"
                      />
                      <span>
                        I confirm that my photos and comments follow the Community Photo Guidelines and that I have permission to share them.
                      </span>
                    </label>

                    {photoFormError && (
                      <p className="mt-3 rounded-xl border border-[#D9665B]/25 bg-[#fff3f0] px-3 py-2 text-sm font-medium text-[#D9665B]">
                        {photoFormError}
                      </p>
                    )}
                  </div>

                  {isTrackBeforeAfterPhotoModal ? (
                    <div className="mt-5 space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.2rem] border border-[#D9665B]/24 bg-white p-4 shadow-[0_10px_22px_rgba(0,43,73,0.08)]">
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8f5e56]">BEFORE</p>
                          <label
                            htmlFor="before-photo-input"
                            className="mt-3 block h-64 overflow-hidden rounded-xl border border-[#002b49]/10 bg-white cursor-pointer"
                          >
                            {selectedimages[0] ? (
                              <img
                                src={selectedimages[0].previewUrl}
                                alt="Before upload preview"
                                className="h-full w-full object-cover select-none"
                                style={{ objectPosition: `${photoCropPositions[0]?.x ?? 50}% ${photoCropPositions[0]?.y ?? 50}%` }}
                                onPointerDown={(event) => handlePhotoPreviewPointerDown(0, event)}
                                onPointerMove={(event) => handlePhotoPreviewPointerMove(0, event)}
                                onPointerUp={(event) => handlePhotoPreviewPointerUp(0, event)}
                                onPointerCancel={(event) => handlePhotoPreviewPointerUp(0, event)}
                                draggable
                                onDragStart={(event) => handlePhotoPreviewDragStart(0, event)}
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={(event) => handlePhotoPreviewDrop(0, event)}
                                onDragEnd={handlePhotoPreviewDragEnd}
                              />
                            ) : null}
                          </label>
                          {selectedimages[0] ? (
                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleRemoveSelectedPhoto(0)}
                                className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#D9665B]/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#D9665B] transition hover:bg-[#fff3f0]"
                              >
                                Remove
                              </button>
                            </div>
                          ) : null}
                        </div>

                        <div className="rounded-[1.2rem] border border-[#69BE28]/24 bg-white p-4 shadow-[0_10px_22px_rgba(0,43,73,0.08)]">
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4b7430]">AFTER</p>
                          <label
                            htmlFor="after-photo-input"
                            className="mt-3 block h-64 overflow-hidden rounded-xl border border-[#002b49]/10 bg-white cursor-pointer"
                          >
                            {selectedimages[1] ? (
                              <img
                                src={selectedimages[1].previewUrl}
                                alt="After upload preview"
                                className="h-full w-full object-cover select-none"
                                style={{ objectPosition: `${photoCropPositions[1]?.x ?? 50}% ${photoCropPositions[1]?.y ?? 50}%` }}
                                onPointerDown={(event) => handlePhotoPreviewPointerDown(1, event)}
                                onPointerMove={(event) => handlePhotoPreviewPointerMove(1, event)}
                                onPointerUp={(event) => handlePhotoPreviewPointerUp(1, event)}
                                onPointerCancel={(event) => handlePhotoPreviewPointerUp(1, event)}
                                draggable
                                onDragStart={(event) => handlePhotoPreviewDragStart(1, event)}
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={(event) => handlePhotoPreviewDrop(1, event)}
                                onDragEnd={handlePhotoPreviewDragEnd}
                              />
                            ) : null}
                          </label>
                          {selectedimages[1] ? (
                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleRemoveSelectedPhoto(1)}
                                className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#D9665B]/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#D9665B] transition hover:bg-[#fff3f0]"
                              >
                                Remove
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#0f9aa1]/24 bg-white px-4 py-4 shadow-[0_10px_20px_rgba(0,43,73,0.06)]">
                        <label htmlFor="before-after-caption" className="block text-sm font-semibold text-[#002b49]">
                          Caption (optional)
                        </label>
                        <p className="mt-1 text-sm text-[#1f5f7a]">This single caption applies to both your BEFORE and AFTER photos.</p>
                        <textarea
                          id="before-after-caption"
                          value={beforeAfterCaption}
                          onChange={(event) => {
                            setBeforeAfterCaption(event.target.value);
                            setPhotoFormError('');
                          }}
                          rows={3}
                          className="mt-2 block w-full rounded-xl border border-[#002b49]/16 bg-white px-4 py-3 text-sm leading-6 text-[#002b49] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/30"
                          placeholder="Optional caption for your before/after pair"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <div className="rounded-[1.2rem] border border-[#0f9aa1]/24 bg-white p-4 shadow-[0_10px_22px_rgba(0,43,73,0.08)]">
                        <label
                          htmlFor="community-action-photo-input"
                          className="block h-64 overflow-hidden rounded-xl border border-[#002b49]/10 bg-white cursor-pointer"
                        >
                          {communityActionSelectedPhoto ? (
                            <img
                              src={communityActionSelectedPhoto.previewUrl}
                              alt="Cleanup upload preview"
                              className="h-full w-full object-contain object-center select-none"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#0f9aa1]/30 bg-[#ecfbfe] px-6 py-2 text-sm font-semibold text-[#0b7485] shadow-[0_8px_16px_rgba(15,154,161,0.12)]">
                                Post Photo
                              </span>
                            </div>
                          )}
                        </label>

                        {communityActionSelectedPhoto ? (
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={handleRemoveCommunityActionPhoto}
                              className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#D9665B]/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#D9665B] transition hover:bg-[#fff3f0]"
                            >
                              Remove
                            </button>
                          </div>
                        ) : null}

                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#002b49]/10 pt-3 sm:flex-row sm:justify-end">
                    <button type="button" onClick={closePhotoModal} disabled={isUploadingCleanupPhotos} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#002b49]/20 px-5 py-2 text-sm font-semibold text-[#002b49] transition hover:bg-[#f2f7fa] disabled:cursor-not-allowed disabled:opacity-70">
                      Cancel
                    </button>
                    <button type="submit" disabled={!hasConfirmedPhotoGuidelines || isUploadingCleanupPhotos} className="btn-green min-h-11 rounded-full px-6 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70">
                      {isUploadingCleanupPhotos ? 'Uploading...' : 'Submit Photos'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {isPhotoGuidelinesPopupOpen ? (
              <div className="fixed inset-0 z-[96] bg-[#002b49]/72 backdrop-blur-[2px] p-4" role="dialog" aria-modal="true" aria-labelledby="photo-guidelines-title">
                <div className="mx-auto flex h-full max-w-2xl items-center justify-center">
                  <div className="paint-card relative w-full overflow-hidden rounded-[2rem] border border-[#0f9aa1]/22 bg-[#f6fcff] shadow-[0_28px_80px_rgba(0,43,73,0.42)]">
                    <div className="max-h-[82vh] overflow-y-auto bg-[#fffdf7] px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h4 id="photo-guidelines-title" className="text-xl font-bold text-[#002b49] sm:text-2xl">
                          Community Photo Guidelines
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsPhotoGuidelinesPopupOpen(false)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#002b49]/20 bg-white text-xl font-semibold text-[#002b49] shadow-[0_8px_18px_rgba(0,43,73,0.18)] transition hover:bg-[#eef7fb]"
                          aria-label="Close community photo guidelines"
                        >
                          ×
                        </button>
                      </div>

                      <div className="rounded-xl border border-[#0f9aa1]/25 bg-[#eef9fc] px-3.5 py-3 text-sm text-[#1f5f7a]">
                        <p className="leading-6">
                          Please share photos and comments that are appropriate for all ages and connected to a cleanup or positive community action.
                        </p>
                        <p className="mt-2 font-semibold text-[#0b6e85]">Do not submit:</p>
                        <ul className="mt-1 list-disc space-y-1 pl-5 leading-6">
                          <li>Nudity, sexually explicit, or sexually suggestive images.</li>
                          <li>Vulgar, threatening, hateful, discriminatory, or harassing language or content.</li>
                          <li>Commercial advertising, promotional graphics, sales offers, or unrelated business marketing.</li>
                          <li>Political campaign material, illegal activity, dangerous behavior, or images intended to shame or humiliate another person.</li>
                          <li>Photos unrelated to cleanup work or positive community action.</li>
                        </ul>
                        <p className="mt-2 leading-6">
                          Submissions that do not follow these guidelines may be removed.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {isShareModalOpen && (
          <div className="fixed inset-0 z-[95] bg-[#002b49]/72 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
            <div className="flex h-full w-full items-end justify-center p-0 sm:items-center sm:p-4">
              <form onSubmit={handleShareSubmit} aria-busy={isSubmittingShareSubmission} className="paint-card relative flex h-full w-full flex-col overflow-hidden rounded-none border border-[#0f9aa1]/22 bg-[#f6fcff] shadow-[0_28px_80px_rgba(0,43,73,0.42)] sm:h-auto sm:max-h-[95vh] sm:max-w-3xl sm:rounded-[2rem]">
                <div className="max-h-[88vh] overflow-y-auto bg-[#fffdf7] px-4 pb-5 pt-4 sm:max-h-[90vh] sm:px-6 sm:pb-6 sm:pt-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 id="share-modal-title" className="text-2xl font-bold leading-tight text-[#002b49] sm:text-[1.75rem]">
                        What would you like to share?
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={closeShareModal}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#002b49]/20 bg-white text-xl font-semibold text-[#002b49] shadow-[0_8px_18px_rgba(0,43,73,0.18)] transition hover:bg-[#eef7fb]"
                      aria-label="Close share modal"
                    >
                      ×
                    </button>
                  </div>

                  {shareModalStage === 'success' ? (
                    <div className="rounded-2xl border border-[#0f9aa1]/24 bg-[#eef9fc] px-4 py-5 text-center shadow-[0_10px_20px_rgba(0,43,73,0.06)]">
                      <p className="text-xl font-bold text-[#1f5f7a] sm:text-2xl">Thanks for sharing a little more kindness with Seattle! 💙</p>
                    </div>
                  ) : shareModalStage === 'choose' ? (
                    <div>
                      <div className="grid grid-cols-1 gap-3">
                        <button
                          type="button"
                          onClick={() => handleShareTypeSelect(COMMUNITY_SHARE_TYPE_THANK_YOU)}
                          className={`rounded-3xl border px-4 py-4 text-left shadow-[0_10px_20px_rgba(0,43,73,0.06)] transition hover:-translate-y-0.5 sm:px-5 sm:py-5 ${
                            shareSubmissionType === COMMUNITY_SHARE_TYPE_THANK_YOU
                              ? 'border-[#0f9aa1]/45 bg-[#dff8fd] ring-2 ring-[#0f9aa1]/35'
                              : 'border-[#0f9aa1]/18 bg-[#ecfbfe]'
                          }`}
                        >
                          <p className="text-lg font-bold text-[#002b49] sm:text-xl">Thank You Note</p>
                          <p className="mt-2 text-sm leading-6 text-[#1f5f7a] sm:text-base">
                            Share a thoughtful note with an optional photo.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleShareTypeSelect(COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY)}
                          className={`rounded-3xl border px-4 py-4 text-left shadow-[0_10px_20px_rgba(0,43,73,0.06)] transition hover:-translate-y-0.5 sm:px-5 sm:py-5 ${
                            shareSubmissionType === COMMUNITY_SHARE_TYPE_SCENIC_DISCOVERY
                              ? 'border-[#f4c94c]/52 bg-[#fff6ce] ring-2 ring-[#f4c94c]/30'
                              : 'border-[#f4c94c]/28 bg-[#fffaf0]'
                          }`}
                        >
                          <p className="text-lg font-bold text-[#002b49] sm:text-xl">Scenic Discovery</p>
                          <p className="mt-2 text-sm leading-6 text-[#1f5f7a] sm:text-base">
                            Share one photo from the walk with an optional caption.
                          </p>
                        </button>
                      </div>

                      {shareFormError ? (
                        <p className="mt-4 rounded-xl border border-[#D9665B]/25 bg-[#fff3f0] px-4 py-2.5 text-sm font-medium text-[#D9665B]">
                          {shareFormError}
                        </p>
                      ) : null}

                      <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[#002b49]/10 pt-3 sm:flex-row sm:justify-end">
                        <button type="button" onClick={closeShareModal} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#002b49]/20 px-5 py-2 text-sm font-semibold text-[#002b49] transition hover:bg-[#f2f7fa]">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : shareSubmissionType === COMMUNITY_SHARE_TYPE_THANK_YOU ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-[#0f9aa1]/24 bg-white px-4 py-4 shadow-[0_10px_20px_rgba(0,43,73,0.06)]">
                        <label htmlFor="share-thank-you-message" className="block text-sm font-semibold text-[#002b49]">
                          Your Thank You Message
                        </label>
                        <textarea
                          id="share-thank-you-message"
                          value={shareThankYouMessage}
                          onChange={(event) => handleShareMessageChange(event.target.value)}
                          rows={5}
                          className="mt-2 block w-full rounded-xl border border-[#002b49]/16 bg-white px-4 py-3 text-sm leading-6 text-[#002b49] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/30"
                          placeholder="Write your thank you message here..."
                        />
                      </div>

                      <div className="rounded-2xl border border-[#0f9aa1]/24 bg-[#eef9fc] px-4 py-4 shadow-[0_10px_20px_rgba(0,43,73,0.06)]">
                        <label htmlFor="share-thank-you-photo" className="block text-sm font-semibold text-[#002b49]">
                          Photo
                        </label>
                        <p className="mt-1 text-sm text-[#1f5f7a]">Optional. Add one photo to go with your note.</p>
                        <input
                          id="share-thank-you-photo"
                          type="file"
                          accept="image/*"
                          disabled={isSubmittingShareSubmission}
                          onChange={handleSharePhotoInputChange}
                          className="sr-only"
                        />
                        <div className="mt-3">
                          <label
                            htmlFor="share-thank-you-photo"
                            aria-disabled={isSubmittingShareSubmission}
                            className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white transition ${
                              isSubmittingShareSubmission
                                ? 'cursor-not-allowed bg-[#1fb8c2]/60'
                                : 'cursor-pointer bg-[#1fb8c2] hover:bg-[#0fa5af]'
                            }`}
                          >
                            Choose File
                          </label>
                        </div>

                        {shareSelectedPhoto ? (
                          <div className="mt-4 grid gap-3">
                            <div className="flex h-56 items-center justify-center overflow-hidden rounded-xl border border-[#0f9aa1]/20 bg-[#f3f8fb]">
                              <img
                                src={shareSelectedPhoto.previewUrl}
                                alt="Thank you note preview"
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#1f5f7a]">Selected photo</p>
                              <button
                                type="button"
                                onClick={handleRemoveSharePhoto}
                                className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#D9665B]/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#D9665B] transition hover:bg-[#fff3f0]"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : null}

                        {shareSelectedPhoto ? (
                          <div className="mt-4 rounded-xl border border-[#0f9aa1]/25 bg-[#eef9fc] px-3.5 py-3 text-sm text-[#1f5f7a]">
                            {(() => {
                              const isOpen = openShareGuidelineIndex === 0;

                              return (
                                <div className="rounded-lg border border-[#0f9aa1]/22 bg-white/70">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenShareGuidelineIndex((current) => (current === 0 ? null : 0));
                                    }}
                                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-[#0b6e85]"
                                    aria-expanded={isOpen}
                                  >
                                    <span>Community Photo Guidelines</span>
                                    <span className="text-xs text-[#0f9aa1]">{isOpen ? 'Hide' : 'Show'}</span>
                                  </button>
                                  {isOpen ? (
                                    <div className="border-t border-[#0f9aa1]/15 px-3 py-2 text-sm text-[#1f5f7a]">
                                      <p className="leading-6">
                                        Please share photos and comments that are appropriate for all ages and connected to a cleanup or positive community action.
                                      </p>
                                      <p className="mt-2 font-semibold text-[#0b6e85]">Do not submit:</p>
                                      <ul className="mt-1 list-disc space-y-1 pl-5 leading-6">
                                        <li>Nudity, sexually explicit, or sexually suggestive images.</li>
                                        <li>Vulgar, threatening, hateful, discriminatory, or harassing language or content.</li>
                                        <li>Commercial advertising, promotional graphics, sales offers, or unrelated business marketing.</li>
                                        <li>Political campaign material, illegal activity, dangerous behavior, or images intended to shame or humiliate another person.</li>
                                        <li>Photos unrelated to cleanup work or positive community action.</li>
                                      </ul>
                                      <p className="mt-2 leading-6">
                                        Submissions that do not follow these guidelines may be removed.
                                      </p>
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })()}
                          </div>
                        ) : null}

                        {shareSelectedPhoto ? (
                          <label className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#002b49]/12 bg-[#fffdf7] px-3 py-3 text-sm text-[#002b49]">
                            <input
                              type="checkbox"
                              checked={hasConfirmedSharePhotoGuidelines}
                              onChange={(event) => {
                                setHasConfirmedSharePhotoGuidelines(event.target.checked);
                                setShareFormError('');
                              }}
                              required
                              className="mt-0.5 h-4 w-4 rounded border-[#002b49]/25"
                            />
                            <span>
                              I confirm that my photo and comments follow the Community Photo Guidelines and that I have permission to share them.
                            </span>
                          </label>
                        ) : null}
                      </div>

                      {shareFormError ? (
                        <p className="rounded-xl border border-[#D9665B]/25 bg-[#fff3f0] px-4 py-2.5 text-sm font-medium text-[#D9665B]">
                          {shareFormError}
                        </p>
                      ) : null}

                      <div className="flex flex-col-reverse gap-2 border-t border-[#002b49]/10 pt-3 sm:flex-row sm:justify-end">
                        <button type="button" onClick={closeShareModal} disabled={isSubmittingShareSubmission} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#002b49]/20 px-5 py-2 text-sm font-semibold text-[#002b49] transition hover:bg-[#f2f7fa] disabled:cursor-not-allowed disabled:opacity-70">
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={
                            isSubmittingShareSubmission ||
                            !shareThankYouMessage.trim() ||
                            (shareSelectedPhoto && !hasConfirmedSharePhotoGuidelines)
                          }
                          className="btn-green min-h-11 rounded-full px-6 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isSubmittingShareSubmission ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-[#0f9aa1]/24 bg-white px-4 py-4 shadow-[0_10px_20px_rgba(0,43,73,0.06)]">
                        <label htmlFor="share-scenic-photo" className="block text-sm font-semibold text-[#002b49]">
                          Photo
                        </label>
                        <p className="mt-1 text-sm text-[#1f5f7a]">Required. Add one photo from your scenic discovery.</p>
                        <input
                          id="share-scenic-photo"
                          type="file"
                          accept="image/*"
                          disabled={isSubmittingShareSubmission}
                          onChange={handleSharePhotoInputChange}
                          className="mt-3 block w-full rounded-xl border border-[#002b49]/16 bg-white px-3 py-2 text-sm text-[#002b49] file:mr-3 file:rounded-full file:border-0 file:bg-[#1fb8c2] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0fa5af] disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        {shareSelectedPhoto ? (
                          <div className="mt-4 grid gap-3">
                            <div
                              className="h-56 overflow-hidden rounded-xl border border-[#0f9aa1]/20 bg-[#f3f8fb]"
                              onPointerDown={handleSharePhotoPreviewPointerDown}
                              onPointerMove={handleSharePhotoPreviewPointerMove}
                              onPointerUp={handleSharePhotoPreviewPointerUp}
                              onPointerCancel={handleSharePhotoPreviewPointerUp}
                            >
                              <img
                                src={shareSelectedPhoto.previewUrl}
                                alt="Scenic discovery preview"
                                className={`h-full w-full select-none object-cover ${sharePhotoDrag ? 'cursor-grabbing' : 'cursor-grab'}`}
                                style={{ objectPosition: `${sharePhotoCropPosition.x ?? 50}% ${sharePhotoCropPosition.y ?? 50}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#1f5f7a]">Selected photo</p>
                              <button
                                type="button"
                                onClick={handleRemoveSharePhoto}
                                className="inline-flex min-h-9 items-center justify-center rounded-full border border-[#D9665B]/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#D9665B] transition hover:bg-[#fff3f0]"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : null}

                        {shareSelectedPhoto ? (
                          <div className="mt-4 rounded-xl border border-[#0f9aa1]/25 bg-[#eef9fc] px-3.5 py-3 text-sm text-[#1f5f7a]">
                            {(() => {
                              const isOpen = openShareGuidelineIndex === 0;

                              return (
                                <div className="rounded-lg border border-[#0f9aa1]/22 bg-white/70">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenShareGuidelineIndex((current) => (current === 0 ? null : 0));
                                    }}
                                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-[#0b6e85]"
                                    aria-expanded={isOpen}
                                  >
                                    <span>Community Photo Guidelines</span>
                                    <span className="text-xs text-[#0f9aa1]">{isOpen ? 'Hide' : 'Show'}</span>
                                  </button>
                                  {isOpen ? (
                                    <div className="border-t border-[#0f9aa1]/15 px-3 py-2 text-sm text-[#1f5f7a]">
                                      <p className="leading-6">
                                        Please share photos and comments that are appropriate for all ages and connected to a cleanup or positive community action.
                                      </p>
                                      <p className="mt-2 font-semibold text-[#0b6e85]">Do not submit:</p>
                                      <ul className="mt-1 list-disc space-y-1 pl-5 leading-6">
                                        <li>Nudity, sexually explicit, or sexually suggestive images.</li>
                                        <li>Vulgar, threatening, hateful, discriminatory, or harassing language or content.</li>
                                        <li>Commercial advertising, promotional graphics, sales offers, or unrelated business marketing.</li>
                                        <li>Political campaign material, illegal activity, dangerous behavior, or images intended to shame or humiliate another person.</li>
                                        <li>Photos unrelated to cleanup work or positive community action.</li>
                                      </ul>
                                      <p className="mt-2 leading-6">
                                        Submissions that do not follow these guidelines may be removed.
                                      </p>
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })()}
                          </div>
                        ) : null}

                        {shareSelectedPhoto ? (
                          <label className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#002b49]/12 bg-[#fffdf7] px-3 py-3 text-sm text-[#002b49]">
                            <input
                              type="checkbox"
                              checked={hasConfirmedSharePhotoGuidelines}
                              onChange={(event) => {
                                setHasConfirmedSharePhotoGuidelines(event.target.checked);
                                setShareFormError('');
                              }}
                              required
                              className="mt-0.5 h-4 w-4 rounded border-[#002b49]/25"
                            />
                            <span>
                              I confirm that my photo and comments follow the Community Photo Guidelines and that I have permission to share them.
                            </span>
                          </label>
                        ) : null}
                      </div>

                      <div className="rounded-2xl border border-[#0f9aa1]/24 bg-white px-4 py-4 shadow-[0_10px_20px_rgba(0,43,73,0.06)]">
                        <label htmlFor="share-scenic-caption" className="block text-sm font-semibold text-[#002b49]">
                          Caption
                        </label>
                        <textarea
                          id="share-scenic-caption"
                          value={shareScenicCaption}
                          onChange={(event) => handleShareCaptionChange(event.target.value)}
                          rows={3}
                          className="mt-2 block w-full rounded-xl border border-[#002b49]/16 bg-white px-4 py-3 text-sm leading-6 text-[#002b49] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f9aa1]/30"
                          placeholder="Optional caption"
                        />
                      </div>

                      {shareFormError ? (
                        <p className="rounded-xl border border-[#D9665B]/25 bg-[#fff3f0] px-4 py-2.5 text-sm font-medium text-[#D9665B]">
                          {shareFormError}
                        </p>
                      ) : null}

                      <div className="flex flex-col-reverse gap-2 border-t border-[#002b49]/10 pt-3 sm:flex-row sm:justify-end">
                        <button type="button" onClick={closeShareModal} disabled={isSubmittingShareSubmission} className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#002b49]/20 px-5 py-2 text-sm font-semibold text-[#002b49] transition hover:bg-[#f2f7fa] disabled:cursor-not-allowed disabled:opacity-70">
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingShareSubmission || !shareSelectedPhoto || !hasConfirmedSharePhotoGuidelines}
                          className="btn-green min-h-11 rounded-full px-6 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isSubmittingShareSubmission ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {isPhotoGalleryOpen && (
          <div className="fixed inset-0 z-[96] bg-[#002b49]/78 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="community-gallery-title">
            <div className="flex h-full w-full items-end justify-center p-0 sm:items-center sm:p-4">
              <div className="paint-card relative flex h-full w-full flex-col overflow-hidden rounded-none border border-[#0f9aa1]/22 bg-[#f6fcff] shadow-[0_28px_80px_rgba(0,43,73,0.42)] sm:h-auto sm:max-h-[95vh] sm:max-w-6xl sm:rounded-[2rem]">
                <div className="flex items-start justify-between gap-3 border-b border-[#002b49]/12 bg-[#fffdf7] px-4 py-4 sm:px-6 sm:py-5">
                  <div>
                    <h3 id="community-gallery-title" className="text-2xl font-bold leading-tight text-[#002b49] sm:text-[1.75rem]">
                      {photoGalleryView === 'volunteer' ? 'Community in Action Gallery' : 'Before/After Gallery'}
                    </h3>
                    <p className="mt-1 text-sm text-[#1f5f7a] sm:text-base">
                      {photoGalleryView === 'volunteer'
                        ? 'Scroll to explore all Community in Action photos.'
                        : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closePhotoGallery}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#002b49]/20 bg-white text-xl font-semibold text-[#002b49] shadow-[0_8px_18px_rgba(0,43,73,0.18)] transition hover:bg-[#eef7fb]"
                    aria-label="Close photo gallery"
                  >
                    ×
                  </button>
                </div>

                <div className="max-h-[86vh] overflow-y-auto bg-[#fffdf7] px-4 pb-5 pt-4 sm:max-h-[80vh] sm:px-6 sm:pb-6 sm:pt-5">
                  {photoGalleryView === 'volunteer' ? (
                    volunteerGroupPhotos.length ? (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {volunteerGroupPhotos.map((photo, photoIndex) => (
                          <div key={`volunteer-gallery-photo-${photo.id}-${photoIndex}`} className="flex flex-col rounded-[1.2rem] border border-[#0f9aa1]/24 bg-white p-3 shadow-[0_10px_22px_rgba(0,43,73,0.08)]">
                            <div className="overflow-hidden rounded-lg border border-[#0f9aa1]/22 bg-white">
                              <img src={getStoredImageUrl(photo)} alt="Community in Action photo" className="h-52 w-full object-contain object-center" />
                            </div>
                            {photo.ownerId && browserOwnerId && photo.ownerId === browserOwnerId ? (
                              <button
                                type="button"
                                onClick={() => handleDeleteCommunityActionSubmission(photo.submissionId)}
                                className="mt-2 inline-flex min-h-9 w-fit items-center justify-center rounded-full border border-[#D9665B]/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#D9665B] transition hover:bg-[#fff3f0]"
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-[1.1rem] border border-[#0f9aa1]/24 bg-white p-6 text-center text-[#1f5f7a]">
                        Community in Action photos will appear here.
                      </div>
                    )
                  ) : visibleBeforeAfterGalleryPairs.length ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {visibleBeforeAfterGalleryPairs.map((pair, submissionIndex) => {
                        const beforeImage = pair.beforeImage;
                        const afterImage = pair.afterImage;

                        return (
                          <div
                            key={`community-photo-submission-${pair.id || submissionIndex}`}
                            className="flex flex-col rounded-[1.2rem] border border-[#0f9aa1]/24 bg-white p-3 shadow-[0_10px_22px_rgba(0,43,73,0.08)]"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <div className="overflow-hidden rounded-lg border border-[#D9665B]/22 bg-[#fff7f4]">
                                {beforeImage ? (
                                  <img src={getStoredImageUrl(beforeImage)} alt="Cleanup before photo" className="h-36 w-full object-cover sm:h-40" style={{ objectPosition: getPhotoObjectPosition(beforeImage) }} />
                                ) : (
                                  <div className="flex h-36 items-center justify-center text-xs font-semibold uppercase tracking-[0.14em] text-[#8f5e56] sm:h-40">
                                    Before
                                  </div>
                                )}
                              </div>

                              <div className="overflow-hidden rounded-lg border border-[#69BE28]/22 bg-[#f4fbe9]">
                                {afterImage ? (
                                  <img src={getStoredImageUrl(afterImage)} alt="Cleanup after photo" className="h-36 w-full object-cover sm:h-40" style={{ objectPosition: getPhotoObjectPosition(afterImage) }} />
                                ) : (
                                  <div className="flex h-36 items-center justify-center text-xs font-semibold uppercase tracking-[0.14em] text-[#4b7430] sm:h-40">
                                    After
                                  </div>
                                )}
                              </div>
                            </div>
                            {pair.pairCaption ? (
                              <p className="mt-2 rounded-lg bg-[#f1f8fb] px-2.5 py-2 text-sm leading-6 text-[#1f5f7a] whitespace-pre-wrap break-words">
                                {pair.pairCaption}
                              </p>
                            ) : null}
                            {pair.ownerId && browserOwnerId && pair.ownerId === browserOwnerId ? (
                              <button
                                type="button"
                                onClick={() => handleDeletePhotoSubmission(pair.submissionId, 'before/after photo pair')}
                                className="mt-2 inline-flex min-h-9 w-fit items-center justify-center rounded-full border border-[#D9665B]/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#D9665B] transition hover:bg-[#fff3f0]"
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-[1.1rem] border border-[#0f9aa1]/24 bg-white p-6 text-center text-[#1f5f7a]">
                      Upload your first before-and-after cleanup pair using POST YOUR PHOTOS.
                    </div>
                  )}

                  <div className="mt-5 flex justify-end border-t border-[#002b49]/10 pt-3">
                    <button
                      type="button"
                      onClick={closePhotoGallery}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#002b49]/20 px-5 py-2 text-sm font-semibold text-[#002b49] transition hover:bg-[#f2f7fa]"
                    >
                      Close Gallery
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
