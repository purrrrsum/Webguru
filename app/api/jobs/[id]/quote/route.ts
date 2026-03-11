import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getJobById, updateJob } from '@/lib/db';

export async function PATCH(
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

    // Only participants in the job can negotiate
    const isUser = session.user.role === 'user' && job.userId === session.user.id;
    const isAgent = session.user.role === 'agent' && job.agentId === session.user.id;

    if (!isUser && !isAgent) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const rawAmount = Number(body.amount);
    const rawMin = body.min != null ? Number(body.min) : undefined;
    const rawMax = body.max != null ? Number(body.max) : undefined;

    if (!rawAmount || isNaN(rawAmount) || rawAmount <= 0) {
      return NextResponse.json({ error: 'A valid quote amount is required.' }, { status: 400 });
    }

    // Agent can define / update the negotiation range
    if (isAgent && (rawMin != null || rawMax != null)) {
      if (rawMin == null || rawMax == null || isNaN(rawMin) || isNaN(rawMax) || rawMin <= 0 || rawMax <= 0 || rawMin > rawMax) {
        return NextResponse.json({ error: 'Invalid negotiation range.' }, { status: 400 });
      }

      if (rawAmount < rawMin || rawAmount > rawMax) {
        return NextResponse.json({ error: 'Quote amount must be within the negotiation range.' }, { status: 400 });
      }

      const updated = await updateJob(jobId, {
        quoteMin: rawMin,
        quoteMax: rawMax,
        quoteAmount: rawAmount,
        quoteStatus: 'proposed',
        quoteLastRole: 'agent',
      });

      return NextResponse.json({ success: true, job: updated });
    }

    // User (or agent) counters within existing range
    if (job.quoteMin == null || job.quoteMax == null) {
      return NextResponse.json({ error: 'Negotiation range has not been set by the agent yet.' }, { status: 400 });
    }

    if (rawAmount < job.quoteMin || rawAmount > job.quoteMax) {
      return NextResponse.json({
        error: `Counter amount must be between ${job.quoteMin} and ${job.quoteMax}.`,
      }, { status: 400 });
    }

    const status = isUser ? 'counter_user' : 'counter_agent';

    const updated = await updateJob(jobId, {
      quoteAmount: rawAmount,
      quoteStatus: status,
      quoteLastRole: isUser ? 'user' : 'agent',
    });

    return NextResponse.json({ success: true, job: updated });
  } catch (error) {
    console.error('Error updating quote:', error);
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}

