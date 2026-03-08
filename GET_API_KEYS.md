# How to Get All API Keys and Environment Variables

This guide will walk you through getting ALL the environment variables you need for your Personal OS app.

**Time needed**: ~15 minutes total

---

## Part 1: Get Firebase Keys (10 minutes)

### Step 1.1: Create a Firebase Project

1. **Go to Firebase Console**
   - Open: https://console.firebase.google.com/
   - Click **"Sign in with Google"** if not already signed in

2. **Create New Project**
   - Click **"Create a project"** (or **"Add project"**)
   - Enter project name: `personal-os` (or any name you prefer)
   - Click **"Continue"**

3. **Google Analytics** (Optional)
   - Toggle OFF "Enable Google Analytics" (you don't need it)
   - Or leave it ON and select an account
   - Click **"Create project"**

4. **Wait** (~30 seconds)
   - Firebase will create your project
   - Click **"Continue"** when done

### Step 1.2: Register Your Web App

1. **Add Web App**
   - In Firebase Console, you'll see your project dashboard
   - Look for "Get started by adding Firebase to your app"
   - Click the **Web icon** (`</>` symbol)

2. **Register App**
   - App nickname: `Personal OS Web`
   - ❌ Don't check "Also set up Firebase Hosting"
   - Click **"Register app"**

3. **Copy Firebase Config** ⚠️ IMPORTANT
   - Firebase will show you a code snippet like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "personal-os-12345.firebaseapp.com",
     projectId: "personal-os-12345",
     storageBucket: "personal-os-12345.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef1234567890"
   };
   ```
   - **COPY THESE VALUES** - you'll need them!
   - Click **"Continue to console"**

### Step 1.3: Enable Google Authentication

1. **Go to Authentication**
   - In the left sidebar, click **"Build"** → **"Authentication"**
   - Click **"Get started"** button

2. **Enable Google Sign-In**
   - Click on **"Sign-in method"** tab at the top
   - Find "Google" in the list of providers
   - Click on **"Google"**

3. **Configure Google Provider**
   - Toggle the **"Enable"** switch to ON
   - Select "Project support email": Choose your email from dropdown
   - Click **"Save"**

### Step 1.4: Your Firebase Keys ✅

Now you have these values from the `firebaseConfig`:

| Variable Name | Example Value | Your Value |
|--------------|---------------|------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyXXXXXXXXXXXX` | _____________ |
| `VITE_FIREBASE_AUTH_DOMAIN` | `personal-os-12345.firebaseapp.com` | _____________ |
| `VITE_FIREBASE_PROJECT_ID` | `personal-os-12345` | _____________ |
| `VITE_FIREBASE_STORAGE_BUCKET` | `personal-os-12345.appspot.com` | _____________ |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` | _____________ |
| `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abc` | _____________ |

**Where to find them later?**
- Firebase Console → Project Settings (gear icon) → General → Scroll to "Your apps" section

---

## Part 2: Get Google Calendar API Key (5 minutes)

### Step 2.1: Go to Google Cloud Console

1. **Open Google Cloud Console**
   - Go to: https://console.cloud.google.com/
   - Sign in with the SAME Google account as Firebase

2. **Select Your Project**
   - At the top, click the project dropdown
   - Select **the same project name** as your Firebase project (e.g., "personal-os")
   - If you don't see it, wait 1-2 minutes for Firebase to sync, then refresh

### Step 2.2: Enable Google Calendar API

1. **Go to API Library**
   - In the left sidebar, click **"APIs & Services"** → **"Library"**
   - Or use the search bar at the top

2. **Search for Calendar API**
   - In the search box, type: `Google Calendar API`
   - Click on **"Google Calendar API"** from results

3. **Enable the API**
   - Click the blue **"Enable"** button
   - Wait 5-10 seconds for it to enable

### Step 2.3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - In the left sidebar, click **"APIs & Services"** → **"OAuth consent screen"**

2. **Choose User Type**
   - Select **"External"** (allows anyone to sign in)
   - Click **"Create"**

3. **Fill Out App Information** (Page 1 of 4)
   - **App name**: `Personal OS`
   - **User support email**: Select your email
   - **App logo**: Skip (optional)
   - **App domain**: Leave blank for now
   - **Developer contact**: Enter your email
   - Click **"Save and Continue"**

4. **Scopes** (Page 2 of 4)
   - Click **"Add or Remove Scopes"**
   - In the filter box, type: `calendar`
   - Check these two boxes:
     - ✅ `https://www.googleapis.com/auth/calendar`
     - ✅ `https://www.googleapis.com/auth/calendar.events`
   - Scroll down and click **"Update"**
   - Click **"Save and Continue"**

5. **Test Users** (Page 3 of 4)
   - Click **"Add Users"**
   - Enter your email address
   - Click **"Add"**
   - Click **"Save and Continue"**

6. **Summary** (Page 4 of 4)
   - Review everything
   - Click **"Back to Dashboard"**

### Step 2.4: Create OAuth Client ID

1. **Go to Credentials**
   - In the left sidebar, click **"APIs & Services"** → **"Credentials"**

2. **Create OAuth Client ID**
   - Click **"+ Create Credentials"** at the top
   - Select **"OAuth client ID"**

3. **Choose Application Type**
   - Application type: Select **"Web application"**
   - Name: `Personal OS Web Client`

4. **Add Authorized JavaScript Origins**
   - Under "Authorized JavaScript origins"
   - Click **"+ Add URI"**
   - Add: `http://localhost:5173` (for local development)
   - Click **"+ Add URI"** again
   - Add: `http://localhost:3000` (backup port)

