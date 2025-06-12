import { doc, getDoc, setDoc, increment, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  criteria: {
    type: 'games_played' | 'total_score' | 'perfect_score' | 'region_mastery' | 'daily_streak';
    target: number;
    region?: 'Luzon' | 'Visayas' | 'Mindanao';
  };
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: Date;
  progress: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_game',
    title: 'First Steps',
    description: 'Complete your first game',
    icon: '🎮',
    reward: 50,
    criteria: {
      type: 'games_played',
      target: 1
    },
    tier: 'Bronze'
  },
  {
    id: 'veteran',
    title: 'Veteran Explorer',
    description: 'Play 100 games',
    icon: '🎯',
    reward: 200,
    criteria: {
      type: 'games_played',
      target: 100
    },
    tier: 'Gold'
  },
  {
    id: 'perfect_guess',
    title: 'Bull\'s Eye',
    description: 'Get a perfect score (5000 points)',
    icon: '🎯',
    reward: 300,
    criteria: {
      type: 'perfect_score',
      target: 1
    },
    tier: 'Gold'
  },
  {
    id: 'luzon_master',
    title: 'Luzon Master',
    description: 'Win 50 games in Luzon',
    icon: '🏔️',
    reward: 100,
    criteria: {
      type: 'region_mastery',
      target: 50,
      region: 'Luzon'
    },
    tier: 'Silver'
  },
  {
    id: 'visayas_master',
    title: 'Visayas Master',
    description: 'Win 50 games in Visayas',
    icon: '🏖️',
    reward: 100,
    criteria: {
      type: 'region_mastery',
      target: 50,
      region: 'Visayas'
    },
    tier: 'Silver'
  },
  {
    id: 'mindanao_master',
    title: 'Mindanao Master',
    description: 'Win 50 games in Mindanao',
    icon: '🌴',
    reward: 100,
    criteria: {
      type: 'region_mastery',
      target: 50,
      region: 'Mindanao'
    },
    tier: 'Silver'
  },
  {
    id: 'daily_devotee',
    title: 'Daily Devotee',
    description: 'Complete 30 daily challenges',
    icon: '📅',
    reward: 500,
    criteria: {
      type: 'daily_streak',
      target: 30
    },
    tier: 'Gold'
  },
  {
    id: 'high_scorer',
    title: 'High Scorer',
    description: 'Accumulate 100,000 total points',
    icon: '🏆',
    reward: 1000,
    criteria: {
      type: 'total_score',
      target: 100000
    },
    tier: 'Platinum'
  }
];

export async function checkAchievements(userId: string, stats: any): Promise<Achievement[]> {
  const userRef = doc(db, 'users', userId);
  const achievementsRef = doc(db, 'userAchievements', userId);
  const achievementsDoc = await getDoc(achievementsRef);
  const unlockedAchievements = achievementsDoc.exists() ? achievementsDoc.data().achievements : {};

  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedAchievements[achievement.id]) continue;

    let progress = 0;
    switch (achievement.criteria.type) {
      case 'games_played':
        progress = stats.gamesPlayed || 0;
        break;
      case 'total_score':
        progress = stats.totalScore || 0;
        break;
      case 'perfect_score':
        progress = stats.perfectScores || 0;
        break;
      case 'region_mastery':
        progress = stats.regionWins?.[achievement.criteria.region!] || 0;
        break;
      case 'daily_streak':
        progress = stats.dailyStreak || 0;
        break;
    }

    if (progress >= achievement.criteria.target) {
      newlyUnlocked.push(achievement);
      unlockedAchievements[achievement.id] = {
        unlockedAt: Timestamp.now(),
        progress
      };

      // Award coins for unlocking achievement
      await setDoc(userRef, {
        coins: increment(achievement.reward)
      }, { merge: true });
    }
  }

  if (newlyUnlocked.length > 0) {
    await setDoc(achievementsRef, {
      achievements: unlockedAchievements
    }, { merge: true });
  }

  return newlyUnlocked;
}

export async function getUserAchievements(userId: string): Promise<{
  unlocked: (Achievement & { unlockedAt: Date })[];
  inProgress: (Achievement & { progress: number })[];
}> {
  const achievementsRef = doc(db, 'userAchievements', userId);
  const userRef = doc(db, 'users', userId);

  const [achievementsDoc, userDoc] = await Promise.all([
    getDoc(achievementsRef),
    getDoc(userRef)
  ]);

  const unlockedAchievements = achievementsDoc.exists() ? achievementsDoc.data().achievements : {};
  const stats = userDoc.exists() ? userDoc.data().stats : {};

  const unlocked: (Achievement & { unlockedAt: Date })[] = [];
  const inProgress: (Achievement & { progress: number })[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (unlockedAchievements[achievement.id]) {
      unlocked.push({
        ...achievement,
        unlockedAt: unlockedAchievements[achievement.id].unlockedAt.toDate()
      });
      continue;
    }

    let progress = 0;
    switch (achievement.criteria.type) {
      case 'games_played':
        progress = stats.gamesPlayed || 0;
        break;
      case 'total_score':
        progress = stats.totalScore || 0;
        break;
      case 'perfect_score':
        progress = stats.perfectScores || 0;
        break;
      case 'region_mastery':
        progress = stats.regionWins?.[achievement.criteria.region!] || 0;
        break;
      case 'daily_streak':
        progress = stats.dailyStreak || 0;
        break;
    }

    inProgress.push({
      ...achievement,
      progress
    });
  }

  return { unlocked, inProgress };
} 