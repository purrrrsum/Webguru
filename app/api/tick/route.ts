import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFileById, updateFile, incrementUserJobCount, getJobById, updateWalletBalance } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await request.json();
    if (!fileId) {
      return NextResponse.json({ error: 'fileId required' }, { status: 400 });
    }

    const file = await getFileById(fileId);

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Update tick status based on user role
    const updates: any = {};
    if (session.user.role === 'user') {
      updates.userTick = true;
    } else if (session.user.role === 'agent') {
      updates.agentTick = true;
    }

    const updatedFile = await updateFile(fileId, updates);

    if (!updatedFile) {
      return NextResponse.json({ error: 'Failed to update file' }, { status: 500 });
    }

    // Check if both ticks are done (user and agent have confirmed completion)
    if (updatedFile.userTick && updatedFile.agentTick) {
      // Increment job count for the original uploader
      await incrementUserJobCount(file.uploadedBy);

      // Load the related job to access agreed price and agent
      const job = await getJobById(updatedFile.jobId);

      if (job && job.agentId && job.agreedPrice && job.agreedPrice > 0) {
        // Credit the agreed price to the agent's wallet balance
        await updateWalletBalance(job.agentId, job.agreedPrice);

        // Mark the latest held escrow for this job as released
        const sql = (await import('@/lib/db-client')).default;
        await sql`
          UPDATE escrow_holds
          SET status = 'released', released_at = NOW()
          WHERE id = (
            SELECT id FROM escrow_holds
            WHERE job_id = ${job.id} AND status = 'held'
            ORDER BY created_at DESC
            LIMIT 1
          )
        `;
      }

      // Get updated user to return job count
      const { getUserById } = await import('@/lib/db');
      const user = await getUserById(file.uploadedBy);

      return NextResponse.json({
        success: true,
        bothTicked: true,
        jobCount: user?.jobCount || 0,
      });
    }

    return NextResponse.json({ success: true, bothTicked: false });
  } catch (error) {
    console.error('Error in tick route:', error);
    return NextResponse.json({ error: 'Failed to process tick' }, { status: 500 });
  }
}
