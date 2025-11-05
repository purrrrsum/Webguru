# Railway Environment Variables Checklist

## ✅ Current Status
- ✅ `DATABASE_URL` - Already added (good!)

## 🔴 Required Variables (Must Add)

You need to add these **2 variables** for the app to work:

### 1. NEXTAUTH_SECRET (REQUIRED)

**Why:** Required for NextAuth.js authentication to work. Without this, login will fail.

**How to Generate:**
- **Option A:** Use online generator: https://generate-secret.vercel.app/32
- **Option B:** Run in terminal: `openssl rand -base64 32`
- **Option C:** Run in PowerShell: 
  ```powershell
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```

**Add to Railway:**
1. Railway Dashboard → Your Service (webguru) → **Variables** tab
2. Click **"New Variable"**
3. Name: `NEXTAUTH_SECRET`
4. Value: Paste the generated secret (it will be a long random string)
5. Click **"Add"**

### 2. NEXTAUTH_URL (REQUIRED)

**Why:** Tells NextAuth where your app is hosted. Required for callbacks to work.

**How to Get:**
1. Railway Dashboard → Your Service (webguru)
2. Go to **"Settings"** tab
3. Look for **"Domains"** section
4. Copy your Railway URL (e.g., `https://your-app-name.up.railway.app`)
5. Or check the **"Deployments"** tab - the URL is shown there

**Add to Railway:**
1. Railway Dashboard → Your Service (webguru) → **Variables** tab
2. Click **"New Variable"**
3. Name: `NEXTAUTH_URL`
4. Value: Your Railway app URL (e.g., `https://your-app-name.up.railway.app`)
5. Click **"Add"**

## ⚪ Optional Variables (Only if needed)

These are **NOT required** for basic password login to work:

- `GOOGLE_CLIENT_ID` - Only if using Google login
- `GOOGLE_CLIENT_SECRET` - Only if using Google login
- `RESEND_API_KEY` - Only if using OTP email login
- `ADMIN_EMAIL` - Optional (defaults to `agent@thesupport.in`)
- `ADMIN_PASSWORD` - Optional (defaults to `Support123!`)

**You can skip these for now** - password login will work without them.

## 📋 Quick Checklist

In Railway Dashboard → Your Service (webguru) → Variables tab, you should have:

- [x] `DATABASE_URL` ✅ (Already added)
- [ ] `NEXTAUTH_SECRET` ⚠️ **ADD THIS**
- [ ] `NEXTAUTH_URL` ⚠️ **ADD THIS**

## 🚀 After Adding Variables

1. **Railway will auto-redeploy** (watch the Deployments tab)
2. **Wait for deployment to complete** (green checkmark ✅)
3. **Test the app:**
   - Go to: https://www.thesupport.agency/auth/signin
   - Click "👤 Access as User"
   - Should work now!

## 🔍 How to Find Your Railway App URL

**Method 1: From Settings**
1. Railway Dashboard → Your Service
2. **Settings** tab
3. Look in **"Domains"** section

**Method 2: From Deployments**
1. Railway Dashboard → Your Service
2. **Deployments** tab
3. Click on any deployment
4. Look for the URL in the deployment details

**Method 3: From Service Overview**
1. Railway Dashboard → Your Service
2. The URL is usually shown at the top of the service page

## ⚡ Quick Steps Summary

1. **Generate NEXTAUTH_SECRET:**
   - Visit: https://generate-secret.vercel.app/32
   - Copy the secret

2. **Add to Railway:**
   - Railway → Your Service → Variables
   - Add `NEXTAUTH_SECRET` = (paste secret)
   - Add `NEXTAUTH_URL` = (your Railway URL)

3. **Wait for redeploy** (automatic)

4. **Test** - Should work! ✅

---

**That's it! Just 2 more variables and you're done!**

