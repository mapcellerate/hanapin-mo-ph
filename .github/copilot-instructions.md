🗺️ Build a mobile-friendly Geoguessr-style web game set in the Philippines called “Hanapin Mo PH”

### 🔧 Tech Stack Preferences
- Frontend: React + TailwindCSS (mobile-first, responsive design)
- Backend: Firebase (Authentication, Firestore, Storage, Cloud Functions)
- Map: Google Maps JavaScript API (legally integrated), or Mapbox if needed
- Deployment: Vercel or Firebase Hosting
- Use TypeScript for strong type safety

---

### 🎮 Game Modes

1. **Daily Challenge**
   - 1 new location per day for all players
   - Timer, streak tracker, global daily leaderboard

2. **Solo Challenges**
   - Random or curated location pool (Luzon, Visayas, Mindanao)
   - 5-round guessing game with distance-based scoring

3. **Classic (Unranked Multiplayer)**
   - Create or join casual lobbies
   - Play same set of 3–5 locations with friends

4. **Ranked Challenges (Competitive)**
   - Elo-style matchmaking
   - Competitive leaderboard (weekly + all-time)
   - Ranked badges/tiers

5. **Invite-only Challenges**
   - Create a challenge room with unique code
   - Shareable link, capped number of players
   - Good for classrooms or group games

---

### 🌍 Location System

- Use curated list of coordinates in the Philippines
- Store locations in Firestore with metadata:
  - `title`, `coordinates`, `region`, `imagePreviewURL`, `difficulty`
- Allow location display in embedded Google Street View

---

### 🧑‍💼 Admin Dashboard ("/admin")

Build a secure UI with the following features:

#### 🔐 Access Control
- Only admins (user role field in Firestore) can access
- Route protection and role-checking logic

#### 📍 Location Management
- Add, edit, or archive game coordinates
- Set difficulty level and region tag (Luzon, etc.)

#### 👤 User Management
- View users by email/username
- Ban or suspend accounts
- View activity logs (optional)

#### 🎨 Cosmetic Item Management
- Add/edit/delete in-game items:
  - Profile icons
  - Marker skins
  - Guess effects
  - Frames
- Set rarity (Common, Rare, Legendary), price (in-game currency), and tags
- Upload asset images

#### 🏆 Achievements Management
- Create/edit trophies:
  - Title, description, icon, reward coins
  - Criteria (e.g. 100 correct guesses, 10 wins)
  - Track unlocks and completion stats

### Dashboard for statistics and analytics 
- User Metrics
  - Total Registered Users
  - Active Users (Daily, Weekly, Monthly)
  - New Signups Per Day/Week/Month
  - User Retention Rate (e.g., % of users returning after 1 day, 7 days, 30 days)
  - Banned/Suspended Users Count
- Gameplay Metrics
  - Total Games Played
  - Games Played per Mode (Daily Challenge, Solo, Classic, Ranked, Invite-only)
  - Average Game Duration
  - Average Score per Game Mode
  - Win/Loss Ratio in Ranked Games
- Location & Map Analytics
  - Most Played Locations
  - Average Guess Distance per Location (shows which locations are harder or easier)
  - Location Completion Rate (how often players finish rounds on each location)
  - Location Popularity Heatmap
- Leaderboard Stats
  - Top Players by Weekly/Monthly/All-Time Rank
  - Number of Players Reaching Each Rank Tier (Bronze, Silver, Gold, Platinum)
  - Average Rank Progression (how fast users climb ranks)
- In-App Economy Metrics
  - Total In-App Currency Earned & Spent
  - Most Popular Items Purchased (Icons, Skins, Effects, Frames)
  - Number of Items Sold Per Category
  - Average User Coin Balance
- Achievement Tracking
  - Number of Achievements Unlocked by All Users
  - Most and Least Earned Achievements
  - Average Time to Unlock Achievements
- System Performance & Errors
  - API Usage (Google Maps, Firebase, etc.)
  - Average Page Load Time
  - Error Logs & Crash Reports


---

### 🧑‍🎓 User-Facing Features

#### 📲 Account System
- Firebase Auth (email/password or Google login)
- Profile Page shows:
  - Display name + profile icon
  - Stats: games played, win %, current streak
  - Rank (weekly, monthly, all-time)
  - Join date
  - Option to deactivate account

#### 🛒 In-App Store ("/store")
- Tabs for `Icons`, `Skins`, `Frames`, `Effects`
- Each item displays:
  - Name, icon/image
  - Price in in-game coins
  - Rarity
  - Buy/Equip button
- Sort/filter by price, rarity, owned/unowned
- Coin balance displayed in navbar

#### 🏅 Trophy Room ("/achievements")
- Sections:
  - Unlocked (with date)
  - In progress (% complete)
  - Locked (greyed out)
- Filters: All, Unlocked, Locked, In Progress
- Trophy tiers: Bronze, Silver, Gold, Platinum
- Clicking a trophy shows description and progress

#### 🧑‍🎨 Profile Customization ("/customize")
- Set:
  - Profile Icon
  - Marker Skin
  - Frame
  - Guess Effect
- Changes saved to user profile
- "Save Changes" button with success toast

---

### 🏆 Leaderboards

- Global leaderboard with:
  - Daily, Weekly, All-Time tabs
  - Show rank, name, score, streak
  - Highlight logged-in user's rank even if not in top 100
- Filter by game mode (Daily, Ranked)

---

### 💰 In-App Currency System

#### Coin Earning:
- Win matches
- Daily login bonus
- Unlock achievements
- Invite friends

#### Coin Spending:
- Buy skins, icons, frames, effects

#### Sample Cosmetic Items:
- 📌 Marker Skins: Classic Red, Banana Peel, Jeepney, Tarsier
- 👤 Profile Icons: PH Flag, Carabao, Mayon, Adobo, Sinigang
- 🌈 Guess Effects: Explosion, Confetti, Floating Rizal Heads
- 🖼️ Frames: Bamboo, Neon, Gold, Pearl of the Orient

---

### 🏆 Achievement Examples

| Title | Criteria | Reward | Tier |
|-------|----------|--------|------|
| First Guess | Complete your first round | 50 coins | Bronze |
| 100 Guesses | Guess 100 locations | 200 coins | Gold |
| Luzon Master | 50 correct guesses in Luzon | 100 coins | Silver |
| Perfect Round | Get a 0-meter guess | 300 coins | Platinum |
| Daily Devotee | Play 30 daily challenges | 500 coins | Gold |

---

### 📱 Mobile Optimized

- All pages must work well on mobile devices
- Use touch-friendly components (buttons, sliders)
- Ensure Google Maps embeds resize properly
- Test with responsive layout (Tailwind breakpoints)

---

### 🔐 Security & Validation

- Prevent fake score submissions (validate on server)
- Use Firestore Rules or Firebase Cloud Functions for:
  - Coin deduction on purchase
  - Unlocking trophies
  - Creating games
- Sanitize inputs and prevent abuse of leaderboards or accounts

---

Refer to existing apps:
- https://www.geoguessr.com/ 

Refer to existing open source repositories
- https://github.com/spider-hand/GeoguessMaster
- https://github.com/GeoGuess/GeoGuess 
- https://github.com/codergautam/worldguessr 

Server / Database infrastructure will be localhost

Let me know if you'd like:
- Component templates (React + Tailwind)
- Firebase data structure schema
- Sample dummy data
- Auth flow for admin vs player roles

