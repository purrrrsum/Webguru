# Fix: Railway Build Error - NEXTAUTH_URL

## Problem
```
ERROR: failed to build: failed to stat /tmp/railpack-build-*/secrets/NEXTAUTH_URL: 
stat /tmp/railpack-build-*/secrets/NEXTAUTH_URL: no such file or directory
```

Railway is trying to read `NEXTAUTH_URL` as a secret file during build, but it shouldn't be needed during build.

## Solution

### ✅ Step 1: Remove NEXTAUTH_URL from Railway Variables (if added manually)

1. Go to Railway Dashboard → Your Service → **Variables** tab
2. **DELETE** `NEXTAUTH_URL` if it exists there
3. **DO NOT** add it as a variable (it's auto-set by Railway)

### ✅ Step 2: Add NEXTAUTH_URL as Runtime Variable Only

**Option A: Let Railway auto-set it (Recommended)**

Railway automatically provides `RAILWAY_PUBLIC_DOMAIN`. The code will use it automatically.

**Option B: Set it manually in Railway Variables (NOT as secret)**

If you need to set it manually:

1. Railway Dashboard → Your Service → **Variables** tab
2. Click **"+ New Variable"**
3. Name: `NEXTAUTH_URL`
4. Value: `https://your-app.up.railway.app` (replace with your actual Railway URL)
5. **IMPORTANT:** Do NOT click the lock icon (🔒) - it should NOT be a secret!
6. Click **Add**

### ✅ Step 3: Verify railway.json

The `railway.json` file should NOT have `NEXTAUTH_URL` in the `variables` section:

```json
{
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

✅ **Correct** - No variables section

### ✅ Step 4: Verify next.config.js

The `next.config.js` should NOT reference `NEXTAUTH_URL` in the `env` section during build.

## How It Works

1. **During Build:** `NEXTAUTH_URL` is NOT needed - Next.js builds successfully without it
2. **During Runtime:** 
   - Railway automatically sets `RAILWAY_PUBLIC_DOMAIN`
   - Code uses `process.env.NEXTAUTH_URL` OR falls back to `RAILWAY_PUBLIC_DOMAIN`
   - NextAuth.js works correctly

## What Changed

- ✅ Removed `variables` section from `railway.json` (was causing Railway to look for secrets)
- ✅ Removed `env` section from `next.config.js` (was trying to access during build)
- ✅ Code uses runtime fallback: `NEXTAUTH_URL` → `RAILWAY_PUBLIC_DOMAIN` → `localhost:3000`

## Verification

After deploying:

1. Check Railway build logs - should succeed ✅
2. Check Railway runtime logs - should show app starting ✅
3. Test login - should work ✅

## If Build Still Fails

1. Check Railway Dashboard → Variables → Make sure `NEXTAUTH_URL` is NOT marked as secret (no lock icon)
2. If it exists, delete it and let Railway auto-set via `RAILWAY_PUBLIC_DOMAIN`
3. Redeploy

---

**Summary:** `NEXTAUTH_URL` is runtime-only, not build-time. Railway should NOT look for it during build. ✅

