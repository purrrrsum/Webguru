# Railway Database Setup Guide

## Quick Setup (5 minutes)

### Step 1: Add PostgreSQL Service in Railway

1. Go to **Railway Dashboard** → Your Project
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create and link the database
4. Railway automatically sets `DATABASE_URL` environment variable

### Step 2: Run Database Setup Script

**Option A: Using Railway CLI (Recommended)**

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Link your project:
   ```bash
   railway link
   ```

4. Run the setup script:
   ```bash
   railway run npm run setup-db
   ```

**Option B: Using Railway Dashboard (One-off Command)**

1. Go to Railway Dashboard → Your Service
2. Click **"Deployments"** tab
3. Click **"..."** (three dots) → **"Run Command"**
4. Enter command:
   ```bash
   npm run setup-db
   ```
5. Click **"Run"**

**Option C: Using Railway SQL Editor**

1. Go to Railway Dashboard → PostgreSQL Service
2. Click **"Query"** tab
3. Copy and paste the SQL from `lib/db-schema.sql`
4. Click **"Run"**
5. Then run the user creation script:
   ```bash
   railway run npm run create-users
   ```

### Step 3: Verify Setup

After running the script, you should see:
```
✅ Database setup completed successfully!

📋 Test Credentials:
  Users: password = User123!
  Agents: password = Agent123!

🔐 Test Accounts:
  User: user1@thesupport.in / User123!
  Agent: agent1@thesupport.in / Agent123!
```

## What the Script Does

1. **Creates Tables:**
   - `users` - User and agent accounts
   - `jobs` - Job/conversation records
   - `files` - File uploads and messages

2. **Creates Test Accounts:**
   - 5 users: `user1@thesupport.in` through `user5@thesupport.in`
   - 5 agents: `agent1@thesupport.in` through `agent5@thesupport.in`
   - All with passwords (User123! / Agent123!)

3. **Verifies Setup:**
   - Checks tables exist
   - Checks users were created
   - Verifies passwords are set

## Manual Setup (Alternative)

If you prefer to set up manually:

### 1. Create Tables

Go to Railway Dashboard → PostgreSQL → Query tab, and run:

```sql
-- Copy and paste contents of lib/db-schema.sql
```

### 2. Create Users

Run in Railway one-off command:
```bash
npm run create-users
```

## Verify Database Connection

Check that `DATABASE_URL` is set:

1. Railway Dashboard → Your App Service → Variables
2. Look for `DATABASE_URL` (should be auto-set by Railway)
3. It should look like: `postgresql://postgres:password@host:port/railway`

## Troubleshooting

### "Table does not exist" Error

**Solution:** Run the setup script:
```bash
railway run npm run setup-db
```

### "Connection refused" Error

**Solution:**
1. Check PostgreSQL service is running in Railway
2. Verify `DATABASE_URL` is set in environment variables
3. Make sure PostgreSQL service is linked to your app service

### "User already exists" Warning

**Solution:** This is normal - the script updates existing users. The warning can be ignored.

### "Password authentication failed"

**Solution:**
1. Make sure you ran the setup script
2. Verify users have passwords:
   ```sql
   SELECT email, role, 
          CASE WHEN password IS NOT NULL THEN 'Yes' ELSE 'No' END as has_password
   FROM users;
   ```
3. If passwords are missing, run:
   ```bash
   railway run npm run create-users
   ```

## Test Login After Setup

1. Visit: `https://your-app.railway.app/auth/signin`
2. Login with:
   - Email: `user1@thesupport.in`
   - Password: `User123!`
3. Or agent login:
   - Email: `agent1@thesupport.in`
   - Password: `Agent123!`

## Next Steps

After database setup:
1. ✅ Verify login works
2. ✅ Create a test job
3. ✅ Upload a file
4. ✅ Test the chat flow

## Environment Variables Checklist

Make sure these are set in Railway:

- ✅ `DATABASE_URL` (auto-set by Railway PostgreSQL)
- ✅ `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- ✅ `NEXTAUTH_URL` (your Railway app URL)

Optional:
- `GOOGLE_CLIENT_ID` (for Google login)
- `GOOGLE_CLIENT_SECRET` (for Google login)
- `RESEND_API_KEY` (for OTP emails)

