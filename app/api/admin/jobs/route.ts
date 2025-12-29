import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import { getAllJobsWithUsers, getFilesByJobId } from '@/lib/db';

const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';

export const dynamic = 'force-dynamic';

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

    const jobs = await getAllJobsWithUsers();
    
    // Add file counts
    const jobsWithFileCounts = await Promise.all(
      jobs.map(async (job) => {
        const files = await getFilesByJobId(job.id);
        return {
          ...job,
          fileCount: files.length,
        };
      })
    );

    return NextResponse.json(jobsWithFileCounts);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

