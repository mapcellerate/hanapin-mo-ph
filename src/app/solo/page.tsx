'use client';

import React, { useState, useCallback, useEffect } from 'react';
import GameMap from '@/components/GameMap';
import StreetView from '@/components/StreetView';
import ResultsView from '@/components/ResultsView';
import { locations } from '@/data/verified-locations';
import { remoteLocations } from '@/data/remote-locations';
import { collection, addDoc, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Location } from '@/types/location';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const ROUNDS = 5;
const MAX_SCORE_PER_ROUND = 5000;

function getRandomLocations(count: number) {
  // Combine both location sets, with remote locations having a higher weight
  const allLocations = [...locations, ...remoteLocations, ...remoteLocations];
  const shuffled = [...allLocations].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function calculateScore(distance: number): number {
  // Distance is already in meters from google.maps.geometry.spherical.computeDistanceBetween
  const distanceInMeters = distance;

  // Apply scoring tiers
  if (distanceInMeters <= 50) {
    return 5000;
  } else if (distanceInMeters <= 200) {
    // Linear interpolation between 4999 and 4500
    return Math.round(4999 - ((distanceInMeters - 50) / 150) * 499);
  } else if (distanceInMeters <= 1000) {
    // Linear interpolation between 4499 and 4000
    return Math.round(4499 - ((distanceInMeters - 200) / 800) * 499);
  } else if (distanceInMeters <= 5000) {
    // Linear interpolation between 3999 and 3000
    return Math.round(3999 - ((distanceInMeters - 1000) / 4000) * 999);
  } else if (distanceInMeters <= 20000) {
    // Linear interpolation between 2999 and 2000
    return Math.round(2999 - ((distanceInMeters - 5000) / 15000) * 999);
  } else if (distanceInMeters <= 50000) {
    // Linear interpolation between 1999 and 1000
    return Math.round(1999 - ((distanceInMeters - 20000) / 30000) * 999);
  } else if (distanceInMeters <= 150000) {
    // Linear interpolation between 999 and 500
    return Math.round(999 - ((distanceInMeters - 50000) / 100000) * 499);
  } else {
    // Linear interpolation between 499 and 0 for distances > 150km
    const score = Math.round(499 * (1 - Math.min(1, (distanceInMeters - 150000) / 150000)));
    return Math.max(0, score);
  }
}

export default function SoloGame() {
  const [gameState, setGameState] = useState<'playing' | 'results'>('playing');
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [guesses, setGuesses] = useState<google.maps.LatLngLiteral[]>([]);
  const [currentGuess, setCurrentGuess] = useState<google.maps.LatLngLiteral | null>(null);
  const [gameLocations, setGameLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const mapRef = React.useRef<google.maps.Map | null>(null);
  const gameMapRef = React.useRef<google.maps.Map | null>(null);

  // Function to reset map to default Philippines view
  const resetMapToPhilippines = useCallback((map: google.maps.Map | null) => {
    if (map) {
      map.setCenter({ lat: 12.8797, lng: 121.7740 }); // Center of Philippines
      map.setZoom(6);
    }
  }, []);

  useEffect(() => {
    // Get 5 random locations for the game
    const getRandomLocations = () => {
      const shuffled = [...locations].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 5);
    };
    setGameLocations(getRandomLocations());
    setIsLoading(false);
  }, []);

  const handleGuess = useCallback((guessLocation: google.maps.LatLngLiteral) => {
    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      guessLocation,
      { lat: gameLocations[currentRound - 1].lat, lng: gameLocations[currentRound - 1].lng }
    );
    const roundScore = calculateScore(distance);

    setCurrentGuess(guessLocation);
    setGuesses(prev => [...prev, guessLocation]);
    setScore(prev => prev + roundScore);
  }, [currentRound, gameLocations]);

  const handleNextRound = useCallback(() => {
    if (currentRound === ROUNDS) {
      setGameState('results');
    } else {
      setCurrentRound(prev => prev + 1);
      setCurrentGuess(null);
      // Reset both maps to default view
      resetMapToPhilippines(mapRef.current);
      resetMapToPhilippines(gameMapRef.current);
    }
  }, [currentRound, resetMapToPhilippines]);

  const handlePlayAgain = async () => {
    // Reset game state
    setCurrentRound(1);
    setGameLocations(getRandomLocations(ROUNDS));
    setGuesses([]);
    setCurrentGuess(null);
    setScore(0);
    setGameState('playing');
    
    // Reset both maps to default view
    resetMapToPhilippines(mapRef.current);
    resetMapToPhilippines(gameMapRef.current);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (gameState === 'results') {
    return (
      <ResultsView
        guessLocations={guesses}
        actualLocations={gameLocations}
        distances={guesses.map((guess, i) => 
          google.maps.geometry.spherical.computeDistanceBetween(
            guess,
            { lat: gameLocations[i].lat, lng: gameLocations[i].lng }
          )
        )}
        totalScore={score}
        onPlayAgain={handlePlayAgain}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Round {currentRound} of {ROUNDS}</h1>
        <div className="text-right">
          <p className="text-lg">Total Score: {score.toLocaleString()}</p>
          {guesses.length > 0 && (
            <p className="text-sm text-gray-600">
              Average Distance: {(guesses.map((guess, i) => 
                google.maps.geometry.spherical.computeDistanceBetween(
                  guess,
                  { lat: gameLocations[i].lat, lng: gameLocations[i].lng }
                )
              ).reduce((a, b) => a + b, 0) / guesses.length / 1000).toFixed(2)} km
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <h2 className="text-xl font-semibold p-4 bg-gray-50">Where is this?</h2>
          <div className="h-[400px]">
            <StreetView location={gameLocations[currentRound - 1]} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <h2 className="text-xl font-semibold p-4 bg-gray-50">
            {currentGuess ? 'Round Results' : 'Make your guess'}
          </h2>
          <div className="h-[400px]">
            <GameMap
              ref={gameMapRef}
              targetLocation={gameLocations[currentRound - 1]}
              onGuess={handleGuess}
              guessLocation={currentGuess || undefined}
              isGuessMode={!currentGuess}
            />
          </div>
          {currentGuess && (
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg">
                    Distance: {(google.maps.geometry.spherical.computeDistanceBetween(
                      currentGuess,
                      { lat: gameLocations[currentRound - 1].lat, lng: gameLocations[currentRound - 1].lng }
                    ) / 1000).toFixed(2)} km
                  </p>
                  <p className="text-lg">
                    Score: +{calculateScore(google.maps.geometry.spherical.computeDistanceBetween(
                      currentGuess,
                      { lat: gameLocations[currentRound - 1].lat, lng: gameLocations[currentRound - 1].lng }
                    )).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleNextRound}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  {currentRound === ROUNDS ? 'See Final Results' : 'Next Round'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 