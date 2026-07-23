"use client";

import { useMemo } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SEATTLE_CENTER = [47.6062, -122.3321];
const BASE_ZOOM = 11;
const FOOTPRINT_ICON_TEMPLATE_VERSION = 'v3-leaflet-image-icon';

export default function CommunityFootprintsMap({
  footprintLatLng,
  existingFootprintLatLngs,
  showExistingFootprints,
  hasNewFootprintMarker,
}) {
  const markerIcon = useMemo(
    () =>
      icon({
        className: 'cleanup-footprint-marker',
        iconUrl: '/green-footprints-marker.png',
        iconSize: [22, 30],
        iconAnchor: [11, 15],
      }),
    [FOOTPRINT_ICON_TEMPLATE_VERSION]
  );

  return (
    <>
      <div className="map-stage mt-6 overflow-hidden rounded-[1.5rem] border border-[#002b49]/10">
        <MapContainer
          center={SEATTLE_CENTER}
          zoom={BASE_ZOOM}
          className="h-44 w-full"
          zoomControl={false}
          scrollWheelZoom={false}
          attributionControl={false}
          preferCanvas
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {showExistingFootprints &&
            (existingFootprintLatLngs || []).map((existingLatLng, index) => (
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
