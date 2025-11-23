import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import { getJobsOpenMoreThan15Minutes } from '@/lib/db';

const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';

export async function GET() {
  try {
    const session = await getServerSession(adminAuthOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email?.toLowerCase().trim();
    const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
    const isAdmin = (session.user as any)?.isAdmin;
    
    if (!isAdmin || !email || email !== adminEmailLower) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const jobs = await getJobsOpenMoreThan15Minutes();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching long-open jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

