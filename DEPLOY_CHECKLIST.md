# Pre-Deployment Checklist for rant.zone

Use this checklist before deploying to ensure everything works correctly.

## ✅ Before Deployment

### 1. Code Preparation
- [ ] All code committed to Git
- [ ] `.env.local` file is NOT committed (in `.gitignore`)
- [ ] `npm run build` succeeds locally
- [ ] No TypeScript errors
- [ ] No linting errors

### 2. Environment Variables Setup

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Required Variables:**
- [ ] `NEXTAUTH_SECRET` - Generated
- [ ] `NEXTAUTH_URL` - Set to `https://rant.zone`
- [ ] `GOOGLE_CLIENT_ID` - From Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- [ ] `RESEND_API_KEY` - From Resend Dashboard
- [ ] `BLOB_READ_WRITE_TOKEN` - From Vercel Blob Storage
- [ ] `ADMIN_EMAIL` - Optional (default: agent@thesupport.in)
- [ ] `ADMIN_PASSWORD` - Optional (default: Support123!)

### 3. Google OAuth Configuration

- [ ] Created OAuth 2.0 Client ID in Google Cloud Console
- [ ] Added authorized redirect URIs:
  - `https://rant.zone/api/auth/callback/google`
  - `https://www.rant.zone/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google` (for local dev)

### 4. Resend Email Setup

- [ ] Created Resend account
- [ ] Generated API key
- [ ] (Optional) Verified domain `rant.zone` for production emails
- [ ] Tested OTP email sending

### 5. Vercel Blob Storage

- [ ] Created Vercel account
- [ ] Enabled Blob Storage in Vercel Dashboard
- [ ] Copied `BLOB_READ_WRITE_TOKEN`
- [ ] Verified storage is accessible

### 6. Domain Configuration (rant.zone)

- [ ] Domain `rant.zone` is accessible
- [ ] DNS access (to add Vercel records)
- [ ] SSL certificate will be auto-provisioned by Vercel

---

## 🚀 Deployment Steps

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (first time) or Yes (if exists)
- **Project name?** → `thesupport-in` or your choice
- **Directory?** → `./`

### Step 2: Configure Environment Variables

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all variables listed above
5. Select environments: **Production**, **Preview**, **Development**

### Step 3: Enable Blob Storage

1. Vercel Dashboard → Your Project
2. Go to **Storage** tab
3. Click **Create Database** → Select **Blob**
4. Copy the token (if not auto-added to env vars)

### Step 4: Configure Domain

1. Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add domain: `rant.zone`
3. Add domain: `www.rant.zone`
4. Follow DNS instructions:
   - Add A record or CNAME pointing to Vercel
   - Wait for DNS propagation (can take up to 48 hours)

### Step 5: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. Edit OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://rant.zone/api/auth/callback/google
   https://www.rant.zone/api/auth/callback/google
   ```

### Step 6: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click **⋮** (three dots) on latest deployment
3. Click **Redeploy**

OR trigger new deployment via:
```bash
vercel --prod
```

---

## ✅ Post-Deployment Testing

Test each feature on `https://rant.zone`:

### Authentication
- [ ] User can sign in with Google OAuth
- [ ] User can request OTP via email
- [ ] OTP email is received
- [ ] User can sign in with OTP
- [ ] Agent can sign in at `/admin`

### Core Features
- [ ] User can create a new job
- [ ] User can upload files (test with image, PDF, video)
- [ ] File upload respects 20MB limit
- [ ] Files appear in chat with preview/download
- [ ] User can tick a file
- [ ] Agent can tick a file
- [ ] When both ticked, file can be deleted
- [ ] Job counter increments after deletion

### Profile
- [ ] User can edit profile (name, company, address, email, phone)
- [ ] Profile changes are saved
- [ ] Job count displays correctly in profile

### UI/UX
- [ ] WhatsApp-style chat bubbles display correctly
- [ ] Mobile responsive design works
- [ ] File previews work (images/videos)
- [ ] Download buttons work for all file types

---

## 🔧 Troubleshooting

### If build fails:
```bash
# Clear and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### If environment variables don't work:
- Check variable names match exactly (case-sensitive)
- Ensure variables are set for correct environment (Production/Preview)
- Redeploy after adding variables

### If file upload fails:
- Verify `BLOB_READ_WRITE_TOKEN` is correct
- Check Vercel Blob storage is enabled
- Verify file size is ≤20MB

### If OTP emails don't send:
- Check `RESEND_API_KEY` is valid
- Verify domain in Resend dashboard
- Check spam folder
- Review Resend logs

### If Google OAuth fails:
- Verify redirect URI matches exactly
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Ensure `NEXTAUTH_URL` is `https://rant.zone`

---

## 📝 Important Notes

### Data Persistence

**⚠️ Important:** JSON files in `/data` directory will NOT persist across deployments on Vercel.

**Solutions:**
1. **Use a database** (recommended for production):
   - Replace JSON files with PostgreSQL, MongoDB, or Supabase
   - Update `lib/utils.ts` to use database instead of file system

2. **Use Vercel KV or Redis** (for simple data):
   - Store user/job data in Redis
   - Update API routes accordingly

3. **Use environment variables for initial data** (quick fix):
   - Store initial data in env vars
   - Seed on first request (not ideal, but works for small data)

**For MVP/Testing:** Current JSON approach works for testing, but data resets on each deployment.

---

## 🎯 Next Steps After Deployment

1. **Monitor Performance**: Check Vercel Analytics
2. **Set up Error Tracking**: Add Sentry or similar
3. **Add Analytics**: Google Analytics or Vercel Analytics
4. **Backup Strategy**: Implement database backup (if migrated from JSON)
5. **Security Review**: Enable rate limiting, review auth flows
6. **Domain SSL**: Vercel handles this automatically

---

## 📞 Quick Reference

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com
- **Resend Dashboard**: https://resend.com/dashboard
- **Project Repo**: (Your Git repository URL)

---

**Ready to deploy?** Follow the steps above and refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

