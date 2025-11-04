# Pre-Deployment Checklist for thesupport.agency

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
- [ ] `NEXTAUTH_SECRET` - Generated (`openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - Set to your app URL (e.g., `https://your-app.railway.app`)
- [ ] `DATABASE_URL` - PostgreSQL connection string (auto-provided by Railway)
- [ ] `GOOGLE_CLIENT_ID` - Optional (for Google login)
- [ ] `GOOGLE_CLIENT_SECRET` - Optional (for Google login)
- [ ] `RESEND_API_KEY` - Optional (for OTP emails)
- [ ] `ADMIN_EMAIL` - Optional (default: agent@thesupport.in)
- [ ] `ADMIN_PASSWORD` - Optional (default: Support123!)

### 3. Google OAuth Configuration

- [ ] Created OAuth 2.0 Client ID in Google Cloud Console (optional)
- [ ] Added authorized redirect URIs:
  - `https://your-domain.com/api/auth/callback/google`
  - `https://your-app.railway.app/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google` (for local dev)

### 4. Resend Email Setup

- [ ] Created Resend account
- [ ] Generated API key
- [ ] (Optional) Verified domain for production emails
- [ ] Tested OTP email sending

### 5. Database Setup

- [ ] PostgreSQL database created (Railway/Hostinger)
- [ ] Database connection string (`DATABASE_URL`) is set
- [ ] Database schema initialized (`npm run setup-db`)
- [ ] Test users and agents created
- [ ] Verified database connection works

### 6. Domain Configuration (Optional)

- [ ] Domain is accessible
- [ ] DNS configured (if using custom domain)
- [ ] SSL certificate configured (auto by Railway/Hostinger)

---

## 🚀 Deployment Steps

### Step 1: Deploy to Railway

```bash
# Install Railway CLI (if not installed)
npm i -g @railway/cli

# Login to Railway
railway login

# Link project
railway link

# Deploy
railway up
```

Or use Railway Dashboard:
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repository

### Step 2: Add PostgreSQL Database

1. Railway Dashboard → Your Project
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway automatically sets `DATABASE_URL`

### Step 3: Configure Environment Variables

1. Railway Dashboard → Your Service
2. Go to **Variables** tab
3. Add all required variables (see above)
4. Railway automatically redeploys

### Step 4: Setup Database

1. Railway Dashboard → Your Service
2. Click **"Deployments"** → **"..."** → **"Run Command"**
3. Enter: `npm run setup-db`
4. Click **"Run"**

### Step 5: Configure Domain (Optional)

1. Railway Dashboard → Your Service → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

### Step 6: Update Google OAuth (if using Google login)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. Edit OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://your-domain.com/api/auth/callback/google
   https://your-app.railway.app/api/auth/callback/google
   ```

### Step 7: Redeploy

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

Test each feature on your deployed URL:

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
- Verify `public/uploads` directory exists and is writable
- Check file permissions on server
- Verify file size is ≤20MB

### If OTP emails don't send:
- Check `RESEND_API_KEY` is valid
- Verify domain in Resend dashboard
- Check spam folder
- Review Resend logs

### If Google OAuth fails:
- Verify redirect URI matches exactly
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Ensure `NEXTAUTH_URL` matches your deployment URL

---

## 📝 Important Notes

### Data Persistence

**✅ This project uses PostgreSQL for data storage:**
- All data is stored in PostgreSQL database
- Data persists across deployments
- Run `npm run setup-db` to initialize schema and test data

---

## 🎯 Next Steps After Deployment

1. **Monitor Performance**: Check Railway/Hostinger analytics
2. **Set up Error Tracking**: Add Sentry or similar
3. **Add Analytics**: Google Analytics or similar
4. **Backup Strategy**: Implement database backup (Railway/Hostinger usually provide this)
5. **Security Review**: Enable rate limiting, review auth flows
6. **Domain SSL**: Railway/Hostinger handles this automatically

---

## 📞 Quick Reference

- **Railway Dashboard**: https://railway.app
- **Google Cloud Console**: https://console.cloud.google.com
- **Resend Dashboard**: https://resend.com/dashboard
- **Project Repo**: https://github.com/purrrrsum/Webguru

---

**Ready to deploy?** Follow the steps above and refer to [RAILWAY_DB_SETUP.md](./RAILWAY_DB_SETUP.md) for detailed instructions.

