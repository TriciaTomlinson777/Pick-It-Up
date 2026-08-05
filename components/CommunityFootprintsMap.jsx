"use client";

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { icon } from 'leaflet';

const SEATTLE_CENTER = [47.6062, -122.3321];
const BASE_ZOOM = 11;
const FOCUS_ZOOM = 11;
const MIN_MARKER_ZOOM = 10;
const MAX_MARKER_ZOOM = 16;
const MIN_MARKER_WIDTH = 20;
const MAX_MARKER_WIDTH = 42;
const FOOTPRINT_ICON_TEMPLATE_VERSION = 'v4-leaflet-image-icon';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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

export default function CommunityFootprintsMap({
  footprintLatLng,
  existingFootprintLatLngs,
  hasNewFootprintMarker,
  mapZoomPhase,
}) {
  const [currentZoom, setCurrentZoom] = useState(BASE_ZOOM);

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

          {(existingFootprintLatLngs || []).map((existingLatLng, index) => (
            <Marker
              key={`existing-footprint-${index}-${existingLatLng[0]}-${existingLatLng[1]}`}
              position={existingLatLng}
              icon={markerIcon}
            />
          ))}

          {hasNewFootprintMarker && footprintLatLng && (
            <Marker
              key={`footprint-${FOOTPRINT_ICON_TEMPLATE_VERSION}`}
              position={footprintLatLng}
              icon={markerIcon}
            />
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
      `}</style>
    </>
  );
}
