# Railway Setup - Quick Reference

## ✅ Current Status

Based on your Railway configuration, here's what you need to set up:

## 🔑 Environment Variables to Add in Railway

Go to **Railway Dashboard → Your Service (webguru) → Variables** tab:

### 1. NEXTAUTH_SECRET (REQUIRED)
- **Generate:** Visit https://generate-secret.vercel.app/32
- **Or run:** `openssl rand -base64 32`
- **Add to Railway:** Variable name = `NEXTAUTH_SECRET`, Value = (paste generated secret)

### 2. NEXTAUTH_URL (REQUIRED)
- **Get your Railway URL:**
  1. Railway Dashboard → Your Service
  2. Go to **Settings** tab → **Domains** section
  3. Or check **Deployments** tab (URL shown there)
- **Format:** `https://your-app-name.up.railway.app`
- **Add to Railway:** Variable name = `NEXTAUTH_URL`, Value = (your Railway URL)

### 3. DATABASE_URL (AUTO-SET)
- ✅ Already configured automatically by Railway
- No need to add manually - Railway sets it when you add PostgreSQL

### 4. DB_TIMEZONE (OPTIONAL)
- **Set timezone for database connections**
- **Add to Railway:** Variable name = `DB_TIMEZONE`, Value = `Asia/Kolkata`
- **Or:** Set in database directly: `SET TIME ZONE 'Asia/Kolkata';`

## 📋 Checklist

- [x] PostgreSQL database added in Railway
- [x] `DATABASE_URL` automatically set
- [ ] `NEXTAUTH_SECRET` added (generate and add)
- [ ] `NEXTAUTH_URL` added (your Railway app URL)
- [ ] Database schema initialized (`npm run setup-db`)
- [ ] Test users created (`npm run create-users`)

## 🚀 After Adding Variables

1. Railway will auto-redeploy
2. Wait for deployment to complete
3. Test: https://www.thesupport.agency/auth/signin
4. Click "👤 Access as User" - should work!

## 🔍 Find Your Railway App URL

**Method 1:**
- Railway Dashboard → Your Service → Settings → Domains

**Method 2:**
- Railway Dashboard → Your Service → Deployments
- Click on any deployment
- URL is shown in deployment details

**Method 3:**
- Railway Dashboard → Your Service (main page)
- URL is usually shown at the top

---

**That's it! Just add those 2 variables and you're done!** ✅

