# Fix: Login Pages Not Working

## Problem

Admin panel, user login, and agent login pages are not responding.

## Root Causes

### 1. Missing Database Tables
Based on Railway configuration:
- ✅ Tables exist: `files`, `jobs`, `users`, `test_table`
- ❌ Missing: `messages` table (needed for text messages)
- ❌ Missing: `admins` table (needed for admin login)
- ❌ Missing: `password_reset_requests` table
- ❌ Missing: `admin_activity_log` table

### 2. Database Connection Issues
- Database might not be accessible
- Connection string might be incorrect
- Tables might exist but have wrong structure

## Solution

### Step 1: Run Complete Database Setup

**In Railway Dashboard:**
1. Go to your Web App Service
2. Click **"Deployments"** tab
3. Click **"..."** (three dots) on latest deployment
4. Click **"Run Command"**
5. Enter: `npm run setup-complete-db`
6. Click **"Run"**

**OR via Railway CLI:**
```bash
railway run npm run setup-complete-db
```

This will create:
- ✅ `users` table (if missing)
- ✅ `jobs` table (if missing)
- ✅ `files` table (if missing)
- ✅ `messages` table (NEW)
- ✅ `admins` table (NEW)
- ✅ `password_reset_requests` table (NEW)
- ✅ `admin_activity_log` table (NEW)

### Step 2: Verify Database Setup

**Check tables:**
```bash
railway run npm run verify-db
```

**Or visit diagnostic endpoint:**
- `https://www.thesupport.agency/api/test-login`
- This will show which tables exist and which are missing

### Step 3: Test Login Endpoints

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
- Email: (any user email)
- Password: (set by admin)

## Diagnostic Endpoints

### 1. Test Login Endpoint
```
GET /api/test-login
```
Shows:
- Database connection status
- Tables that exist
- Missing tables
- Sample users, agents, admins

### 2. Health Endpoint
```
GET /api/health
```
Shows:
- Database connection
- Table existence
- Missing tables

### 3. Status Endpoint
```
GET /api/status
```
Shows:
- Server status
- Database connection
- NextAuth configuration

## Common Issues

### Issue 1: "Admins table does not exist"
**Solution:**
```bash
npm run setup-admin-db
```

### Issue 2: "Messages table does not exist"
**Solution:**
```bash
npm run setup-db
```

### Issue 3: "Database connection failed"
**Check:**
1. Railway Dashboard → PostgreSQL Service → Is it running?
2. Railway Variables → `DATABASE_URL` is set?
3. Connection string format is correct?

### Issue 4: "Invalid credentials"
**Check:**
1. Admin exists? Visit `/api/test-login` to see admins
2. Password correct? Default: `Admin123!`
3. User/agent exists? Check database

## Quick Fix Commands

```bash
# Setup everything (users, agents, admins, messages)
npm run setup-complete-db

# Verify setup
npm run verify-db

# Check login diagnostics
# Visit: https://www.thesupport.agency/api/test-login
```

## Expected Tables After Setup

1. ✅ `users` - User and agent accounts
2. ✅ `jobs` - Job assignments
3. ✅ `files` - Uploaded files
4. ✅ `messages` - Text messages
5. ✅ `admins` - Admin accounts
6. ✅ `password_reset_requests` - Password reset requests
7. ✅ `admin_activity_log` - Admin activity log

## Default Credentials (After Setup)

**Admin:**
- Username: `admin`
- Password: `Admin123!`
- URL: `/admin-panel/login`

**Agent:**
- Email: `agent@thesupport.in`
- Password: `Support123!`
- URL: `/agent-login`

**User:**
- Email: (created by admin)
- Password: (set by admin)
- URL: `/auth/signin`

---

**After running `npm run setup-complete-db`, all login pages should work!**

