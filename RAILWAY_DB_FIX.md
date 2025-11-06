# Railway Database Configuration Fix

## Quick Fix Steps

### Step 1: Add PostgreSQL Database in Railway

1. Go to [Railway Dashboard](https://railway.app)
2. Select your project
3. Click **"+ New"** (top right)
4. Select **"Database"** → **"Add PostgreSQL"**
5. Wait 30-60 seconds for database to provision

### Step 2: Verify DATABASE_URL is Set

1. Click on your **app service** (not PostgreSQL service)
2. Go to **"Variables"** tab
3. Look for `DATABASE_URL` - it should be automatically added

**If DATABASE_URL is missing:**
- Go to PostgreSQL service → Variables tab
- Copy the `DATABASE_URL` or `PGDATABASE_URL` value
- Go to app service → Variables → New Variable
- Name: `DATABASE_URL`
- Value: Paste the connection string
- Click "Add"

### Step 3: Initialize Database Tables

**Option A: Via Railway Dashboard (Recommended)**
1. App service → **"Deployments"** tab
2. Click latest deployment → **"..."** → **"Run Command"**
3. Enter: `npm run setup-db`
4. Click **"Run"**
5. Wait for completion (check logs)

**Option B: Via Railway SQL Editor**
1. PostgreSQL service → **"Query"** tab
2. Copy contents of `lib/db-schema.sql`
3. Paste and execute

### Step 4: Verify Database Health

Visit: `https://your-app.railway.app/api/health/db`

Should show:
```json
{
  "status": "healthy",
  "checks": {
    "databaseUrl": true,
    "connection": true,
    "tables": ["files", "jobs", "messages", "users"],
    "usersCount": 5,
    "agentsCount": 5
  }
}
```

### Step 5: Add Users/Agents

**Via API (if authenticated as agent):**
```bash
POST /api/admin/users
{
  "email": "newuser@example.com",
  "name": "New User",
  "role": "user",
  "company": "Company Name",
  "address": "Address",
  "phone": "+1234567890"
}
```

**Or use the setup script:**
```bash
railway run npm run setup-db
```

## Troubleshooting

### Error: "DATABASE_URL not configured"

**Solution:**
1. Add PostgreSQL database in Railway
2. Verify `DATABASE_URL` appears in app service Variables
3. Redeploy app service

### Error: "Database connection failed"

**Check:**
1. PostgreSQL service is running (green status)
2. `DATABASE_URL` format is correct
3. SSL is enabled (Railway requires SSL)

### Error: "Database tables not initialized"

**Solution:**
1. Run: `npm run setup-db` in Railway
2. Or execute `lib/db-schema.sql` manually

### Error: "User already exists"

**Solution:**
- The user with that email already exists
- Use update endpoint or different email

## API Endpoints

### Check Database Health
```
GET /api/health/db
```

### List All Users/Agents
```
GET /api/admin/users
(Requires agent/admin authentication)
```

### Create User/Agent
```
POST /api/admin/users
{
  "email": "user@example.com",
  "name": "User Name",
  "role": "user" | "agent",
  "company": "Company",
  "address": "Address",
  "phone": "+1234567890",
  "password": "optional"
}
(Requires agent/admin authentication)
```

## Test Credentials (After Setup)

**Users:**
- Email: `user1@thesupport.in`
- Password: `User123!`

**Agents:**
- Email: `agent1@thesupport.in`
- Password: `Agent123!`

## Quick Checklist

- [ ] PostgreSQL database added in Railway
- [ ] `DATABASE_URL` set in app service Variables
- [ ] Database tables initialized (`npm run setup-db`)
- [ ] Database health check passes (`/api/health/db`)
- [ ] Can create users/agents via API
- [ ] Test login works

---

**After completing these steps, you should be able to add users and agents successfully!** ✅

