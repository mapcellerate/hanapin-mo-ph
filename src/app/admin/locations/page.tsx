'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Location {
  id: string;
  title: string;
  lat: number;
  lng: number;
  region: string;
  difficulty: string;
  averageScore: number;
  averageAccuracy: number;
  timesPlayed: number;
}

function LocationsAdmin() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const querySnapshot = await getDocs(collection(db, 'locations'));
        const locationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Location[];
        
        setLocations(locationsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError('Failed to load locations');
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, []);

  if (loading) {
    return <div className="p-4">Loading locations...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Location Statistics</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Coordinates</th>
              <th className="px-4 py-2 border">Region</th>
              <th className="px-4 py-2 border">Difficulty</th>
              <th className="px-4 py-2 border">Avg Score</th>
              <th className="px-4 py-2 border">Avg Accuracy</th>
              <th className="px-4 py-2 border">Times Played</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id}>
                <td className="px-4 py-2 border">{location.title}</td>
                <td className="px-4 py-2 border">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </td>
                <td className="px-4 py-2 border">{location.region}</td>
                <td className="px-4 py-2 border">{location.difficulty}</td>
                <td className="px-4 py-2 border text-right">
                  {location.averageScore?.toLocaleString() ?? 'N/A'}
                </td>
                <td className="px-4 py-2 border text-right">
                  {location.averageAccuracy?.toFixed(2) ?? 'N/A'}%
                </td>
                <td className="px-4 py-2 border text-right">
                  {location.timesPlayed ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LocationsAdmin; 