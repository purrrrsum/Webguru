# Railway NextAuth Configuration - FIXED ✅

## 🚨 Important: NEVER Seal NEXTAUTH_URL

**NEXTAUTH_URL is NOT a secret** - it's a public URL that should be set automatically by Railway.

## ✅ Correct Setup

### 1. Railway Configuration (`railway.json`)

Railway automatically sets `NEXTAUTH_URL` using `RAILWAY_PUBLIC_DOMAIN`:

```json
{
  "deploy": {
    "variables": {
      "NEXTAUTH_URL": "https://${{RAILWAY_PUBLIC_DOMAIN}}"
    }
  }
}
```

This means you **DO NOT need to manually add NEXTAUTH_URL** in Railway Variables!

### 2. What to Seal (Mark as Secret) in Railway

**ONLY seal these sensitive values:**

- ✅ `NEXTAUTH_SECRET` - **SEAL THIS** (use the lock icon in Railway)
- ✅ `DATABASE_URL` - **SEAL THIS** (usually auto-sealed by Railway)
- ✅ `GOOGLE_CLIENT_SECRET` - **SEAL THIS** (if using Google OAuth)
- ✅ `RESEND_API_KEY` - **SEAL THIS** (if using OTP emails)

**DO NOT seal:**
- ❌ `NEXTAUTH_URL` - Public URL, not a secret
- ❌ `GOOGLE_CLIENT_ID` - Public value, not a secret
- ❌ `DB_TIMEZONE` - Public configuration

### 3. Railway Variables Setup

In Railway Dashboard → Your Service → Variables:

**Regular Variables (NOT sealed):**
- `NEXTAUTH_URL` - **Auto-set by railway.json**, don't add manually
- `GOOGLE_CLIENT_ID` - Optional (if using Google login)
- `DB_TIMEZONE` - Optional (e.g., `Asia/Kolkata`)

**Sealed Variables (Click the lock icon 🔒):**
- `NEXTAUTH_SECRET` - Generate: `openssl rand -base64 32`
- `DATABASE_URL` - Auto-provided by Railway PostgreSQL
- `GOOGLE_CLIENT_SECRET` - Optional (if using Google login)
- `RESEND_API_KEY` - Optional (if using OTP emails)

### 4. Build Command

- **Build:** `npm run build`
- **Start:** `npm start`

### 5. Database Timezone

Timezone is automatically set via `DB_TIMEZONE` environment variable:

- **Set in Railway Variables:** `DB_TIMEZONE` = `Asia/Kolkata`
- Or manually in database: `SET TIME ZONE 'Asia/Kolkata';`

## 🔍 How It Works

1. Railway automatically provides `RAILWAY_PUBLIC_DOMAIN` (e.g., `your-app.up.railway.app`)
2. `railway.json` sets `NEXTAUTH_URL = https://${{RAILWAY_PUBLIC_DOMAIN}}`
3. NextAuth uses this automatically
4. No manual configuration needed!

## ✅ Verification

After deployment, check:
- ✅ Build succeeds (no NEXTAUTH_URL errors)
- ✅ App starts without authentication errors
- ✅ Login works correctly

## 🐛 Troubleshooting

**If NEXTAUTH_URL is still missing:**
1. Check Railway Dashboard → Variables → Look for `RAILWAY_PUBLIC_DOMAIN`
2. Verify `railway.json` has the variables section
3. Redeploy to apply changes

**If you see "secrets/NEXTAUTH_URL" errors:**
- This means Railway is trying to read it as a secret file
- Solution: Remove NEXTAUTH_URL from Railway Variables (it's auto-set by railway.json)
- Or ensure it's NOT marked as a secret (no lock icon)

---

**Summary:** Let Railway auto-set NEXTAUTH_URL via railway.json. Only seal NEXTAUTH_SECRET and DATABASE_URL! 🎯

