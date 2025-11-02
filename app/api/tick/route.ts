import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFileById, updateFile, incrementUserJobCount } from '@/lib/db';

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

    // Check if both ticks are done
    if (updatedFile.userTick && updatedFile.agentTick) {
      // Increment job count for user
      await incrementUserJobCount(file.uploadedBy);

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
