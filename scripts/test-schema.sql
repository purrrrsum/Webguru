-- Test SQL to verify schema works correctly
-- Run this after db-schema.sql to verify everything is set up

-- 1. Check tables exist
SELECT 'Tables Check' as test;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('users', 'jobs', 'files');

-- 2. Check agent user exists
SELECT 'Agent User Check' as test;
SELECT id, email, name, role, company 
FROM users 
WHERE email = 'agent@thesupport.in';

-- 3. Check sample user exists
SELECT 'Sample User Check' as test;
SELECT id, email, name, role, company 
FROM users 
WHERE email = 'user@example.com';

-- 4. Check indexes
SELECT 'Indexes Check' as test;
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('users', 'jobs', 'files')
ORDER BY tablename, indexname;

-- 5. Test ON CONFLICT - try inserting again (should not duplicate)
SELECT 'ON CONFLICT Test' as test;
INSERT INTO users (id, email, name, company, address, phone, job_count, role)
VALUES (
  'user1',
  'user@example.com',
  'John Doe Updated',
  'ABC Designs Updated',
  '123, MG Road, Mumbai, India',
  '+919876543210',
  0,
  'user'
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company;

-- 6. Verify update worked
SELECT 'Verify Update' as test;
SELECT name, company FROM users WHERE email = 'user@example.com';

