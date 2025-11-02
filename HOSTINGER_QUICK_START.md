# Quick Start: Deploy Next.js to Hostinger

## Problem
Hostinger's migration tool only supports PHP/WordPress, not Node.js.

## Solution
Deploy manually via SSH or use VPS hosting.

---

## Method 1: SSH/FTP Upload (For Shared Hosting with Node.js Support)

If your Hostinger plan has Node.js support:

1. **Upload files via FTP**
   - Host: `ftp.yourdomain.com` or IP
   - Use FileZilla or Hostinger File Manager
   - Upload extracted files to `public_html` or Node.js app folder

2. **SSH into server**
   ```bash
   ssh username@your-server-ip
   cd public_html  # or your app directory
   ```

3. **Install and build**
   ```bash
   npm install
   npm run build
   npm start
   ```

---

## Method 2: VPS Deployment (Recommended)

### Quick Steps:

1. **Get VPS access** from Hostinger
2. **Upload files** via SFTP/SCP
3. **Install Node.js** on VPS
4. **Set up PostgreSQL**
5. **Run the app** with PM2
6. **Configure Nginx** as reverse proxy

📖 **See full guide:** `DEPLOY_HOSTINGER_VPS.md`

---

## Method 3: Use Alternative Platform (Fastest)

If Hostinger doesn't support Node.js:

### Railway (Recommended - Easiest)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Connect your repo
5. Add environment variables
6. Deploy! (Auto-deploys on push)

### Render
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. Add environment variables
7. Deploy!

### Vercel (Original Platform)
1. Go to https://vercel.com
2. Import your repo
3. Set environment variables
4. Deploy!

---

## What Do You Have?

Check your Hostinger plan:

- ✅ **VPS Hosting**: Follow Method 2
- ✅ **Shared Hosting with Node.js**: Follow Method 1
- ❌ **Shared Hosting (PHP only)**: Use Method 3 (Alternative Platform)

---

## Need Help?

1. Check Hostinger support: Does your plan support Node.js?
2. Upgrade to VPS if needed
3. Or deploy to Railway/Render (5-minute setup)

---

**Fastest Option:** Use Railway or Render - they're designed for Node.js and deploy in minutes!

