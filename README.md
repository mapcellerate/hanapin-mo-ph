# 🗺️ Hanapin Mo PH

A Geoguessr-style web game set in the Philippines. Test your knowledge of Philippine geography by guessing locations from Street View images!

## 🚀 Features

- 🎮 Multiple Game Modes:
  - Daily Challenge
  - Solo Challenges
  - Classic (Unranked Multiplayer)
  - Ranked Challenges
  - Invite-only Challenges

- 🏆 Achievement System
- 🛒 In-game Store
- 📊 Leaderboards
- 👤 User Profiles

## 🔧 Tech Stack

- Frontend: Next.js + React + TailwindCSS
- Backend: Firebase (Authentication, Firestore, Storage)
- Maps: Google Maps JavaScript API
- Language: TypeScript

## 🛠️ Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hanapin-mo-ph.git
cd hanapin-mo-ph
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 