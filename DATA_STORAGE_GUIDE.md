# 📊 Data Storage Guide - Personal Kanban

## Overview
Your Personal Kanban uses **Firebase Firestore** (cloud database) to store all your data securely.

---

## 🗄️ Where Is Your Data Stored?

### Cloud Storage (Firebase Firestore)
All your data is stored in **Google's Firebase Firestore** database in the cloud.

**Database Structure:**
```
Firestore Database
└── users (collection)
    └── {your-google-user-id} (document)
        ├── ruleOfThree: ["Priority 1", "Priority 2", "Priority 3"]
        ├── nonPriorityTasks: ["Task 1", "Task 2"]
        ├── cards: {
        │   ├── ideas: [array of task cards]
        │   ├── inProgress: [array of task cards]
        │   ├── readyToPublish: [array of task cards]
        │   └── done: [array of task cards]
        │   }
        ├── customRoles: [array of your custom tags]
        ├── areasOfFocus: "Your answer from onboarding"
        ├── purposeOfUse: "Your answer from onboarding"
        └── lastUpdated: "2025-01-15T10:30:00.000Z"
```

---

## 🔑 Your User ID

When you sign in with Google, Firebase assigns you a unique user ID like:
```
xK9mN2pQ7rT8sU4vW6yZ1aB3cD5eF
```

This ID is used as the **key** to store and retrieve YOUR data only.

---

## 🔐 Data Security

### Who Can Access Your Data?

✅ **Only YOU can access your data**
- Your data is tied to your Google account
- Firebase security rules ensure only authenticated users can read/write their own data
- Other users CANNOT see your data

### Security Rules (In Firebase):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Only you can read/write your own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Translation:**
- `request.auth != null` = You must be signed in
- `request.auth.uid == userId` = Your user ID must match the document ID
- Nobody else can access your data, even if they try!

---

## 💾 What Data Is Stored?

### 1. **Your Daily Tasks** (`ruleOfThree`)
```json
{
  "ruleOfThree": [
    "Finish project proposal",
    "Call client at 2pm",
    "Review code changes"
  ]
}
```

### 2. **Non-Priority Tasks** (`nonPriorityTasks`)
```json
{
  "nonPriorityTasks": [
    "Clean email inbox",
    "Update LinkedIn profile"
  ]
}
```

### 3. **Kanban Board Cards** (`cards`)
```json
{
  "cards": {
    "ideas": [
      {
        "id": "1234567890",
        "title": "Write blog post",
        "description": "Topic: React hooks",
        "roles": ["work", "learning"],
        "priority": "high",
        "dueDate": "2025-01-20",
        "createdAt": "2025-01-15T10:00:00.000Z"
      }
    ],
    "inProgress": [...],
    "readyToPublish": [...],
    "done": [...]
  }
}
```

### 4. **Your Custom Tags/Roles** (`customRoles`)
```json
{
  "customRoles": [
    {
      "id": "custom-0",
      "label": "Gym",
      "color": "bg-rose-400",
      "hub": "personal"
    },
    {
      "id": "custom-1",
      "label": "Side Project",
      "color": "bg-blue-400",
      "hub": "career"
    }
  ]
}
```

### 5. **Onboarding Answers**
```json
{
  "areasOfFocus": "Software development, fitness, content creation",
  "purposeOfUse": "Managing multiple projects and personal goals",
  "lastUpdated": "2025-01-15T10:30:00.000Z"
}
```

---

## 🔄 How Data Flows

### When You Make Changes:

```
1. You type something
   ↓
2. React updates the state (in memory)
   ↓
3. After 1 second (debounce), data is saved to Firestore
   ↓
4. Firestore confirms save
   ↓
5. Your data is now in the cloud! ☁️
```

### When You Sign In:

```
1. You sign in with Google
   ↓
2. Firebase authenticates you
   ↓
3. App gets your user ID
   ↓
4. App queries Firestore: "Get data for user {your-id}"
   ↓
5. Firestore returns your data
   ↓
6. App loads your tasks, cards, tags, etc.
   ↓
7. You see your personalized dashboard! 🎉
```

---

## 📍 Where Is Firebase Located?

### Physical Location
Your data is stored in **Google's data centers** in the region you selected when creating the Firebase project.

Common locations:
- `us-central1` - Iowa, USA
- `us-east1` - South Carolina, USA
- `europe-west1` - Belgium
- `asia-southeast1` - Singapore

You can check your location in the Firebase Console → Firestore Database → Location

---

## 🌐 Can I Access My Data From Multiple Devices?

**YES!** ✅

Your data is in the cloud, so:
- Sign in on your **laptop** → See your data
- Sign in on your **phone** → See the same data
- Sign in on your **work computer** → See the same data

Everything syncs automatically!

---

## 🔍 How to View Your Data

### Option 1: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **"Firestore Database"** in the left menu
4. Navigate to `users` collection
5. Click on your user ID document
6. You'll see all your data!

