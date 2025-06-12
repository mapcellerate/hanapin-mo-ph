export interface Location {
  id: string;
  title: string;
  lat: number;
  lng: number;
  region: string;
  difficulty: string;
  streetViewConfig: {
    lat: number;
    lng: number;
    heading: number;
    pitch: number;
    zoom: number;
  };
  streetViewMetadata: {
    pano: string;
    copyright: string;
    date: string;
  };
  isGoogleStreetView: boolean;
} 