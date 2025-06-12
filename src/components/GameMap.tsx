'use client';

import React, { useEffect, useRef } from 'react';
import { loader } from '@/lib/google-maps-loader';
import ConfirmDialog from './ConfirmDialog';

interface Location {
  id?: string;
  title?: string;
  lat: number;
  lng: number;
  region?: string;
}

interface GameMapProps {
  targetLocation: Location;
  onGuess: (location: google.maps.LatLngLiteral) => void;
  guessLocation?: google.maps.LatLngLiteral;
  isGuessMode: boolean;
}

const GameMap = React.forwardRef<google.maps.Map, GameMapProps>(({
  targetLocation,
  onGuess,
  guessLocation,
  isGuessMode
}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const guessMarkerRef = useRef<google.maps.Marker | null>(null);
  const targetMarkerRef = useRef<google.maps.Marker | null>(null);
  const lineRef = useRef<google.maps.Polyline | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [pendingGuess, setPendingGuess] = React.useState<google.maps.LatLngLiteral | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useImperativeHandle(ref, () => mapInstanceRef.current!, []);

  const clearMapObjects = () => {
    if (guessMarkerRef.current) {
      guessMarkerRef.current.setMap(null);
      guessMarkerRef.current = null;
    }
    if (targetMarkerRef.current) {
      targetMarkerRef.current.setMap(null);
      targetMarkerRef.current = null;
    }
    if (lineRef.current) {
      lineRef.current.setMap(null);
      lineRef.current = null;
    }
  };

  const handleConfirmGuess = () => {
    if (pendingGuess) {
      onGuess(pendingGuess);
      setShowConfirmDialog(false);
      setPendingGuess(null);
    }
  };

  const handleCancelGuess = () => {
    clearMapObjects();
    setShowConfirmDialog(false);
    setPendingGuess(null);
  };

  // Initialize map and set up click handling
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        await loader.load();
        
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 12.8797, lng: 121.7740 }, // Center of Philippines
          zoom: 6,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          clickableIcons: false,
        });

        mapInstanceRef.current = map;

        // Set up click listener if in guess mode
        if (isGuessMode) {
          map.addListener('click', (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;
            
            const clickLocation = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            };

            clearMapObjects();

            const marker = new google.maps.Marker({
              position: clickLocation,
              map,
              icon: {
                url: '/marker-blue.svg',
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40),
              },
              title: 'Your Guess'
            });
            guessMarkerRef.current = marker;

            setPendingGuess(clickLocation);
            setShowConfirmDialog(true);
          });
        }

        // Show results if not in guess mode and we have a guess location
        if (!isGuessMode && guessLocation) {
          // Guess marker (blue)
          const guessMarker = new google.maps.Marker({
            position: guessLocation,
            map,
            icon: {
              url: '/marker-blue.svg',
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 40),
            },
            title: 'Your Guess'
          });
          guessMarkerRef.current = guessMarker;

          // Target marker (red)
          const targetMarker = new google.maps.Marker({
            position: { lat: targetLocation.lat, lng: targetLocation.lng },
            map,
            icon: {
              url: '/marker-red.svg',
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 40),
            },
            title: targetLocation.title || 'Actual Location'
          });
          targetMarkerRef.current = targetMarker;

          // Line between markers
          const line = new google.maps.Polyline({
            path: [guessLocation, { lat: targetLocation.lat, lng: targetLocation.lng }],
            map,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
          });
          lineRef.current = line;

          // Fit bounds to show both markers
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(guessLocation);
          bounds.extend({ lat: targetLocation.lat, lng: targetLocation.lng });
          map.fitBounds(bounds, 50);
        }

      } catch (error) {
        console.error('Error initializing map:', error);
        setError('Failed to load map');
      }
    };

    initMap();
  }, [isGuessMode, guessLocation, targetLocation]);

  if (error) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-100">{error}</div>;
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={handleConfirmGuess}
        onCancel={handleCancelGuess}
        title="Confirm Your Guess"
        message="Are you sure about this location? You can't change your guess after confirming."
      />
    </div>
  );
});

GameMap.displayName = 'GameMap';

export default GameMap; 