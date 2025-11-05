# Complete Google OAuth Setup Guide 🚀

This is a **step-by-step guide** with **all manual steps** required to enable Google authentication on your site.

## 📋 Prerequisites

- Google account (Gmail or Google Workspace)
- Access to Railway dashboard
- Your Railway app URL: `https://www.thesupport.agency` (our public Railway URI)

---

## 🎯 Step 1: Create Google Cloud Project

### 1.1 Go to Google Cloud Console

1. Open your browser and go to: **https://console.cloud.google.com**
2. Sign in with your Google account

### 1.2 Create New Project

1. Click on the **project dropdown** at the top (next to "Google Cloud")
2. Click **"New Project"**
3. Enter project name: `thesupport-agency` (or any name you prefer)
4. Click **"Create"**
5. Wait 10-20 seconds for project creation
6. **Select the new project** from the dropdown (if not already selected)

---

## 🎯 Step 2: Enable Google+ API / People API

### 2.1 Navigate to APIs & Services

1. In the left sidebar, click **"APIs & Services"** → **"Library"**
2. Or go directly: https://console.cloud.google.com/apis/library

### 2.2 Enable Required API

1. In the search box, type: **"Google+ API"** or **"People API"**
2. Click on **"Google+ API"** (or "People API")
3. Click the **"Enable"** button
4. Wait for it to enable (usually instant)

**Note:** Google+ API is being deprecated, but People API works the same. Either one is fine.

---

## 🎯 Step 3: Configure OAuth Consent Screen

### 3.1 Navigate to OAuth Consent Screen

1. In the left sidebar, click **"APIs & Services"** → **"OAuth consent screen"**
2. Or go directly: https://console.cloud.google.com/apis/credentials/consent

### 3.2 Choose User Type

1. Select **"External"** (unless you have Google Workspace)
2. Click **"Create"**

### 3.3 Fill App Information

Fill in the form:

**Required Fields:**
- **App name**: `thesupport.agency` (or your app name)
- **User support email**: Select your email from dropdown
- **App logo**: (Optional - skip for now)
- **App domain**: (Optional - skip for now)
- **Application home page**: `https://www.thesupport.agency` (or your Railway URL)
- **Application privacy policy link**: (Optional - skip for now)
- **Application terms of service link**: (Optional - skip for now)
- **Authorized domains**: (Optional - skip for now)
- **Developer contact information**: Your email address

**Click "Save and Continue"**

### 3.4 Configure Scopes (Skip)

1. On the "Scopes" page, click **"Save and Continue"** (no changes needed)

### 3.5 Add Test Users (Important!)

