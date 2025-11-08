import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { nanoid } from 'nanoid';
import {
  createJobVersion,
  getJobById,
  getVersionsByJobId,
} from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobId = request.nextUrl.searchParams.get('jobId');
  if (!jobId) {
    return NextResponse.json({ error: 'jobId query parameter is required' }, { status: 400 });
  }

  const job = await getJobById(jobId);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  if (session.user.role === 'user' && job.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const versions = await getVersionsByJobId(jobId);
  return NextResponse.json({ versions });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const jobId = body?.jobId as string | undefined;
  const fileId = typeof body?.fileId === 'string' ? body.fileId : undefined;
  const notes = typeof body?.notes === 'string' ? body.notes.trim() : undefined;

  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  const job = await getJobById(jobId);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  if (session.user.role === 'user' && job.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const version = await createJobVersion({
    id: nanoid(),
    jobId,
    fileId,
    notes,
    createdBy: session.user.id,
  });

  return NextResponse.json({ version });
}

