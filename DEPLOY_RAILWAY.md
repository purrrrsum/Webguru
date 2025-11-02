# Deploy to Railway - Complete Guide

Railway is the easiest way to deploy your Next.js app! This guide will walk you through the entire process.

## Prerequisites

1. ✅ GitHub account (free)
2. ✅ Railway account (free tier includes $5/month)
3. ✅ Your code in a Git repository (GitHub recommended)

## Step 1: Push Your Code to GitHub

If you haven't already, create a GitHub repository:

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Railway deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/thesupport-in.git
git branch -M main
git push -u origin main
```

**Or use GitHub Desktop/Web interface** to create and push your repository.

## Step 2: Sign Up for Railway

1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (recommended - easiest)
4. Authorize Railway to access your GitHub

## Step 3: Create New Project

1. After signing in, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository (`thesupport-in` or your repo name)
4. Railway will automatically detect it's a **Next.js** project!

## Step 4: Add PostgreSQL Database

Railway makes this super easy:

1. In your project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway automatically creates a PostgreSQL database!
4. The connection string is automatically set as `DATABASE_URL`

## Step 5: Configure Environment Variables

1. Go to your project → **Variables** tab
2. Click **"New Variable"**
3. Add each variable:

```
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://your-app-name.up.railway.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=agent@thesupport.in
ADMIN_PASSWORD=Support123!
NEXT_PUBLIC_BASE_URL=https://your-app-name.up.railway.app
NODE_ENV=production
```

**Important:**
- `DATABASE_URL` is **automatically set** by Railway (don't add manually)
- Generate `NEXTAUTH_SECRET`: Run `openssl rand -base64 32` locally
- `NEXTAUTH_URL` will be your Railway domain initially (you can change later)

## Step 6: Initialize Database

After Railway deploys, you need to initialize the database schema:

### Option A: Using Railway CLI (Recommended)

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Link to your project:**
   ```bash
   railway link
   # Select your project
   ```

4. **Run database initialization:**
   ```bash
   railway run npx tsx scripts/init-db.ts
   ```

### Option B: Using Railway Web Interface

1. Go to your PostgreSQL service in Railway
2. Click **"Query"** tab
3. Copy contents of `lib/db-schema.sql`
4. Paste and click **"Run"**

### Option C: Using Railway Database Tab

1. Click on your PostgreSQL database service
2. Go to **"Data"** tab
3. Use the SQL editor to run `lib/db-schema.sql`

## Step 7: Deploy!

Railway automatically deploys when you:
- Push to GitHub (if connected)
- Or manually trigger deployment

**First deployment:**
1. Railway will detect `package.json`
2. Automatically run `npm install`
3. Run `npm run build` (from `package.json` scripts)
4. Start the app

**Check deployment status:**
- Go to **"Deployments"** tab
- Watch the build logs in real-time
- Wait for "Deploy Succeeded" ✅

## Step 8: Get Your App URL

1. After deployment, Railway gives you a URL:
   - Format: `https://your-app-name.up.railway.app`
2. **Copy this URL** - you'll need it!

## Step 9: Update Environment Variables

Now that you have your Railway URL:

1. Go to **Variables** tab
2. Update:
   ```
   NEXTAUTH_URL=https://your-app-name.up.railway.app
   NEXT_PUBLIC_BASE_URL=https://your-app-name.up.railway.app
   ```
3. Railway will **automatically redeploy** when you update variables

## Step 10: Configure Custom Domain (Optional)

To use `thesupport.agency`:

1. Go to your project → **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Enter: `thesupport.agency`
4. Railway will provide DNS records:
   - Add **CNAME** record pointing to Railway's provided domain
5. Railway automatically handles SSL certificate! 🔒

**In your domain registrar (Hostinger):**
- Add CNAME: `@` → `your-app.up.railway.app`
- Or A record: `@` → Railway's IP (provided)

## Step 11: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URI:
   ```
   https://your-app-name.up.railway.app/api/auth/callback/google
   https://thesupport.agency/api/auth/callback/google  (if using custom domain)
   ```

## Step 12: File Storage Setup

Railway uses ephemeral storage, so files uploaded to `public/uploads/` will be lost on redeploy.

### Option A: Use Railway Volumes (Persistent Storage)

1. In your project, click **"+ New"** → **"Volume"**
2. Mount to: `/app/public/uploads`
3. Now files persist across deployments!

### Option B: Use External Storage (Recommended for Production)

Consider using:
- **AWS S3** (with free tier)
- **Cloudflare R2** (free tier available)
- **Railway Blob Storage** (if available)

Update `lib/file-storage.ts` accordingly.

## Step 13: Monitor Your App

**Railway Dashboard shows:**
- Real-time logs
- Deployments history
- Resource usage
- Database queries

**Check logs:**
- Go to **"Deployments"** → Click latest deployment → **"View Logs"**

## Troubleshooting

### Build Fails

**Check logs:**
1. Go to **Deployments** → Latest → **View Logs**
2. Common issues:
   - Missing environment variables
   - Build errors in code
   - Node.js version mismatch

**Fix:**
```bash
# Check Node.js version
# Railway auto-detects, but you can specify in package.json:
"engines": {
  "node": "20.x"
}
```

### Database Connection Fails

**Check:**
1. `DATABASE_URL` is automatically set by Railway (don't override)
2. Database service is running (green status)
3. Schema initialized (run `lib/db-schema.sql`)

**Test connection:**
```bash
railway run npx tsx -e "import('./lib/db-client').then(() => console.log('Connected!'))"
```

### App Not Starting

**Check startup command:**
1. Go to **Settings** → **Service**
2. **Start Command** should be: `npm start`
3. Or Railway auto-detects from `package.json`

**Verify:**
```json
// package.json
{
  "scripts": {
    "start": "next start"
  }
}
```

### Environment Variables Not Loading

- Variables are loaded at **build time** for Next.js
- Update variables → Railway **automatically redeploys**
- Check variable names match exactly (case-sensitive)

### Out of Memory

Railway free tier has limits. If app crashes:

1. Check **Metrics** tab for memory usage
2. Optimize:
   - Reduce image sizes
   - Enable Next.js image optimization
   - Use external storage for files

## Railway CLI Commands (Useful)

```bash
# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Open in browser
railway open

# Run commands
railway run npm run build

# Connect to database
railway connect postgres
```

## Cost Management

**Free Tier Limits:**
- $5 credit/month
- 500 hours runtime
- Sufficient for small projects

**Monitor usage:**
- Go to **Settings** → **Usage**
- Set spending limits
- Railway notifies before exceeding limits

**Tips to stay within free tier:**
- Use Railway volumes only when needed
- Optimize app performance
- Enable sleep on inactivity (Railway does this automatically)

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Project created from GitHub repo
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Database schema initialized
- [ ] Deployment successful
- [ ] App URL obtained
- [ ] Google OAuth redirect URI updated
- [ ] Custom domain configured (optional)
- [ ] File storage configured (volumes or external)
- [ ] Test all features

## Success! 🎉

Your app should now be live at:
- Railway URL: `https://your-app-name.up.railway.app`
- Custom domain: `https://thesupport.agency` (if configured)

**Next Steps:**
- Test all features (login, upload, chat)
- Monitor logs for any errors
- Set up backups for database (Railway has automatic backups on paid plans)

---

## Additional Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app

---

**Need Help?** Railway has excellent community support and documentation!

