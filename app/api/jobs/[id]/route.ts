import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getJobById, updateJob } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const jobId = params.id;
    const job = await getJobById(jobId);
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Only allow user who owns the job to update job number
    if (job.userId !== session.user.id && session.user.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updates = await request.json();
    const allowedUpdates: any = {};
    
    // Only allow updating job number and title
    if (updates.jobNumber !== undefined && typeof updates.jobNumber === 'number') {
      allowedUpdates.jobNumber = updates.jobNumber;
    }
    
    if (updates.title !== undefined && typeof updates.title === 'string') {
      allowedUpdates.title = updates.title.trim().slice(0, 120) || null;
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }

    const updated = await updateJob(jobId, allowedUpdates);
    
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }

    return NextResponse.json({ job: updated });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

