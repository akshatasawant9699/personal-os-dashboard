# Deploy to Vercel - Step-by-Step Guide

This guide will help you deploy your Personal Kanban Dashboard to Vercel in just a few minutes!

## Prerequisites

- GitHub account (already done ✅)
- Vercel account (free - sign up at https://vercel.com)
- Firebase project set up (see SETUP_GUIDE.md)
- Google Calendar API configured (see SETUP_GUIDE.md)

## Step 1: Sign Up / Log In to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" (or "Log In" if you have an account)
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

## Step 2: Import Your GitHub Repository

1. Once logged in, click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find and select: **`akshatasawant9699/personal-os-dashboard`**
4. Click **"Import"**

## Step 3: Configure Project Settings

Vercel will auto-detect that you're using Vite. Verify these settings:

### Framework Preset
- **Framework**: Vite ✅ (should be auto-detected)

### Build Settings
- **Build Command**: `npm run build` ✅ (should be auto-filled)
- **Output Directory**: `dist` ✅ (should be auto-filled)
- **Install Command**: `npm install` ✅ (should be auto-filled)

### Root Directory
- Leave as `.` (root) ✅

**Don't click Deploy yet!** We need to add environment variables first.

## Step 4: Add Environment Variables

Click on **"Environment Variables"** to expand the section.

Add each of these variables (get values from your `.env` file or Firebase/Google Cloud Console):

| Variable Name | Value | Where to Get It |
|--------------|--------|----------------|
| `VITE_FIREBASE_API_KEY` | `AIza...` | Firebase Console → Project Settings → General → Your apps |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | Same as above |
| `VITE_FIREBASE_PROJECT_ID` | `your-project` | Same as above |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` | Same as above |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789` | Same as above |
| `VITE_FIREBASE_APP_ID` | `1:123:web:abc` | Same as above |
| `VITE_GOOGLE_CLIENT_ID` | `123-abc.apps.googleusercontent.com` | Google Cloud Console → Credentials |

**Important**:
- Click "Add" after entering each variable
- Make sure all variables start with `VITE_` (Vite requirement)
- These will be available for Production, Preview, and Development

## Step 5: Deploy!

1. Click **"Deploy"**
2. Wait 1-2 minutes while Vercel:
   - Clones your repository
   - Installs dependencies
   - Builds your project
   - Deploys to a global CDN

You'll see a build log with progress. When complete, you'll see:
```
✓ Build successful
🎉 Deployed to production
```

## Step 6: Get Your Live URL

After deployment completes:
1. Vercel will show your live URL (e.g., `https://personal-os-dashboard.vercel.app`)
2. Click **"Visit"** to open your live app
3. Copy the URL to share with others

## Step 7: Update Firebase & Google Cloud Settings

**CRITICAL**: Your app won't work until you add the Vercel URL to Firebase and Google Cloud:

### Update Firebase
1. Go to Firebase Console → Authentication → Settings
2. Click on **"Authorized domains"**
3. Click **"Add domain"**
4. Add your Vercel domain: `personal-os-dashboard.vercel.app`
5. Click **"Add"**

### Update Google Cloud OAuth
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click on your OAuth 2.0 Client ID
3. Under **"Authorized JavaScript origins"**, click **"Add URI"**
4. Add: `https://personal-os-dashboard.vercel.app`
5. Under **"Authorized redirect URIs"**, click **"Add URI"**
6. Add: `https://personal-os-dashboard.vercel.app`
7. Click **"Save"**

## Step 8: Test Your Live App

1. Open your Vercel URL in a browser
2. Click "Sign in with Google"
3. Verify authentication works
4. Create a test task
5. Try dragging and dropping
6. Test calendar sync

## Automatic Deployments

🎉 **Your app is now live and will auto-deploy!**

From now on, whenever you push code to the `main` branch on GitHub:
- Vercel automatically detects the change
- Builds and deploys the new version
- Updates your live site (usually within 1-2 minutes)

## Custom Domain (Optional)

Want to use your own domain (e.g., `personalos.com`)?

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain name
5. Follow Vercel's instructions to update your DNS settings

Don't forget to also add your custom domain to Firebase and Google Cloud authorized domains!

## Monitoring & Analytics

Vercel provides built-in analytics:
- Go to your project dashboard
- Click **"Analytics"** to see:
  - Page views
  - Unique visitors
  - Top pages
  - Real-time data

## Troubleshooting

### Build Fails
**Error**: `Command "npm run build" exited with 1`

**Solutions**:
1. Check that all environment variables are set correctly
2. Make sure all variables start with `VITE_`
3. Check the build logs for specific errors

### "Sign in with Google" Doesn't Work
**Error**: `redirect_uri_mismatch`

**Solution**:
- Verify you added your Vercel URL to Google Cloud authorized URIs
- Make sure you're using HTTPS (not HTTP)
- Check for typos in the URL

### Environment Variables Not Working
**Error**: `import.meta.env.VITE_* is undefined`

**Solution**:
1. Go to Vercel project → Settings → Environment Variables
2. Verify all variables are present and spelled correctly
3. Click **"Redeploy"** to trigger a new build with updated variables

### Calendar Sync Fails
**Error**: `Failed to fetch calendar events`

**Solution**:
- Verify Google Calendar API is enabled
- Check that OAuth scopes include Calendar
- Make sure the access token is being stored correctly

## Vercel CLI (Advanced)

Want to deploy from your terminal?

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Next Steps

✅ Your Personal Kanban is now live and accessible to anyone!

**Share your app**:
- Post on LinkedIn
- Share on Twitter/X
- Add to your portfolio
- Show to your network

**Customize it**:
- Edit roles in `src/App.jsx`
- Change colors in `tailwind.config.js`
- Add new features

**Monitor usage**:
- Check Vercel Analytics
- Monitor Firebase Authentication
- Track Calendar API usage in Google Cloud

## Cost

Everything is FREE:
- ✅ Vercel: Free tier (100GB bandwidth/month)
- ✅ Firebase: Free tier (10K authentications/month)
- ✅ Google Calendar API: Free (1M requests/day)

More than enough for personal use and showing to friends!

## Support

Having issues?
- Check the [README.md](README.md)
- Review the [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Open an issue on GitHub
- Check Vercel documentation: https://vercel.com/docs

---

🎉 **Congratulations! Your Personal Kanban is live!** 🎉

Your live URL: https://personal-os-dashboard.vercel.app (update after deployment)

---

Built with ❤️ by Akshata Sawant
