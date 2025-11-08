import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getJobById, updateJobDueDate } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'agent') {
    return NextResponse.json({ error: 'Only agents can update SLA settings' }, { status: 403 });
  }

  const body = await request.json();
  const jobId = body?.jobId as string | undefined;
  const dueAt = body?.dueAt as string | undefined;

  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  const job = await getJobById(jobId);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const updatedJob = await updateJobDueDate(jobId, dueAt || null);

  return NextResponse.json({
    job: updatedJob,
  });
}

