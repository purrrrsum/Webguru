# Railway URL Configuration

## Public Railway URI

**Our public Railway URI is:** `https://www.thesupport.agency`

This is the URL that should be used for:
- Google OAuth redirect URIs
- NEXTAUTH_URL (if set manually)
- Public API endpoints
- All external references

---

## Google OAuth Configuration

For Google OAuth, use these exact URLs:

**Authorized JavaScript origins:**
```
http://localhost:3000
https://www.thesupport.agency
```

**Authorized redirect URIs:**
```
http://localhost:3000/api/auth/callback/google
https://www.thesupport.agency/api/auth/callback/google
```

---

## Environment Variables

When setting `NEXTAUTH_URL` (if needed):
```
NEXTAUTH_URL=https://www.thesupport.agency
```

---

**Note:** Railway may also provide a `.up.railway.app` URL, but our public domain is `www.thesupport.agency`.

