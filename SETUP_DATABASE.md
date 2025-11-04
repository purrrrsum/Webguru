# Database Setup Guide

This project uses **PostgreSQL** for persistent data storage (Railway, Hostinger, or any PostgreSQL server).

## Quick Setup

### 1. Create PostgreSQL Database

**Option A: Railway (Recommended)**
1. Go to Railway Dashboard → Your Project
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway automatically sets `DATABASE_URL`

**Option B: Hostinger/Other PostgreSQL**
1. Create PostgreSQL database in your hosting provider
2. Get connection string: `postgresql://user:password@host:port/database`
3. Set as `DATABASE_URL` environment variable

### 3. Initialize Database Schema

**Option A: Using Railway Dashboard (Recommended)**

1. Railway Dashboard → Your Service → **Deployments** → **"..."** → **"Run Command"**
2. Enter: `npm run setup-db`
3. Click **Run**

**Option B: Using Railway SQL Editor**

1. Railway Dashboard → PostgreSQL Service → **Query** tab
2. Copy the contents of `lib/db-schema.sql`
3. Paste and execute

**Option B: Using Script (Development)**

```bash
# Install tsx for running TypeScript
npm install -g tsx

# Run initialization script
npx tsx scripts/init-db.ts
```

**Option C: Manual SQL**

1. Connect to your database using any PostgreSQL client
2. Run the SQL commands from `lib/db-schema.sql`

### 4. Verify Setup

The schema creates:
- ✅ `users` table (with default agent and sample user)
- ✅ `jobs` table
- ✅ `files` table
- ✅ Indexes for performance

### 5. Test Connection

The app uses standard `pg` library which connects using `DATABASE_URL` environment variable.

## Environment Variables

**Database connection:**

```
DATABASE_URL=postgresql://user:password@host:port/database
```

- **Railway**: Automatically sets `DATABASE_URL` when you add PostgreSQL
- **Hostinger/Other**: Set `DATABASE_URL` manually in environment variables

## Migration from JSON Files

The codebase has been migrated from JSON files to PostgreSQL:

- ❌ Old: `data/users.json`, `data/jobs.json`, `data/files.json`
- ✅ New: PostgreSQL tables (`users`, `jobs`, `files`)

All API routes now use database functions from `lib/db.ts` instead of file system operations.

## Database Schema

See `lib/db-schema.sql` for the complete schema including:
- Table definitions
- Foreign key constraints
- Indexes
- Default data (agent and sample user)

## Troubleshooting

### "Table does not exist" Error

Run the schema initialization:
1. Use Railway Dashboard → PostgreSQL → Query tab, OR
2. Run: `npm run setup-db`
3. Copy and run `lib/db-schema.sql` manually if needed

### Connection Issues

- Verify database is created and running
- Check that `DATABASE_URL` is set correctly
- Verify connection string format: `postgresql://user:password@host:port/database`
- Test connection with: `npm run verify-db`

### Data Not Persisting

- Verify tables exist: Check your database directly or run `npm run verify-db`
- Check database connection logs
- Ensure schema was run successfully: `npm run setup-db`

## Local Development

For local development with PostgreSQL:

1. Install PostgreSQL locally or use Docker:
   ```bash
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
   ```

2. Set environment variables in `.env.local`:
   ```env
   POSTGRES_URL=postgresql://postgres:password@localhost:5432/thesupport
   ```

3. Run schema initialization:
   ```bash
   npx tsx scripts/init-db.ts
   ```

## Production

For production on Railway:
- Database is automatically provisioned when you add PostgreSQL
- `DATABASE_URL` is auto-set
- Run `npm run setup-db` once to initialize schema and test data

For production on Hostinger/Other:
- Create PostgreSQL database manually
- Set `DATABASE_URL` environment variable
- Run `npm run setup-db` to initialize

