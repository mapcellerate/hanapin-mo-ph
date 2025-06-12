import { GameMode } from '@/types';
import Link from 'next/link';

interface GameModeCardProps {
  mode: GameMode;
  title: string;
  description: string;
  icon: string;
  isComingSoon?: boolean;
}

export default function GameModeCard({
  mode,
  title,
  description,
  icon,
  isComingSoon = false,
}: GameModeCardProps) {
  return (
    <Link
      href={isComingSoon ? '#' : `/${mode}`}
      className={`block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
        isComingSoon ? 'opacity-75 cursor-not-allowed' : ''
      }`}
    >
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{icon}</span>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
      {isComingSoon && (
        <span className="inline-block mt-4 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
          Coming Soon
        </span>
      )}
    </Link>
  );
} 