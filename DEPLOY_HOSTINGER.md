# Deployment Guide for Hostinger

This guide will help you deploy thesupport.in to **thesupport.agency** on Hostinger hosting.

## ⚠️ Important Note

**Hostinger's migration tool only supports PHP/WordPress**, not Node.js!

If you see the error: *"Files built with frameworks like Node.js, React, or Vue, which aren't supported"*

**You have 3 options:**

1. **Deploy via SSH/VPS** (Recommended) - See `DEPLOY_HOSTINGER_VPS.md`
2. **Use Hostinger's Node.js hosting** (if available in your plan)
3. **Deploy to alternative platform** - See `HOSTINGER_QUICK_START.md`

---

## Prerequisites

1. ✅ Hostinger account with **VPS hosting** OR Node.js hosting enabled
2. ✅ PostgreSQL database access
3. ✅ Domain configured (thesupport.agency)
4. ✅ SSH/FTP access to Hostinger server

**Note:** Shared hosting plans typically don't support Node.js. You'll need VPS.

## Step-by-Step Deployment

### 1. Prepare Your Code

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test locally
npm run start
```

### 2. Get Database Credentials from Hostinger

1. Log into **Hostinger hPanel**
2. Go to **Databases** → **PostgreSQL Databases**
3. Create a new PostgreSQL database (if not exists)
4. Note down:
   - Database Name
   - Database User
   - Database Password
   - Database Host (usually `localhost` or specific host)
   - Database Port (usually `5432`)

### 3. Create Database Connection String

Format your connection string:
```
postgresql://username:password@host:port/database_name
```

Example:
```
postgresql://thesupport_user:yourpassword@localhost:5432/thesupport_db
```

### 4. Set Up Environment Variables

Create a `.env.production` file or set in Hostinger's environment variables:

```env
# NextAuth
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://thesupport.agency

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Resend for OTP
RESEND_API_KEY=your_resend_api_key

# PostgreSQL Database
DATABASE_URL=postgresql://username:password@host:port/database_name
# OR
POSTGRES_URL=postgresql://username:password@host:port/database_name

# Admin Credentials (optional)
ADMIN_EMAIL=agent@thesupport.in
ADMIN_PASSWORD=Support123!

# Base URL for file uploads
NEXT_PUBLIC_BASE_URL=https://thesupport.agency
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Initialize Database Schema

**Option A: Using Hostinger phpPgAdmin (Recommended)**

1. Go to Hostinger hPanel → Databases → phpPgAdmin
2. Select your database
3. Click **SQL** tab
4. Copy and paste the contents of `lib/db-schema.sql`
5. Click **Execute**

**Option B: Using SSH (if available)**

```bash
# Connect via SSH
ssh your-username@your-hostinger-server

# Connect to PostgreSQL
psql -U your_db_user -d your_db_name

# Run the schema
\i /path/to/lib/db-schema.sql
```

**Option C: Using Local Connection**

If Hostinger allows external connections:

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://user:pass@hostinger-host:5432/dbname"

# Run init script
npx tsx scripts/init-db.ts
```

### 6. Upload Files to Hostinger

**Using FTP (FileZilla, WinSCP, etc.):**

1. Connect to Hostinger via FTP
2. Navigate to your domain's `public_html` folder (or Node.js app directory)
3. Upload all files EXCEPT:
   - `node_modules/` (will be installed on server)
   - `.env.local` (use `.env.production` or hosting env vars)
   - `.git/`
   - `.next/` (will be built on server)

**Files to Upload:**
```
/
├── app/
├── components/
├── lib/
├── public/
├── scripts/
├── types/
├── .gitignore
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.production (or set via hosting panel)
```

### 7. Configure Node.js on Hostinger

1. **Go to Hostinger hPanel**
2. **Node.js** → Select your domain
3. **Create Application:**
   - Node.js Version: `20.x` or latest LTS
   - Application Root: `public_html` (or your domain folder)
   - Application URL: `https://thesupport.agency`
   - Application Startup File: `server.js` (for standalone) or `package.json` (for custom start)

4. **Set Environment Variables** in Node.js settings (or use `.env.production`)

5. **Install Dependencies:**
   ```bash
   npm install --production
   ```

6. **Build Application:**
   ```bash
   npm run build
   ```

7. **Start Application:**
   ```bash
   npm start
   ```

### 8. Configure Next.js Standalone Mode

The `next.config.js` is already configured with `output: 'standalone'` which creates a minimal server.

After build, you'll have:
- `.next/standalone/` - Contains the server
- `.next/static/` - Static assets
- `public/` - Public files

**Start Command:**
```bash
cd .next/standalone
node server.js
```

OR use PM2 for process management:
```bash
npm install -g pm2
pm2 start npm --name "thesupport" -- start
pm2 save
pm2 startup
```

### 9. Set Up File Storage

The app uses local file storage in `public/uploads/`. Ensure:

1. The `public/uploads/` directory exists and is writable:
   ```bash
   mkdir -p public/uploads
   chmod 755 public/uploads
   ```

2. Uploads are accessible via URL: `https://thesupport.agency/uploads/filename`

### 10. Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URI:
   ```
   https://thesupport.agency/api/auth/callback/google
   ```

### 11. Configure Domain DNS (if needed)

If using Hostinger DNS:
- A record or CNAME pointing to Hostinger's server
- SSL certificate (usually auto-configured by Hostinger)

## Alternative: Using Hostinger's Node.js Template

Some Hostinger plans offer Node.js templates:

1. **Create Node.js App** in hPanel
2. **Select Next.js template** (if available)
3. **Connect your Git repository** (if supported)
4. **Set environment variables**
5. **Auto-deploy**

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database host, port, username, password
- Ensure PostgreSQL is running on Hostinger
- Check firewall rules if using remote connection

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules

# Reinstall
npm install

# Rebuild
npm run build
```

### File Upload Issues

- Check `public/uploads/` directory permissions
- Verify directory exists
- Ensure writable permissions: `chmod 755 public/uploads`

### Port/Process Issues

- Check if Node.js process is running: `ps aux | grep node`
- Verify port (usually 3000) is not in use
- Use PM2 to manage process: `pm2 list`, `pm2 restart thesupport`

### Environment Variables Not Loading

- Verify `.env.production` exists in root directory
- Check Hostinger Node.js environment variables settings
- Restart Node.js application after adding variables

## Post-Deployment Checklist

- [ ] Database schema initialized
- [ ] Environment variables set
- [ ] Node.js application running
- [ ] Google OAuth redirect URI updated
- [ ] File uploads working
- [ ] Test user registration/login
- [ ] Test OTP email delivery
- [ ] Test file upload/download
- [ ] Test agent login
- [ ] SSL certificate active

## Performance Tips

1. **Use PM2** for process management and auto-restart
2. **Enable caching** if Hostinger supports it
3. **Optimize images** before upload
4. **Monitor disk space** for file uploads
5. **Set up database backups** via Hostinger

## Support

- **Hostinger Support**: https://www.hostinger.com/contact
- **Node.js Docs**: https://nodejs.org/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Your app should now be live at: https://thesupport.agency** 🎉

