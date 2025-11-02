/**
 * Database initialization script for Hostinger
 * Run this once to set up the database schema
 * 
 * Usage: 
 *   npx tsx scripts/init-db.ts
 *   or
 *   node --loader ts-node/esm scripts/init-db.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { query } from '../lib/db-client';

async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    const schemaPath = join(process.cwd(), 'lib', 'db-schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await query(statement);
        console.log('✓ Executed statement');
      } catch (error: any) {
        // Ignore "already exists" errors
        if (!error.message.includes('already exists') && !error.message.includes('duplicate')) {
          console.error('Error executing statement:', error.message);
          console.error('Statement:', statement.substring(0, 100));
        }
      }
    }

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
