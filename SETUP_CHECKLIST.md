# Complete Setup Checklist

Use this checklist to track your progress from GitHub to Railway deployment.

## Phase 1: GitHub Setup ✅

- [ ] GitHub Desktop installed
- [ ] Signed in to GitHub account
- [ ] Repository created in GitHub Desktop
- [ ] All files committed
- [ ] Code pushed to GitHub
- [ ] Verified repository exists at: `https://github.com/yourusername/thesupport-in`

**Status:** _______________

---

## Phase 2: Railway Account ✅

- [ ] Created Railway account at https://railway.app
- [ ] Signed in with GitHub
- [ ] Authorized Railway to access GitHub

**Status:** _______________

---

## Phase 3: Railway Project ✅

- [ ] Created new project in Railway
- [ ] Connected GitHub repository
- [ ] Railway detected Next.js project
- [ ] First deployment completed successfully
- [ ] Got Railway app URL: `https://______________.up.railway.app`

**Status:** _______________

---

## Phase 4: PostgreSQL Database ✅

- [ ] Added PostgreSQL database in Railway
- [ ] Database service is running (green status)
- [ ] Verified `DATABASE_URL` is automatically set

**Status:** _______________

---

## Phase 5: Environment Variables ✅

- [ ] Generated `NEXTAUTH_SECRET` (using `openssl rand -base64 32`)
- [ ] Added `NEXTAUTH_SECRET` variable
- [ ] Added `NEXTAUTH_URL` (your Railway URL)
- [ ] Added `GOOGLE_CLIENT_ID`
- [ ] Added `GOOGLE_CLIENT_SECRET`
- [ ] Added `RESEND_API_KEY`
- [ ] Added `ADMIN_EMAIL` = `agent@thesupport.in`
- [ ] Added `ADMIN_PASSWORD` = `Support123!`
- [ ] Added `NEXT_PUBLIC_BASE_URL` (your Railway URL)
- [ ] Added `NODE_ENV` = `production`
- [ ] Verified Railway auto-redeployed after adding variables

**Status:** _______________

---

## Phase 6: Database Initialization ✅

- [ ] Opened `lib/db-schema.sql` locally
- [ ] Accessed Railway PostgreSQL service
- [ ] Opened "Query" tab
- [ ] Pasted `lib/db-schema.sql` contents
- [ ] Executed SQL successfully
- [ ] Verified tables created (users, jobs, files)

**Status:** _______________

---

## Phase 7: Google OAuth Setup ✅

- [ ] Opened Google Cloud Console
- [ ] Went to APIs & Services → Credentials
- [ ] Edited OAuth 2.0 Client ID
- [ ] Added redirect URI: `https://your-app.up.railway.app/api/auth/callback/google`
- [ ] Saved changes

**Status:** _______________

---

## Phase 8: Custom Domain (Optional) ✅

- [ ] Added custom domain in Railway: `thesupport.agency`
- [ ] Got DNS instructions from Railway
- [ ] Added CNAME/A record in domain registrar (Hostinger)
- [ ] Waited for DNS propagation (5-10 minutes)
- [ ] Verified SSL certificate active (Railway auto-provisions)
- [ ] Updated Google OAuth with custom domain redirect URI

**Status:** _______________

---

## Phase 9: File Storage ✅

- [ ] Chose storage option:
  - [ ] Railway Volume (mounted to `/app/public/uploads`)
  - [ ] External storage (AWS S3, Cloudflare R2, etc.)
- [ ] Storage configured and tested

**Status:** _______________

---

## Phase 10: Testing ✅

- [ ] App loads at Railway URL
- [ ] Homepage displays correctly
- [ ] Google OAuth login works
- [ ] OTP email login works (received email)
- [ ] File upload works (≤20MB)
- [ ] Files display in chat
- [ ] Agent login works at `/admin`
- [ ] Mutual tick system works
- [ ] File deletion works (after both ticks)
- [ ] Profile editing works
- [ ] Job counter increments correctly

**Status:** _______________

---

## Phase 11: Monitoring ✅

- [ ] Checked Railway logs (no errors)
- [ ] Verified database connections
- [ ] Checked resource usage
- [ ] Set up spending alerts (optional)

**Status:** _______________

---

## Final Status

**App URL:** `https://______________.up.railway.app`

**Custom Domain:** `https://thesupport.agency` (if configured)

**Deployment Date:** _______________

**Status:** ✅ Production Ready

---

## Notes

_Use this space to note any issues or special configurations:_




---

## Support Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **GitHub Desktop Help:** https://docs.github.com/en/desktop

---

**Congratulations! Your app is deployed! 🎉**

