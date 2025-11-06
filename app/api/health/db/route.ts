import { NextResponse } from 'next/server';
import { query } from '@/lib/db-client';

// GET - Check database connection and status
export async function GET() {
  const checks = {
    databaseUrl: !!process.env.DATABASE_URL || !!process.env.POSTGRES_URL,
    connection: false,
    tables: [] as string[],
    usersCount: 0,
    agentsCount: 0,
    error: null as string | null,
  };

  try {
    // Check if DATABASE_URL is set
    if (!checks.databaseUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL not configured',
        checks: {
          ...checks,
          error: 'DATABASE_URL or POSTGRES_URL environment variable is not set',
        },
        solution: {
          step1: 'Go to Railway Dashboard → Your Project',
          step2: 'Click "+ New" → "Database" → "Add PostgreSQL"',
          step3: 'Railway will automatically set DATABASE_URL',
          step4: 'Run: npm run setup-db to initialize tables',
        },
      }, { status: 503 });
    }

    // Test connection
    try {
      await query('SELECT 1');
      checks.connection = true;
    } catch (error: any) {
      checks.error = error.message;
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        checks,
        solution: {
          step1: 'Verify DATABASE_URL is correct in Railway Variables',
          step2: 'Check PostgreSQL service is running',
          step3: 'Verify connection string format: postgresql://user:pass@host:port/db',
        },
      }, { status: 503 });
    }

    // Check tables exist
    try {
      const tablesResult = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'jobs', 'files', 'messages')
        ORDER BY table_name
      `);
      checks.tables = tablesResult.rows.map((r: any) => r.table_name);
    } catch (error: any) {
      checks.error = error.message;
    }

    // Count users and agents
    try {
      const usersResult = await query(`
        SELECT role, COUNT(*) as count
        FROM users
        GROUP BY role
      `);
      
      usersResult.rows.forEach((row: any) => {
        if (row.role === 'user') {
          checks.usersCount = parseInt(row.count);
        } else if (row.role === 'agent') {
          checks.agentsCount = parseInt(row.count);
        }
      });
    } catch (error: any) {
      // Tables might not exist yet
      if (!error.message?.includes('does not exist')) {
        checks.error = error.message;
      }
    }

    // Determine status
    const hasAllTables = checks.tables.length >= 3; // users, jobs, files (messages optional)
    const status = hasAllTables && checks.connection ? 'healthy' : 'partial';

    return NextResponse.json({
      status,
      message: hasAllTables 
        ? 'Database is configured and ready' 
        : 'Database connected but tables not initialized',
      checks,
      nextSteps: hasAllTables ? [] : [
        'Run: npm run setup-db in Railway Dashboard',
        'Or execute lib/db-schema.sql manually in Railway SQL Editor',
      ],
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Database check failed',
      checks: {
        ...checks,
        error: error.message,
      },
    }, { status: 500 });
  }
}

