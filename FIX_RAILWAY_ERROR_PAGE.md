# Fix: Railway Error Page (Request ID Displayed)

## Problem

Website showing Railway Request ID instead of actual content. This indicates:
- Server crash on startup
- Runtime error preventing page load
- Missing dependencies or environment variables
- Database connection failure
- Port configuration issue

## Common Causes & Fixes

### 1. Standalone Build Issues

**Issue:** Standalone output might be missing dependencies

**Fix:** Ensure all dependencies are properly included

### 2. Database Connection Error

**Issue:** `DATABASE_URL` not set or database not accessible

**Fix:** 
- Check Railway Variables → `DATABASE_URL` is set
- Verify PostgreSQL service is running
- Check connection string format

### 3. Missing Environment Variables

**Issue:** Required env vars missing causing runtime crash

**Fix:** Ensure these are set:
- `NEXTAUTH_SECRET` (required)
- `DATABASE_URL` (required)
- `NEXTAUTH_URL` (optional, auto-set)

### 4. Port Configuration

**Issue:** Server not binding to correct port

**Fix:** Next.js auto-detects PORT from Railway, but verify

### 5. Build/Runtime Errors

**Issue:** TypeScript errors or missing files in production

**Fix:** Check Railway build logs for errors

## Diagnostic Steps

1. **Check Railway Logs:**
   - Railway Dashboard → Your Service → Logs
   - Look for error messages before "Request ID"

2. **Check Build Logs:**
   - Railway Dashboard → Deployments → Latest → Build Logs
   - Ensure build completes successfully

3. **Verify Environment Variables:**
   - Railway Dashboard → Variables tab
   - Ensure all required variables are set

4. **Test Database Connection:**
   - Railway Dashboard → Run Command
   - Run: `npm run verify-db`

## Quick Fixes

### Fix 1: Add Error Handling

Add try-catch in critical paths to prevent crashes.

### Fix 2: Verify Database Connection

Ensure database connection doesn't crash the server if it fails.

### Fix 3: Check Port Binding

Next.js should auto-detect PORT, but verify it's working.

## Next Steps

1. Check Railway logs for specific error
2. Verify all environment variables
3. Test database connection
4. Check if build completes successfully
5. Verify standalone server.js is created

