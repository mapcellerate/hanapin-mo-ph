'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format } from 'date-fns';

interface CompletedChallenge {
  id: string;
  timestamp: Date;
  score: number;
  accuracy: number;
}

function CompletedChallengesAdmin() {
  const [challenges, setChallenges] = useState<CompletedChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenges() {
      try {
        const q = query(
          collection(db, 'completed_challenges'),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const challengesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate(),
        })) as CompletedChallenge[];
        
        setChallenges(challengesData);
        setError(null);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        setError('Failed to load completed challenges');
      } finally {
        setLoading(false);
      }
    }

    fetchChallenges();
  }, []);

  if (loading) {
    return <div className="p-4">Loading challenges...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Completed Solo Challenges</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Timestamp</th>
              <th className="px-4 py-2 border">Score</th>
              <th className="px-4 py-2 border">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((challenge) => (
              <tr key={challenge.id}>
                <td className="px-4 py-2 border">
                  {format(challenge.timestamp, 'PPpp')}
                </td>
                <td className="px-4 py-2 border text-right">
                  {challenge.score.toLocaleString()}
                </td>
                <td className="px-4 py-2 border text-right">
                  {challenge.accuracy.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CompletedChallengesAdmin; 