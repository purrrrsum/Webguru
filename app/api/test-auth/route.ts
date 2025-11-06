import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { getAdminByUsername } from '@/lib/db-admin';
import { compare } from 'bcryptjs';

/**
 * Test authentication endpoint
 * POST /api/test-auth
 * Body: { email?: string, username?: string, password: string, type: 'user' | 'agent' | 'admin' }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, username, password, type } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const results: any = {
      type,
      found: false,
      hasPassword: false,
      passwordMatch: false,
      error: null,
      details: {},
    };

    try {
      if (type === 'admin' && username) {
        const admin = await getAdminByUsername(username);
        if (admin) {
          results.found = true;
          results.hasPassword = !!admin.password;
          results.details = {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            isActive: admin.isActive,
          };

          if (admin.password) {
            try {
              results.passwordMatch = await compare(password, admin.password);
            } catch (compareError: any) {
              results.error = `Password comparison failed: ${compareError.message}`;
            }
          } else {
            results.error = 'Admin has no password set';
          }
        } else {
          results.error = 'Admin not found';
        }
      } else if ((type === 'user' || type === 'agent') && email) {
        const user = await getUserByEmail(email);
        if (user) {
          results.found = true;
          results.hasPassword = !!user.password;
          results.details = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };

          if (user.password) {
            try {
              results.passwordMatch = await compare(password, user.password);
            } catch (compareError: any) {
              results.error = `Password comparison failed: ${compareError.message}`;
            }
          } else {
            results.error = 'User has no password set';
          }
        } else {
          results.error = 'User not found';
        }
      } else {
        results.error = 'Invalid parameters. Need email for user/agent or username for admin';
      }
    } catch (dbError: any) {
      results.error = `Database error: ${dbError.message}`;
      if (dbError.message?.includes('does not exist')) {
        results.error = `Database table does not exist. Run: npm run setup-complete-db`;
      }
      if (dbError.code === 'ECONNREFUSED') {
        results.error = 'Database connection refused. Check DATABASE_URL.';
      }
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

