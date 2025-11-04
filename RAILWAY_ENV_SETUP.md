# Railway Environment Variables Setup

## Required Environment Variables for Railway

The "There is a problem with the server configuration" error typically means **NEXTAUTH_SECRET** is missing.

### 1. NextAuth Configuration (REQUIRED)

```env
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=https://your-app.railway.app
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Or use this online generator:** https://generate-secret.vercel.app/32

### 2. Database Configuration (REQUIRED)

```env
DATABASE_URL=postgresql://user:password@host:port/database
# OR
POSTGRES_URL=postgresql://user:password@host:port/database
```

**If using Railway PostgreSQL:**
- Railway automatically provides `DATABASE_URL` when you add a PostgreSQL service
- Make sure it's linked to your app service

### 3. Google OAuth (Optional - for Google login)

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Note:** Can be empty strings if you're only using password login.

### 4. Resend API (Optional - for OTP emails)

```env
RESEND_API_KEY=your_resend_api_key
```

**Note:** Not required if using password login only.

### 5. Admin Configuration (Optional)

```env
ADMIN_EMAIL=agent@thesupport.in
ADMIN_PASSWORD=Support123!
```

## How to Add Environment Variables in Railway

1. **Go to your Railway project dashboard**
2. **Select your service** (the app service, not the database)
3. **Click on "Variables" tab**
4. **Click "New Variable"**
5. **Add each variable:**

   | Variable Name | Value | Required |
   |--------------|-------|----------|
   | `NEXTAUTH_SECRET` | (generate with openssl) | ✅ YES |
   | `NEXTAUTH_URL` | `https://your-app.railway.app` | ✅ YES |
   | `DATABASE_URL` | (auto-provided by Railway PostgreSQL) | ✅ YES |
   | `GOOGLE_CLIENT_ID` | (or empty string) | ⚪ Optional |
   | `GOOGLE_CLIENT_SECRET` | (or empty string) | ⚪ Optional |
   | `RESEND_API_KEY` | (or empty string) | ⚪ Optional |
   | `ADMIN_EMAIL` | `agent@thesupport.in` | ⚪ Optional |
   | `ADMIN_PASSWORD` | `Support123!` | ⚪ Optional |

## Quick Fix for Current Error

**The error is most likely due to missing `NEXTAUTH_SECRET`.**

### Step 1: Generate Secret
```bash
openssl rand -base64 32
```

### Step 2: Add to Railway
1. Railway Dashboard → Your Service → Variables
2. Add: `NEXTAUTH_SECRET` = (paste generated secret)
3. Add: `NEXTAUTH_URL` = `https://your-app.railway.app` (replace with your actual Railway URL)

### Step 3: Verify Database URL
1. Make sure PostgreSQL service is linked
2. Check that `DATABASE_URL` is set automatically
3. If not, manually add it from your PostgreSQL service settings

### Step 4: Redeploy
- Railway will automatically redeploy when you add environment variables
- Or manually trigger a redeploy

## Testing After Setup

1. **Visit your Railway app URL**
2. **Try logging in with:**
   - Email: `user1@thesupport.in`
   - Password: `User123!`
3. **Or agent login:**
   - Email: `agent1@thesupport.in`
   - Password: `Agent123!`

## Common Issues

### Issue: "There is a problem with the server configuration"
**Solution:** Add `NEXTAUTH_SECRET` environment variable

### Issue: "Database connection failed"
**Solution:** 
- Check `DATABASE_URL` is set
- Verify PostgreSQL service is running
- Make sure database tables are created (run `npm run init-db` or SQL schema)

### Issue: "Google login not working"
**Solution:** 
- Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Or use password login instead (don't need Google OAuth)

### Issue: "OTP emails not sending"
**Solution:**
- Add `RESEND_API_KEY` 
- Or use password login instead (don't need OTP)

## Minimum Required Variables (Password Login Only)

If you only want password login, you only need:

```env
NEXTAUTH_SECRET=(generated secret)
NEXTAUTH_URL=https://your-app.railway.app
DATABASE_URL=(from Railway PostgreSQL)
```

That's it! Google OAuth and Resend are optional.

