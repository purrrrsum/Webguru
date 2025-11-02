# Deployment Guide for rant.zone

## Prerequisites

Before deploying, make sure you have:

1. ✅ All environment variables ready
2. ✅ Google OAuth credentials configured
3. ✅ Resend account for OTP emails
4. ✅ Vercel account (for Blob storage)
5. ✅ Domain configured (rant.zone)

## Step-by-Step Deployment

### Option 1: Deploy to Vercel (Recommended)

Vercel is the recommended platform since this app uses Vercel Blob storage.

#### 1. Prepare Your Code

```bash
# Make sure all dependencies are installed
npm install

# Test the build locally
npm run build

# If build succeeds, you're ready to deploy!
```

#### 2. Connect to Vercel

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `./` (or your project root)
   - Build Command: `npm run build`
   - Output Directory: `.next`

**Option B: Via Vercel CLI**
```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# For production deployment
vercel --prod
```

#### 3. Configure Environment Variables in Vercel

Go to your project settings → Environment Variables and add:

```env
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://rant.zone
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RESEND_API_KEY=your_resend_api_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
ADMIN_EMAIL=agent@thesupport.in
ADMIN_PASSWORD=Support123!
```

**Important Notes:**
- `NEXTAUTH_URL` should be `https://rant.zone` (or `https://your-domain.vercel.app` if using Vercel domain)
- Generate `NEXTAUTH_SECRET` with: `openssl rand -base64 32`
- `BLOB_READ_WRITE_TOKEN` is available in Vercel Dashboard → Storage → Blob

#### 4. Enable Vercel Storage

**Vercel Blob Storage (for files):**
1. In Vercel Dashboard → Storage
2. Click "Create Database" → Select "Blob"
3. This automatically sets up `BLOB_READ_WRITE_TOKEN`
4. Copy the token to your environment variables

**Vercel Postgres (for database):**
1. In Vercel Dashboard → Storage
2. Click "Create Database" → Select "Postgres"
3. Choose a name and region
4. Environment variables are automatically set
5. Go to SQL Editor and run the schema from `lib/db-schema.sql`

#### 5. Configure Domain (rant.zone)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add `rant.zone` and `www.rant.zone`
3. Follow DNS configuration instructions:
   - Add A record or CNAME as instructed by Vercel
   - DNS records will be provided by Vercel

#### 6. Update Google OAuth Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   - `https://rant.zone/api/auth/callback/google`
   - `https://www.rant.zone/api/auth/callback/google`

#### 7. Update Resend Domain (if needed)

1. Go to [Resend Dashboard](https://resend.com)
2. Add/verify `rant.zone` domain (for production emails)
3. Update sender email in `lib/otp.ts` if needed

#### 8. Redeploy

After setting environment variables:
- Vercel automatically redeploys, OR
- Go to Deployments → Click "Redeploy"

---

### Option 2: Deploy to Other Platforms

#### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables

# Deploy
railway up
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

**Note:** Netlify doesn't support Vercel Blob. You'll need to:
- Replace Vercel Blob with another storage (AWS S3, Cloudflare R2, etc.)
- Update `app/api/upload/route.ts` accordingly

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
- [ ] Test on actual domain (rant.zone)

---

## Environment Variables Reference

| Variable | Required | Description | How to Get |
|----------|----------|-------------|------------|
| `NEXTAUTH_SECRET` | ✅ | Secret for NextAuth | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | Your app URL | `https://rant.zone` |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth Client ID | [Google Cloud Console](https://console.cloud.google.com) |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth Secret | [Google Cloud Console](https://console.cloud.google.com) |
| `RESEND_API_KEY` | ✅ | Resend API key | [Resend Dashboard](https://resend.com) |
| `BLOB_READ_WRITE_TOKEN` | ✅ | Vercel Blob token | Vercel Dashboard → Storage → Blob |
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

- Verify `BLOB_READ_WRITE_TOKEN` is correct
- Check Vercel Blob storage is enabled
- Verify file size is ≤20MB

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

# 3. Deploy to Vercel
vercel --prod

# 4. View logs
vercel logs

# 5. Open deployment
vercel open
```

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Ensure all API services (Google, Resend, Vercel Blob) are configured correctly

