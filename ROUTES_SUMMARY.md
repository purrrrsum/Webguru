# Application Routes Summary

## Public Routes (No Login Required)

These pages are accessible to everyone:

- **`/`** - Home page (marketing/landing page)
- **`/about`** - About us page
- **`/pricing`** - Pricing plans
- **`/contact`** - Contact us form
- **`/blog`** - Blog listing page
- **`/blog/[id]`** - Individual blog post
- **`/policy`** - Privacy policy
- **`/terms`** - Terms of service
- **`/auth/signin`** - Login page
- **`/admin`** - Admin login page (public, but requires credentials to access dashboard)

## Protected Routes (Login Required)

These routes require authentication and redirect to `/auth/signin` if not logged in:

- **`/dashboard`** - Main dashboard (job list for users/agents)
- **`/chat/[id]`** - Chat room with file uploads
- **`/profile`** - User profile editing page

## API Routes

### Public APIs:
- **`/api/auth/[...nextauth]`** - NextAuth authentication
- **`/api/otp`** - Send OTP emails

### Protected APIs (Require Authentication):
- **`/api/upload`** - Upload files
- **`/api/tick`** - Handle tick confirmation
- **`/api/delete`** - Delete files
- **`/api/profile`** - Get/update user profile
- **`/api/jobs`** - List/create jobs
- **`/api/chat/[jobId]`** - Get chat data
- **`/api/admin/login`** - Admin authentication

## Navigation Flow

### For Visitors:
1. Visit `/` (home page)
2. Browse public pages (About, Pricing, Blog, etc.)
3. Click "Sign In" → `/auth/signin`
4. After login → Redirected to `/dashboard`

### For Authenticated Users:
1. Visit `/dashboard` → See job list
2. Click job → `/chat/[id]` → Upload files, chat with agent
3. Click profile → `/profile` → Edit profile

### For Agents:
1. Visit `/admin` → Login with credentials
2. Redirected to `/dashboard` → See all jobs
3. Click job → `/chat/[id]` → Review files, provide corrections

## Middleware Protection

The `middleware.ts` file automatically:
- ✅ Allows public routes (/, /about, /pricing, etc.)
- ✅ Redirects unauthenticated users to `/auth/signin` for protected routes
- ✅ Preserves the intended destination via `callbackUrl` parameter

## Components

- **`Navigation.tsx`** - Shared navigation bar (appears on all pages)
- **`Footer.tsx`** - Shared footer (appears on public pages)

## File Structure

```
app/
├── page.tsx              # Home (public)
├── about/page.tsx        # About (public)
├── pricing/page.tsx     # Pricing (public)
├── contact/page.tsx     # Contact (public)
├── blog/
│   ├── page.tsx         # Blog list (public)
│   └── [id]/page.tsx    # Blog post (public)
├── policy/page.tsx       # Privacy policy (public)
├── terms/page.tsx        # Terms (public)
├── auth/signin/page.tsx  # Login (public)
├── admin/page.tsx        # Admin login (public)
├── dashboard/page.tsx    # Dashboard (protected)
├── chat/[id]/page.tsx    # Chat room (protected)
└── profile/page.tsx      # Profile (protected)
```

---

All set! Your app now has a complete public marketing site + protected application area.

