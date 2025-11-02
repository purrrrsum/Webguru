import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFileById, deleteFile as deleteFileFromDb } from '@/lib/db';
import { deleteFile as deleteFileFromStorage } from '@/lib/file-storage';

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

    // Only delete if both ticks are done
    if (!file.userTick || !file.agentTick) {
      return NextResponse.json({ error: 'Both ticks required to delete' }, { status: 400 });
    }

    // Delete from file storage
    try {
      await deleteFileFromStorage(file.url);
    } catch (error) {
      console.error('Error deleting file from storage:', error);
      // Continue to remove from database even if file deletion fails
    }

    // Remove from database
    const deleted = await deleteFileFromDb(fileId);

    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete file from database' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete route:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
