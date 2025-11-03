# Next Steps After GitHub Setup

Follow these steps in order to deploy your app to Railway.

## ✅ Step 1: Code is on GitHub (You just did this!)

Your repository URL should look like:
```
https://github.com/yourusername/thesupport-in
```

---

## 🚀 Step 2: Deploy to Railway (5 minutes)

### 2.1 Create Railway Account

1. Go to: **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (click GitHub button)
4. Authorize Railway to access your GitHub

### 2.2 Create New Project

1. Click **"New Project"** (big button)
2. Select **"Deploy from GitHub repo"**
3. Find and select **"thesupport-in"** (or your repo name)
4. Railway will automatically detect it's a Next.js project! ✅

### 2.3 Railway Auto-Deploys

Railway will:
- ✅ Detect `package.json`
- ✅ Run `npm install`
- ✅ Run `npm run build`
- ✅ Start the app

**First deployment takes 2-5 minutes.** Watch the logs!

---

## 🗄️ Step 3: Add PostgreSQL Database (2 minutes)

1. In your Railway project, click **"+ New"** (top right)
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway automatically creates the database!
4. **`DATABASE_URL` is automatically set** - you don't need to add it manually! ✅

---

## 🔐 Step 4: Set Environment Variables (5 minutes)

1. In Railway project, go to **"Variables"** tab
2. Click **"New Variable"** for each:

### Required Variables:

```
Variable Name: NEXTAUTH_SECRET
Value: (Generate with this command: openssl rand -base64 32)
```

**To generate NEXTAUTH_SECRET:**
- Open PowerShell or Terminal
- Run: `openssl rand -base64 32`
- Copy the output
- Paste as value

```
Variable Name: NEXTAUTH_URL
Value: https://your-app-name.up.railway.app
```
*(Get this URL from Railway dashboard after first deployment)*

```
Variable Name: GOOGLE_CLIENT_ID
Value: your_google_oauth_client_id
```

```
Variable Name: GOOGLE_CLIENT_SECRET
Value: your_google_oauth_client_secret
```

```
Variable Name: RESEND_API_KEY
Value: your_resend_api_key
```

**🔑 How to Get Resend API Key:**
1. Go to https://resend.com and sign up for a free account (or sign in)
2. Navigate to https://resend.com/api-keys
3. Click **"Create API Key"**
4. Give it a name (e.g., "Railway Production" or "thesupport.agency")
5. Select **"Sending access"** permission (recommended for security)
6. **Copy the API key immediately** - it's only shown once!
7. Paste it as the value for `RESEND_API_KEY` above

**Note:** Resend free tier includes 3,000 emails/month and 100 emails/day

```
Variable Name: ADMIN_EMAIL
Value: agent@thesupport.in
```

```
Variable Name: ADMIN_PASSWORD
Value: Support123!
```

```
Variable Name: NEXT_PUBLIC_BASE_URL
Value: https://your-app-name.up.railway.app
```

```
Variable Name: NODE_ENV
Value: production
```

**Important:**
- Don't add `DATABASE_URL` - Railway sets it automatically!
- Railway will **auto-redeploy** when you add/update variables
- Wait for the deployment to complete after adding variables

---

## 📊 Step 5: Initialize Database Schema (5 minutes)

After Railway deploys successfully, initialize the database:

### Option A: Using Railway CLI with Connection String (Recommended)

1. **Get Database Connection String:**
   - Click on your **PostgreSQL** service in Railway
   - Go to **"Variables"** tab
   - Find and copy the `DATABASE_URL` or `PGDATABASE_URL` value
   - It looks like: `postgresql://user:password@host:port/database`

2. **Use psql (if installed) or an online tool:**
   
   **Option A1: Using psql command (if you have PostgreSQL client installed)**
   ```powershell
   # In PowerShell, replace <DATABASE_URL> with your actual connection string
   $env:PGPASSWORD="your_password"; psql "<DATABASE_URL>"
   # Then paste the SQL from lib/db-schema.sql
   ```
   
   **Option A2: Using online PostgreSQL client**
   - Visit: https://adminer.org or https://www.pgadmin.org/ (for web access)
   - Or download: https://www.pgadmin.org/download/ (pgAdmin) or TablePlus
   - Connect using your Railway `DATABASE_URL`
   - Open SQL Query tool and paste contents from `lib/db-schema.sql`
   - Execute

### Option B: Using Railway CLI (Alternative Method)

1. **Install Railway CLI:**
   ```powershell
   npm install -g @railway/cli
   ```

2. **Login:**
   ```powershell
   railway login
   ```
   (Opens browser to authenticate)

3. **Connect to your project:**
   ```powershell
   cd D:\Webguru
   railway link
   ```
   (Select your Railway project)

4. **Connect to PostgreSQL:**
   ```powershell
   railway connect postgres
   ```
   This will open a psql session connected to your Railway database.

5. **Run the schema:**
   - Copy the entire contents of `lib/db-schema.sql`
   - Paste into the psql terminal
   - Press Enter to execute

### Option C: Using External Database Tool (Easiest Visual Method)

If you prefer a visual interface, use a database client:

1. **Get Database Connection String:**
   - In Railway, click your PostgreSQL service
   - Go to **"Variables"** tab
   - Copy the `DATABASE_URL` value

