# Deployment Guide for thesupport.agency

## Prerequisites

Before deploying, make sure you have:

1. ✅ All environment variables ready
2. ✅ PostgreSQL database (Railway/Hostinger/any PostgreSQL)
3. ✅ Google OAuth credentials configured (optional)
4. ✅ Resend account for OTP emails (optional)
5. ✅ Domain configured (your domain)

## Step-by-Step Deployment

### Option 1: Deploy to Railway (Recommended)

Railway provides easy PostgreSQL setup and automatic deployments.

#### 1. Prepare Your Code

```bash
# Make sure all dependencies are installed
npm install

# Test the build locally
npm run build

# If build succeeds, you're ready to deploy!
```

#### 2. Connect to Railway

**Option A: Via Railway Dashboard (Recommended)**
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Next.js and starts deployment

**Option B: Via Railway CLI**
```bash
# Install Railway CLI globally
npm i -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# Deploy
railway up
```

#### 3. Configure Environment Variables in Railway

Go to your Railway service → Variables tab and add:

```env
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://your-app.railway.app
DATABASE_URL=postgresql://... (auto-provided by Railway)
GOOGLE_CLIENT_ID=your_google_client_id (optional)
GOOGLE_CLIENT_SECRET=your_google_client_secret (optional)
RESEND_API_KEY=your_resend_api_key (optional)
ADMIN_EMAIL=agent@thesupport.in (optional)
ADMIN_PASSWORD=Support123! (optional)
```

**Important Notes:**
- `NEXTAUTH_URL` should be your Railway app URL (e.g., `https://your-app.railway.app`)
- Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
- `DATABASE_URL` is automatically set by Railway when you add PostgreSQL

#### 4. Setup Database

1. Railway automatically creates `DATABASE_URL` when you add PostgreSQL
2. Run database setup script:
   ```bash
   railway run npm run setup-db
   ```
   Or use Railway Dashboard → Run Command → `npm run setup-db`

#### 5. Configure Domain (Optional)

1. Go to Railway Dashboard → Your Service → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

#### 6. Update Google OAuth Redirect URIs (if using Google login)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   - `https://your-domain.com/api/auth/callback/google`
   - `https://your-app.railway.app/api/auth/callback/google`

#### 7. Redeploy

After setting environment variables:
- Railway automatically redeploys, OR
- Go to Deployments → Click "Redeploy"

---

### Option 2: Deploy to Other Platforms

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

**Note:** Vercel requires additional setup for file storage. Consider using Railway or Hostinger for easier deployment.

#### Hostinger

See [DEPLOY_HOSTINGER.md](./DEPLOY_HOSTINGER.md) for detailed Hostinger VPS deployment guide.

#### Docker + Any Hosting

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

Update `next.config.js`:

```js
const nextConfig = {
  output: 'standalone',
  // ... rest of config
}
```

---

## Post-Deployment Checklist

- [ ] Test user sign-up/login (Google OAuth)
- [ ] Test OTP email delivery
- [ ] Test file upload (verify 20MB limit)
- [ ] Test agent login at `/admin`
- [ ] Test mutual tick system
- [ ] Test file deletion after both ticks
- [ ] Test profile editing
- [ ] Verify job counter increments
- [ ] Check mobile responsiveness
- [ ] Test on actual domain

---

## Environment Variables Reference

| Variable | Required | Description | How to Get |
|----------|----------|-------------|------------|
| `NEXTAUTH_SECRET` | ✅ | Secret for NextAuth | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Your app URL | `https://your-app.railway.app` |
| `DATABASE_URL` | ✅ | PostgreSQL connection | Auto-provided by Railway/Hostinger |
| `GOOGLE_CLIENT_ID` | ⚪ | Google OAuth Client ID (optional) | [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | ⚪ | Google OAuth Secret (optional) | [Google Cloud Console](https://console.cloud.google.com) |
| `RESEND_API_KEY` | ⚪ | Resend API key (optional) | [Resend Dashboard](https://resend.com) |
| `ADMIN_EMAIL` | ⚪ | Admin email (optional) | Default: `agent@thesupport.in` |
| `ADMIN_PASSWORD` | ⚪ | Admin password (optional) | Default: `Support123!` |

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables are set in Vercel Dashboard → Settings → Environment Variables
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### File Upload Fails

- Verify `public/uploads` directory exists and is writable
- Check file size is ≤20MB
- Verify file storage permissions on server

### OTP Emails Not Sending

- Check `RESEND_API_KEY` is valid
- Verify domain is verified in Resend dashboard
- Check spam folder
- Review Resend dashboard logs

### Google OAuth Not Working

- Verify redirect URI matches exactly in Google Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Ensure `NEXTAUTH_URL` matches your domain

---

## Quick Deploy Commands

```bash
# 1. Install dependencies
npm install

# 2. Build locally (test)
npm run build

# 3. Deploy to Railway
railway up

# 4. Setup database
railway run npm run setup-db

# 5. View logs
railway logs
```

---

## Support

If you encounter issues:
1. Check Railway/Hostinger deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure database is set up: `npm run setup-db`
5. Verify PostgreSQL connection is working

