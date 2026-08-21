"use client";

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { divIcon, icon, latLngBounds } from 'leaflet';

const SEATTLE_CENTER = [47.6062, -122.3321];
const BASE_ZOOM = 11;
const FOCUS_ZOOM = 11;
const MIN_MARKER_ZOOM = 10;
const MAX_MARKER_ZOOM = 16;
const MIN_MARKER_WIDTH = 20;
const MAX_MARKER_WIDTH = 42;
const FOOTPRINT_ICON_TEMPLATE_VERSION = 'v4-leaflet-image-icon';
const MOBILE_MARKER_QUERY = '(max-width: 767px)';
const MOBILE_BRANDED_MARKER_ZOOM = 13;
const MOBILE_CLUSTER_MAX_ZOOM = 16;
const MOBILE_CLUSTER_RADIUS = 34;
const MOBILE_CLUSTER_MIN_RADIUS = 18;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function useIsMobileMap() {
  const [isMobileMap, setIsMobileMap] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_MARKER_QUERY);
    const updateIsMobileMap = () => {
      setIsMobileMap(mobileQuery.matches);
    };

    updateIsMobileMap();
    mobileQuery.addEventListener('change', updateIsMobileMap);

    return () => {
      mobileQuery.removeEventListener('change', updateIsMobileMap);
    };
  }, []);

  return isMobileMap;
}

function getMobileClusterRadius(zoom) {
  const zoomProgress = Math.max(0, zoom - BASE_ZOOM);

  return Math.max(MOBILE_CLUSTER_MIN_RADIUS, MOBILE_CLUSTER_RADIUS - zoomProgress * 4);
}

function MapViewController({ footprintLatLng, mapZoomPhase }) {
  const map = useMap();

  useEffect(() => {
    if (!footprintLatLng || mapZoomPhase !== 'focus') {
      return;
    }

    map.setView(footprintLatLng, FOCUS_ZOOM, { animate: false });
    map.invalidateSize({ pan: false });
  }, [footprintLatLng, map, mapZoomPhase]);

  return null;
}

