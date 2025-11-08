import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { evaluateSLAStatuses, getSLAOverview } from '@/lib/db';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'agent') {
    return NextResponse.json({ error: 'Only agents can run automations' }, { status: 403 });
  }

  const jobs = await evaluateSLAStatuses();
  const summary = await getSLAOverview();

  return NextResponse.json({
    summary,
    processed: jobs.length,
  });
}

