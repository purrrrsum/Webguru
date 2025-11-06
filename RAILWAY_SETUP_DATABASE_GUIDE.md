# Guide: Run Database Setup in Railway

This guide shows you how to run `npm run setup-complete-db` in Railway to create all necessary database tables.

## Method 1: Railway Dashboard (Recommended)

### Step 1: Open Railway Dashboard
1. Go to [https://railway.app](https://railway.app)
2. Log in to your account
3. Select your project (the one containing `webguru` or `thesupport.agency` service)

### Step 2: Navigate to Your Web App Service
1. In your project, find the service named **"thesupport.agency"** or **"webguru"**
2. Click on it to open the service details

### Step 3: Open Deployments
1. Click on the **"Deployments"** tab at the top
2. You'll see a list of all deployments

### Step 4: Run Command on Latest Deployment
1. Find the **latest deployment** (top of the list, should have a green checkmark if running)
2. Click on the **"..."** (three dots) menu on the right side of that deployment
3. Select **"Run Command"** from the dropdown menu

### Step 5: Enter Setup Command
1. A command input box will appear
2. Type or paste: `npm run setup-complete-db`
3. Click **"Run"** or press Enter

### Step 6: Watch the Output
1. A terminal window will open showing the command execution
2. You should see output like:
   ```
   🔧 Setting up complete database...
   
   📋 Step 1: Setting up main schema (users, jobs, files, messages)...
   ✅ Executed: CREATE TABLE IF NOT EXISTS users...
   ✅ Executed: CREATE TABLE IF NOT EXISTS jobs...
   ...
   
   📋 Step 2: Setting up admin schema (admins, password_reset_requests)...
   ✅ Executed: CREATE TABLE IF NOT EXISTS admins...
   ...
   
   📋 Step 3: Verifying tables...
   📊 Table Status:
     ✅ users
     ✅ jobs
     ✅ files
     ✅ messages
     ✅ admins
     ✅ password_reset_requests
     ✅ admin_activity_log
   
   ✅ Complete database setup successful!
   ```

### Step 7: Verify Success
- Look for the message: `✅ Complete database setup successful!`
- All tables should show `✅` status
- If you see `❌ Missing tables: ...`, there was an error

---

## Method 2: Railway CLI (Alternative)

If you have Railway CLI installed, you can run:

### Step 1: Install Railway CLI (if not installed)
```bash
npm i -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Link to Your Project
```bash
railway link
```
Select your project when prompted.

### Step 4: Run Setup Command
```bash
railway run npm run setup-complete-db
```

### Step 5: Watch Output
The command will run and show the same output as Method 1.

---

## Method 3: Direct SQL Execution (Advanced)

If the above methods don't work, you can execute SQL directly:

### Step 1: Open PostgreSQL Service
1. In Railway Dashboard, find your **PostgreSQL** service
2. Click on it

### Step 2: Open Query Editor
1. Click on the **"Query"** tab
2. Or use the **"Connect"** button to get connection details

### Step 3: Run SQL Files
1. Copy contents from `lib/db-schema.sql`
2. Paste into Query editor
3. Click **"Run"**
4. Repeat for `lib/db-schema-admin.sql`

---

## Verification After Setup

### Option 1: Use Diagnostic Endpoint
Visit in your browser:
```
https://www.thesupport.agency/api/test-login
```

This will show:
- ✅ Database connection status
- ✅ All tables that exist
- ❌ Missing tables (if any)
- Sample users, agents, and admins

### Option 2: Test Login Pages

**Admin Login:**
- URL: `https://www.thesupport.agency/admin-panel/login`
- Username: `admin`
- Password: `Admin123!`

**Agent Login:**
- URL: `https://www.thesupport.agency/agent-login`
- Email: `agent@thesupport.in`
- Password: `Support123!`

**User Login:**
- URL: `https://www.thesupport.agency/auth/signin`
- Use any user credentials

---

## Troubleshooting

### Issue: "Command not found"
**Solution:** Make sure you're running the command in the **Web App Service**, not the PostgreSQL service.

### Issue: "Database connection failed"
**Check:**
1. Railway Dashboard → PostgreSQL Service → Is it running? (should show green)
2. Railway Variables → `DATABASE_URL` is set correctly
3. Connection string format: `postgresql://postgres:PASSWORD@postgres.railway.internal:5432/railway`

### Issue: "Permission denied" or "relation does not exist"
**Solution:**
1. Make sure PostgreSQL service is running
2. Check that `DATABASE_URL` uses the correct database name (`railway`)
3. Try running the setup command again

### Issue: "npm: command not found"
**Solution:**
1. Make sure you're in the **Web App Service** (not PostgreSQL)
2. The service should have Node.js installed
3. If not, Railway should auto-detect from `package.json`

### Issue: Tables already exist warnings
**Status:** This is normal! The script uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times.

---

## Expected Output (Success)

```
🔧 Setting up complete database...

📋 Step 1: Setting up main schema (users, jobs, files, messages)...
✅ Executed: CREATE TABLE IF NOT EXISTS users...
✅ Executed: CREATE TABLE IF NOT EXISTS jobs...
✅ Executed: CREATE TABLE IF NOT EXISTS files...
✅ Executed: CREATE TABLE IF NOT EXISTS messages...
⚠️  Already exists: CREATE INDEX IF NOT EXISTS idx_users_email...
... (more indexes)

📋 Step 2: Setting up admin schema (admins, password_reset_requests)...
✅ Executed: CREATE TABLE IF NOT EXISTS admins...
✅ Executed: CREATE TABLE IF NOT EXISTS password_reset_requests...
✅ Executed: CREATE TABLE IF NOT EXISTS admin_activity_log...
⚠️  Already exists: CREATE INDEX IF NOT EXISTS idx_admins_username...

📋 Step 3: Verifying tables...
📊 Table Status:
  ✅ users
  ✅ jobs
  ✅ files
  ✅ messages
  ✅ admins
  ✅ password_reset_requests
  ✅ admin_activity_log

📋 Step 4: Verifying default data...
  ✅ Users: 2
  ✅ Admins: 1

✅ Complete database setup successful!

📝 Login Credentials:
─────────────────────────────────────
Admin Panel:
  URL: /admin-panel/login
  Username: admin
  Password: Admin123!

Agent Login:
  URL: /agent-login
  Email: agent@thesupport.in
  Password: Support123!

User Login:
  URL: /auth/signin
  Email: (any user email)
  Password: (set by admin)

⚠️  Change default passwords after first login!
```

---

## Quick Reference

**Command to run:**
```bash
npm run setup-complete-db
```

**Where to run:**
- Railway Dashboard → Your Web App Service → Deployments → Latest → Run Command

**Time to complete:**
- Usually 10-30 seconds

**Can run multiple times?**
- Yes! It's safe to run multiple times (uses `IF NOT EXISTS`)

**What it creates:**
- ✅ `users` table
- ✅ `jobs` table
- ✅ `files` table
- ✅ `messages` table (NEW)
- ✅ `admins` table (NEW)
- ✅ `password_reset_requests` table (NEW)
- ✅ `admin_activity_log` table (NEW)

---

## Next Steps After Setup

1. ✅ Test admin login: `/admin-panel/login`
2. ✅ Test agent login: `/agent-login`
3. ✅ Test user login: `/auth/signin`
4. ✅ Check diagnostics: `/api/test-login`
5. ✅ Verify all tables: Visit `/api/test-login` endpoint

---

**Need help?** Check the diagnostic endpoint first: `https://www.thesupport.agency/api/test-login`

