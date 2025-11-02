# Local Testing Checklist

Test these pages in your browser at **http://localhost:3000**

## Public Pages (No Login Required)

### ✅ Home Page (`/`)
- [ ] Page loads with hero section
- [ ] Features section displays correctly
- [ ] "How It Works" section shows
- [ ] Navigation bar appears at top
- [ ] Footer appears at bottom
- [ ] "Get Started" button visible (if not logged in)
- [ ] "Go to Dashboard" button visible (if logged in)

### ✅ About Page (`/about`)
- [ ] Page loads
- [ ] Content displays properly
- [ ] Navigation works
- [ ] Footer appears
- [ ] "Get Started" button works

### ✅ Pricing Page (`/pricing`)
- [ ] Three pricing plans display
- [ ] Plans are styled correctly
- [ ] Buttons are clickable
- [ ] Navigation works

### ✅ Contact Page (`/contact`)
- [ ] Contact form displays
- [ ] All form fields work
- [ ] Subject dropdown works
- [ ] Form validation works
- [ ] Navigation works

### ✅ Blog Page (`/blog`)
- [ ] Blog posts list displays
- [ ] Post cards show properly
- [ ] Can click "Read more" links
- [ ] Navigation works

### ✅ Blog Post (`/blog/1`, `/blog/2`, `/blog/3`)
- [ ] Individual blog post loads
- [ ] Content displays
- [ ] "Back to Blog" link works
- [ ] Navigation works

### ✅ Policy Page (`/policy`)
- [ ] Privacy policy content displays
- [ ] Sections are readable
- [ ] Navigation works

### ✅ Terms Page (`/terms`)
- [ ] Terms of service display
- [ ] Sections are readable
- [ ] Navigation works

### ✅ Sign In Page (`/auth/signin`)
- [ ] Google OAuth button displays
- [ ] Email/OTP form shows
- [ ] Can enter email
- [ ] Can request OTP
- [ ] Navigation link to admin login works

### ✅ Admin Login (`/admin`)
- [ ] Admin login form displays
- [ ] Can enter email and password
- [ ] Form works

## Protected Pages (Require Login)

### ✅ Dashboard (`/dashboard`)
- [ ] **When NOT logged in:** Redirects to `/auth/signin`
- [ ] **When logged in:** Shows job list
- [ ] "New Job" button works (for users)
- [ ] Can click on jobs to go to chat
- [ ] Navigation shows "Profile" and "Sign Out"

### ✅ Profile (`/profile`)
- [ ] **When NOT logged in:** Redirects to `/auth/signin`
- [ ] **When logged in:** Shows profile form
- [ ] Job counter displays
- [ ] Can edit profile fields
- [ ] Save button works
- [ ] Navigation works

### ✅ Chat (`/chat/[id]`)
- [ ] **When NOT logged in:** Redirects to `/auth/signin`
- [ ] **When logged in:** Shows chat interface
- [ ] Can upload files
- [ ] File preview works (images/videos)
- [ ] Download button works
- [ ] Tick buttons work
- [ ] Navigation back to dashboard works

## Navigation Testing

- [ ] Clicking "Home" goes to `/`
- [ ] Clicking "About" goes to `/about`
- [ ] Clicking "Pricing" goes to `/pricing`
- [ ] Clicking "Blog" goes to `/blog`
- [ ] Clicking "Contact" goes to `/contact`
- [ ] When logged out, "Sign In" button shows
- [ ] When logged in, "Dashboard" and "Sign Out" show
- [ ] Active page is highlighted in navigation

## Footer Testing

- [ ] Footer appears on all public pages
- [ ] Company links work
- [ ] Legal links work (Policy, Terms)
- [ ] "Sign In" button in footer works

## Responsive Testing

- [ ] Test on mobile viewport (375px width)
- [ ] Navigation hamburger menu appears (if implemented)
- [ ] All pages are readable on mobile
- [ ] Forms are usable on mobile

## Common Issues to Check

### Build Errors:
- ✅ Build should complete without errors
- ✅ No TypeScript errors
- ✅ No linting errors

### Runtime Errors:
- [ ] Check browser console (F12) for errors
- [ ] Check terminal/console for server errors
- [ ] All pages load without crashes

### Styling:
- [ ] WhatsApp green colors display correctly
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] Spacing looks good

---

## Quick Test Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

---

**Visit:** http://localhost:3000

**Test each page and check off items above!**

