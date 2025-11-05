# Fix: redirect_uri_mismatch Error 🔧

This error means the redirect URI in Google Console doesn't match what your app is sending.

## 🎯 Quick Fix Steps

### Step 1: Get Your Exact Railway URL

1. Go to **Railway Dashboard**: https://railway.app
2. Your Project → Your Service (webguru)
3. Click **"Settings"** tab
4. Find **"Public URL"** or check **"Domains"** section
5. **Copy the EXACT URL** (e.g., `https://thesupport-in-production.up.railway.app`)

### Step 2: Update Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your **OAuth 2.0 Client ID**
3. Click the **pencil icon** (Edit) ✏️

### Step 3: Fix Authorized Redirect URIs

In **"Authorized redirect URIs"** section:

1. **Remove** any existing Railway redirect URIs (if incorrect)
2. Click **"+ ADD URI"**
3. Add exactly: `https://YOUR-RAILWAY-URL.up.railway.app/api/auth/callback/google`
   - Replace `YOUR-RAILWAY-URL` with your actual Railway URL
   - **Must be:** `https://` (not `http://`)
   - **Must end with:** `/api/auth/callback/google`
   - **No trailing slash!**

### Step 4: Fix Authorized JavaScript Origins

In **"Authorized JavaScript origins"** section:

1. Click **"+ ADD URI"**
2. Add exactly: `https://YOUR-RAILWAY-URL.up.railway.app`
   - **No trailing slash!**
   - **Must be:** `https://`

### Step 5: Save and Wait

1. Scroll down → Click **"Save"**
2. **Wait 1-2 minutes** for Google to update
3. Try Google login again

---

## 🔍 How to Find What URL NextAuth is Sending

### Method 1: Check Railway Logs

1. Railway Dashboard → Your Service → **"Logs"** tab
2. Try Google login
3. Look for error messages showing the redirect URI

### Method 2: Check Browser Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try Google login
4. Look for request to `accounts.google.com`
5. Check the URL parameters - find `redirect_uri`
6. **That's what you need to add to Google Console!**

---

## ✅ Correct Format

**Your Railway URL:** `https://thesupport-in-production.up.railway.app`

**Authorized JavaScript origins:**
```
http://localhost:3000
https://www.thesupport.agency
https://thesupport-in-production.up.railway.app
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://www.thesupport.agency/api/auth/callback/google
https://thesupport-in-production.up.railway.app/api/auth/callback/google
```

**Important:**
- ✅ Use exact Railway URL from Settings
- ✅ Include `https://`
- ✅ No trailing slashes
- ✅ Must end with `/api/auth/callback/google`

---

## 🐛 Common Mistakes

❌ **WRONG:**
- `http://your-url.com` (should be `https://`)
- `https://your-url.com/` (trailing slash)
- `https://your-url.com/auth/callback/google` (wrong path)
- `https://your-url.com/api/auth/callback/google/` (trailing slash)
- `https://www.your-url.com` (if Railway URL doesn't have www)

✅ **CORRECT:**
- `https://your-url.up.railway.app/api/auth/callback/google`
- Exact match with Railway URL
- No trailing slashes

---

## 🔧 If Still Not Working

### Option 1: Check Railway Variables

1. Railway Dashboard → Variables
2. Check if `NEXTAUTH_URL` is set
3. **If set:** It should match your Railway URL exactly
4. **If not set:** Railway uses request headers (which is fine)

### Option 2: Verify Domain Match

1. Get Railway URL from Settings (exact copy)
2. Compare with Google Console redirect URI
3. They must match **character for character**

### Option 3: Test with Different Browser

1. Try in incognito/private window
2. Clear browser cache
3. Try again

---

## 📋 Verification Checklist

After updating Google Console:

- [ ] Railway URL copied from Settings (exact)
- [ ] Added to "Authorized JavaScript origins" (no trailing slash)
- [ ] Added to "Authorized redirect URIs" (exact format: `/api/auth/callback/google`)
- [ ] Using `https://` (not `http://`)
- [ ] Saved in Google Console
- [ ] Waited 1-2 minutes
- [ ] Tried Google login again

---

## 🎯 Still Need Help?

If it still doesn't work:

1. **Check the exact error message** - it might show the redirect URI being sent
2. **Compare character-by-character** with Google Console
3. **Make sure** you're using the Railway URL from Settings, not typing it manually

**The redirect URI NextAuth sends is:**
```
https://YOUR-RAILWAY-URL/api/auth/callback/google
```

**This must match EXACTLY in Google Console!**

---

## ✅ Quick Reference

**Google Cloud Console:**
- Credentials: https://console.cloud.google.com/apis/credentials

**Railway:**
- Dashboard: https://railway.app
- Settings: Railway → Your Service → Settings tab

**After fixing, wait 1-2 minutes and try again!** ⏱️

