# Domain Configuration Check: www.thesupport.agency

## ✅ Current Status

The domain `www.thesupport.agency` is **referenced in the code** but needs to be **configured in Railway** to work.

---

## 📍 Where the Domain is Used in Code

### 1. **lib/auth.ts** (Line 114)
```typescript
// Production fallback: use our public Railway URI
if (process.env.NODE_ENV === 'production') {
  return 'https://www.thesupport.agency';
}
```
**Status**: ✅ Hardcoded as production fallback

### 2. **pages/api/auth/[...nextauth].ts** (Line 16)
```typescript
process.env.NEXTAUTH_URL = 'https://www.thesupport.agency';
```
**Status**: ✅ Hardcoded as fallback when no host detected

### 3. **Multiple Documentation Files**
- Referenced in deployment guides
- Used in Google OAuth redirect URI examples
- Mentioned in admin login guides

---

## ⚠️ What Needs to Be Done

### Step 1: Configure Domain in Railway

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Sign in and select your project

2. **Add Custom Domain**
   - Click on your **web service** (not database)
   - Go to **Settings** tab
   - Scroll to **"Domains"** section
   - Click **"Custom Domain"** or **"Generate Domain"**
   - Enter: `www.thesupport.agency`
   - Railway will provide DNS configuration instructions

3. **Configure DNS**
   - Go to your domain registrar (where you bought `thesupport.agency`)
   - Add the DNS records Railway provides:
     - Usually a **CNAME** record pointing to Railway
     - Or **A** record with Railway's IP address
   - Wait for DNS propagation (can take 5 minutes to 48 hours)

### Step 2: Set Environment Variable (Optional but Recommended)

1. **In Railway Dashboard**
   - Go to your service → **Variables** tab
   - Add or update:
     ```
     NEXTAUTH_URL=https://www.thesupport.agency
     ```
   - This ensures the domain is used correctly

### Step 3: Update Google OAuth (if using Google login)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com
   - Navigate to **APIs & Services** → **Credentials**
   - Edit your OAuth 2.0 Client ID

2. **Add Authorized Redirect URIs**
   - Add: `https://www.thesupport.agency/api/auth/callback/google`
   - Also keep your Railway URL: `https://your-app.up.railway.app/api/auth/callback/google`

---

## 🔍 How to Verify Domain is Working

### Test 1: Check if Domain Resolves
```bash
# In terminal/command prompt
ping www.thesupport.agency
# or
nslookup www.thesupport.agency
```

### Test 2: Check Railway Domain Status
1. Go to Railway Dashboard → Your Service → Settings → Domains
2. Check if `www.thesupport.agency` shows as **"Active"** or **"Provisioned"**

### Test 3: Visit the Domain
- Open browser: `https://www.thesupport.agency`
- Should show your Next.js app (not an error page)

### Test 4: Check API Endpoints
- `https://www.thesupport.agency/api/health` - Should return health status
- `https://www.thesupport.agency/api/status` - Should return status

---

## 🚨 Common Issues

### Issue 1: Domain Not Resolving
**Symptoms**: Browser shows "This site can't be reached" or DNS error

**Solutions**:
- Check DNS records are correctly configured
- Wait for DNS propagation (can take up to 48 hours)
- Verify domain is added in Railway Dashboard

### Issue 2: SSL Certificate Not Working
**Symptoms**: Browser shows "Not Secure" or SSL error

**Solutions**:
- Railway automatically provisions SSL certificates
- Wait a few minutes after adding domain
- Check Railway Dashboard → Domains → SSL status

### Issue 3: Domain Points to Wrong Site
**Symptoms**: Domain loads but shows wrong content or error

**Solutions**:
- Verify `NEXTAUTH_URL` is set to `https://www.thesupport.agency`
- Check Railway service is deployed and running
- Verify domain is connected to correct Railway service

### Issue 4: OAuth Redirect Errors
**Symptoms**: Google login fails with redirect URI mismatch

**Solutions**:
- Add `https://www.thesupport.agency/api/auth/callback/google` to Google OAuth settings
- Verify `NEXTAUTH_URL` is set correctly in Railway

---

## 📋 Quick Checklist

- [ ] Domain `www.thesupport.agency` added in Railway Dashboard
- [ ] DNS records configured at domain registrar
- [ ] DNS propagation completed (check with `nslookup`)
- [ ] SSL certificate provisioned (automatic by Railway)
- [ ] `NEXTAUTH_URL` environment variable set to `https://www.thesupport.agency`
- [ ] Google OAuth redirect URI updated (if using Google login)
- [ ] Domain accessible in browser: `https://www.thesupport.agency`
- [ ] API endpoints working: `/api/health`, `/api/status`

---

## 🔧 Current Code Behavior

The code will use `www.thesupport.agency` in this order:

1. **First Priority**: `NEXTAUTH_URL` environment variable
2. **Second Priority**: `RAILWAY_PUBLIC_DOMAIN` (auto-set by Railway)
3. **Third Priority**: Hardcoded fallback `https://www.thesupport.agency` (production only)

**This means**: Even if the domain isn't configured in Railway, the code will try to use it as a fallback. However, for it to actually work, you **must**:
- Configure the domain in Railway
- Set up DNS records
- Ensure Railway service is running

---

## 📞 Need Help?

If the domain still doesn't work after following these steps:

1. Check Railway deployment logs for errors
2. Verify DNS records using online tools (e.g., https://dnschecker.org)
3. Check Railway Dashboard → Domains → Status
4. Verify environment variables are set correctly

---

**Summary**: The domain `www.thesupport.agency` is **configured in code** but needs to be **set up in Railway** and **DNS** to actually work. ✅

