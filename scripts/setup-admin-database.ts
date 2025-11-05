#!/usr/bin/env tsx
/**
 * Setup admin database tables
 * Run: npm run setup-admin-db
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { query } from '../lib/db-client';

async function setupAdminDatabase() {
  try {
    console.log('🔧 Setting up admin database tables...\n');

    // Read admin schema SQL file
    const schemaPath = join(process.cwd(), 'lib', 'db-schema-admin.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await query(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      } catch (error: any) {
        // Ignore "already exists" errors
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          console.log('⚠️  Already exists:', statement.substring(0, 50) + '...');
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Admin database setup complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Create admin user: npm run create-admin');
    console.log('   2. Or use default admin:');
    console.log('      Username: admin');
    console.log('      Password: Admin123! (change this!)');
  } catch (error: any) {
    console.error('❌ Error setting up admin database:', error.message);
    if (error.code) {
      console.error('   Database error code:', error.code);
    }
    process.exit(1);
  }
}

setupAdminDatabase();

