import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import sql from '@/lib/db-client';

const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const session = await getServerSession(adminAuthOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email?.toLowerCase().trim();
    const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
    const isAdmin = (session.user as any)?.isAdmin;
    
    if (!isAdmin || !email || email !== adminEmailLower) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users
    const result = await sql`
      SELECT id, email, name, role, job_count, created_at
      FROM users
      ORDER BY created_at DESC
    `;

    const users = result.rows.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      jobCount: row.job_count || 0,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
