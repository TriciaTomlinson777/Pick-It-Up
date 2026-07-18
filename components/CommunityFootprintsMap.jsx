"use client";

import { useEffect, useMemo } from 'react';
import { CircleMarker, MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { divIcon } from 'leaflet';

const SEATTLE_CENTER = [47.6062, -122.3321];
const BASE_ZOOM = 11;
const FOCUS_ZOOM = 13;

function MapViewAnimator({ mapZoomPhase, targetLatLng }) {
  const map = useMap();

  useEffect(() => {
    const bootTimer = window.setTimeout(() => {
      map.invalidateSize();
    }, 80);

    return () => {
      window.clearTimeout(bootTimer);
    };
  }, [map]);

  useEffect(() => {
    if (!targetLatLng) {
      return;
    }

    if (mapZoomPhase === 'focus') {
      map.invalidateSize();
      map.flyTo(targetLatLng, FOCUS_ZOOM, { duration: 1.15, easeLinearity: 0.2 });
      const focusSizeTimer = window.setTimeout(() => {
        map.invalidateSize();
      }, 650);

      return () => {
        window.clearTimeout(focusSizeTimer);
      };
    }

    if (mapZoomPhase === 'return') {
      map.invalidateSize();
      map.flyTo(SEATTLE_CENTER, BASE_ZOOM, { duration: 1.1, easeLinearity: 0.22 });
      const returnSizeTimer = window.setTimeout(() => {
        map.invalidateSize();
      }, 850);

      return () => {
        window.clearTimeout(returnSizeTimer);
      };
    }

    if (mapZoomPhase === 'idle') {
      const idleTimer = window.setTimeout(() => {
        map.invalidateSize();
      }, 120);

      return () => {
        window.clearTimeout(idleTimer);
      };
    }

    return undefined;
  }, [map, mapZoomPhase, targetLatLng]);

  return null;
}

export default function CommunityFootprintsMap({
  footprintLatLng,
  hasNewFootprintMarker,
  isMarkerDropping,
  isRippleActive,
  isMapCardAnimating,
  mapZoomPhase,
}) {
  const markerIcon = useMemo(
    () =>
      divIcon({
        className: `cleanup-footprint-marker${isMarkerDropping ? ' is-dropping' : ''}`,
        html: '<div class="cleanup-footprint-pin"><span class="cleanup-footprint-core"></span><span class="cleanup-footprint-toes"></span></div>',
        iconSize: [42, 46],
        iconAnchor: [21, 42],
      }),
    [isMarkerDropping]
  );

  return (
    <>
      <div className={`map-stage mt-6 overflow-hidden rounded-[1.5rem] border border-[#0f2b45]/10 ${isMapCardAnimating ? 'is-focused' : ''}`}>
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

          <MapViewAnimator mapZoomPhase={mapZoomPhase} targetLatLng={footprintLatLng || SEATTLE_CENTER} />

          {hasNewFootprintMarker && footprintLatLng && (
            <>
              {isRippleActive && (
                <CircleMarker
                  center={footprintLatLng}
                  radius={13}
                  pathOptions={{
                    className: 'cleanup-footprint-ripple',
                    color: '#62b275',
                    fillColor: '#62b275',
                    fillOpacity: 0.35,
                    opacity: 0.35,
                    weight: 2,
                  }}
                />
              )}

              <Marker position={footprintLatLng} icon={markerIcon} />
            </>
          )}
        </MapContainer>
      </div>

      <style jsx global>{`
        .map-stage {
          transform-origin: center;
          background: #d7e7f3;
          position: relative;
          transition: transform 1150ms cubic-bezier(0.22, 0.8, 0.2, 1), box-shadow 1150ms ease;
          will-change: transform;
        }

        .map-stage.is-focused {
          transform: scale(1.95) translateY(-18%);
          z-index: 70;
          box-shadow: 0 40px 90px rgba(15, 43, 69, 0.34);
        }

        .cleanup-footprint-marker {
          background: transparent;
          border: 0;
        }

        .cleanup-footprint-pin {
          position: relative;
          width: 42px;
          height: 46px;
          transform-origin: center bottom;
        }

        .cleanup-footprint-pin::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 2px;
          width: 30px;
          height: 40px;
          border-radius: 15px 15px 16px 16px;
          background: #1f5f7a;
          clip-path: polygon(50% 100%, 8% 50%, 12% 17%, 50% 2%, 88% 17%, 92% 50%);
          box-shadow: 0 7px 12px rgba(15, 43, 69, 0.26);
        }

        .cleanup-footprint-core {
          position: absolute;
          left: 16px;
          top: 11px;
          width: 10px;
          height: 14px;
          border-radius: 999px;
          background: #fffdf7;
          z-index: 1;
        }

        .cleanup-footprint-toes {
          position: absolute;
          left: 12px;
          top: 5px;
          width: 18px;
          height: 8px;
          background:
            radial-gradient(circle at 0 50%, #fffdf7 0 2px, transparent 2.2px),
            radial-gradient(circle at 33% 5%, #fffdf7 0 2px, transparent 2.2px),
            radial-gradient(circle at 66% 0, #fffdf7 0 1.8px, transparent 2px),
            radial-gradient(circle at 100% 38%, #fffdf7 0 1.7px, transparent 1.9px);
          z-index: 1;
        }

        .cleanup-footprint-marker.is-dropping .cleanup-footprint-pin {
          animation: footprintDrop 1.1s cubic-bezier(0.18, 0.84, 0.24, 1) 1;
        }

        .cleanup-footprint-ripple {
          animation: footprintRipple 1.9s ease-out 1;
          transform-origin: center;
        }

        @keyframes footprintDrop {
          0% {
            transform: translateY(-38px) scale(1.6);
            opacity: 0;
          }

          62% {
            transform: translateY(3px) scale(0.96);
            opacity: 1;
          }

          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes footprintRipple {
          0% {
            transform: scale(0.65);
            opacity: 0.52;
          }

          100% {
            transform: scale(4.2);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
  }