**Example View:**
```
users/
  xK9mN2pQ7rT8sU4vW6yZ1aB3cD5eF/
    ruleOfThree: Array[3]
    cards: Map
    customRoles: Array[5]
    areasOfFocus: "Software development..."
    purposeOfUse: "Managing projects..."
    lastUpdated: January 15, 2025 at 10:30:00 AM
```

### Option 2: Browser DevTools

1. Open your app
2. Press `F12` (Windows) or `Cmd+Option+I` (Mac)
3. Go to **Console** tab
4. Type:
   ```javascript
   getUserData(auth.currentUser.uid).then(data => console.log(data))
   ```
5. Press Enter
6. Your data will be displayed in the console

---

## 💰 Firebase Free Tier Limits

Don't worry about costs! Firebase has a generous free tier:

### Firestore Free Tier:
- ✅ **1 GB** of stored data (plenty for personal use!)
- ✅ **50,000 reads** per day
- ✅ **20,000 writes** per day
- ✅ **20,000 deletes** per day

### Typical Usage (Personal Kanban):
- **Storage:** ~1-5 MB (you'd need 200+ years to hit 1GB!)
- **Reads:** ~50-100 per day (well under 50,000)
- **Writes:** ~20-50 per day (well under 20,000)

**You'll stay in the free tier easily!** 🎉

---

## 🛡️ Data Backup & Safety

### Automatic Backups
Firebase Firestore provides:
- ✅ **Automatic replication** across multiple data centers
- ✅ **99.999% uptime guarantee**
- ✅ **Automatic backups** by Google
- ✅ **Point-in-time recovery** (if you enable it)

### Your Data Is Safe Because:
1. Google manages the infrastructure
2. Data is replicated across multiple servers
3. If one server fails, your data is on others
4. Industry-standard encryption

---

## 📤 Export Your Data

Want to export your data? You can:

### Method 1: Firebase Console
1. Go to Firebase Console → Firestore
2. Select your user document
3. Click the three dots → Export
4. Save as JSON

### Method 2: Code
Add this to your app:
```javascript
const exportData = async () => {
  const data = await getUserData(auth.currentUser.uid);
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'personal-os-data.json';
  a.click();
};
```

---

## ❓ Common Questions

### Q: What happens if I lose internet connection?
**A:** The app continues to work with your last loaded data. Changes are queued and synced when you reconnect.

### Q: Can I delete all my data?
**A:** Yes! Either:
1. Delete your user document in Firebase Console
2. Add a "Delete Account" feature in the app
3. Delete the entire Firebase project

### Q: What if I sign in with a different Google account?
**A:** You'll get a separate, empty workspace. Each Google account has its own data.

### Q: Can I share my workspace with someone?
**A:** Not by default, but you could add sharing features by:
1. Creating a "shared" collection in Firestore
2. Storing shared task IDs
3. Updating security rules to allow access

### Q: How long is my data kept?
**A:** Forever (until you delete it or delete your Firebase project). Firebase doesn't automatically delete user data.

---

## 🔧 Troubleshooting

### Data Not Saving?
1. Check Firebase Console → Firestore Database is enabled
2. Check browser console for errors
3. Verify Firebase security rules allow writes
4. Make sure you're signed in

### Data Not Loading?
1. Check Firebase Console → Your user document exists
2. Check security rules allow reads
3. Check browser console for errors
4. Try signing out and back in

### Want to Reset?
1. Go to Firebase Console
2. Find your user document
3. Delete it
4. Sign in again → Onboarding will appear!

---

## 📊 Summary Diagram

```
┌─────────────────────────────────────────────────┐
│         YOUR PERSONAL OS APP (Browser)          │
│  ┌───────────────────────────────────────────┐  │
│  │  React State (Temporary, in memory)       │  │
│  │  - ruleOfThree: []                        │  │
│  │  - cards: {}                              │  │
│  │  - customRoles: []                        │  │
│  └────────────────┬──────────────────────────┘  │
│                   │                              │
│                   │ Auto-save (1 second delay)   │
│                   ↓                              │
└───────────────────────────────────────────────────┘
                    │
                    │ Firebase SDK
                    │
┌───────────────────↓───────────────────────────────┐
│         FIREBASE FIRESTORE (Cloud)                │
│  ┌─────────────────────────────────────────────┐  │
│  │  users/                                     │  │
│  │    └── {your-user-id}/                     │  │
│  │         ├── ruleOfThree                    │  │
│  │         ├── cards                          │  │
│  │         ├── customRoles                    │  │
│  │         ├── areasOfFocus                   │  │
│  │         └── lastUpdated                    │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  🌍 Stored in Google Data Centers                │
│  🔒 Encrypted & Secure                           │
│  ☁️ Accessible from anywhere                     │
└───────────────────────────────────────────────────┘
```

---

## 🎉 That's It!

Now you understand exactly where and how your data is stored. It's:
- ☁️ In the cloud (Firebase Firestore)
- 🔐 Secure and private
- 🌍 Accessible from anywhere
- 💾 Automatically backed up
- 🆓 Free for personal use

**Your data is safe and under your control!** ✨
