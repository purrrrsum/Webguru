# GitHub Desktop Setup Guide

Complete guide to set up your code on GitHub using GitHub Desktop.

## Step 1: Install GitHub Desktop

1. **Download GitHub Desktop:**
   - Go to: https://desktop.github.com
   - Click **"Download for Windows"**
   - Run the installer
   - Follow the installation wizard

2. **Launch GitHub Desktop**

## Step 2: Sign In to GitHub

1. **If you don't have a GitHub account:**
   - Click **"Sign up for GitHub"** in GitHub Desktop
   - Or go to https://github.com/signup
   - Create a free account

2. **If you already have a GitHub account:**
   - Click **"Sign in to GitHub.com"**
   - Enter your credentials

## Step 3: Initialize Repository in GitHub Desktop

### Option A: Create New Repository on GitHub

1. In GitHub Desktop, click **"File"** → **"New Repository"** (or `Ctrl+N`)
2. Fill in:
   - **Name:** `thesupport-in` (or any name you prefer)
   - **Description:** `WhatsApp-style design correction portal`
   - **Local Path:** `D:\Webguru` (or your project folder)
   - **Git Ignore:** Select `Node` from dropdown
   - **License:** None (or choose one)
3. **⚠️ IMPORTANT:** Uncheck **"Initialize this repository with a README"**
4. Click **"Create Repository"**

### Option B: Publish Existing Repository

If repository already exists:

1. Click **"File"** → **"Add Local Repository"**
2. Click **"Choose..."** and select `D:\Webguru`
3. Click **"Add Repository"**
4. Click **"Publish Repository"** (top right)
5. Uncheck **"Keep this code private"** (or keep it private if you prefer)
6. Click **"Publish Repository"**

## Step 4: Commit Your Files

1. **Check files to commit:**
   - You should see all your files listed in the left panel
   - Files with green `+` are new files
   - Files with orange `!` are modified files

2. **Stage all files:**
   - Click the checkbox at the top: **"Select all"** ✓
   - Or manually select files you want to commit

3. **Write commit message:**
   - In the bottom left, write:
   ```
   Initial commit - Ready for Railway deployment
   ```
   - Or any descriptive message

4. **Commit:**
   - Click **"Commit to main"** button (bottom left)

## Step 5: Push to GitHub

1. **After committing, click:**
   - **"Publish Repository"** (if first time)
   - OR **"Push origin"** (if repository already exists)

2. **Wait for upload:**
   - You'll see progress in GitHub Desktop
   - Files are being uploaded to GitHub

3. **Confirm success:**
   - You should see: **"Successfully pushed to GitHub"** ✅
   - Or visit: `https://github.com/yourusername/thesupport-in`

## Step 6: Verify on GitHub

1. **Open in browser:**
   - In GitHub Desktop, click **"View on GitHub"** (top right)
   - Or go to: `https://github.com/yourusername/thesupport-in`

2. **Verify files are uploaded:**
   - You should see all your project files
   - `package.json`, `app/`, `components/`, `lib/`, etc.

## Step 7: What Gets Committed?

**✅ These files WILL be committed:**
- All source code (`app/`, `components/`, `lib/`)
- Configuration files (`package.json`, `next.config.js`, `tsconfig.json`)
- Documentation files (`README.md`, `DEPLOY_RAILWAY.md`)
- Database schema (`lib/db-schema.sql`)
- Scripts (`scripts/`)

**❌ These files WON'T be committed (automatically excluded):**
- `node_modules/` (from `.gitignore`)
- `.env.local` (from `.gitignore`)
- `.next/` (from `.gitignore`)
- `.git/` (internal Git files)
- `public/uploads/*` (from `.gitignore`)

## Step 8: Repository Settings (Optional)

1. **Go to your repository on GitHub.com**
2. **Click "Settings"** tab
3. **Optional settings:**
   - Add description
   - Add topics/tags
   - Enable GitHub Pages (if needed)
   - Configure branch protection (for production)

## Common Issues & Solutions

### Issue: "Repository already exists"

**Solution:**
- The folder already has a Git repository
- In GitHub Desktop: **"File"** → **"Add Local Repository"**
- Select your folder
- Click **"Add Repository"**

### Issue: Files not showing up

**Solution:**
- Check `.gitignore` isn't excluding them
- Try: **"Repository"** → **"Show in Explorer"**
- Verify files exist in the folder

### Issue: Authentication failed

**Solution:**
1. **"File"** → **"Options"** → **"Accounts"**
2. Sign out and sign in again
3. If using 2FA, use Personal Access Token

### Issue: Push rejected

**Solution:**
- Pull latest changes first: **"Repository"** → **"Pull"**
- Then push again: **"Repository"** → **"Push"**

## Next Steps After GitHub Setup

Once your code is on GitHub:

1. ✅ **Deploy to Railway** (See next section)
2. ✅ **Set up Railway environment variables**
3. ✅ **Initialize database on Railway**
4. ✅ **Test your deployed app**

---

**Your code is now on GitHub! Ready for Railway deployment!** 🚀

