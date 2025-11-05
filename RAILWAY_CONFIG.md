# Railway Configuration Reference

## 🚨 IMPORTANT: Keep This File Secure

**DO NOT commit database credentials or secrets to Git!**

## 🛤️ Live URLs

**App URL:** `https://your-app.up.railway.app`  
**Replace with your actual Railway app URL**

## 🔑 Environment Variables (Set in Railway Dashboard)

### Required Variables

1. **NEXTAUTH_SECRET**
   - Generate: `openssl rand -base64 32`
   - Or use: https://generate-secret.vercel.app/32
   - Set in Railway → Variables → `NEXTAUTH_SECRET`

2. **NEXTAUTH_URL**
   - Your Railway app URL
   - Example: `https://your-app.up.railway.app`
   - Set in Railway → Variables → `NEXTAUTH_URL`

3. **DATABASE_URL**
   - Automatically provided by Railway PostgreSQL
   - Should appear automatically when you add PostgreSQL service
   - Format: `postgresql://user:password@host:port/database`

### Optional Variables

- `GOOGLE_CLIENT_ID` - Only if using Google login
- `GOOGLE_CLIENT_SECRET` - Only if using Google login
- `RESEND_API_KEY` - Only if using OTP emails
- `ADMIN_EMAIL` - Optional (defaults to `agent@thesupport.in`)
- `ADMIN_PASSWORD` - Optional (defaults to `Support123!`)

## 🗄️ Database Connection

**Database URL is automatically set by Railway** when you add PostgreSQL service.

**To find your database connection string:**
1. Railway Dashboard → PostgreSQL Service
2. Go to **"Variables"** tab
3. Look for `DATABASE_URL` or `PGDATABASE_URL`
4. Copy it (but don't share it publicly!)

## ⏰ Database Timezone

If you need to set timezone:
```sql
SET TIME ZONE 'Asia/Kolkata';
```

Run this in Railway → PostgreSQL → Query tab, or in your database initialization script.

## 🛠️ Build Commands

Railway automatically runs:
- `npm run build` (during build)
- `npm start` (at runtime)

Configured in `railway.json`.

## 📊 Project Structure

This is a Next.js 14 application with:
- App Router
- TypeScript
- Tailwind CSS
- PostgreSQL database
- NextAuth.js authentication

## 💡 Best Practices

- ✅ Always use `process.env.NEXTAUTH_URL` (never hard-code URLs)
- ✅ Never hard-code ports (use Railway's default)
- ✅ Use environment variables for all secrets
- ✅ Keep database credentials secure (never commit to Git)
- ✅ Use Railway's automatic `DATABASE_URL` (don't set manually)

## 🔒 Security Checklist

- [ ] Database connection string is NOT in code
- [ ] All secrets are in Railway Variables (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] No credentials in any committed files
- [ ] `NEXTAUTH_SECRET` is a strong random string

---

**⚠️ WARNING:** If you see database credentials in any file, remove them immediately and rotate the password!

