# Google OAuth Complete Setup Guide

This guide will help you configure Google OAuth authentication for your application.

## Prerequisites

- A Google account
- Access to Google Cloud Console (https://console.cloud.google.com)
- Your Railway deployment URL (or localhost for development)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `thesupport-agency` (or your preferred name)
5. Click **"Create"**
6. Wait for project creation, then select it from the dropdown

## Step 2: Enable Google+ API

1. In Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"People API"**
3. Click on the API
4. Click **"Enable"**
5. Wait for the API to be enabled

## Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace)
3. Click **"Create"**
4. Fill in the required information:
   - **App name**: `thesupport.agency` (or your app name)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**
6. On the **Scopes** page, click **"Save and Continue"** (no need to add scopes)
7. On the **Test users** page:
   - Click **"Add Users"**
   - Add your email address (and any other test emails)
   - Click **"Save and Continue"**
8. Review and click **"Back to Dashboard"**

## Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. If prompted, configure the consent screen (you already did this)
5. Choose **"Web application"** as the application type
6. Enter a name: `thesupport-agency-web-client`
7. **Authorized JavaScript origins** - Add these URLs:
   ```
   http://localhost:3000
   https://your-railway-app.railway.app
   https://www.thesupport.agency
   ```
   (Replace with your actual Railway URL)

8. **Authorized redirect URIs** - Add these URLs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-railway-app.railway.app/api/auth/callback/google
   https://www.thesupport.agency/api/auth/callback/google
   ```
   (Replace with your actual Railway URL)

9. Click **"Create"**
10. **IMPORTANT**: Copy both:
    - **Client ID** (looks like: `123456789-abc123def456.apps.googleusercontent.com`)
    - **Client Secret** (looks like: `GOCSPX-abc123def456`)
    
    ⚠️ **The Client Secret is only shown once!** Save it immediately.

## Step 5: Add Credentials to Railway

1. Go to your Railway dashboard: https://railway.app
2. Select your project
3. Go to your service → **"Variables"** tab
4. Click **"+ New Variable"**

### Add GOOGLE_CLIENT_ID:
- **Name**: `GOOGLE_CLIENT_ID`
- **Value**: Paste your Client ID
- **Lock**: Leave unlocked (this is a public value)
- Click **"Add"**

### Add GOOGLE_CLIENT_SECRET:
- **Name**: `GOOGLE_CLIENT_SECRET`
- **Value**: Paste your Client Secret
- **Lock**: Click the lock icon 🔒 (mark as secret)
- Click **"Add"**

5. Railway will automatically redeploy your application

## Step 6: Verify Configuration

1. Wait for Railway deployment to complete (check Deployments tab)
2. Go to your application URL: `https://your-app.railway.app/auth/signin`
3. You should see a **"Continue with Google"** button
4. Click it and test the login flow

## Step 7: Update Google Console with Production URL

If your Railway URL changed or you're using a custom domain:

1. Go back to Google Cloud Console → **Credentials**
2. Find your OAuth 2.0 Client ID
3. Click the **pencil icon** (Edit)
4. Update **Authorized JavaScript origins** with your actual URL
5. Update **Authorized redirect URIs** with your actual callback URL:
   ```
   https://your-actual-url.com/api/auth/callback/google
   ```
6. Click **"Save"**
7. Wait 1-2 minutes for changes to propagate

## Troubleshooting

### "redirect_uri_mismatch" Error

**Problem**: The redirect URI in Google Console doesn't match your app URL.

**Solution**:
1. Check your Railway app URL (from Railway dashboard)
2. Go to Google Console → Credentials → Edit OAuth Client
3. Make sure the redirect URI is EXACTLY:
   ```
   https://your-railway-url.railway.app/api/auth/callback/google
   ```
4. Make sure it's `https://` not `http://`
5. Save and wait 1-2 minutes

### "access_denied" Error

**Problem**: Your email is not in the test users list.

**Solution**:
1. Go to Google Console → OAuth consent screen
2. Click **"Test users"** tab
3. Add your email address
4. Save and try again

### Google Button Doesn't Appear

**Problem**: Google OAuth credentials are not set or invalid.

**Solution**:
1. Check Railway Variables:
   - `GOOGLE_CLIENT_ID` is set
   - `GOOGLE_CLIENT_SECRET` is set
2. Verify credentials are correct (no extra spaces)
3. Redeploy Railway
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### "Invalid client" Error

**Problem**: Client ID or Secret is incorrect.

**Solution**:
1. Double-check credentials in Railway Variables
2. Make sure there are no extra spaces or line breaks
3. Re-copy from Google Console if needed
4. Redeploy after updating

## Testing Checklist

- [ ] Google OAuth button appears on sign-in page
- [ ] Clicking button redirects to Google sign-in
- [ ] After signing in, redirects back to your app
- [ ] User is logged in and can access dashboard
- [ ] User can log out and log back in
- [ ] Works on both localhost and production

## Security Notes

1. **Never commit** `GOOGLE_CLIENT_SECRET` to git
2. Keep the Client Secret **locked** in Railway Variables
3. Regularly rotate credentials if compromised
4. Use HTTPS in production (Railway does this automatically)
5. Only add trusted domains to authorized redirect URIs

## Next Steps

After Google OAuth is working:
1. Test the complete authentication flow
2. Verify user creation works
3. Test on mobile devices
4. Consider adding more OAuth providers (GitHub, etc.)

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Check browser console for errors
3. Verify all URLs match exactly in Google Console
4. Ensure environment variables are set correctly
5. Wait 1-2 minutes after making changes in Google Console

---

**Done!** 🎉 Your Google OAuth authentication is now configured and ready to use!

