'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Achievement, getUserAchievements } from '@/lib/achievements';

interface AchievementCardProps {
  achievement: Achievement & { progress?: number; unlockedAt?: Date };
  isUnlocked: boolean;
}

function AchievementCard({ achievement, isUnlocked }: AchievementCardProps) {
  const progress = achievement.progress || 0;
  const progressPercentage = Math.min(100, Math.round((progress / achievement.criteria.target) * 100));

  const tierColors = {
    Bronze: 'bg-amber-600',
    Silver: 'bg-gray-400',
    Gold: 'bg-yellow-500',
    Platinum: 'bg-gradient-to-r from-purple-400 to-pink-600'
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${isUnlocked ? 'border-2 border-green-500' : ''}`}>
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 ${tierColors[achievement.tier]} rounded-full flex items-center justify-center text-2xl`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{achievement.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{achievement.description}</p>
          {isUnlocked ? (
            <div className="flex items-center space-x-2">
              <span className="text-green-600 text-sm">✓ Unlocked</span>
              {achievement.unlockedAt && (
                <span className="text-gray-500 text-sm">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress: {progress}/{achievement.criteria.target}</span>
                <span className="text-gray-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
          <div className="mt-2">
            <span className="text-yellow-600 text-sm">+{achievement.reward} coins</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<{
    unlocked: (Achievement & { unlockedAt: Date })[];
    inProgress: (Achievement & { progress: number })[];
  }>({ unlocked: [], inProgress: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    async function loadAchievements() {
      if (!user) return;
      const userAchievements = await getUserAchievements(user.id);
      setAchievements(userAchievements);
      setLoading(false);
    }
    loadAchievements();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg">Please sign in to view your achievements.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg">Loading achievements...</p>
        </div>
      </div>
    );
  }

  const filteredAchievements = filter === 'all'
    ? [...achievements.unlocked, ...achievements.inProgress]
    : filter === 'unlocked'
      ? achievements.unlocked
      : achievements.inProgress;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <div className="space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'unlocked' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Unlocked
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'locked' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            In Progress
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isUnlocked={'unlockedAt' in achievement}
          />
        ))}
      </div>
    </div>
  );
} 