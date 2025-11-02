# Database Setup Guide

This project uses **Vercel Postgres** (PostgreSQL) for persistent data storage.

## Quick Setup

### 1. Create Vercel Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create new one)
3. Go to **Storage** tab
4. Click **Create Database** → Select **Postgres**
5. Choose a name and region
6. Click **Create**

### 2. Get Connection String

After creating the database:
1. Vercel automatically adds environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

These are automatically available when using `@vercel/postgres` - **no manual configuration needed!**

### 3. Initialize Database Schema

**Option A: Using Vercel Dashboard (Recommended)**

1. Go to your database in Vercel Dashboard
2. Click **Connect** → **SQL Editor**
3. Copy the contents of `lib/db-schema.sql`
4. Paste and execute in SQL Editor
5. Click **Run**

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

The app will automatically use `@vercel/postgres` which connects using environment variables provided by Vercel.

## Environment Variables

**No manual database configuration needed!** Vercel Postgres automatically provides:

```
POSTGRES_URL (auto-provided)
POSTGRES_PRISMA_URL (auto-provided)
POSTGRES_URL_NON_POOLING (auto-provided)
```

These are **automatically set** by Vercel when you create a Postgres database in your project.

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
1. Use Vercel Dashboard SQL Editor
2. Copy and run `lib/db-schema.sql`

### Connection Issues

- Verify database is created in Vercel Dashboard
- Check that environment variables are set (auto-provided by Vercel)
- Ensure you're using `@vercel/postgres` package (already installed)

### Data Not Persisting

- Verify tables exist: Check Vercel Dashboard → Database → Tables
- Check database connection logs in Vercel Dashboard
- Ensure schema was run successfully

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

For production on Vercel:
- Database is automatically provisioned
- Environment variables are auto-set
- Just run the schema SQL once via Vercel Dashboard

No additional configuration needed! 🎉

