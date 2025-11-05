#!/usr/bin/env tsx
/**
 * Script to create admin user
 * Run: npx tsx scripts/create-admin.ts
 */

import { hash } from 'bcryptjs';
import { query } from '../lib/db-client';
import { nanoid } from 'nanoid';

async function createAdmin() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      readline.question(prompt, resolve);
    });
  };

  try {
    console.log('🔐 Create Admin User\n');

    const username = await question('Username: ');
    const email = await question('Email: ');
    const password = await question('Password: ');
    const fullName = await question('Full Name: ');
    const role = await question('Role (admin/sub_admin) [admin]: ') || 'admin';

    if (!username || !email || !password || !fullName) {
      console.error('❌ All fields are required!');
      process.exit(1);
    }

    if (role !== 'admin' && role !== 'sub_admin') {
      console.error('❌ Role must be "admin" or "sub_admin"');
      process.exit(1);
    }

    const hashedPassword = await hash(password, 10);
    const adminId = nanoid();

    // Check if table exists
    try {
      await query('SELECT 1 FROM admins LIMIT 1');
    } catch (error: any) {
      if (error.message?.includes('does not exist')) {
        console.error('❌ Admins table does not exist!');
        console.error('   Run: npm run setup-admin-db');
        process.exit(1);
      }
      throw error;
    }

    // Check if username or email already exists
    const existing = await query(
      'SELECT id FROM admins WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existing.rows.length > 0) {
      console.error('❌ Username or email already exists!');
      process.exit(1);
    }

    // Create admin
    const canDelete = role === 'admin';
    await query(
      `INSERT INTO admins (id, username, email, password, full_name, role, can_create, can_delete, can_manage_users, can_manage_agents)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [adminId, username, email, hashedPassword, fullName, role, true, canDelete, true, true]
    );

    console.log('\n✅ Admin created successfully!');
    console.log(`   Username: ${username}`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    console.log(`   Can Delete: ${canDelete}`);
  } catch (error: any) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    readline.close();
  }
}

createAdmin();

