import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import { locations } from '../src/data/locations';
import * as fs from 'fs';

// Load environment variables
dotenv.config({ path: '.env.local' });

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;
const metadataBaseUrl = 'https://maps.googleapis.com/maps/api/streetview/metadata';

async function checkStreetViewMetadata(lat: number, lng: number): Promise<any> {
  const url = `${metadataBaseUrl}?location=${lat},${lng}&key=${apiKey}`;
  const response = await fetch(url);
  return response.json();
}

async function verifyStreetView() {
  console.log('Checking Street View coverage for all locations...\n');
  
  const results = [];
  
  for (const location of locations) {
    try {
      const metadata = await checkStreetViewMetadata(location.lat, location.lng);
      
      console.log(`Location: ${location.title}`);
      console.log(`Coordinates: ${location.lat}, ${location.lng}`);
      console.log(`Status: ${metadata.status}`);
      
      if (metadata.status === 'OK') {
        console.log(`Panorama ID: ${metadata.pano_id}`);
        console.log(`Date: ${metadata.date}`);
        console.log(`Copyright: ${metadata.copyright}`);
        console.log(`Is Google: ${metadata.copyright.toLowerCase().includes('google')}`);
        
        results.push({
          ...location,
          streetViewMetadata: metadata,
          isGoogleStreetView: metadata.copyright.toLowerCase().includes('google')
        });
      }
      
      console.log('-------------------\n');
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`Error checking ${location.title}:`, error);
    }
  }
  
  // Write results to a file
  const validLocations = results.filter(loc => loc.isGoogleStreetView);
  const outputPath = 'src/data/verified-locations.ts';
  
  const fileContent = `// Auto-generated file - contains only locations with official Google Street View coverage
export const locations = ${JSON.stringify(validLocations, null, 2)} as const;

export type Location = typeof locations[number];
`;
  
  fs.writeFileSync(outputPath, fileContent);
  
  console.log(`\nResults summary:`);
  console.log(`Total locations: ${locations.length}`);
  console.log(`Locations with Street View: ${results.length}`);
  console.log(`Locations with Google Street View: ${validLocations.length}`);
  console.log(`\nVerified locations have been saved to: ${outputPath}`);
}

verifyStreetView().catch(console.error); 