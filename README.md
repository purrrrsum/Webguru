# thesupport.in

A hard-coded WhatsApp-style design correction portal built with Next.js 14.

## Features

- **User Authentication**: Google OAuth or Email OTP login
- **Agent Portal**: Admin login at `/admin`
- **File Upload**: Upload any file ≤20MB (images, videos, PDFs, DOCX, etc.)
- **Chat Interface**: WhatsApp-style chat bubbles
- **Mutual Tick System**: Both user and agent tick to complete a job
- **Job Counter**: Track completed jobs in user profile
- **Profile Management**: Edit name, company, address, email, phone

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (Google + Credentials OTP via Resend)
- **Storage**: Local file system (public/uploads/)
- **Database**: PostgreSQL (standard pg library)

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the following:
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your app URL (e.g., `http://localhost:3000` for dev)
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `RESEND_API_KEY`: From Resend dashboard (optional, for OTP emails)
   - `DATABASE_URL`: PostgreSQL connection string (required)

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/
├── app/
│   ├── api/          # API routes (upload, delete, tick, profile)
│   ├── auth/         # Authentication pages
│   ├── admin/        # Agent login
│   ├── chat/         # Chat rooms
│   ├── profile/      # User profile
│   └── layout.tsx    # Root layout
├── components/       # Reusable components
├── data/            # JSON data files
└── lib/             # Utilities and NextAuth config
```

## Default Credentials

- **Admin Agent**: 
  - Email: `agent@thesupport.in`
  - Password: `Support123!`

- **Sample User**: 
  - Email: `user@example.com`
  - (Login via Google or OTP)

## Deployment

### 🚀 Quick Deploy to Railway (Recommended)

Railway is the easiest platform for Node.js apps:

1. **Push code to GitHub**
2. **Go to** https://railway.app
3. **New Project** → **Deploy from GitHub repo**
4. **Add PostgreSQL** database (one click!)
5. **Add environment variables**
6. **Deploy!** ✅

📖 **Complete guide:** See `DEPLOY_RAILWAY.md`

**Free tier includes:**
- $5 usage credit/month
- PostgreSQL database
- Automatic SSL
- Custom domains
- 8GB RAM / 8 vCPU

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel login
vercel --prod
```

### Detailed Instructions

See [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md) or [RAILWAY_DB_SETUP.md](./RAILWAY_DB_SETUP.md) for comprehensive deployment guides.

### Key Steps

1. **Add PostgreSQL database** (Railway/Hostinger/any PostgreSQL)
2. **Set up environment variables** (NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL)
3. **Run database setup**: `npm run setup-db`
4. **Update Google OAuth** redirect URIs (if using Google login)
5. **Test all features** after deployment

