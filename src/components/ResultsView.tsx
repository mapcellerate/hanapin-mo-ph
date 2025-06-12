import { formatDistance } from '../utils/distance';

interface ResultsViewProps {
  guessLocations: google.maps.LatLngLiteral[];
  actualLocations: google.maps.LatLngLiteral[];
  distances: number[];
  totalScore: number;
  onPlayAgain: () => void;
}

function calculateScore(distance: number): number {
  // Distance is already in meters from google.maps.geometry.spherical.computeDistanceBetween
  const distanceInMeters = distance;

  // Apply scoring tiers
  if (distanceInMeters <= 50) {
    return 5000;
  } else if (distanceInMeters <= 200) {
    // Linear interpolation between 4999 and 4500
    return Math.round(4999 - ((distanceInMeters - 50) / 150) * 499);
  } else if (distanceInMeters <= 1000) {
    // Linear interpolation between 4499 and 4000
    return Math.round(4499 - ((distanceInMeters - 200) / 800) * 499);
  } else if (distanceInMeters <= 5000) {
    // Linear interpolation between 3999 and 3000
    return Math.round(3999 - ((distanceInMeters - 1000) / 4000) * 999);
  } else if (distanceInMeters <= 20000) {
    // Linear interpolation between 2999 and 2000
    return Math.round(2999 - ((distanceInMeters - 5000) / 15000) * 999);
  } else if (distanceInMeters <= 50000) {
    // Linear interpolation between 1999 and 1000
    return Math.round(1999 - ((distanceInMeters - 20000) / 30000) * 999);
  } else if (distanceInMeters <= 150000) {
    // Linear interpolation between 999 and 500
    return Math.round(999 - ((distanceInMeters - 50000) / 100000) * 499);
  } else {
    // Linear interpolation between 499 and 0 for distances > 150km
    const score = Math.round(499 * (1 - Math.min(1, (distanceInMeters - 150000) / 150000)));
    return Math.max(0, score);
  }
}

export default function ResultsView({
  guessLocations,
  actualLocations,
  distances,
  totalScore,
  onPlayAgain,
}: ResultsViewProps) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Game Results</h2>
        
        <div className="space-y-4 mb-6">
          {distances.map((distance, index) => {
            const roundScore = calculateScore(distance);
            return (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div className="space-y-1">
                  <div className="font-medium">Round {index + 1}</div>
                  <div className="text-sm text-gray-600">Distance: {formatDistance(distance)}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{roundScore.toLocaleString()} points</div>
                  <div className="text-sm text-gray-600">
                    {Math.round((roundScore / 5000) * 100)}% accuracy
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="flex justify-between items-center pt-4 font-bold text-lg">
            <span>Total Score</span>
            <div className="text-right">
              <div>{totalScore.toLocaleString()} points</div>
              <div className="text-sm text-gray-600">
                {Math.round((totalScore / (5000 * distances.length)) * 100)}% average accuracy
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onPlayAgain}
            className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
} 