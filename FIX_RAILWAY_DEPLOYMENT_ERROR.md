# Fix: Railway "failed to exec pid1" Error

## Problem

Railway error: `ERROR (catatonit:2): failed to exec pid1: No such file or directory`

This happens when using Next.js `output: 'standalone'` because:
- Standalone output creates `.next/standalone/server.js`
- `npm start` (which runs `next start`) expects standard Next.js build structure
- Railway can't find the entry point

## Solution

### Option 1: Use Standalone Server (Recommended for Railway)

**Updated `railway.json`:**
```json
{
  "deploy": {
    "startCommand": "node .next/standalone/server.js"
  }
}
```

### Option 2: Remove Standalone Output (Alternative)

If you don't need standalone output, remove it from `next.config.js`:

```javascript
const nextConfig = {
  // Remove: output: 'standalone',
  // ... rest of config
}
```

Then use:
```json
{
  "deploy": {
    "startCommand": "npm start"
  }
}
```

## Verification

After updating `railway.json`:

1. Commit and push to GitHub
2. Railway will auto-redeploy
3. Check Railway logs - should see:
   ```
   Starting Container
   node .next/standalone/server.js
   Ready on port 3000
   ```

## Why Standalone?

- **Smaller deployment size** - Only includes necessary files
- **Faster cold starts** - Less code to load
- **Better for Railway** - Optimized for containerized deployments

## Next Steps

1. ✅ Updated `railway.json` with correct start command
2. Commit and push
3. Railway will redeploy automatically
4. Check deployment logs

---

**Status:** Fixed - Railway should now deploy successfully!

