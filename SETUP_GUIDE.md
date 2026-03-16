# Quick Setup Guide

Follow these steps to get your Personal Kanban up and running in minutes!

## Step 1: Install Node.js

If you don't have Node.js installed:

### macOS
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
```

### Windows
Download the installer from [nodejs.org](https://nodejs.org)

### Linux
```bash
# Ubuntu/Debian
sudo apt install nodejs npm

# Fedora
sudo dnf install nodejs npm
```

Verify installation:
```bash
node --version
npm --version
```

## Step 2: Install Dependencies

In your project directory:

```bash
npm install
```

This will install all required packages including:
- React & React DOM
- Vite (build tool)
- Tailwind CSS (styling)
- Firebase (authentication)
- lucide-react (icons)
- @hello-pangea/dnd (drag & drop)

## Step 3: Firebase Setup (5 minutes)

### 3.1 Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: "personal-os" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 3.2 Enable Google Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Click on "Sign-in method" tab
4. Click on "Google"
5. Toggle "Enable"
6. Select a support email
7. Click "Save"

### 3.3 Get Firebase Config

1. Click the gear icon → "Project settings"
2. Scroll to "Your apps"
3. Click the web icon (`</>`)
4. Register app name: "Personal Kanban Web"
5. Don't check Firebase Hosting
6. Click "Register app"
7. Copy the `firebaseConfig` object values

## Step 4: Google Calendar API Setup (5 minutes)

### 4.1 Enable Calendar API

1. Go to https://console.cloud.google.com/
2. Select the same project name as Firebase (or create new)
3. Click "APIs & Services" → "Library"
4. Search for "Google Calendar API"
5. Click "Enable"

### 4.2 Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure OAuth consent screen:
   - User Type: External
   - App name: "Personal Kanban"
   - Support email: your email
   - Add scopes: Select "Google Calendar API" scopes
   - Add test users: your email
   - Click "Save and Continue"
4. Create OAuth client ID:
   - Application type: "Web application"
   - Name: "Personal Kanban Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - Your production URL (after deployment)
   - Authorized redirect URIs:
     - `http://localhost:5173` (development)
     - Your production URL (after deployment)
5. Click "Create"
6. Copy the "Client ID"

## Step 5: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` with your values:

```env
# From Firebase Project Settings → General → Your apps → Web app config
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# From Google Cloud Console → Credentials
VITE_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
```

## Step 6: Run the App

Start the development server:

```bash
npm run dev
```

Open your browser to: http://localhost:5173

## Step 7: Test Everything

1. Click "Sign in with Google"
2. Authorize the app
3. Set your Rule of 3 tasks
4. Create a quick capture item
5. Drag it between columns
6. Add synergy tags
7. Try hub filtering
8. Click "Sync Calendar" to test calendar integration

## Troubleshooting

### "npm: command not found"
→ Node.js is not installed. Go back to Step 1.

### Firebase Authentication Error
→ Check that:
- Google sign-in is enabled in Firebase Console
- Your Firebase config in `.env` is correct
- You're using the correct project

### Calendar Sync Fails
→ Check that:
- Google Calendar API is enabled
- OAuth client is configured correctly
- You've added authorized origins
- You've granted calendar permissions when signing in

### App Won't Start
→ Try:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Next Steps

### Customize Your Roles

Edit [src/App.jsx](src/App.jsx) and modify the `ROLES` array to match your actual roles.

### Deploy to Production

See the main [README.md](README.md) for deployment instructions to:
- Vercel (recommended - easiest)
- Netlify
- Firebase Hosting

### Add More Features

Some ideas:
- Due dates for tasks
- Reminders
- Team collaboration
- File attachments
- Task templates
- Analytics dashboard
- Mobile app

## Getting Help

- Review the full [README.md](README.md)
- Check Firebase documentation: https://firebase.google.com/docs
- Check Google Calendar API docs: https://developers.google.com/calendar
- Open an issue on GitHub

---

Enjoy your Personal Kanban!
