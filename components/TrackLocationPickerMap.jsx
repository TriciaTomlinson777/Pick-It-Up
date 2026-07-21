"use client";

import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { icon } from 'leaflet';

function SyncMapView({ markerLatLng }) {
  const map = useMap();

  useEffect(() => {
    if (!markerLatLng) {
      return;
    }

    map.setView(markerLatLng, map.getZoom(), { animate: false });
    map.invalidateSize({ pan: false });
  }, [map, markerLatLng]);

  return null;
}

export default function TrackLocationPickerMap({ markerLatLng, onMarkerMoved }) {
  const markerIcon = useMemo(
    () =>
      icon({
        className: 'cleanup-footprint-marker track-picker-marker',
        iconUrl: '/pick-it-up-map-marker.png',
        iconSize: [56, 78],
        iconAnchor: [28, 39],
      }),
    []
  );

  if (!markerLatLng) {
    return null;
  }

  return (
    <>
      <div className="h-full w-full">
        <MapContainer
          key="track-location-picker-map"
          center={markerLatLng}
          zoom={16}
          className="h-full w-full"
          zoomControl={false}
          scrollWheelZoom={false}
          attributionControl={false}
          preferCanvas
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <SyncMapView markerLatLng={markerLatLng} />

          <Marker
            position={markerLatLng}
            draggable
            icon={markerIcon}
            eventHandlers={{
              dragend: (event) => {
                const { lat, lng } = event.target.getLatLng();
                onMarkerMoved([lat, lng]);
              },
            }}
          />
        </MapContainer>
      </div>
    </>
  );
}
