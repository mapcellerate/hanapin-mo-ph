'use client';

export default function DailyChallengeGame() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Daily Challenge</h1>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-6xl mb-4">🌅</div>
          <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
          <p className="text-gray-600 mb-6">
            The Daily Challenge feature is currently under development. Check back soon to compete with players worldwide in daily challenges!
          </p>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">What to expect:</h3>
              <ul className="text-blue-700 text-left space-y-2">
                <li>• One new location every day</li>
                <li>• Global leaderboard</li>
                <li>• Daily streaks and rewards</li>
                <li>• Special achievements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 