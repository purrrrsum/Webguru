# How to Create Zip File for Hostinger Upload

## Quick Method (Using Script)

Run the package script:

```bash
npm run package
```

This will create `thesupport-agency-for-hostinger.zip` ready for upload.

## Manual Method

### Option 1: Windows (PowerShell)

1. Open PowerShell in the project root directory
2. Run:
```powershell
Get-ChildItem -Exclude node_modules,.git,.next,out,build,coverage,.DS_Store,*.log,.env.local,.env.development,.env.test,.pnp,.pnp.js,*.tsbuildinfo,next-env.d.ts | Compress-Archive -DestinationPath thesupport-agency-for-hostinger.zip -Force
```

### Option 2: Windows (Manual Zip)

1. Select all files and folders EXCEPT:
   - `node_modules/`
   - `.git/`
   - `.next/`
   - `.vercel/`
   - `out/`
   - `build/`
   - `coverage/`
   - `.env.local`
   - `public/uploads/*` (except `.gitkeep`)
   - Any `.log` files
   
2. Right-click → Send to → Compressed (zipped) folder
3. Name it: `thesupport-agency-for-hostinger.zip`

### Option 3: Linux/Mac (Terminal)

```bash
zip -r thesupport-agency-for-hostinger.zip . \
  -x "node_modules/*" \
  -x ".git/*" \
  -x ".next/*" \
  -x ".vercel/*" \
  -x "out/*" \
  -x "build/*" \
  -x "coverage/*" \
  -x ".env.local" \
  -x "public/uploads/*" \
  -x "*.log" \
  -x ".DS_Store"
```

## Files to Include

✅ **Include these:**
- All files in `app/`
- All files in `components/`
- All files in `lib/` **including `lib/db-schema.sql`** ✅
- All files in `public/` (except uploaded files)
- All files in `scripts/`
- All files in `types/`
- `package.json`
- `package-lock.json`
- `next.config.js`
- `tsconfig.json`
- `tailwind.config.ts`
- `postcss.config.js`
- `.gitignore`
- `README.md`
- `DEPLOY_HOSTINGER.md`
- `lib/db-schema.sql` (Database schema - **INCLUDED**)

❌ **Exclude these:**
- `node_modules/` (will be installed on server)
- `.git/` (version control)
- `.next/` (will be built on server)
- `.vercel/` (Vercel-specific)
- `.env.local` (contains local secrets)
- `public/uploads/*` (user-uploaded files, but keep `.gitkeep`)

## Upload to Hostinger

1. Go to: https://hpanel.hostinger.com/migrations-onboarding
2. Upload the zip file
3. Extract it on the server
4. Run on server:
   ```bash
   npm install
   npm run build
   npm start
   ```

## File Size

The zip should be approximately **2-5 MB** (excluding node_modules).

After uploading and extracting, the server will install dependencies which may take a few minutes.

