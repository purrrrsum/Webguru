#!/usr/bin/env tsx
/**
 * Idempotent migration for admins table.
 * - Adds missing columns with proper defaults
 * - Ensures unique indexes on username/email
 * - Ensures role check constraint
 * - Backfills NULLs with sane defaults
 *
 * Run:
 *   npx tsx scripts/migrate-admin-table.ts
 */

import sql, { query } from '../lib/db-client';

async function columnExists(table: string, column: string): Promise<boolean> {
  const res = await query(
    `SELECT 1
     FROM information_schema.columns
     WHERE table_name = $1 AND column_name = $2
     LIMIT 1`,
    [table, column]
  );
  return res.rows.length > 0;
}

async function constraintExists(name: string): Promise<boolean> {
  const res = await query(
    `SELECT 1 FROM pg_constraint WHERE conname = $1 LIMIT 1`,
    [name]
  );
  return res.rows.length > 0;
}

async function indexExists(name: string): Promise<boolean> {
  const res = await query(
    `SELECT 1 FROM pg_class WHERE relname = $1 AND relkind IN ('i','I') LIMIT 1`,
    [name]
  );
  return res.rows.length > 0;
}

async function ensureAdminsTable() {
  // Create table if it does not exist with minimal structure; other columns are added below.
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id VARCHAR(255) PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255),
      full_name VARCHAR(255),
      role VARCHAR(20),
      can_create BOOLEAN,
      can_delete BOOLEAN,
      can_manage_users BOOLEAN,
      can_manage_agents BOOLEAN,
      is_active BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
    )
  `;
}

async function addMissingColumns() {
  // Add columns with IF NOT EXISTS (safe, idempotent)
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS username VARCHAR(255)`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS email VARCHAR(255)`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS password VARCHAR(255)`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(20)`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS can_create BOOLEAN DEFAULT TRUE`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS can_delete BOOLEAN DEFAULT TRUE`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS can_manage_users BOOLEAN DEFAULT TRUE`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS can_manage_agents BOOLEAN DEFAULT TRUE`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;
  await sql`ALTER TABLE admins ADD COLUMN IF NOT EXISTS last_login TIMESTAMP`;

  // Basic NOT NULL enforcement for critical fields if possible
  // Only set NOT NULL if there are no NULLs (avoid failing migrations)
  for (const col of ['username', 'email']) {
    const nulls = await query(`SELECT COUNT(*)::int AS c FROM admins WHERE ${col} IS NULL`);
    if ((nulls.rows[0]?.c || 0) === 0) {
      try {
        await query(`ALTER TABLE admins ALTER COLUMN ${col} SET NOT NULL`);
      } catch {
        // ignore if not possible
      }
    }
  }
}

async function ensureConstraintsAndIndexes() {
  // Unique indexes (safer than adding unique constraints post-hoc)
  if (!(await indexExists('uq_admins_username'))) {
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS uq_admins_username ON admins(username)`;
  }
  if (!(await indexExists('uq_admins_email'))) {
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS uq_admins_email ON admins(email)`;
  }

  // Role CHECK constraint: only add if missing
  if (!(await constraintExists('admins_role_check'))) {
    try {
      await sql`ALTER TABLE admins ADD CONSTRAINT admins_role_check CHECK (role IN ('admin','sub_admin'))`;
    } catch {
      // If it already exists under another name, skip
    }
  }
}

async function backfillDefaults() {
  // Fill missing values with defaults
  await sql`UPDATE admins SET full_name = COALESCE(full_name, username) WHERE full_name IS NULL AND username IS NOT NULL`;
  await sql`UPDATE admins SET role = COALESCE(role, 'admin') WHERE role IS NULL OR role NOT IN ('admin','sub_admin')`;
  await sql`UPDATE admins SET can_create = COALESCE(can_create, TRUE) WHERE can_create IS NULL`;
  await sql`UPDATE admins SET can_delete = COALESCE(can_delete, TRUE) WHERE can_delete IS NULL`;
  await sql`UPDATE admins SET can_manage_users = COALESCE(can_manage_users, TRUE) WHERE can_manage_users IS NULL`;
  await sql`UPDATE admins SET can_manage_agents = COALESCE(can_manage_agents, TRUE) WHERE can_manage_agents IS NULL`;
  await sql`UPDATE admins SET is_active = COALESCE(is_active, TRUE) WHERE is_active IS NULL`;
}

async function migrate() {
  try {
    console.log('🔧 Migrating admins table...');
    await ensureAdminsTable();
    await addMissingColumns();
    await ensureConstraintsAndIndexes();
    await backfillDefaults();
    console.log('✅ Admins table migration complete (idempotent).');
  } catch (err: any) {
    console.error('❌ Migration failed:', err?.message || err);
    process.exit(1);
  }
}

migrate();


