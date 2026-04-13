# 📱 ProgressPulse

**A minimalist, offline-first habit and learning tracker built with React Native and Expo.**  
Track your daily progress, maintain streaks, and visualize your growth — even when you’re offline.

---

<!-- ## 🖼️ App Preview

- [ProgressPulse Home 🏠](./assets/screens/home_medium.png)
- [ProgressPulse Stats 📊](./assets/screens/stats_medium.png)
- [ProgressPulse Settings ⚙️](./assets/screens/settings_medium.png) -->

-
- ## 🖼️ App Preview

<p align="center">
  <a href="./assets/screens/home_medium.png">🏠 <strong>ProgressPulse Home</strong></a>
  &nbsp;•&nbsp;
  <a href="./assets/screens/stats_medium.png">📊 <strong>ProgressPulse Stats</strong></a>
  &nbsp;•&nbsp;
  <a href="./assets/screens/settings_medium.png">⚙️ <strong>ProgressPulse Settings</strong></a>
</p>

---

## 🎯 Overview

ProgressPulse helps learners and professionals build consistency through daily updates.  
It focuses on simplicity and momentum — quick entries, clear streaks, and reliable offline access.

### ✨ Key Features

- 🏠 **Home Dashboard** – view and manage your daily entries
- ✍️ **Add / Edit / Delete Entries** – track progress effortlessly
- 💾 **Offline-first Architecture** – powered by SQLite
- 🔐 **Secure User Identity** – managed via Expo SecureStore
- ☁️ **Cloud Sync** – AWS Lambda + DynamoDB for multi-device support
- 📊 **Stats Dashboard** – visualize streaks and trends (in progress)
- 🔔 **Notifications** _(coming soon)_ – stay consistent with reminders

---

## 🧱 Tech Stack

| Layer                  | Tools                                                    |
| ---------------------- | -------------------------------------------------------- |
| **Frontend**           | React Native · Expo · Expo Router · TypeScript           |
| **State & Storage**    | Expo SQLite (local) · Expo SecureStore                   |
| **Authentication**     | AWS Cognito (custom integration)                         |
| **Backend**            | AWS Lambda · DynamoDB · API Gateway                      |
| **Build & Deployment** | EAS Build · Android Studio                               |

---

## 📂 Project Structure

```
app/ 
  (app)/ 
    _layout.tsx         # Root layout (navigation + providers) 
    index.tsx           # Home screen 
  entry/ 
    _layout.tsx 
    AppButton.tsx       # Reusable button component 
    settings.tsx        # Settings screen 
    sign-in.tsx         # Authentication screen 
    stats.tsx           # Stats screen 
    
assets/                 # Images, icons, screenshots 
backend/                # Backend & sync-related logic 
components/ 
  SideDrawer.tsx        # Navigation drawer

lib/ 
  context/ # Global state providers 
  auth.ts               # Cognito authentication logic 
  config.ts             # Environment 
  config db.ts          # Shared DB interface 
  db.native.ts          # SQLite (mobile) 
  db.web.ts             # Web fallback 
  entries.ts            # CRUD logic 
  storage.ts            # Secure/local storage helpers 
  store.ts              # State management 
  syncTypes.ts          # Sync models/types 
  testLogin.ts          # Auth debugging utilities 
  themes.ts             # Theme system 
  userId.ts             # User identity handling

  The app uses a modular architecture separating UI, business logic, and platform-specific implementations for scalability.
```

---

## 📸 App Flow

**User Journey:**

1. Home →
2. Add Entry →
3. Save →
4. Return to Home →
5. View Entry →
6. Edit or Delete

**Screens Implemented (v0.1):**

- ✅ Home
- ✅ Add New Entry
- ✅ Entry Details
- ✅ Stats
- ✅ Settings

---

## ⚙️ Local Development

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Run locally

```bash
npx expo start
```

### 3️⃣ Run on Android (recommended)

Expo Go has limitations with SecureStore — use a dev build for full functionality.

```bash
npx expo run:android
```

---

## 🧭 Development Journey

| Phase | Milestone                                 |
| ----- | ----------------------------------------- |
| ✅    | Created Expo app and verified build       |
| ✅    | Integrated SQLite for offline data        |
| ✅    | Added SecureStore for unique user IDs     |
| ✅    | Built CRUD entry system (add/edit/delete) |
| ✅    | Connected frontend logic to SQLite        |
| ✅    | Add Stats charts                          |
| ✅    | Cloud Sync with AWS Lambda + DynamoDB     |
| 🔜    | Add Notifications                         |
| 🔜    | App Store Release                         |

---

## 🧠 Lessons Learned

- How to debug Expo SecureStore and dev builds
- How to verify SQLite tables via Android Studio AVD
- Structuring React Native apps for scalability
- Managing local persistence effectively

---

## 🧠 Key Engineering Decisions
- Offline-first design → ensures reliability without network dependency
- Platform abstraction (db.native.ts, db.web.ts) → clean cross-platform support
- Custom Cognito auth flow → deeper control vs black-box solutions
- Modular architecture → scalable as features grow

---

## 🔮 Next Steps

- 🔔 Integrate daily reminder notifications
- 🧾 Export data (CSV / PDF)
- 📊 Advanced analytics & charts
- 🚀 Publish to Play Store (internal track first)
- 🤖 AI-powered insights (future vision)

---

## 👤 About

Built by **Fowell Whitfield (buthlezi)** — Software Engineer focused on building scalable, practical apps that help people learn, grow, and stay consistent.  
Currently exploring the intersection of **mobile development** and **AI-driven productivity tools**.

Currently exploring:

📱 Mobile engineering (React Native)
☁️ Serverless backend architecture
🤖 AI-powered productivity tools

---


## 🪪 License

MIT License © 2025 Fowell Whitfield

---

> “Small daily progress compounds into meaningful growth — ProgressPulse is built around that philosophy.”




