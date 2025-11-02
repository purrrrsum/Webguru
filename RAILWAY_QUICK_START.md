# Railway Quick Start (5 Minutes)

## Super Fast Deployment

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for Railway"
git remote add origin https://github.com/yourusername/thesupport-in.git
git push -u origin main
```

### Step 2: Deploy to Railway

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select your repo**
5. **Add PostgreSQL:**
   - Click **"+ New"** → **"Database"** → **"PostgreSQL"**

### Step 3: Add Environment Variables

Go to **Variables** tab, add:

```
NEXTAUTH_SECRET=(generate with: openssl rand -base64 32)
NEXTAUTH_URL=https://your-app.up.railway.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=agent@thesupport.in
ADMIN_PASSWORD=Support123!
NEXT_PUBLIC_BASE_URL=https://your-app.up.railway.app
```

**Note:** `DATABASE_URL` is automatically set by Railway! ✅

### Step 4: Initialize Database

**Option A: Railway CLI**
```bash
npm install -g @railway/cli
railway login
railway link
railway run npx tsx scripts/init-db.ts
```

**Option B: Railway Web Interface**
1. Go to PostgreSQL service
2. Click **"Query"** tab
3. Paste contents of `lib/db-schema.sql`
4. Click **"Run"**

### Step 5: Done! 🎉

Your app is live at: `https://your-app.up.railway.app`

Railway automatically:
- ✅ Detects Next.js
- ✅ Runs `npm install`
- ✅ Runs `npm run build`
- ✅ Starts with `npm start`
- ✅ Provides SSL certificate
- ✅ Handles scaling

### Custom Domain (Optional)

1. **Settings** → **Domains** → **Custom Domain**
2. Enter: `thesupport.agency`
3. Add CNAME record in your DNS:
   - `@` → `your-app.up.railway.app`

### File Storage

Railway volumes are ephemeral. For persistent storage:

1. **Add Volume:**
   - **"+ New"** → **"Volume"**
   - Mount: `/app/public/uploads`

**Or** use external storage (AWS S3, Cloudflare R2) for production.

---

## Troubleshooting

**Build fails?**
- Check **Deployments** → **View Logs**
- Ensure all environment variables are set

**Database not connecting?**
- `DATABASE_URL` is auto-set by Railway (don't override)
- Ensure schema is initialized

**Need help?**
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

---

**That's it! Your app is live in ~5 minutes!** 🚀

