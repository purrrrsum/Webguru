import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getJobById,
  getFilesByJobId,
  getUserById,
  getMessagesByJobId,
  isDatabaseError,
} from '@/lib/db';

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
    // Agents can access all user conversations

    const jobFiles = await getFilesByJobId(jobId);
    const messages = await getMessagesByJobId(jobId);

    // Get user info for display
    const otherUserId =
      session.user.role === 'user' ? job.agentId : job.userId;
    const otherUser = await getUserById(otherUserId);

    const jobWithName = {
      ...job,
      userName:
        job.userName ||
        (session.user.role === 'agent'
          ? otherUser?.name || null
          : session.user.name || null),
    };

    const response = NextResponse.json({
      job: jobWithName,
      files: jobFiles,
      messages: messages,
      otherUser: otherUser
        ? { id: otherUser.id, name: otherUser.name, role: otherUser.role }
        : null,
    });
    
    // Add no-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching chat:', error);
    const session = await getServerSession(authOptions);
    const { jobId } = await params;

    if (isDatabaseError(error) && session?.user) {
      const fallbackJob = {
        id: jobId,
        userId: session.user.role === 'agent' ? 'user-temp' : session.user.id,
        agentId: session.user.role === 'agent' ? session.user.id : 'agent-temp',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: `Job ${jobId.slice(0, 8)}`,
        tags: [],
        userName:
          session.user.role === 'agent'
            ? 'User'
            : session.user.name || null,
      };

      const otherUser =
        session.user.role === 'agent'
          ? { id: fallbackJob.userId, name: 'User', role: 'user' as const }
          : {
              id: fallbackJob.agentId,
              name: 'Support Agent',
              role: 'agent' as const,
            };

      return NextResponse.json({
        job: fallbackJob,
        files: [],
        messages: [],
        otherUser,
        warning:
          'Database is not configured. Showing a temporary chat view without stored messages.',
      });
    }

    const errorResponse = NextResponse.json({ error: 'Failed to fetch chat' }, { status: 500 });
    errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return errorResponse;
  }
}
