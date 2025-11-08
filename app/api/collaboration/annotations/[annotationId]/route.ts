import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getJobById, resolveJobAnnotation } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { annotationId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const annotationId = params.annotationId;
  const body = await request.json().catch(() => ({}));
  const jobId = typeof body?.jobId === 'string' ? body.jobId : undefined;

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

  const annotation = await resolveJobAnnotation(annotationId, session.user.id);
  if (!annotation) {
    return NextResponse.json({ error: 'Annotation not found' }, { status: 404 });
  }

  return NextResponse.json({ annotation });
}

