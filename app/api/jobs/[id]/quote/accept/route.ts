import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getJobById, updateJob } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobId = params.id;
    const job = await getJobById(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const isUser = session.user.role === 'user' && job.userId === session.user.id;
    const isAgent = session.user.role === 'agent' && job.agentId === session.user.id;

    if (!isUser && !isAgent) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!job.quoteAmount || job.quoteAmount <= 0) {
      return NextResponse.json({ error: 'No active quote to accept.' }, { status: 400 });
    }

    // Disallow accepting your own last offer – the other party must confirm
    if (job.quoteLastRole === session.user.role) {
      return NextResponse.json({ error: 'Waiting for the other party to respond to this quote.' }, { status: 400 });
    }

    const updated = await updateJob(jobId, {
      quoteStatus: 'accepted',
      agreedPrice: job.quoteAmount,
    });

    return NextResponse.json({ success: true, job: updated });
  } catch (error) {
    console.error('Error accepting quote:', error);
    return NextResponse.json({ error: 'Failed to accept quote' }, { status: 500 });
  }
}

