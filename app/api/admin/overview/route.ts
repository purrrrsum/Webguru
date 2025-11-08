import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getOpenAnnotations,
  getJobsSummaryForAdmin,
  getSLAOverview,
  evaluateSLAStatuses,
} from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'agent' || session.user.email !== 'admin@thesupport.agency') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await evaluateSLAStatuses();

  const [slaOverview, jobs, annotations] = await Promise.all([
    getSLAOverview(),
    getJobsSummaryForAdmin(50),
    getOpenAnnotations(50),
  ]);

  return NextResponse.json({
    slaOverview,
    jobs,
    annotations,
  });
}

