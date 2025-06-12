import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    if (!process.env.FIREBASE_ADMIN_EMAIL || !process.env.FIREBASE_ADMIN_PASSWORD) {
      throw new Error('Missing admin credentials in environment variables');
    }

    // Create user with email and password
    const userRecord = await auth.createUser({
      email: process.env.FIREBASE_ADMIN_EMAIL,
      password: process.env.FIREBASE_ADMIN_PASSWORD,
      displayName: 'Admin',
    });

    // Set custom claims
    await auth.setCustomUserClaims(userRecord.uid, { admin: true });

    // Set up admin user document in Firestore
    await db.doc(`users/${userRecord.uid}`).set({
      email: userRecord.email,
      displayName: 'Admin',
      photoURL: null,
      role: 'admin',
      stats: {
        gamesPlayed: 0,
        totalScore: 0,
        averageScore: 0,
        perfectScores: 0,
        dailyStreak: 0,
        regionWins: {
          Luzon: 0,
          Visayas: 0,
          Mindanao: 0
        }
      },
      coins: 0,
      createdAt: new Date()
    });

    console.log('Successfully created admin user');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 