function ZoomTracker({ onZoomChange }) {
  const map = useMapEvents({
    zoom: () => {
      onZoomChange(map.getZoom());
    },
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
}

function MobileFootprintMarkers({ footprintPoints, markerIcon, currentZoom }) {
  const map = useMap();

  const dotIcon = useMemo(
    () =>
      divIcon({
        className: 'cleanup-footprint-dot-marker',
        html: '<span aria-hidden="true"></span>',
        iconSize: [9, 9],
        iconAnchor: [4.5, 4.5],
      }),
    []
  );

  const clusteredFootprints = useMemo(() => {
    if (currentZoom >= MOBILE_CLUSTER_MAX_ZOOM) {
      return footprintPoints.map((footprint) => ({ ...footprint, members: [footprint] }));
    }

    const clusterRadius = getMobileClusterRadius(currentZoom);
    const projectedFootprints = footprintPoints.map((footprint) => ({
      ...footprint,
      point: map.latLngToLayerPoint(footprint.position),
    }));
    const usedFootprintIds = new Set();

    return projectedFootprints.reduce((clusters, footprint) => {
      if (usedFootprintIds.has(footprint.id)) {
        return clusters;
      }

      const members = projectedFootprints.filter((candidate) => {
        if (usedFootprintIds.has(candidate.id)) {
          return false;
        }

        return footprint.point.distanceTo(candidate.point) <= clusterRadius;
      });

      members.forEach((member) => {
        usedFootprintIds.add(member.id);
      });

      clusters.push({
        id: members.map((member) => member.id).join('-'),
        position: [
          members.reduce((total, member) => total + member.position[0], 0) / members.length,
          members.reduce((total, member) => total + member.position[1], 0) / members.length,
        ],
        members,
      });

      return clusters;
    }, []);
  }, [currentZoom, footprintPoints, map]);

  const clusterIcon = useMemo(
    () => (count) =>
      divIcon({
        className: 'cleanup-footprint-cluster-marker',
        html: `<span>${count}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    []
  );

  const handleClusterTap = (cluster) => {
    const nextZoom = Math.min(map.getMaxZoom(), Math.max(currentZoom + 2, MOBILE_BRANDED_MARKER_ZOOM));

    if (cluster.members.length > 1) {
      map.fitBounds(latLngBounds(cluster.members.map((member) => member.position)), {
        animate: true,
        maxZoom: nextZoom,
        padding: [28, 28],
      });
      return;
    }

    map.setView(cluster.position, nextZoom, { animate: true });
  };

  return clusteredFootprints.map((cluster) => {
    if (cluster.members.length > 1) {
      return (
        <Marker
          key={`cluster-${cluster.id}`}
          position={cluster.position}
          icon={clusterIcon(cluster.members.length)}
          eventHandlers={{ click: () => handleClusterTap(cluster) }}
        />
      );
    }

    const footprint = cluster.members[0];
    const mobileIcon = currentZoom >= MOBILE_BRANDED_MARKER_ZOOM ? markerIcon : dotIcon;

    return <Marker key={footprint.id} position={footprint.position} icon={mobileIcon} />;
  });
}

export default function CommunityFootprintsMap({
  footprintLatLng,
  existingFootprintLatLngs,
  hasNewFootprintMarker,
  mapZoomPhase,
}) {
  const [currentZoom, setCurrentZoom] = useState(BASE_ZOOM);
  const isMobileMap = useIsMobileMap();

  const markerWidth = useMemo(() => {
    const zoom = clamp(currentZoom, MIN_MARKER_ZOOM, MAX_MARKER_ZOOM);
    const zoomProgress = (zoom - MIN_MARKER_ZOOM) / (MAX_MARKER_ZOOM - MIN_MARKER_ZOOM);

    return Math.round(MIN_MARKER_WIDTH + zoomProgress * (MAX_MARKER_WIDTH - MIN_MARKER_WIDTH));
  }, [currentZoom]);

  const markerHeight = useMemo(() => Math.round(markerWidth * (78 / 56)), [markerWidth]);

  const markerIcon = useMemo(
    () =>
      icon({
        className: 'cleanup-footprint-marker track-picker-marker',
        iconUrl: '/pick-it-up-map-marker.png',
        iconSize: [markerWidth, markerHeight],
        iconAnchor: [Math.round(markerWidth / 2), Math.round(markerHeight / 2)],
      }),
    [markerHeight, markerWidth]
  );

  const footprintPoints = useMemo(() => {
    const existingFootprints = (existingFootprintLatLngs || []).map((existingLatLng, index) => ({
      id: `existing-footprint-${index}-${existingLatLng[0]}-${existingLatLng[1]}`,
      position: existingLatLng,
    }));

    if (!hasNewFootprintMarker || !footprintLatLng) {
      return existingFootprints;
    }

    return [
      ...existingFootprints,
      {
        id: `footprint-${FOOTPRINT_ICON_TEMPLATE_VERSION}`,
        position: footprintLatLng,
      },
    ];
  }, [existingFootprintLatLngs, footprintLatLng, hasNewFootprintMarker]);

  return (
    <>
      <div className="map-stage mt-6 overflow-hidden rounded-[1.5rem] border border-[#002b49]/10">
        <MapContainer
          center={SEATTLE_CENTER}
          zoom={BASE_ZOOM}
          className="h-44 w-full"
          zoomControl
          dragging
          touchZoom
          scrollWheelZoom
          attributionControl={false}
          preferCanvas
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapViewController footprintLatLng={footprintLatLng} mapZoomPhase={mapZoomPhase} />
          <ZoomTracker onZoomChange={setCurrentZoom} />

          {isMobileMap ? (
            <MobileFootprintMarkers footprintPoints={footprintPoints} markerIcon={markerIcon} currentZoom={currentZoom} />
          ) : (
            footprintPoints.map((footprint) => <Marker key={footprint.id} position={footprint.position} icon={markerIcon} />)
          )}
        </MapContainer>
      </div>

      <style jsx global>{`
        .map-stage {
          background: #d7e7f3;
          position: relative;
          z-index: 1;
        }

        .cleanup-footprint-marker {
          background: transparent;
          border: 0;
          line-height: 0;
          transform-origin: center center;
          filter: drop-shadow(0 2px 5px rgba(0,43,73, 0.18));
          object-fit: contain;
        }

        .cleanup-footprint-dot-marker,
        .cleanup-footprint-cluster-marker {
          background: transparent;
          border: 0;
        }

        .cleanup-footprint-dot-marker span {
          display: block;
          width: 9px;
          height: 9px;
          border: 1px solid rgba(255, 255, 255, 0.86);
          border-radius: 9999px;
          background: #002244;
          box-shadow: 0 1px 4px rgba(0, 34, 68, 0.24);
        }

        .cleanup-footprint-cluster-marker span {
          display: inline-flex;
          width: 30px;
          height: 30px;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.9);
          border-radius: 9999px;
          background: #002244;
          color: #ffffff;
          font-family: var(--font-baloo-2), 'Trebuchet MS', 'Segoe UI', sans-serif;
          font-size: 0.9rem;
          font-weight: 800;
          line-height: 1;
          box-shadow: 0 4px 12px rgba(0, 34, 68, 0.28);
        }
      `}</style>
    </>
  );
}
