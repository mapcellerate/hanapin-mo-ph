'use client';

import React, { useEffect, useRef } from 'react';
import { loader } from '@/lib/google-maps-loader';

interface StreetViewProps {
  location: {
    streetViewConfig: {
      lat: number;
      lng: number;
      heading: number;
      pitch: number;
      zoom: number;
    };
  };
}

export default function StreetView({ location }: StreetViewProps) {
  const streetViewRef = useRef<HTMLDivElement>(null);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (!streetViewRef.current) return;

    const initStreetView = async () => {
      try {
        await loader.load();

        if (!streetViewRef.current) return;

        const panorama = new google.maps.StreetViewPanorama(
          streetViewRef.current,
          {
            position: {
              lat: location.streetViewConfig.lat,
              lng: location.streetViewConfig.lng,
            },
            pov: {
              heading: location.streetViewConfig.heading,
              pitch: location.streetViewConfig.pitch,
            },
            zoom: location.streetViewConfig.zoom,
            addressControl: false,
            showRoadLabels: false,
            motionTracking: false,
            motionTrackingControl: false,
            fullscreenControl: false,
          }
        );
      } catch (error) {
        console.error('Error initializing Street View:', error);
        setError('Failed to load Street View');
      }
    };

    initStreetView();
  }, [location]);

  if (error) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-100">{error}</div>;
  }

  return <div ref={streetViewRef} style={{ width: '100%', height: '100%' }} />;
} 