1. On the "Test users" page:
   - Click **"+ ADD USERS"**
   - Add your email address (the one you'll use to test Google login)
   - Click **"Add"**
2. Click **"Save and Continue"**

### 3.6 Review and Go Back

1. Review the summary
2. Click **"Back to Dashboard"**

---

## 🎯 Step 4: Create OAuth 2.0 Credentials

### 4.1 Navigate to Credentials

1. In the left sidebar, click **"APIs & Services"** → **"Credentials"**
2. Or go directly: https://console.cloud.google.com/apis/credentials

### 4.2 Create OAuth Client ID

1. Click **"+ CREATE CREDENTIALS"** (top of page)
2. Select **"OAuth client ID"**

### 4.3 Configure OAuth Client

**Application type**: Select **"Web application"**

**Name**: `thesupport-agency-web-client` (or any name)

**Authorized JavaScript origins**: Click **"+ ADD URI"** and add these one by one:
```
http://localhost:3000
https://www.thesupport.agency
https://thesupport-in-production.up.railway.app
```
**Replace `thesupport-in-production.up.railway.app` with your actual Railway URL!**

**Authorized redirect URIs**: Click **"+ ADD URI"** and add these one by one:
```
http://localhost:3000/api/auth/callback/google
https://www.thesupport.agency/api/auth/callback/google
https://www.thesupport.agency/api/auth/callback/google
```
**Again, replace with your actual Railway URL!**

### 4.4 Create and Copy Credentials

1. Click **"Create"**
2. **IMPORTANT:** A popup will appear with your credentials:
   - **Client ID**: Copy this (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - **Client Secret**: Copy this (looks like: `GOCSPX-xxxxxxxxxxxxx`)
3. **SAVE THESE** - you'll need them in Railway!

**Note:** If you close the popup, you can still find the Client ID in the credentials list, but the secret is only shown once. If you lose it, you'll need to create new credentials.

---

## 🎯 Step 5: Add Credentials to Railway

### 5.1 Get Your Railway App URL

1. Go to Railway Dashboard: https://railway.app
2. Click on your project
3. Click on your service (webguru)
4. Go to **"Settings"** tab
5. Our **public Railway URI** is: `https://www.thesupport.agency`
6. **Copy this URL** - you'll need it!

### 5.2 Add Environment Variables

1. In Railway, go to your service → **"Variables"** tab
2. Click **"+ New Variable"**

**Add Variable 1:**
- **Name**: `GOOGLE_CLIENT_ID`
- **Value**: Paste your Client ID (the one ending in `.apps.googleusercontent.com`)
- **Do NOT** click the lock icon (not a secret)
- Click **"Add"**

**Add Variable 2:**
- **Name**: `GOOGLE_CLIENT_SECRET`
- **Value**: Paste your Client Secret (the one starting with `GOCSPX-`)
- **Click the lock icon** 🔒 to mark it as a secret (important!)
- Click **"Add"**

### 5.3 Verify Variables

Your Railway Variables tab should now show:
- ✅ `GOOGLE_CLIENT_ID` (not locked)
- ✅ `GOOGLE_CLIENT_SECRET` (locked 🔒)
- ✅ `NEXTAUTH_SECRET` (locked 🔒)
- ✅ `DATABASE_URL` (auto-set by Railway)

---

## 🎯 Step 6: Update Google Console with Railway URL

### 6.1 Go Back to Google Cloud Console

1. Go back to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID (the one you just created)
3. Click the **pencil icon** (Edit) on the right

### 6.2 Add Railway URL to Authorized Origins

1. In **"Authorized JavaScript origins"**, click **"+ ADD URI"**
2. Add: `https://www.thesupport.agency`
3. Click outside the input box

### 6.3 Add Railway URL to Redirect URIs

1. In **"Authorized redirect URIs"**, click **"+ ADD URI"**
2. Add: `https://www.thesupport.agency/api/auth/callback/google`
3. Click outside the input box

### 6.4 Save Changes

1. Scroll down and click **"Save"**
2. Wait for confirmation

---

## 🎯 Step 7: Test Google Login

### 7.1 Test Locally (Optional)

1. Create `.env.local` file in your project root:
```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

2. Run: `npm run dev`
3. Go to: `http://localhost:3000/auth/signin`
4. Click **"Continue with Google"**
5. Sign in with your Google account
6. Should redirect to dashboard

### 7.2 Test on Railway (Production)

1. Railway will auto-redeploy after you add the variables
2. Wait for deployment to complete (check Railway dashboard)
3. Go to your Railway URL: `https://www.thesupport.agency/auth/signin`
4. Click **"Continue with Google"**
5. Sign in with your Google account
6. Should redirect to dashboard

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Test users added (your email)
- [ ] OAuth 2.0 credentials created
- [ ] Client ID and Secret copied
- [ ] Railway URL added to Authorized JavaScript origins
- [ ] Railway URL added to Authorized redirect URIs
- [ ] `GOOGLE_CLIENT_ID` added to Railway Variables
- [ ] `GOOGLE_CLIENT_SECRET` added to Railway Variables (locked)
- [ ] Railway deployment completed
- [ ] Google login tested locally (optional)
- [ ] Google login tested on Railway ✅

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem:** The redirect URI in Google Console doesn't match your app URL.

**Solution:**
1. Check your Railway URL exactly (including `https://`)
2. Make sure redirect URI is: `https://www.thesupport.agency/api/auth/callback/google`
3. Copy-paste the exact URL from Railway (don't type it manually)
4. Save in Google Console
5. Wait 1-2 minutes for changes to propagate
6. Try again

### Error: "access_denied"

**Problem:** Your email is not in the test users list.

**Solution:**
1. Go to OAuth consent screen → Test users
2. Add your email
3. Save
4. Try again

### Error: "Google login button doesn't appear"

**Problem:** Environment variables not set or app not redeployed.

**Solution:**
1. Check Railway Variables tab - verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` exist
2. Trigger a new deployment in Railway
3. Wait for deployment to complete
4. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Error: "Invalid client" or "Client ID not found"

**Problem:** Wrong Client ID or Secret.

**Solution:**
1. Double-check you copied the correct Client ID and Secret
2. Make sure there are no extra spaces
3. Verify in Railway Variables that they match exactly
4. Redeploy Railway

---

## 📝 Quick Reference

**Google Cloud Console:**
- Project: https://console.cloud.google.com
- OAuth Consent Screen: https://console.cloud.google.com/apis/credentials/consent
- Credentials: https://console.cloud.google.com/apis/credentials

**Railway:**
- Dashboard: https://railway.app
- Variables: Railway → Your Service → Variables tab

**Your App:**
- Sign In: `https://www.thesupport.agency/auth/signin`
- Callback URL: `https://www.thesupport.agency/api/auth/callback/google`

---

## 🎉 Success!

Once Google login works:
1. ✅ Users can sign in with Google
2. ✅ New users are automatically created
3. ✅ Existing users are logged in
4. ✅ All users created via Google have role: 'user'

**Next Steps:**
- Test with multiple Google accounts
- Verify user creation in database
- Test agent login (still uses password/OTP)

---

**Need Help?** Check the [NextAuth.js Google Provider Docs](https://next-auth.js.org/providers/google)

