#!/usr/bin/env tsx
/**
 * Complete Database Setup Script
 * 
 * This script creates ALL necessary tables for:
 * - Users and Agents (login)
 * - Admin panel
 * - Messages
 * - Password resets
 * 
 * Usage:
 *   npx tsx scripts/setup-complete-database.ts
 *   OR
 *   npm run setup-complete-db
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { query } from '../lib/db-client';

async function setupCompleteDatabase() {
  try {
    console.log('🔧 Setting up complete database...\n');

    // Step 1: Setup main schema (users, jobs, files, messages)
    console.log('📋 Step 1: Setting up main schema (users, jobs, files, messages)...');
    const mainSchemaPath = join(process.cwd(), 'lib', 'db-schema.sql');
    const mainSchema = readFileSync(mainSchemaPath, 'utf-8');

    const mainStatements = mainSchema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of mainStatements) {
      try {
        await query(statement);
        console.log('✅ Executed:', statement.substring(0, 60) + '...');
      } catch (error: any) {
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          console.log('⚠️  Already exists:', statement.substring(0, 60) + '...');
        } else {
          console.error('❌ Error:', error.message);
          console.error('   Statement:', statement.substring(0, 100));
          throw error;
        }
      }
    }

    // Step 2: Setup admin schema (admins, password_reset_requests, admin_activity_log)
    console.log('\n📋 Step 2: Setting up admin schema (admins, password_reset_requests)...');
    const adminSchemaPath = join(process.cwd(), 'lib', 'db-schema-admin.sql');
    const adminSchema = readFileSync(adminSchemaPath, 'utf-8');

    const adminStatements = adminSchema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of adminStatements) {
      try {
        await query(statement);
        console.log('✅ Executed:', statement.substring(0, 60) + '...');
      } catch (error: any) {
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          console.log('⚠️  Already exists:', statement.substring(0, 60) + '...');
        } else {
          console.error('❌ Error:', error.message);
          console.error('   Statement:', statement.substring(0, 100));
          throw error;
        }
      }
    }

    // Step 3: Verify all tables exist
    console.log('\n📋 Step 3: Verifying tables...');
    const expectedTables = [
      'users',
      'jobs',
      'files',
      'messages',
      'admins',
      'password_reset_requests',
      'admin_activity_log',
    ];

    const tablesCheck = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    const existingTables = tablesCheck.rows.map((r: any) => r.table_name);
    const missingTables = expectedTables.filter((t) => !existingTables.includes(t));

    console.log('\n📊 Table Status:');
    expectedTables.forEach((table) => {
      if (existingTables.includes(table)) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} (MISSING)`);
      }
    });

    if (missingTables.length > 0) {
      console.error(`\n❌ Missing tables: ${missingTables.join(', ')}`);
      process.exit(1);
    }

    // Step 4: Verify default data
    console.log('\n📋 Step 4: Verifying default data...');
    
    const usersCheck = await query('SELECT COUNT(*) as count FROM users');
    const usersCount = parseInt(usersCheck.rows[0]?.count || '0');
    console.log(`  ✅ Users: ${usersCount}`);

    const adminsCheck = await query('SELECT COUNT(*) as count FROM admins');
    const adminsCount = parseInt(adminsCheck.rows[0]?.count || '0');
    console.log(`  ✅ Admins: ${adminsCount}`);

    console.log('\n✅ Complete database setup successful!');
    console.log('\n📝 Login Credentials:');
    console.log('─────────────────────────────────────');
    console.log('Admin Panel:');
    console.log('  URL: /admin-panel/login');
    console.log('  Username: admin');
    console.log('  Password: Admin123!');
    console.log('\nAgent Login:');
    console.log('  URL: /agent-login');
    console.log('  Email: agent@thesupport.in');
    console.log('  Password: Support123!');
    console.log('\nUser Login:');
    console.log('  URL: /auth/signin');
    console.log('  Email: (any user email)');
    console.log('  Password: (set by admin)');
    console.log('\n⚠️  Change default passwords after first login!');
  } catch (error: any) {
    console.error('\n❌ Error setting up database:', error.message);
    if (error.code) {
      console.error('   Database error code:', error.code);
    }
    if (error.message?.includes('does not exist')) {
      console.error('\n💡 Make sure DATABASE_URL is set correctly in Railway Variables');
    }
    process.exit(1);
  }
}

setupCompleteDatabase();

