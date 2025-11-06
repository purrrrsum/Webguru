# Railway Configuration - Current Setup

## 📊 PostgreSQL Database Service

**Service Name:** Postgres

**Connection Details:**
- **Public Host:** `shinkansen.proxy.rlwy.net:10699`
- **Private Host:** `postgres.railway.internal:5432`
- **Database Name:** `railway`
- **Username:** `postgres`
- **Password:** `RounErPuMOENHtmPQFZmUlaKyKCocZau`

**Tables:**
- ✅ `files`
- ✅ `jobs`
- ✅ `test_table`
- ✅ `users`

**Environment Variables (PostgreSQL Service):**
- `Database_public_url`: `postgresql://postgres:RounErPuMOENHtmPQFZmUlaKyKCocZau@shinkansen.proxy.rlwy.net:10699/railway`
- `DATABASE_URL`: `postgresql://postgres:RounErPuMOENHtmPQFZmUlaKyKCocZau@postgres.railway.internal:5432/railway`
- `PGDATA`: `/var/lib/postgresql/data/pgdata`
- `PGHOST`: `postgres.railway.internal`

---

## 🚀 Web Application Service

**Service Name:** webguru (or thesupport.agency)

**Source Repository:** `purrrrsum/Webguru`

**Builder:** Uses `railway.json` file

**Deploy Command:** `npm start`

**Public Networking:**
- `thesupport.agency` → Port `8080`
- `www.thesupport.agency` → Port `8080`

**Private Networking:**
- `webguru.railway.internal`

**Environment Variables (Web App Service):**
- `DATABASE_URL`: `postgresql://postgres:RounErPuMOENHtmPQFZmUlaKyKCocZau@postgres.railway.internal:5432/railway`
- `GOOGLE_CLIENT_ID`: `84042664681-85kktvter8neia5v45i08pkq0mib6896.apps.googleusercontent.com`
- `GOOGLE_CLIENT_SECRET`: `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`
- `NEXT_PUBLIC_BASE_URL`: `https://thesupport.agency.up.railway.app`
- `NEXTAUTH_SECRET`: `IFdYa72dIvkaeBiJ4Umy5Yh4Exh7UetCMDGPhYf6nqo=`
- `PGDATABASE`: `railway`
- `ADMIN_EMAIL`: (set)
- `ADMIN_PASSWORD`: (set)
- `NODE_ENV`: (set)

---

## ⚠️ Important Notes

### 1. Domain Configuration
- **Public Domain:** `www.thesupport.agency` and `thesupport.agency`
- **NEXT_PUBLIC_BASE_URL:** Points to `.up.railway.app` subdomain
- **Action Needed:** Consider updating `NEXT_PUBLIC_BASE_URL` to match public domain, or remove it and let Railway auto-detect

### 2. Database Connection
- Using **private networking** (`postgres.railway.internal`) for better performance
- Public URL available but not needed for app (internal is faster)

### 3. Port Configuration
- Public networking uses port `8080`
- Next.js typically runs on port `3000` internally
- Railway handles port mapping automatically

### 4. Missing Tables
- Database has: `files`, `jobs`, `test_table`, `users`
- **Missing:** `messages` table (for text messages)
- **Missing:** `admins` table (for admin panel)
- **Action Needed:** Run `npm run setup-db` and `npm run setup-admin-db`

---

## 🔧 Recommended Actions

### 1. Update NEXT_PUBLIC_BASE_URL
```bash
# In Railway Variables, change:
NEXT_PUBLIC_BASE_URL=https://www.thesupport.agency
# OR remove it entirely (Railway auto-detects)
```

### 2. Setup Missing Database Tables
```bash
# In Railway Dashboard → Run Command:
npm run setup-db        # Creates messages table
npm run setup-admin-db  # Creates admins table
```

### 3. Verify Database Connection
```bash
# Test connection:
npm run verify-db
```

---

## 📋 Quick Reference

**Database Connection String:**
```
postgresql://postgres:RounErPuMOENHtmPQFZmUlaKyKCocZau@postgres.railway.internal:5432/railway
```

**Public URLs:**
- Main: `https://www.thesupport.agency`
- Alt: `https://thesupport.agency`

**Admin Panel:**
- URL: `https://www.thesupport.agency/admin-panel/login`
- Default: `admin` / `Admin123!`

**Google OAuth:**
- Client ID: `84042664681-85kktvter8neia5v45i08pkq0mib6896.apps.googleusercontent.com`
- Redirect URI: `https://www.thesupport.agency/api/auth/callback/google`

---

**Last Updated:** Based on Railway configuration provided