2. **Choose a tool:**
   - **TablePlus** (Recommended - beautiful UI): https://tableplus.com/download
   - **pgAdmin** (Full-featured): https://www.pgadmin.org/download/
   - **DBeaver** (Free, open-source): https://dbeaver.io/download/
   - **Online (Adminer)**: https://www.adminer.org/ (single PHP file)

3. **Connect and run SQL:**
   - Open your chosen database tool
   - Create a new PostgreSQL connection
   - Paste your `DATABASE_URL` connection string
   - Connect to the database
   - Open SQL Query window/editor
   - Copy entire contents from `lib/db-schema.sql`
   - Paste and execute
   - You should see tables created! ✅

4. **Verify tables were created:**
   ```powershell
   # Option 1: Run verification script (if Railway CLI is linked)
   railway run npm run verify-db
   
   # Option 2: Run locally (if DATABASE_URL is set in .env.local)
   npm run verify-db
   
   # Option 3: Manual SQL check (in your database tool)
   # Open lib/verify-tables.sql and run all queries, OR
   # Run this simple query to see all tables:
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

**Expected Results After Running Schema:**
- ✅ **3 tables created:** `users`, `jobs`, `files`
- ✅ **2 users inserted:** agent@thesupport.in and user@example.com
- ✅ **5 indexes created** for performance
- ✅ **0 jobs** and **0 files** initially (empty until you use the app)

---

## 🌐 Step 6: Get Your App URL

1. After deployment completes, Railway gives you a URL:
   - Format: `https://thesupport-in-production.up.railway.app`
   - Or similar based on your project name

2. **Copy this URL!**

3. **Update environment variables:**
   - Go back to **Variables** tab
   - Update `NEXTAUTH_URL` with your actual Railway URL
   - Update `NEXT_PUBLIC_BASE_URL` with your actual Railway URL
   - Railway will auto-redeploy

---

## 🔗 Step 7: Configure Custom Domain (Optional)

To use `thesupport.agency`:

1. In Railway project, go to **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Enter: `thesupport.agency`
4. Railway provides DNS instructions:
   - Add **CNAME** record: `@` → `your-app.up.railway.app`
   - Or **A record** with Railway's IP
5. Railway automatically provisions SSL certificate! 🔒

6. **Wait 5-10 minutes** for DNS propagation

7. **Update Google OAuth** redirect URI:
   - Go to Google Cloud Console
   - Add: `https://thesupport.agency/api/auth/callback/google`

---

## 📧 Step 8: Update Google OAuth

1. Go to: **https://console.cloud.google.com**
2. **APIs & Services** → **Credentials**
3. Edit your **OAuth 2.0 Client ID**
4. Add **Authorized redirect URIs:**
   ```
   https://your-app-name.up.railway.app/api/auth/callback/google
   https://thesupport.agency/api/auth/callback/google  (if custom domain)
   ```
5. **Save**

---

## 📁 Step 9: Configure File Storage

Railway volumes are ephemeral (reset on redeploy). Choose one:

### Option A: Railway Volume (Simple)

1. In Railway project, click **"+ New"** → **"Volume"**
2. Mount to: `/app/public/uploads`
3. Files will persist across deployments ✅

### Option B: External Storage (Production)

For production, use:
- **AWS S3** (update `lib/file-storage.ts`)
- **Cloudflare R2** (free tier)
- **Railway Blob Storage** (if available)

---

## ✅ Step 10: Test Your App

1. **Visit your Railway URL:**
   - `https://your-app-name.up.railway.app`

2. **Test features:**
   - [ ] Homepage loads
   - [ ] Sign in with Google works
   - [ ] OTP email works
   - [ ] File upload works
   - [ ] Agent login works
   - [ ] Chat functionality works
   - [ ] Profile editing works

3. **Check logs if issues:**
   - Go to **"Deployments"** → Latest → **"View Logs"**

---

## 📋 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Project created from GitHub repo
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Database schema initialized
- [ ] App URL obtained
- [ ] Google OAuth updated
- [ ] Custom domain configured (optional)
- [ ] File storage configured
- [ ] App tested and working

---

## 🆘 Troubleshooting

### Build Fails

**Check:**
1. Go to **Deployments** → Latest → **View Logs**
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

**Fix:**
- Add missing environment variables
- Fix code errors
- Railway auto-redeploys when you push to GitHub

### Database Connection Fails

**Check:**
- `DATABASE_URL` is automatically set (don't add manually)
- Database service is running (green status in Railway)
- Schema is initialized

**Fix:**
- Verify database exists and is running
- Run `lib/db-schema.sql` again

### App Not Loading

**Check:**
- Deployment succeeded (green checkmark)
- Service is running
- Check logs for errors

**Fix:**
- View logs in Railway dashboard
- Check environment variables are set correctly

---

## 🎉 Success!

Your app is now live at:
- Railway URL: `https://your-app-name.up.railway.app`
- Custom domain: `https://thesupport.agency` (if configured)

---

## 📚 Additional Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway (Community support)
- **Full Railway Guide:** See `DEPLOY_RAILWAY.md`

---

## 🚀 Auto-Deployments

**Railway automatically:**
- ✅ Deploys when you push to GitHub
- ✅ Runs `npm install`
- ✅ Runs `npm run build`
- ✅ Starts the app
- ✅ Provides logs and monitoring

**To update your app:**
1. Make changes locally
2. Commit in GitHub Desktop
3. Push to GitHub
4. Railway auto-deploys! 🎉

---

**You're all set! Your app is live on Railway!** 🚀

