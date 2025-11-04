import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getJobById, getFilesByJobId, getUserById } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await params;
    const job = await getJobById(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if user has access to this job
    if (session.user.role === 'user' && job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (session.user.role === 'agent' && job.agentId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const jobFiles = await getFilesByJobId(jobId);

    // Get user info for display
    const otherUserId =
      session.user.role === 'user' ? job.agentId : job.userId;
    const otherUser = await getUserById(otherUserId);

    return NextResponse.json({
      job,
      files: jobFiles,
      otherUser: otherUser
        ? { id: otherUser.id, name: otherUser.name, role: otherUser.role }
        : null,
    });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 });
  }
}
