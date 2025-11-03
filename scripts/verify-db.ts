/**
 * Database verification script
 * Checks if all required tables exist in the database
 * 
 * Usage: 
 *   npx tsx scripts/verify-db.ts
 */

import { query } from '../lib/db-client';

async function verifyDatabase() {
  try {
    console.log('🔍 Checking database tables...\n');
    
    // Check if users table exists
    const usersCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    console.log(`✅ users table: ${usersCheck.rows[0].exists ? 'EXISTS' : '❌ MISSING'}`);
    
    // Check if jobs table exists
    const jobsCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'jobs'
      );
    `);
    console.log(`✅ jobs table: ${jobsCheck.rows[0].exists ? 'EXISTS' : '❌ MISSING'}`);
    
    // Check if files table exists
    const filesCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'files'
      );
    `);
    console.log(`✅ files table: ${filesCheck.rows[0].exists ? 'EXISTS' : '❌ MISSING'}`);
    
    // Count records in each table
    console.log('\n📊 Table Record Counts:\n');
    
    try {
      const usersCount = await query('SELECT COUNT(*) as count FROM users');
      console.log(`   users: ${usersCount.rows[0].count} records`);
      
      const jobsCount = await query('SELECT COUNT(*) as count FROM jobs');
      console.log(`   jobs: ${jobsCount.rows[0].count} records`);
      
      const filesCount = await query('SELECT COUNT(*) as count FROM files');
      console.log(`   files: ${filesCount.rows[0].count} records`);
    } catch (error) {
      console.log('   (Cannot count - tables may not exist yet)');
    }
    
    // Check for default agent
    console.log('\n👤 Checking default agent:\n');
    try {
      const agent = await query("SELECT id, email, name, role FROM users WHERE email = 'agent@thesupport.in'");
      if (agent.rows.length > 0) {
        console.log(`   ✅ Default agent found: ${agent.rows[0].name} (${agent.rows[0].email})`);
      } else {
        console.log('   ⚠️  Default agent not found');
      }
    } catch (error) {
      console.log('   (Cannot check agent - table may not exist)');
    }
    
    // Check indexes
    console.log('\n📑 Checking indexes:\n');
    const indexes = await query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('users', 'jobs', 'files')
      ORDER BY tablename, indexname;
    `);
    
    if (indexes.rows.length > 0) {
      indexes.rows.forEach((idx: any) => {
        console.log(`   ✅ ${idx.indexname}`);
      });
    } else {
      console.log('   ⚠️  No indexes found');
    }
    
    console.log('\n✨ Database verification complete!\n');
    
  } catch (error: any) {
    console.error('❌ Error verifying database:', error.message);
    console.error('\nMake sure:');
    console.error('1. DATABASE_URL environment variable is set');
    console.error('2. Database is accessible');
    console.error('3. Schema has been initialized (run scripts/init-db.ts)');
    process.exit(1);
  }
}

verifyDatabase();

