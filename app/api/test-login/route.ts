import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db-client';

/**
 * Test endpoint to check database connection and table existence
 * GET /api/test-login
 */
export async function GET(request: NextRequest) {
  try {
    const results: any = {
      database: 'unknown',
      tables: [],
      users: [],
      agents: [],
      admins: [],
      errors: [],
    };

    // Test database connection
    try {
      await query('SELECT 1');
      results.database = 'connected';
    } catch (error: any) {
      results.database = 'disconnected';
      results.errors.push(`Database connection: ${error.message}`);
      return NextResponse.json(results, { status: 503 });
    }

    // Check tables
    try {
      const tablesResult = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);
      results.tables = tablesResult.rows.map((r: any) => r.table_name);
    } catch (error: any) {
      results.errors.push(`Tables check: ${error.message}`);
    }

    // Check users
    try {
      const usersResult = await query('SELECT id, email, name, role FROM users LIMIT 10');
      results.users = usersResult.rows;
    } catch (error: any) {
      results.errors.push(`Users check: ${error.message}`);
    }

    // Check agents
    try {
      const agentsResult = await query("SELECT id, email, name FROM users WHERE role = 'agent' LIMIT 10");
      results.agents = agentsResult.rows;
    } catch (error: any) {
      results.errors.push(`Agents check: ${error.message}`);
    }

    // Check admins
    try {
      const adminsResult = await query('SELECT id, username, email, role FROM admins LIMIT 10');
      results.admins = adminsResult.rows;
    } catch (error: any) {
      if (error.message?.includes('does not exist')) {
        results.errors.push('Admins table does not exist - run: npm run setup-admin-db');
      } else {
        results.errors.push(`Admins check: ${error.message}`);
      }
    }

    // Expected tables
    const expectedTables = ['users', 'jobs', 'files', 'messages', 'admins'];
    const missingTables = expectedTables.filter((t) => !results.tables.includes(t));

    if (missingTables.length > 0) {
      results.missingTables = missingTables;
      results.message = `Missing tables: ${missingTables.join(', ')}. Run: npm run setup-complete-db`;
    } else {
      results.message = 'All tables exist!';
    }

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({
      error: 'Test failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}

