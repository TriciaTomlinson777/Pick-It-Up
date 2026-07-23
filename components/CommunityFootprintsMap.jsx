"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

const SEATTLE_CENTER = [47.6062, -122.3321];
const BASE_ZOOM = 11;
const FOCUS_ZOOM = 16;

export default function CommunityFootprintsMap({
  footprintLatLng,
  existingFootprintLatLngs,
  showExistingFootprints,
  hasNewFootprintMarker,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const iconRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Create the map exactly once. The cleanup below is what prevents the
  // "Map container is being reused by another instance" error.
  useEffect(() => {
    let cancelled = false;
    let resizeObserver = null;

    (async () => {
      // Imported inside the effect so Leaflet never loads during server rendering.
      const L = (await import("leaflet")).default;

      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: SEATTLE_CENTER,
        zoom: BASE_ZOOM,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      iconRef.current = L.icon({
        className: "cleanup-footprint-marker",
        iconUrl: "/green-footprints-marker.png",
        iconSize: [22, 30],
        iconAnchor: [11, 15],
      });

      markerLayerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      // If the map lives inside a form or panel that starts collapsed, Leaflet
      // measures it at zero height and draws nothing. This re-measures whenever
      // the container's size changes, so the map fills in when the form opens.
      resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      });
      resizeObserver.observe(containerRef.current);

      setTimeout(() => map.invalidateSize(), 0);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      if (resizeObserver) resizeObserver.disconnect();
      if (mapRef.current) {
        mapRef.current.remove(); // <-- releases the container for the next mount
        mapRef.current = null;
        markerLayerRef.current = null;
      }
      setReady(false);
    };
  }, []);

  // Redraw markers when props change. The map itself is never rebuilt, so this
  // same instance serves both the "locate" step and the "place marker" step.
  useEffect(() => {
    if (!ready || !markerLayerRef.current || !iconRef.current) return;

    const layer = markerLayerRef.current;
    layer.clearLayers();

    (async () => {
      const L = (await import("leaflet")).default;

      if (showExistingFootprints) {
        (existingFootprintLatLngs || []).forEach((latLng) => {
          L.marker(latLng, { icon: iconRef.current }).addTo(layer);
        });
      }

      if (hasNewFootprintMarker && footprintLatLng) {
        L.marker(footprintLatLng, { icon: iconRef.current }).addTo(layer);
      }
    })();
  }, [
    ready,
    showExistingFootprints,
    hasNewFootprintMarker,
    // Serialized so a new-but-identical array from the parent doesn't rerun this.
    JSON.stringify(existingFootprintLatLngs || []),
    JSON.stringify(footprintLatLng || null),
  ]);

  // Pan to the located spot once it's known.
  useEffect(() => {
    if (!ready || !mapRef.current || !footprintLatLng) return;
    mapRef.current.setView(footprintLatLng, FOCUS_ZOOM, { animate: true });
  }, [ready, JSON.stringify(footprintLatLng || null)]);

  return (
    <>
      <div className="map-stage mt-6 overflow-hidden rounded-[1.5rem] border border-[#002b49]/10">
        <div ref={containerRef} className="h-44 w-full" />
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
          filter: drop-shadow(0 2px 5px rgba(0, 43, 73, 0.18));
          object-fit: contain;
        }
      `}</style>
    </>
  );
}
