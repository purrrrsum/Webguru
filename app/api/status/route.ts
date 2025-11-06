import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const status = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'unknown',
      nextauth: 'unknown',
    };

    // Check database
    try {
      const { query } = await import('@/lib/db-client');
      await query('SELECT 1');
      status.database = 'connected';
    } catch (error: any) {
      status.database = error.message || 'disconnected';
    }

    // Check NextAuth
    if (process.env.NEXTAUTH_SECRET) {
      status.nextauth = 'configured';
    } else {
      status.nextauth = 'not configured';
    }

    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

