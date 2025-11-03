# Test Login Guide (Temporary Testing Mode)

Google OAuth is temporarily disabled for testing. Use the direct test login buttons.

## Test Accounts

### User Account
- **Email**: `user@example.com`
- **Login**: Click "🧪 Test Login (User)" button on `/auth/signin`
- **Role**: User
- **Name**: John Doe

### Agent Account
- **Email**: `agent@thesupport.in`
- **Login**: Click "🧪 Test Login (Agent)" button on `/agent-login`
- **Password**: `Support123!` (for password login)
- **Role**: Agent
- **Name**: Support Agent

## Quick Test Steps

### 1. Test User Login
1. Go to `http://localhost:3000/auth/signin`
2. Click **"🧪 Test Login (User)"** button
3. You should be logged in as `user@example.com`
4. Redirected to `/dashboard`

### 2. Test Agent Login
1. Go to `http://localhost:3000/agent-login`
2. Click **"🧪 Test Login (Agent)"** button
3. You should be logged in as `agent@thesupport.in`
4. Redirected to `/dashboard`

### 3. Test Full Flow
1. **As User**:
   - Login as user
   - Go to dashboard
   - Create a new job
   - Upload a file
   - Add a text message with correction requirements

2. **As Agent**:
   - Logout from user account
   - Login as agent
   - Go to dashboard
   - See the job from the user
   - Click on the job to open chat
   - Download the file
   - Upload corrected version
   - Tick the original file

3. **Complete Job**:
   - Both user and agent tick the first uploaded file
   - File should be deleted
   - Job count should increment
   - Both can see the completed job

## Database Check

Make sure these users exist in your database:

```sql
-- Check users
SELECT id, email, name, role FROM users;

-- Should show:
-- user1 | user@example.com | John Doe | user
-- agent1 | agent@thesupport.in | Support Agent | agent
```

If users don't exist, run the database schema:
```sql
-- Run lib/db-schema.sql
```

## Re-enable Google OAuth

When ready to enable Google OAuth:

1. Remove test login buttons from:
   - `app/auth/signin/page.tsx`
   - `app/agent-login/page.tsx`

2. Uncomment Google login handlers

3. Remove test-login-bypass from `lib/auth.ts`

4. Set up Google OAuth credentials (see `GOOGLE_OAUTH_SETUP.md`)

## Current Test Features

✅ Direct login (no Google OAuth needed)
✅ User login (`user@example.com`)
✅ Agent login (`agent@thesupport.in`)
✅ Full chat flow
✅ File upload/download
✅ Mutual tick system
✅ Job completion

## Known Limitations (Test Mode)

- ❌ Google OAuth disabled
- ❌ Email OTP disabled (only test login works)
- ✅ Password login for agents still works
- ✅ All other features work normally

