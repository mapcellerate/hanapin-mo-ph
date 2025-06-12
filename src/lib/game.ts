import { collection, doc, getDoc, getDocs, query, where, orderBy, limit, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface Location {
  id: string;
  title: string;
  lat: number;
  lng: number;
  region: 'Luzon' | 'Visayas' | 'Mindanao';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imageUrl?: string;
  plays: number;
  streetViewConfig?: {
    lat: number;
    lng: number;
    heading: number;
    pitch: number;
    zoom: number;
  };
}

export interface DailyChallenge {
  id: string;
  date: Date;
  location: Location;
  participants: number;
  averageScore: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  score: number;
  timestamp: Date;
}

export async function getDailyChallenge(): Promise<DailyChallenge | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const challengeRef = doc(db, 'dailyChallenges', today.toISOString().split('T')[0]);
  const challengeDoc = await getDoc(challengeRef);

  if (!challengeDoc.exists()) {
    // If no challenge exists for today, create one
    const locationsRef = collection(db, 'locations');
    const locationsSnap = await getDocs(locationsRef);
    const locations = locationsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Location));
    
    if (locations.length === 0) return null;

    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const newChallenge: DailyChallenge = {
      id: today.toISOString().split('T')[0],
      date: today,
      location: randomLocation,
      participants: 0,
      averageScore: 0,
    };

    await setDoc(challengeRef, {
      ...newChallenge,
      date: Timestamp.fromDate(today),
    });

    return newChallenge;
  }

  const data = challengeDoc.data();
  return {
    ...data,
    id: challengeDoc.id,
    date: data.date.toDate(),
  } as DailyChallenge;
}

export async function submitDailyScore(userId: string, challengeId: string, score: number): Promise<void> {
  const scoreRef = doc(db, 'dailyScores', `${challengeId}_${userId}`);
  await setDoc(scoreRef, {
    userId,
    challengeId,
    score,
    timestamp: Timestamp.now(),
  });

  // Update challenge stats
  const challengeRef = doc(db, 'dailyChallenges', challengeId);
  const challengeDoc = await getDoc(challengeRef);
  const data = challengeDoc.data()!;

  const newAverage = Math.round(
    (data.averageScore * data.participants + score) / (data.participants + 1)
  );

  await setDoc(challengeRef, {
    ...data,
    participants: data.participants + 1,
    averageScore: newAverage,
  }, { merge: true });
}

export async function getDailyLeaderboard(challengeId: string, limit = 10): Promise<LeaderboardEntry[]> {
  const scoresRef = collection(db, 'dailyScores');
  const q = query(
    scoresRef,
    where('challengeId', '==', challengeId),
    orderBy('score', 'desc'),
    limit(limit)
  );

  const scoresSnap = await getDocs(q);
  const scores = scoresSnap.docs.map(doc => ({
    ...doc.data(),
    timestamp: doc.data().timestamp.toDate(),
  })) as LeaderboardEntry[];

  return scores;
} 