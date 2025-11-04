# Quick Fix: Railway Server Configuration Error

## The Error
```
There is a problem with the server configuration.
Check the server logs for more information.
```

## Root Cause
This error means **NEXTAUTH_SECRET is missing** in Railway environment variables.

## Immediate Fix (5 minutes)

### Step 1: Generate NEXTAUTH_SECRET

**Option A: Using Command Line (if you have OpenSSL):**
```bash
openssl rand -base64 32
```

**Option B: Using Online Generator:**
1. Visit: https://generate-secret.vercel.app/32
2. Copy the generated secret

**Option C: Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 2: Add to Railway

1. Go to **Railway Dashboard** → Your Project → Your Service
2. Click **"Variables"** tab
3. Click **"New Variable"**
4. Add these variables:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `NEXTAUTH_SECRET` | (paste the secret you generated) | `aBc123XyZ789...` |
| `NEXTAUTH_URL` | Your Railway app URL | `https://your-app.railway.app` |

### Step 3: Verify Database

1. Make sure you have a **PostgreSQL service** in Railway
2. Check that **`DATABASE_URL`** is automatically set (Railway does this)
3. If not, copy it from PostgreSQL service → Variables → `DATABASE_URL`

### Step 4: Redeploy

Railway will automatically redeploy when you add variables. If not:
1. Go to **Deployments** tab
2. Click **"Redeploy"**

## Test Login

After redeploy, try logging in:
- **User**: `user1@thesupport.in` / `User123!`
- **Agent**: `agent1@thesupport.in` / `Agent123!`

## Complete Environment Variables List

For full functionality, add these (minimum required marked with ✅):

```env
# Required
NEXTAUTH_SECRET=your_generated_secret_here  ✅
NEXTAUTH_URL=https://your-app.railway.app   ✅
DATABASE_URL=postgresql://...                ✅ (auto-set by Railway)

# Optional (for password login only, these can be empty)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
RESEND_API_KEY=

# Optional (admin defaults)
ADMIN_EMAIL=agent@thesupport.in
ADMIN_PASSWORD=Support123!
```

## Still Not Working?

1. **Check Railway logs:**
   - Go to your service → Logs tab
   - Look for error messages

2. **Verify database connection:**
   - Make sure PostgreSQL service is running
   - Run database init: In Railway, add a one-off command:
     ```bash
     npm run init-db
     ```

3. **Check build logs:**
   - Make sure build succeeded
   - Check for any warnings

## Common Mistakes

❌ **Wrong variable name:** Make sure it's exactly `NEXTAUTH_SECRET` (not `NEXT_AUTH_SECRET`)

❌ **Missing NEXTAUTH_URL:** This should be your Railway app URL (e.g., `https://web-production-xxxx.up.railway.app`)

❌ **Database not linked:** Make sure PostgreSQL service is linked to your app service

✅ **Correct:** Both variables set, database linked, service redeployed

