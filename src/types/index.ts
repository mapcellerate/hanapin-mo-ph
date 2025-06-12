export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  coins: number;
  rank?: string;
  createdAt: Date;
  stats: UserStats;
}

export interface UserStats {
  gamesPlayed: number;
  wins: number;
  totalScore: number;
  averageScore: number;
  currentStreak: number;
  bestStreak: number;
}

export interface Location {
  id: string;
  title: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  region: 'Luzon' | 'Visayas' | 'Mindanao';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  imagePreviewURL?: string;
}

export interface Game {
  id: string;
  mode: GameMode;
  status: GameStatus;
  players: string[];
  locations: Location[];
  rounds: Round[];
  createdAt: Date;
  endedAt?: Date;
}

export type GameMode = 'daily' | 'solo' | 'classic' | 'ranked' | 'invite';
export type GameStatus = 'waiting' | 'active' | 'completed';

export interface Round {
  locationId: string;
  guesses: Guess[];
  timeLimit: number;
  startedAt: Date;
  endedAt?: Date;
}

export interface Guess {
  playerId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: number;
  score: number;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  criteria: {
    type: string;
    value: number;
  };
} 