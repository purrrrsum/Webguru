import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getJobById, updateJob, getUserById, updateWalletBalance } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow agents and admins to update job status
    if (session.user.role !== 'agent') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const { status, amount } = await request.json();

    if (!status || !['open', 'closed', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const job = await getJobById(id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (status === 'completed') {
      const completionAmount = job.agreedPrice || Number(amount) || 0;
      if (completionAmount <= 0) {
        return NextResponse.json({ error: 'Invalid or missing job price to deduct.' }, { status: 400 });
      }

      const user = await getUserById(job.userId);
      if (!user) {
        return NextResponse.json({ error: 'Job owner not found' }, { status: 404 });
      }

      if ((user.walletBalance || 0) < completionAmount) {
        return NextResponse.json({ error: 'User wallet balance is insufficient for this job' }, { status: 402 });
      }

      // Deduct from wallet & put into Escrow
      // Deduct from user wallet
      await updateWalletBalance(user.id, -completionAmount);
      // Create escrow holding
      const nanoid = (await import('nanoid')).nanoid;
      const escrowId = nanoid();
      const sql = (await import('@/lib/db-client')).default;
      await sql`INSERT INTO escrow_holds (id, job_id, amount) VALUES (${escrowId}, ${job.id}, ${completionAmount})`;

      // Update the agreed price on the job so it's recorded
      await updateJob(id, { status, agreedPrice: completionAmount });
    } else {
      const updatedJob = await updateJob(id, { status });
      if (!updatedJob) {
        return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error updating job status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

