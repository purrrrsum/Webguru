#!/usr/bin/env tsx
/**
 * Non-interactive admin creation from environment variables
 *
 * Usage (Railway → Deployments → Run Command):
 * ADMIN_USERNAME="Jaffar" ADMIN_EMAIL="jaffar@thesupport.agency" ADMIN_PASSWORD="Admin@2321@" npm run create-admin-from-env
 *
 * Required ENVs:
 *  - ADMIN_USERNAME
 *  - ADMIN_EMAIL
 *  - ADMIN_PASSWORD
 * Optional:
 *  - ADMIN_FULL_NAME (defaults to ADMIN_USERNAME)
 *  - ADMIN_ROLE ('admin' | 'sub_admin', defaults to 'admin')
 */

import { hash } from 'bcryptjs';
import { query } from '../lib/db-client';
import { nanoid } from 'nanoid';

async function main() {
  try {
    const username = process.env.ADMIN_USERNAME?.trim();
    const email = process.env.ADMIN_EMAIL?.trim();
    const password = process.env.ADMIN_PASSWORD;
    const fullName = (process.env.ADMIN_FULL_NAME || username || '').trim();
    const role = (process.env.ADMIN_ROLE === 'sub_admin' ? 'sub_admin' : 'admin') as 'admin' | 'sub_admin';

    if (!username || !email || !password) {
      console.error('❌ Missing required environment variables.');
      console.error('   Required: ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD');
      process.exit(1);
    }

    // Ensure admins table exists
    try {
      await query('SELECT 1 FROM admins LIMIT 1');
    } catch (error: any) {
      if (error?.message?.includes('does not exist')) {
        console.error('❌ Admins table does not exist. Run: npm run setup-admin-db');
        process.exit(1);
      }
      throw error;
    }

    // Check if user exists
    const existing = await query(
      'SELECT id FROM admins WHERE username = $1 OR email = $2',
      [username, email]
    );
    const hashedPassword = await hash(password, 10);
    const canDelete = role === 'admin';

    if (existing.rows.length > 0) {
      // Update existing admin (by username or email)
      const res = await query(
        `UPDATE admins
         SET password = $1,
             full_name = COALESCE($2, full_name),
             role = $3,
             can_delete = $4,
             updated_at = NOW()
         WHERE username = $5 OR email = $6
         RETURNING id, username, email, role`,
        [hashedPassword, fullName || username, role, canDelete, username, email]
      );
      const a = res.rows[0];
      console.log('✅ Admin updated successfully');
      console.log(`   Username: ${a?.username || username}`);
      console.log(`   Email:    ${a?.email || email}`);
      console.log(`   Role:     ${a?.role || role}`);
      console.log('   Note: Change the password periodically for security.');
    } else {
      // Create new admin
      const adminId = nanoid();
      await query(
        `INSERT INTO admins (id, username, email, password, full_name, role, can_create, can_delete, can_manage_users, can_manage_agents, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)`,
        [adminId, username, email, hashedPassword, fullName || username, role, true, canDelete, true, true]
      );
      console.log('✅ Admin created successfully');
      console.log(`   Username: ${username}`);
      console.log(`   Email:    ${email}`);
      console.log(`   Role:     ${role}`);
      console.log('   Note: Change the password periodically for security.');
    }
  } catch (err: any) {
    console.error('❌ Error creating admin:', err?.message || err);
    process.exit(1);
  }
}

main();


