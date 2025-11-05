# Google OAuth Quick Start Checklist ✅

Follow this checklist step-by-step to enable Google authentication.

## 🔑 Step 1: Google Cloud Console Setup

### 1.1 Create Project
- [ ] Go to https://console.cloud.google.com
- [ ] Click project dropdown → "New Project"
- [ ] Name: `thesupport-agency`
- [ ] Click "Create"
- [ ] Select the new project

### 1.2 Enable API
- [ ] Go to "APIs & Services" → "Library"
- [ ] Search "Google+ API" or "People API"
- [ ] Click "Enable"

### 1.3 Configure OAuth Consent Screen
- [ ] Go to "APIs & Services" → "OAuth consent screen"
- [ ] Choose "External"
- [ ] Fill:
  - App name: `thesupport.agency`
  - User support email: Your email
  - Developer contact: Your email
- [ ] Click "Save and Continue"
- [ ] Click "Save and Continue" (Scopes)
- [ ] Add your email as "Test user"
- [ ] Click "Save and Continue"
- [ ] Click "Back to Dashboard"

### 1.4 Create OAuth Credentials
- [ ] Go to "APIs & Services" → "Credentials"
- [ ] Click "+ CREATE CREDENTIALS" → "OAuth client ID"
- [ ] Application type: "Web application"
- [ ] Name: `thesupport-agency-web-client`

**Authorized JavaScript origins** (add all):
```
http://localhost:3000
https://www.thesupport.agency
https://your-railway-url.up.railway.app
```

**Authorized redirect URIs** (add all):
```
http://localhost:3000/api/auth/callback/google
https://www.thesupport.agency/api/auth/callback/google
https://your-railway-url.up.railway.app/api/auth/callback/google
```

- [ ] Click "Create"
- [ ] **COPY Client ID** (save it!)
- [ ] **COPY Client Secret** (save it - only shown once!)

---

## 🚂 Step 2: Railway Setup

### 2.1 Get Railway URL
- [ ] Go to Railway Dashboard
- [ ] Your Service → Settings tab
- [ ] **Copy your public URL** (e.g., `https://thesupport-in-production.up.railway.app`)

### 2.2 Add Environment Variables
- [ ] Railway → Your Service → Variables tab
- [ ] Click "+ New Variable"

**Variable 1:**
- Name: `GOOGLE_CLIENT_ID`
- Value: Paste your Client ID
- **Don't lock** (not a secret)
- Click "Add"

**Variable 2:**
- Name: `GOOGLE_CLIENT_SECRET`
- Value: Paste your Client Secret
- **Click lock icon** 🔒 (mark as secret)
- Click "Add"

### 2.3 Wait for Redeploy
- [ ] Railway will auto-redeploy
- [ ] Wait for deployment to complete (check Deployments tab)

---

## 🔄 Step 3: Update Google Console with Railway URL

### 3.1 Edit OAuth Client
- [ ] Go back to Google Cloud Console → Credentials
- [ ] Find your OAuth 2.0 Client ID
- [ ] Click **pencil icon** (Edit)

### 3.2 Add Railway URLs
- [ ] In "Authorized JavaScript origins", add:
  - `https://your-railway-url.up.railway.app`
- [ ] In "Authorized redirect URIs", add:
  - `https://your-railway-url.up.railway.app/api/auth/callback/google`
- [ ] Click "Save"

---

## ✅ Step 4: Test

### 4.1 Test on Railway
- [ ] Go to: `https://your-railway-url.up.railway.app/auth/signin`
- [ ] Click "Continue with Google" button
- [ ] Sign in with your Google account
- [ ] Should redirect to dashboard ✅

### 4.2 Verify
- [ ] Check dashboard loads correctly
- [ ] Check user was created in database
- [ ] Try logging out and logging back in

---

## 🐛 If It Doesn't Work

**Error: "redirect_uri_mismatch"**
- Check Railway URL in Google Console matches exactly
- Make sure it's `https://` (not `http://`)
- Wait 1-2 minutes after saving, then try again

**Error: "access_denied"**
- Add your email to Test users in OAuth consent screen
- Save and try again

**Button doesn't appear**
- Check Railway Variables are set correctly
- Redeploy Railway
- Hard refresh browser (Ctrl+Shift+R)

---

**Done!** 🎉 Google authentication is now enabled!

