import { NextResponse } from 'next/server';
import { query } from '@/lib/db-client';

// Simple health check endpoint to test database connection
export async function GET() {
  try {
    // Check if DATABASE_URL is set
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      return NextResponse.json({
        status: 'unhealthy',
        database: 'not_configured',
        message: 'DATABASE_URL is not set',
      }, { status: 503 });
    }

    // Try to query database
    try {
      await query('SELECT 1');
      
      // Try to check if tables exist
      const tablesCheck = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'jobs', 'files')
        ORDER BY table_name
      `);
      
      const existingTables = tablesCheck.rows.map((r: any) => r.table_name);
      const expectedTables = ['users', 'jobs', 'files'];
      const missingTables = expectedTables.filter(t => !existingTables.includes(t));
      
      return NextResponse.json({
        status: 'healthy',
        database: 'connected',
        tables: {
          existing: existingTables,
          missing: missingTables,
          allPresent: missingTables.length === 0,
        },
        message: missingTables.length === 0 
          ? 'Database is healthy and all tables exist'
          : `Missing tables: ${missingTables.join(', ')}. Run: npm run setup-db`,
      });
    } catch (dbError: any) {
      return NextResponse.json({
        status: 'unhealthy',
        database: 'connection_failed',
        message: dbError.message,
        errorCode: dbError.code,
        hint: 'Check DATABASE_URL and ensure database is running',
      }, { status: 503 });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      database: 'error',
      message: error.message,
    }, { status: 500 });
  }
}

