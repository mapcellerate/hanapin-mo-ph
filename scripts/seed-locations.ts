import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import { locations } from '../src/data/verified-locations';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const db = getFirestore(app);

// Add plays field to each location
const locationsWithPlays = locations.map(location => ({
  ...location,
  plays: 0
}));

// Seed the locations
async function seedLocations() {
  try {
    const locationsCollection = db.collection('locations');
    
    // First, delete all existing locations
    const existingDocs = await locationsCollection.get();
    const batch = db.batch();
    existingDocs.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log('Deleted existing locations');
    
    // Now add all locations
    for (const location of locationsWithPlays) {
      const docRef = await locationsCollection.add(location);
      console.log(`Added location: ${location.title} with ID: ${docRef.id}`);
    }
    
    console.log('Successfully seeded locations');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding locations:', error);
    process.exit(1);
  }
}

seedLocations(); 