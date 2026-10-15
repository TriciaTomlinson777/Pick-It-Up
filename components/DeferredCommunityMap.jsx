"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

function MapPlaceholder() {
  return (
    <div className="mt-6 flex h-44 items-center justify-center rounded-[1.5rem] border border-[#002b49]/10 bg-[#e6f2ef] text-sm text-[#002b49] lg:h-[30rem]" role="status">
      Loading community map…
    </div>
  );
}

const Map = dynamic(() => import('@/components/CommunityFootprintsMap'), {
  ssr: false,
  loading: MapPlaceholder,
});

export default function DeferredCommunityMap(props) {
  const containerRef = useRef(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const loadMap = isNearViewport || props.hasNewFootprintMarker || props.isMapCardAnimating;

  useEffect(() => {
    if (loadMap) return;
    if (!('IntersectionObserver' in window)) {
      setIsNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setIsNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: '600px 0px' });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [loadMap]);

  return <div ref={containerRef}>{loadMap ? <Map {...props} /> : <MapPlaceholder />}</div>;
}
