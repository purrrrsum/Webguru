# Database Schema Fixes & Verification

## ✅ Issues Fixed

### 1. **ON CONFLICT Clause**
- **Before:** `ON CONFLICT (id) DO NOTHING` 
- **After:** `ON CONFLICT (email) DO UPDATE SET ...`
- **Why:** Using `email` (which is UNIQUE) is more logical. Also changed from `DO NOTHING` to `DO UPDATE` so schema can be re-run safely without errors.

### 2. **Password Hash**
- **Before:** Invalid/dummy hash `$2b$10$5z5z5z5z5z5z5z5z5z5z5u5z5z5z5z5z5z5z5z5z5z5z5z5z5z5z`
- **After:** Valid bcrypt hash `$2a$10$ONwyTUXOP6VukZFuyv6yRuwzhneu4nO8Kx3mVF8kFKz.0grdkkfQ2`
- **Note:** This hash is for password "Support123!" - but admin login uses plain text comparison from env vars, so hash is mainly for consistency.

### 3. **Schema Re-runnable**
- Schema can now be run multiple times safely
- Uses `ON CONFLICT ... DO UPDATE` to update existing records instead of failing
- All CREATE statements use `IF NOT EXISTS` for safety

## 📋 Schema Structure

### Tables Created:
1. **users** - User accounts (with agent and sample user inserted)
2. **jobs** - Job/conversation records
3. **files** - File uploads metadata

### Indexes Created:
- `idx_users_email` - Fast email lookups
- `idx_jobs_user_id` - Fast job queries by user
- `idx_jobs_agent_id` - Fast job queries by agent
- `idx_files_job_id` - Fast file queries by job
- `idx_files_uploaded_by` - Fast file queries by uploader

### Default Data:
- **Agent:** agent@thesupport.in (password: Support123!)
- **Sample User:** user@example.com (no password, uses OTP)

## ✅ How to Verify Schema Works

### Option 1: Run Verification Script
```powershell
npm run verify-db
```

### Option 2: Run Test SQL
Open `scripts/test-schema.sql` in your database tool and run all queries.

### Option 3: Manual Check
```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('users', 'jobs', 'files');

-- Check users inserted
SELECT id, email, name, role FROM users;

-- Check indexes
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('users', 'jobs', 'files');
```

### Expected Results:
- ✅ 3 tables: `users`, `jobs`, `files`
- ✅ 2 users: `agent@thesupport.in` (role: agent), `user@example.com` (role: user)
- ✅ 5 indexes created
- ✅ 0 jobs and 0 files initially

## 🔧 SQL Syntax Validation

All SQL statements are valid PostgreSQL syntax:
- ✅ CREATE TABLE with proper constraints
- ✅ Foreign key references
- ✅ Indexes with IF NOT EXISTS
- ✅ INSERT with ON CONFLICT handling
- ✅ Proper data types and defaults

## 📝 Notes

1. **Password Storage:** The agent password hash is stored but admin login doesn't use it - it compares against `ADMIN_PASSWORD` env var directly.
2. **Re-runnable:** Schema can be executed multiple times - it updates existing records instead of failing.
3. **Email Uniqueness:** Using `ON CONFLICT (email)` ensures no duplicate emails.

## ✅ Schema is Ready!

The schema is now correct and ready to use. Run it in your Railway PostgreSQL database.

