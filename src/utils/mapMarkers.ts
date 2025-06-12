export function createLocationMarker(
  map: google.maps.Map,
  position: google.maps.LatLngLiteral,
  options: {
    isGuess: boolean;
    showLabel: boolean;
  }
) {
  const circle = new google.maps.Circle({
    map: map,
    center: position,
    radius: 1000, // 1km radius
    fillColor: options.isGuess ? '#4285F4' : '#EA4335', // Blue for guess, Red for target
    fillOpacity: 0.5,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    zIndex: 1,
  });

  const label = new google.maps.InfoWindow({
    content: `<div class="font-semibold">${options.isGuess ? 'Your Guess' : 'Actual Location'}</div>`,
    position: position,
    pixelOffset: new google.maps.Size(0, -10),
  });

  if (options.showLabel) {
    label.open(map);
  }

  return {
    circle,
    label,
    setMap: (newMap: google.maps.Map | null) => {
      circle.setMap(newMap);
      if (newMap === null) {
        label.close();
      } else if (options.showLabel) {
        label.open(newMap);
      }
    },
    getPosition: () => circle.getCenter()?.toJSON(),
  };
} 