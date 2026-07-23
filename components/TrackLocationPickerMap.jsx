"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

const FOCUS_ZOOM = 16;

function sameSpot(a, b) {
  if (!a || !b) return false;
  return Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;
}

export default function TrackLocationPickerMap({ markerLatLng, onMarkerMoved }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const initialLatLngRef = useRef(markerLatLng);
  const onMarkerMovedRef = useRef(onMarkerMoved);
  const lastDraggedRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Keep the latest callback without making it an effect dependency.
  useEffect(() => {
    onMarkerMovedRef.current = onMarkerMoved;
  }, [onMarkerMoved]);

  // Create the map exactly once, and tear it down properly on unmount.
  useEffect(() => {
    let cancelled = false;
    let resizeObserver = null;

    (async () => {
      const L = (await import("leaflet")).default;

      if (cancelled || !containerRef.current || mapRef.current) return;

      const start = initialLatLngRef.current;
      if (!start) return;

      const map = L.map(containerRef.current, {
        center: start,
        zoom: FOCUS_ZOOM,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const markerIcon = L.icon({
        className: "cleanup-footprint-marker track-picker-marker",
        iconUrl: "/pick-it-up-map-marker.png",
        iconSize: [56, 78],
        iconAnchor: [28, 39],
      });

      const marker = L.marker(start, { icon: markerIcon, draggable: true }).addTo(map);

      marker.on("dragend", (event) => {
        const { lat, lng } = event.target.getLatLng();
        const next = [lat, lng];
        // Remember what we emitted so the sync effect below doesn't yank the
        // map back to center on every drag.
        lastDraggedRef.current = next;
        if (onMarkerMovedRef.current) onMarkerMovedRef.current(next);
      });

      markerRef.current = marker;
      mapRef.current = map;

      // This panel is hidden until the location is confirmed, so Leaflet would
      // otherwise measure a zero-height box and render blank.
      resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) mapRef.current.invalidateSize({ pan: false });
      });
      resizeObserver.observe(containerRef.current);

      setTimeout(() => map.invalidateSize({ pan: false }), 0);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      if (resizeObserver) resizeObserver.disconnect();
      if (mapRef.current) {
        mapRef.current.remove(); // releases the container for any later mount
        mapRef.current = null;
        markerRef.current = null;
      }
      setReady(false);
    };
  }, []);

  // Sync the marker when the location changes from outside the map (e.g. the
  // address lookup). Changes that came from dragging are ignored here.
  useEffect(() => {
    if (!ready || !mapRef.current || !markerRef.current || !markerLatLng) return;

    if (sameSpot(markerLatLng, lastDraggedRef.current)) return;

    markerRef.current.setLatLng(markerLatLng);
    mapRef.current.setView(markerLatLng, mapRef.current.getZoom(), { animate: false });
    mapRef.current.invalidateSize({ pan: false });
  }, [ready, JSON.stringify(markerLatLng || null)]);

  if (!markerLatLng) return null;

  return (
    <div className="h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
