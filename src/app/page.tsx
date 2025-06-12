import GameModeCard from '@/components/GameModeCard';

const gameModes = [
  {
    mode: 'daily',
    title: 'Daily Challenge',
    description: 'One new location every day. Compete with players worldwide!',
    icon: '🌅',
    isComingSoon: true,
  },
  {
    mode: 'solo',
    title: 'Solo Challenge',
    description: 'Practice your skills with random locations across the Philippines.',
    icon: '🎯',
  },
  {
    mode: 'classic',
    title: 'Classic Mode',
    description: 'Play casual games with friends in custom lobbies.',
    icon: '🎮',
    isComingSoon: true,
  },
  {
    mode: 'ranked',
    title: 'Ranked Mode',
    description: 'Compete in ranked matches and climb the leaderboard!',
    icon: '🏆',
    isComingSoon: true,
  },
  {
    mode: 'invite',
    title: 'Private Games',
    description: 'Create private games with custom settings for your group.',
    icon: '✉️',
    isComingSoon: true,
  },
] as const;

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Hanapin Mo PH</h1>
      <p className="text-xl text-gray-600 mb-12 text-center">
        Test your knowledge of the Philippines in this geography guessing game!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gameModes.map((mode) => (
          <GameModeCard key={mode.mode} {...mode} />
        ))}
      </div>
    </main>
  );
} 