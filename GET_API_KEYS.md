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

2. **What You'll See** (depends on your account status)

   **SCENARIO A: You see "Configure Consent Screen" or "User Type" selection**
   - Select **"External"** (allows anyone to sign in)
   - Click **"Create"** or **"Configure"**
   - Proceed to step 3 below

   **SCENARIO B: You see an existing consent screen**
   - If you see a configured app, click **"Edit App"** button
   - Proceed to step 3 below

   **SCENARIO C: You don't see "External" option**
   - This happens if you're in a Google Workspace organization
   - Select **"Internal"** (only for your organization)
   - Click **"Create"**
   - Proceed to step 3 below

3. **Fill Out App Information** (OAuth consent screen - Edit app registration)
   - **App name**: `Personal OS`
   - **User support email**: Select your email from dropdown
   - **App logo**: Skip (optional - you can leave this empty)
   - **App domain** section:
     - Application home page: Leave blank (optional)
     - Application privacy policy link: Leave blank (optional)
     - Application terms of service link: Leave blank (optional)
   - **Authorized domains**: Leave blank for now
   - **Developer contact information**: Enter your email
   - Click **"Save and Continue"** at the bottom

4. **Scopes** (Add or remove scopes)
   - You'll see "What scopes does your project need?"
   - Click **"Add or Remove Scopes"** button
   - A panel will slide in from the right with a long list
   - In the **"Filter"** search box at the top, type: `calendar`
   - Scroll and find these two scopes and check their boxes:
     - ✅ `.../auth/calendar` - "See, edit, share, and permanently delete all the calendars you can access using Google Calendar"
     - ✅ `.../auth/calendar.events` - "View and edit events on all your calendars"
   - The full scope names are:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/calendar.events`
   - Scroll down in the panel and click **"Update"** button
   - Back on the main page, click **"Save and Continue"**

5. **Test Users** (Optional test users)
   - Click **"+ Add Users"** button
   - Enter your email address (the one you're using to develop)
   - Click **"Add"**
   - Click **"Save and Continue"**

   **Note**: While your app is in "Testing" mode, only test users you add here can sign in.

6. **Summary**
   - Review all the information
   - If everything looks good, click **"Back to Dashboard"**

   **Important**: Your app will be in "Testing" mode. This is fine for development and personal use!

### Step 2.4: Create OAuth Client ID

1. **Go to Credentials**
   - In the left sidebar, click **"APIs & Services"** → **"Credentials"**

2. **Create OAuth Client ID**
   - Click **"+ Create Credentials"** at the top
   - Select **"OAuth client ID"**

   **If you see a blue box saying "To create an OAuth client ID, you must first configure your consent screen"**:
   - Click **"Configure Consent Screen"**
   - Go back to Step 2.3 above and complete the OAuth consent screen setup
   - Then come back here

3. **Choose Application Type**
   - Application type: Select **"Web application"** from the dropdown
   - Name: `Personal OS Web Client` (or any name you prefer)

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

### Can't Find "External" or "Internal" Option in OAuth Consent Screen

**Problem**: The OAuth consent screen interface looks different

**Solution - You have several options**:

**Option 1**: If you see "Edit App" button
- Your consent screen is already configured
- Click "Edit App" to modify it
- Add the Calendar scopes if they're missing

**Option 2**: If you're in a Google Workspace organization
- You may only see "Internal" option (not "External")
- This is fine - select "Internal"
- Only people in your organization can use your app

**Option 3**: If the page says OAuth is already configured
- Click on "OAuth consent screen" in the left sidebar
- Look for "Edit App" or "Configure" button
- Update the app configuration to add Calendar scopes

**Option 4**: Skip to creating credentials
- Sometimes you can skip the consent screen setup initially
- Go directly to Step 2.4 (Create OAuth Client ID)
- Google will prompt you to configure consent screen if needed

### "Google hasn't verified this app" Warning ⚠️

**Problem**: When signing in, you see "Google hasn't verified this app" with a warning screen

**Solution**: This is completely NORMAL for apps in development/testing mode! Here's how to proceed:

1. **Click "Advanced"** at the bottom of the warning screen
2. **Click "Go to Personal OS (unsafe)"** - Don't worry, your own app is safe!
3. **Grant permissions** - Allow access to Calendar and profile

**Why this happens:**
- Your app is in "Testing" mode (not published to the public)
- This is the CORRECT setup for personal use
- Only you and test users you add can access it
- Your data is completely safe - it's YOUR app!

**To avoid this warning (optional):**
- Go to Google Cloud Console → OAuth consent screen
- Add yourself as a test user
- Or click "Publish App" if you want to make it public (requires verification)
- For personal use, just click "Advanced" → "Go to..." each time you sign in

### "The app is in testing mode" Warning

**Problem**: After setting up OAuth, you see "Testing" status

**Solution**: This is completely NORMAL and expected!
- Your app will work perfectly in testing mode
- You can use it yourself and with test users you add
- For personal use, you don't need to "publish" your app
- To publish for everyone: Click "Publish App" on OAuth consent screen (optional)

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
