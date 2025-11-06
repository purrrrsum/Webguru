# Railway Setup - Important Notes

## Current Configuration

### Database
- ✅ PostgreSQL service running
- ✅ Tables: `files`, `jobs`, `users`, `test_table`
- ⚠️ Missing: `messages` table (run `npm run setup-db`)
- ⚠️ Missing: `admins` table (run `npm run setup-admin-db`)

### Web App
- ✅ Domain: `www.thesupport.agency` (port 8080)
- ✅ Environment variables configured
- ⚠️ `NEXT_PUBLIC_BASE_URL` points to `.up.railway.app` subdomain (should be `www.thesupport.agency`)

## Action Items

1. **Update NEXT_PUBLIC_BASE_URL in Railway Variables:**
   - Current: `https://thesupport.agency.up.railway.app`
   - Should be: `https://www.thesupport.agency`
   - OR: Remove it entirely (Railway auto-detects)

2. **Setup Missing Database Tables:**
   - Run: `npm run setup-db` (creates messages table)
   - Run: `npm run setup-admin-db` (creates admins table)

3. **Verify Everything Works:**
   - Check homepage: `https://www.thesupport.agency`
   - Check status: `https://www.thesupport.agency/api/status`
   - Check health: `https://www.thesupport.agency/api/health`

## Database Credentials

**Connection String (Internal):**
```
postgresql://postgres:RounErPuMOENHtmPQFZmUlaKyKCocZau@postgres.railway.internal:5432/railway
```

**Connection String (Public - for external tools):**
```
postgresql://postgres:RounErPuMOENHtmPQFZmUlaKyKCocZau@shinkansen.proxy.rlwy.net:10699/railway
```

---

**Note:** All configuration details saved in `RAILWAY_CONFIGURATION.md`

