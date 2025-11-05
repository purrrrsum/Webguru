# Railway Database Setup - Step by Step

## ⚠️ Current Error
```
Database not configured: DATABASE_URL environment variable is not set.
```

## ✅ Solution: Add PostgreSQL Database in Railway

### Step-by-Step Instructions

#### Step 1: Open Railway Dashboard
1. Go to: https://railway.app
2. Sign in to your account
3. Select your project (thesupport-in or similar)

#### Step 2: Add PostgreSQL Database
1. In your Railway project, click **"+ New"** button (top right corner)
2. A dropdown menu will appear
3. Click **"Database"**
4. Select **"Add PostgreSQL"**
5. Railway will start provisioning the database (takes 30-60 seconds)

#### Step 3: Verify Database is Added
You should see:
- A new service in your project called "PostgreSQL" or similar
- Green/running status indicator
- The database service should be visible in your project sidebar

#### Step 4: Check DATABASE_URL is Set
1. Click on your **main app service** (not the PostgreSQL service)
2. Go to **"Variables"** tab
3. Look for `DATABASE_URL` in the list
4. It should be automatically added by Railway

**If DATABASE_URL is NOT there:**
- Make sure PostgreSQL service is in the same project
- Try restarting your app service
- Check Railway's documentation for linking services

#### Step 5: Initialize Database Schema
After database is added, you need to create tables:

**Option A: Via Railway Dashboard (Recommended)**
1. Click on your **app service** (not PostgreSQL)
2. Go to **"Deployments"** tab
3. Click on the **latest deployment**
4. Click **"..."** (three dots menu)
5. Click **"Run Command"**
6. Enter: `npm run setup-db`
7. Click **"Run"**
8. Wait for it to complete (check logs)

**Option B: Via Railway CLI**
```bash
railway login
railway link  # Select your project
railway run npm run setup-db
```

#### Step 6: Verify Setup
After running `npm run setup-db`, you should see:
- ✅ Tables created: users, jobs, files
- ✅ Users created: 5 users and 5 agents
- ✅ All accounts have passwords

#### Step 7: Wait for Auto-Redeploy
- Railway will automatically redeploy your app after adding database
- Check **"Deployments"** tab - should show new deployment
- Wait for green checkmark ✅

#### Step 8: Test
1. Go to: https://www.thesupport.agency/auth/signin
2. Click **"👤 Access as User"**
3. Should work now! ✅

## 🔍 Troubleshooting

### Problem: DATABASE_URL Still Not Showing

**Solution 1: Check Service Linking**
- Make sure PostgreSQL service is in same project
- Railway should auto-link, but sometimes needs manual linking
- Try restarting app service

**Solution 2: Manual Variable Setting**
If Railway doesn't auto-set it:
1. Railway Dashboard → PostgreSQL Service
2. Go to **"Variables"** tab
3. Find `DATABASE_URL` or `PGDATABASE_URL`
4. Copy the value
5. Go to your **app service** → **"Variables"** tab
6. Click **"New Variable"**
7. Name: `DATABASE_URL`
8. Value: Paste the connection string
9. Click **"Add"**

### Problem: "npm run setup-db" Command Not Found

**Solution:**
Make sure you're running it in the correct service:
- Should be run in your **app service** (Node.js service)
- NOT in PostgreSQL service
- The command should be available (check package.json)

### Problem: Database Connection Still Fails

**Check:**
1. PostgreSQL service is running (green status)
2. `DATABASE_URL` format is correct: `postgresql://user:pass@host:port/db`
3. SSL is enabled (Railway requires SSL)
4. Check Railway logs for connection errors

### Problem: Tables Don't Exist After Setup

**Solution:**
1. Check Railway logs for `npm run setup-db` output
2. Look for errors in the logs
3. Try running SQL manually:
   - Railway Dashboard → PostgreSQL Service
   - Click **"Query"** tab
   - Copy contents of `lib/db-schema.sql`
   - Paste and execute

## 📋 Quick Checklist

- [ ] PostgreSQL database added in Railway
- [ ] Database service shows green/running status
- [ ] `DATABASE_URL` appears in app service Variables tab
- [ ] Ran `npm run setup-db` command successfully
- [ ] Tables created (users, jobs, files)
- [ ] Test users created (5 users, 5 agents)
- [ ] App service redeployed after adding database
- [ ] Tested "Access as User" button - works! ✅

## 🎯 Alternative: Manual DATABASE_URL Setup

If Railway auto-setup doesn't work:

1. **Get Connection String:**
   - Railway Dashboard → PostgreSQL Service
   - Go to **"Variables"** tab
   - Find `DATABASE_URL` or `PGDATABASE_URL`
   - Copy the value

2. **Set in App Service:**
   - Railway Dashboard → Your App Service
   - Go to **"Variables"** tab
   - Click **"New Variable"**
   - Name: `DATABASE_URL`
   - Value: Paste connection string
   - Click **"Add"**

3. **Redeploy:**
   - Railway will auto-redeploy
   - Or manually trigger: **"Deployments"** → **"Redeploy"**

## 📞 Still Having Issues?

1. Check Railway logs for detailed errors
2. Verify PostgreSQL service is running
3. Check `DATABASE_URL` format is correct
4. Try restarting both services
5. Review `QUICK_FIX_DATABASE.md` for more details

---

**After completing these steps, the database error should be resolved!** ✅

