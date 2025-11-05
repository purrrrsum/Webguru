# Railway Deployment Ready ✅

## Configuration Summary

Railway is configured via `railway.json` and ready for deployment.

### ✅ Current Configuration

**File:** `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Build Process

1. **Builder**: RAILPACK (auto-detects Node.js from package.json)
2. **Node Version**: 20.x (from package.json engines)
3. **Build Command**: `npm run build`
4. **Start Command**: `npm start`
5. **Restart Policy**: Auto-restart on failure (max 10 retries)

---

## 🚀 Deployment Steps

### Automatic Deployment (Git Push)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```
2. Railway automatically:
   - Detects the push
   - Reads `railway.json`
   - Runs `npm install`
   - Runs `npm run build`
   - Starts with `npm start`

### Manual Redeploy (Railway Dashboard)

1. Go to Railway Dashboard
2. Select your service
3. Go to **Deployments** tab
4. Click **⋮** (three dots) on latest deployment
5. Click **Redeploy**

---

## ✅ Verification Checklist

Before deployment, ensure:

- [x] `railway.json` exists and is configured
- [x] `package.json` has `build` and `start` scripts
- [x] Node.js version specified in `package.json` engines
- [x] Environment variables set in Railway Dashboard
- [x] Database connected (PostgreSQL)
- [x] `NEXTAUTH_SECRET` is set
- [x] `DATABASE_URL` is set (auto-set by Railway PostgreSQL)

---

## 📋 Required Environment Variables

Set these in Railway Dashboard → Variables:

**Required:**
- `NEXTAUTH_SECRET` - Generated secret (32+ chars)
- `DATABASE_URL` - Auto-set by Railway PostgreSQL

**Optional:**
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GOOGLE_CLIENT_SECRET` - For Google OAuth
- `RESEND_API_KEY` - For OTP emails
- `DB_TIMEZONE` - Database timezone (e.g., `Asia/Kolkata`)

**Note:** `NEXTAUTH_URL` should NOT be set - Railway auto-detects it.

---

## 🔍 Build Logs

To check build logs:

1. Railway Dashboard → Your Service
2. Go to **Deployments** tab
3. Click on the deployment
4. View **Build Logs** and **Deploy Logs**

Expected build output:
```
✓ Installing dependencies
✓ Running npm run build
✓ Building Next.js application
✓ Compiled successfully
✓ Starting server with npm start
```

---

## 🐛 Troubleshooting

### Build Fails

**Check:**
- Node.js version matches `package.json` engines (20.x)
- All dependencies in `package.json`
- TypeScript errors: Run `npm run build` locally first

### Deployment Fails

**Check:**
- `DATABASE_URL` is set
- `NEXTAUTH_SECRET` is set
- Server logs in Railway Dashboard

### App Not Starting

**Check:**
- `npm start` works locally
- Port is correctly configured (Next.js uses 3000 by default)
- Environment variables are set

---

## ✅ Configuration Verified

- ✅ `railway.json` configured correctly
- ✅ RAILPACK builder selected
- ✅ Build and start commands match package.json
- ✅ No conflicting config files
- ✅ Ready for deployment

---

**Railway will automatically deploy when you push to GitHub!** 🚀