5. **Add Authorized Redirect URIs**
   - Under "Authorized redirect URIs"
   - Click **"+ Add URI"**
   - Add: `http://localhost:5173` (for local development)
   - Click **"+ Add URI"** again
   - Add: `http://localhost:3000` (backup port)

6. **Create**
   - Click **"Create"** button at the bottom

7. **Copy Your Client ID** ⚠️ IMPORTANT
   - A popup will appear with:
     - **Client ID**: `123456789-abc123xyz.apps.googleusercontent.com`
     - **Client Secret**: (you don't need this)
   - **COPY THE CLIENT ID** - you'll need it!
   - Click **"OK"**

### Step 2.5: Your Google Calendar Key ✅

| Variable Name | Example Value | Your Value |
|--------------|---------------|------------|
| `VITE_GOOGLE_CLIENT_ID` | `123-abc.apps.googleusercontent.com` | _____________ |

**Where to find it later?**
- Google Cloud Console → APIs & Services → Credentials → Look for "Personal OS Web Client"

---

## Part 3: Create Your .env File

Now create a file called `.env` in your project root:

1. **Copy the example file**
   ```bash
   cp .env.example .env
   ```

2. **Open .env in a text editor**
   ```bash
   # On Mac
   open .env

   # Or use VS Code
   code .env
   ```

3. **Fill in your values**
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=personal-os-12345.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=personal-os-12345
   VITE_FIREBASE_STORAGE_BUCKET=personal-os-12345.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456

   # Google Calendar API
   VITE_GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
   ```

4. **Save the file**

---

## Part 4: Test Everything

1. **Install dependencies** (if you haven't already)
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open the app**
   - Go to: http://localhost:5173
   - You should see the Personal OS landing page

4. **Test Sign In**
   - Click "Sign in with Google"
   - Select your Google account
   - Grant permissions (email, profile, calendar)
   - You should be signed in!

5. **Test the App**
   - Set your Rule of 3 tasks
   - Create a quick capture
   - Drag and drop tasks
   - Add synergy tags
   - Try calendar sync

---

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"

**Problem**: Your domain isn't authorized in Firebase

**Solution**:
1. Go to Firebase Console → Authentication → Settings
2. Click "Authorized domains" tab
3. Make sure `localhost` is in the list
4. If not, click "Add domain" and add `localhost`

### "redirect_uri_mismatch" Error

**Problem**: Your redirect URI isn't authorized in Google Cloud

**Solution**:
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click on your OAuth client ID
3. Make sure `http://localhost:5173` is in both:
   - Authorized JavaScript origins
   - Authorized redirect URIs
4. Click "Save"

### "Access blocked: This app's request is invalid"

**Problem**: OAuth consent screen isn't configured properly

**Solution**:
1. Go to Google Cloud Console → APIs & Services → OAuth consent screen
2. Make sure the app is configured
3. Add yourself as a test user
4. Make sure Calendar scopes are added

### "Calendar API has not been used in project"

**Problem**: Calendar API isn't enabled

**Solution**:
1. Go to Google Cloud Console → APIs & Services → Library
2. Search for "Google Calendar API"
3. Click "Enable"
4. Wait 1-2 minutes, then try again

### Can't Find My Firebase Config

**Solution**:
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Click the gear icon (⚙️) → "Project settings"
4. Scroll down to "Your apps"
5. Find your web app
6. Click "Config" radio button (not "CDN")
7. Copy the values from the config object

### Can't Find My Google Client ID

**Solution**:
1. Go to Google Cloud Console: https://console.cloud.google.com/
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Look for "OAuth 2.0 Client IDs" section
5. Find "Personal OS Web Client"
6. Click on it to see the Client ID

---

## Security Notes

### Are These Keys Safe to Share?

**Firebase API Key**:
- ✅ Safe to expose in your frontend code
- ✅ Safe to commit to GitHub (public repos)
- It's NOT a secret - it identifies your app
- Security is handled by Firebase Security Rules

**Google Client ID**:
- ✅ Safe to expose in your frontend code
- ✅ Safe to commit to GitHub (public repos)
- It's NOT a secret - it's meant to be public
- Security is handled by OAuth redirect URIs

### What Should You Keep Secret?

- ❌ Don't share: Firebase Admin SDK private keys
- ❌ Don't share: Google OAuth Client Secret
- ❌ Don't share: Any "secret" or "private" keys

---

## For Vercel Deployment

When you deploy to Vercel, you'll need to add the same environment variables:

1. Go to Vercel project settings
2. Click "Environment Variables"
3. Add all 7 variables (same names, same values)

**PLUS** you'll need to add your Vercel URL to:
- Firebase: Authorized domains
- Google Cloud: Authorized JavaScript origins and redirect URIs

See [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md) for detailed instructions.

---

## Quick Reference Card

Print this and keep it handy:

```
FIREBASE CONFIG
--------------
Console: https://console.firebase.google.com/
Location: Project Settings → General → Your apps

GOOGLE CLOUD OAUTH
------------------
Console: https://console.cloud.google.com/
Location: APIs & Services → Credentials

LOCAL DEV URLS
--------------
http://localhost:5173
http://localhost:3000

PRODUCTION URLS (add after deployment)
-------------------------------------
Your Vercel URL: https://your-app.vercel.app
```

---

## Need Help?

- Review the [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Check Firebase docs: https://firebase.google.com/docs/web/setup
- Check Google Calendar API docs: https://developers.google.com/calendar/api/quickstart/js
- Open an issue on GitHub

---

**You're all set! Now run `npm run dev` and start being productive!** 🚀
