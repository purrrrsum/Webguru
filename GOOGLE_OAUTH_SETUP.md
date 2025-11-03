# Google OAuth Setup Guide

This guide will help you set up Google OAuth for both user and agent login.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** → **"New Project"**
3. Enter project name: `thesupport-agency` (or your preferred name)
4. Click **"Create"**
5. Wait for project creation (takes a few seconds)

## Step 2: Enable Google+ API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"People API"**
3. Click on it and click **"Enable"**

## Step 3: Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (unless you have Google Workspace)
3. Click **"Create"**
4. Fill in the form:
   - **App name**: `thesupport.agency`
   - **User support email**: Your email
   - **Developer contact information**: Your email
5. Click **"Save and Continue"**
6. On **"Scopes"** page, click **"Save and Continue"**
7. On **"Test users"** page:
   - Add test users (your email) if in testing mode
   - Click **"Save and Continue"**
8. Review and click **"Back to Dashboard"**

## Step 4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Choose **"Web application"** as application type
4. Enter a name: `thesupport-agency-web-client`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://your-railway-url.up.railway.app
   https://thesupport.agency (if you have custom domain)
   ```
6. **Authorized redirect URIs** (IMPORTANT - add all of these):
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-railway-url.up.railway.app/api/auth/callback/google
   https://thesupport.agency/api/auth/callback/google (if custom domain)
   ```
7. Click **"Create"**
8. **Copy the Client ID and Client Secret** (you'll need these!)

## Step 5: Add Credentials to Environment Variables

### For Local Development (`.env.local`):

```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

### For Railway:

1. Go to your Railway project
2. Click on your service
3. Go to **"Variables"** tab
4. Add these variables:
   - **Variable**: `GOOGLE_CLIENT_ID`
     **Value**: `your_client_id_here.apps.googleusercontent.com`
   - **Variable**: `GOOGLE_CLIENT_SECRET`
     **Value**: `your_client_secret_here`

## Step 6: Update Redirect URIs After Deployment

After deploying to Railway:

1. Get your Railway app URL (e.g., `https://thesupport-in-production.up.railway.app`)
2. Go back to Google Cloud Console → **Credentials** → Your OAuth client
3. Click **Edit**
4. Add your Railway URL to:
   - **Authorized JavaScript origins**: `https://your-railway-url.up.railway.app`
   - **Authorized redirect URIs**: `https://your-railway-url.up.railway.app/api/auth/callback/google`
5. Click **Save**

## Step 7: Test Google Login

1. **Local Testing**:
   - Start dev server: `npm run dev`
   - Go to `http://localhost:3000/auth/signin`
   - Click "Continue with Google"
   - Sign in with your Google account

2. **Production Testing**:
   - Go to your Railway app URL
   - Try Google login
   - If it fails, check Railway logs and verify redirect URIs

## Common Issues & Solutions

### Issue: "redirect_uri_mismatch" Error

**Solution**: 
- Make sure the redirect URI in Google Console exactly matches your app URL
- Format: `https://your-domain.com/api/auth/callback/google`
- Check for trailing slashes, http vs https, etc.

### Issue: "access_denied" Error

**Solution**:
- Make sure you added your email as a test user in OAuth consent screen
- Or publish the app (if ready for production)

### Issue: Google Login Creates User but Session Doesn't Work

**Solution**:
- Check `NEXTAUTH_SECRET` is set correctly
- Verify `NEXTAUTH_URL` matches your app URL
- Check database connection is working

### Issue: Agent Google Login Not Working

**Solution**:
- Agents using Google login need to be verified after login
- Make sure agent email exists in database with `role: 'agent'`
- Check `/agent-verify` page is working

## Security Best Practices

1. **Never commit** `GOOGLE_CLIENT_SECRET` to git
2. **Use different OAuth clients** for development and production (optional but recommended)
3. **Restrict redirect URIs** to only your domains
4. **Regularly rotate** OAuth secrets if compromised
5. **Enable MFA** on your Google Cloud account

## Verification Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Client ID and Secret copied
- [ ] Redirect URIs added for localhost
- [ ] Redirect URIs added for Railway URL
- [ ] Environment variables set in Railway
- [ ] Google login tested locally
- [ ] Google login tested on Railway
- [ ] Agent Google login tested (if applicable)

## Next Steps

After Google OAuth is working:
1. Test user registration via Google
2. Test agent login (password method)
3. Test agent Google login (if implemented)
4. Update documentation with your specific URLs

---

**Need Help?** Check the [NextAuth.js Google Provider Docs](https://next-auth.js.org/providers/google)

