'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Stats {
  totalUsers: number;
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  totalGamesPlayed: number;
  averageScore: number;
  topPlayers: Array<{
    id: string;
    displayName: string;
    score: number;
  }>;
  popularLocations: Array<{
    id: string;
    title: string;
    plays: number;
  }>;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      // Get total users
      const usersRef = collection(db, 'users');
      const usersSnap = await getDocs(usersRef);
      const totalUsers = usersSnap.size;

      // Get active users
      const now = new Date();
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [dailyActive, weeklyActive, monthlyActive] = await Promise.all([
        getDocs(query(usersRef, where('lastActive', '>=', dayAgo))),
        getDocs(query(usersRef, where('lastActive', '>=', weekAgo))),
        getDocs(query(usersRef, where('lastActive', '>=', monthAgo)))
      ]);

      // Get game stats
      const gamesRef = collection(db, 'games');
      const gamesSnap = await getDocs(gamesRef);
      const totalGamesPlayed = gamesSnap.size;

      let totalScore = 0;
      gamesSnap.forEach(doc => {
        totalScore += doc.data().score || 0;
      });
      const averageScore = totalGamesPlayed > 0 ? Math.round(totalScore / totalGamesPlayed) : 0;

      // Get top players
      const topPlayersQuery = query(
        usersRef,
        orderBy('stats.totalScore', 'desc'),
        limit(10)
      );
      const topPlayersSnap = await getDocs(topPlayersQuery);
      const topPlayers = topPlayersSnap.docs.map(doc => ({
        id: doc.id,
        displayName: doc.data().displayName,
        score: doc.data().stats.totalScore
      }));

      // Get popular locations
      const locationsRef = collection(db, 'locations');
      const locationsSnap = await getDocs(locationsRef);
      const popularLocations = locationsSnap.docs
        .map(doc => ({
          id: doc.id,
          title: doc.data().title,
          plays: doc.data().plays || 0
        }))
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 5);

      setStats({
        totalUsers,
        activeUsers: {
          daily: dailyActive.size,
          weekly: weeklyActive.size,
          monthly: monthlyActive.size
        },
        totalGamesPlayed,
        averageScore,
        topPlayers,
        popularLocations
      });

      setLoading(false);
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <p className="text-lg">Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center">
        <p className="text-lg text-red-600">Error loading statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">User Statistics</h2>
          <div className="space-y-2">
            <p>Total Users: {stats.totalUsers}</p>
            <p>Daily Active: {stats.activeUsers.daily}</p>
            <p>Weekly Active: {stats.activeUsers.weekly}</p>
            <p>Monthly Active: {stats.activeUsers.monthly}</p>
          </div>
        </div>

        {/* Game Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Game Statistics</h2>
          <div className="space-y-2">
            <p>Total Games: {stats.totalGamesPlayed}</p>
            <p>Average Score: {stats.averageScore}</p>
          </div>
        </div>

        {/* Top Players */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Top Players</h2>
          <div className="space-y-2">
            {stats.topPlayers.slice(0, 5).map((player, index) => (
              <div key={player.id} className="flex justify-between">
                <span>{index + 1}. {player.displayName}</span>
                <span>{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Locations */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Popular Locations</h2>
          <div className="space-y-2">
            {stats.popularLocations.map((location, index) => (
              <div key={location.id} className="flex justify-between">
                <span>{index + 1}. {location.title}</span>
                <span>{location.plays} plays</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts could be added here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          {/* Add chart component here */}
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Game Activity</h2>
          {/* Add chart component here */}
        </div>
      </div>
    </div>
  );
} 