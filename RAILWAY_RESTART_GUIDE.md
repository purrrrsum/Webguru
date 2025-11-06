# Guide: Restart Railway Service

This guide shows you how to restart your Railway service after making changes or if something isn't working.

## Method 1: Railway Dashboard (Recommended)

### Step 1: Open Railway Dashboard
1. Go to [https://railway.app](https://railway.app)
2. Log in to your account
3. Select your project (the one containing `webguru` or `thesupport.agency` service)

### Step 2: Navigate to Your Service
1. In your project, find the service named **"thesupport.agency"** or **"webguru"**
2. Click on it to open the service details

### Step 3: Restart the Service
**Option A: Using the Settings Tab**
1. Click on the **"Settings"** tab
2. Scroll down to find **"Restart Service"** or **"Redeploy"** button
3. Click the button to restart

**Option B: Using the Deployments Tab**
1. Click on the **"Deployments"** tab
2. Find the **latest deployment**
3. Click on the **"..."** (three dots) menu on the right
4. Select **"Redeploy"** from the dropdown

**Option C: Quick Restart (if available)**
1. In the service overview page
2. Look for a **"Restart"** or **"Redeploy"** button in the top right
3. Click it to restart immediately

### Step 4: Wait for Restart
1. You'll see the deployment status change
2. Wait for the service to restart (usually 30-60 seconds)
3. The status should show as **"Active"** or **"Running"** when ready

---

## Method 2: Railway CLI

If you have Railway CLI installed:

### Step 1: Login and Link
```bash
railway login
railway link
```

### Step 2: Restart Service
```bash
railway restart
```

Or redeploy:
```bash
railway up
```

---

## Method 3: Trigger New Deployment

The easiest way to restart is to trigger a new deployment:

### Step 1: Make a Small Change
1. Push a new commit to your GitHub repository
2. Railway will automatically detect and redeploy
3. This effectively restarts the service

### Step 2: Or Use Empty Commit
```bash
git commit --allow-empty -m "Trigger Railway redeploy"
git push origin main
```

---

## When to Restart

Restart your Railway service when:
- ✅ After running database setup commands
- ✅ After changing environment variables
- ✅ When the service is not responding
- ✅ After code changes that require a restart
- ✅ When you see errors in logs
- ✅ When login pages are not working

---

## Verify Service is Running

After restart, verify:

### 1. Check Service Status
- Railway Dashboard → Your Service → Should show **"Active"** or **"Running"**

### 2. Check Logs
- Railway Dashboard → Your Service → **"Logs"** tab
- Should see: `Ready on http://0.0.0.0:PORT` or similar

### 3. Test Your Website
- Visit: `https://www.thesupport.agency`
- Should load without errors

### 4. Test API Endpoints
- Visit: `https://www.thesupport.agency/api/status`
- Should return JSON with status information

---

## Troubleshooting

### Issue: Service won't restart
**Solution:**
1. Check if PostgreSQL service is running (required dependency)
2. Check Railway Dashboard for any error messages
3. Try redeploying instead of restarting

### Issue: Service restarts but still has errors
**Solution:**
1. Check the **"Logs"** tab for error messages
2. Verify environment variables are set correctly
3. Check database connection (PostgreSQL service must be running)

### Issue: "Service is restarting" for too long
**Solution:**
1. Check the **"Logs"** tab for build errors
2. Verify `railway.json` configuration is correct
3. Check that `package.json` has correct scripts
4. If stuck, try redeploying from a new commit

---

## Quick Restart Checklist

- [ ] Open Railway Dashboard
- [ ] Navigate to your service
- [ ] Click "Redeploy" or "Restart"
- [ ] Wait for status to show "Active"
- [ ] Check logs for "Ready" message
- [ ] Test website: `https://www.thesupport.agency`
- [ ] Test API: `https://www.thesupport.agency/api/status`

---

**After restart, your service should be running with all the latest changes!**

