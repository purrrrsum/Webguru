# Quick Fix: Database Not Configured

## Error: "Database not configured"

This means `DATABASE_URL` environment variable is not set in Railway.

## ✅ Solution: Add PostgreSQL Database

### Step 1: Add PostgreSQL in Railway

1. Go to **Railway Dashboard**: https://railway.app
2. Select your project
3. Click **"+ New"** button (top right)
4. Select **"Database"** → **"Add PostgreSQL"**
5. Railway will automatically:
   - Create the database
   - Set `DATABASE_URL` environment variable
   - Make it available to your app

### Step 2: Verify Database is Connected

1. In Railway Dashboard → Your Service
2. Go to **"Variables"** tab
3. Look for `DATABASE_URL` - it should be there automatically
4. If you see it, you're good! ✅

### Step 3: Initialize Database Schema

After database is added, you need to create the tables:

**Option A: Via Railway Dashboard (Easiest)**
1. Railway Dashboard → Your Service
2. Click **"Deployments"** → **"..."** (three dots on latest deployment)
3. Click **"Run Command"**
4. Enter: `npm run setup-db`
5. Click **"Run"**

**Option B: Via Railway CLI**
```bash
railway run npm run setup-db
```

### Step 4: Create Test Users

After schema is initialized, create test users:

**Via Railway Dashboard:**
1. Railway Dashboard → Your Service → **"Deployments"** → **"..."** → **"Run Command"**
2. Enter: `npm run create-users`
3. Click **"Run"**

**Via Railway CLI:**
```bash
railway run npm run create-users
```

### Step 5: Verify Everything Works

1. Railway will auto-redeploy after adding database
2. Wait for deployment to complete (green checkmark)
3. Try clicking "👤 Access as User" again
4. Should work now! ✅

## 🔍 Troubleshooting

### If DATABASE_URL is still not showing:

1. Check Railway Dashboard → Your Service → **"Variables"**
2. Make sure PostgreSQL service is added to the same project
3. Try restarting your service:
   - Railway Dashboard → Your Service
   - Click **"..."** → **"Restart"**

### If setup-db command fails:

1. Check Railway logs for errors
2. Verify PostgreSQL service is running (should show green status)
3. Try running SQL manually:
   - Railway Dashboard → PostgreSQL Service → **"Query"** tab
   - Copy contents of `lib/db-schema.sql`
   - Paste and execute

### If create-users command fails:

1. Make sure schema is initialized first (run `npm run setup-db`)
2. Check that users table exists
3. Review Railway logs for specific errors

## ✅ Verification Checklist

- [ ] PostgreSQL database added in Railway
- [ ] `DATABASE_URL` appears in Variables tab
- [ ] Database service shows green/running status
- [ ] Schema initialized (`npm run setup-db` completed)
- [ ] Test users created (`npm run create-users` completed)
- [ ] App redeployed after adding database
- [ ] "Access as User" button works

## 🎯 Quick Commands Reference

```bash
# Initialize database schema
railway run npm run setup-db

# Create test users
railway run npm run create-users

# Verify database connection
railway run npm run verify-db
```

---

**After completing these steps, the "Database not configured" error should be resolved!**

