-- Quick SQL Queries to Verify Database Tables
-- Run these queries in your database tool after executing db-schema.sql

-- 1. Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('users', 'jobs', 'files')
ORDER BY table_name;

-- 2. Count records in each table
SELECT 
  'users' as table_name, 
  COUNT(*) as record_count 
FROM users
UNION ALL
SELECT 
  'jobs' as table_name, 
  COUNT(*) as record_count 
FROM jobs
UNION ALL
SELECT 
  'files' as table_name, 
  COUNT(*) as record_count 
FROM files;

-- 3. Check if default agent exists
SELECT id, email, name, role, company
FROM users 
WHERE email = 'agent@thesupport.in';

-- 4. Check if sample user exists
SELECT id, email, name, role, company
FROM users 
WHERE email = 'user@example.com';

-- 5. List all indexes
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('users', 'jobs', 'files')
ORDER BY tablename, indexname;

-- Expected Results:
-- ✅ Should see 3 tables: files, jobs, users
-- ✅ users table should have 2 records (agent + sample user)
-- ✅ jobs table should have 0 records initially
-- ✅ files table should have 0 records initially
-- ✅ Should see 5 indexes created

