#!/usr/bin/env tsx
/**
 * Script to check if messages table exists and test message functionality
 * Run: npx tsx scripts/check-messages-table.ts
 */

import { query } from '../lib/db-client';

const checkMessagesTable = async () => {
  console.log('🔍 Checking Messages Table...\n');

  try {
    // Check if messages table exists
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'messages'
      );
    `);

    const tableExists = tableCheck.rows[0]?.exists;

    if (!tableExists) {
      console.log('❌ Messages table does NOT exist!');
      console.log('\n📝 To create it, run:');
      console.log('   npm run setup-db');
      console.log('\n   Or execute lib/db-schema.sql in your database');
      process.exit(1);
    }

    console.log('✅ Messages table exists');

    // Check table structure
    const columns = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'messages'
      ORDER BY ordinal_position;
    `);

    console.log('\n📋 Table Structure:');
    console.log('─────────────────────────────────────');
    columns.rows.forEach((col: any) => {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
    });

    // Check indexes
    const indexes = await query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'messages';
    `);

    console.log('\n📊 Indexes:');
    console.log('─────────────────────────────────────');
    if (indexes.rows.length === 0) {
      console.log('  ⚠️  No indexes found (should have indexes for performance)');
    } else {
      indexes.rows.forEach((idx: any) => {
        console.log(`  ✅ ${idx.indexname}`);
      });
    }

    // Count messages
    const count = await query('SELECT COUNT(*) as count FROM messages');
    console.log(`\n💬 Total Messages: ${count.rows[0]?.count || 0}`);

    // Test message creation
    console.log('\n🧪 Testing Message Creation...');
    try {
      const testResult = await query(`
        INSERT INTO messages (id, job_id, sender_id, message, created_at)
        VALUES ('test-msg-' || EXTRACT(EPOCH FROM NOW())::text, 
                (SELECT id FROM jobs LIMIT 1),
                (SELECT id FROM users WHERE role = 'user' LIMIT 1),
                'Test message',
                NOW())
        RETURNING id, job_id, sender_id, message;
      `);

      if (testResult.rows.length > 0) {
        console.log('✅ Message creation test: PASSED');
        
        // Clean up test message
        await query(`DELETE FROM messages WHERE id = $1`, [testResult.rows[0].id]);
        console.log('🧹 Test message cleaned up');
      } else {
        console.log('⚠️  Message creation test: No jobs/users found to test with');
      }
    } catch (testError: any) {
      console.log('❌ Message creation test: FAILED');
      console.log(`   Error: ${testError.message}`);
      if (testError.code) {
        console.log(`   Code: ${testError.code}`);
      }
    }

    console.log('\n✅ Messages table check complete!');
  } catch (error: any) {
    console.error('❌ Error checking messages table:', error.message);
    if (error.code) {
      console.error('   Database error code:', error.code);
    }
    process.exit(1);
  }
};

checkMessagesTable();

