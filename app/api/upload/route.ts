import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FileData } from '@/lib/utils';
import { createFile } from '@/lib/db';
import { saveFile } from '@/lib/file-storage';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobId = formData.get('jobId') as string;

    if (!file || !jobId) {
      return NextResponse.json({ error: 'File and jobId required' }, { status: 400 });
    }

    // Check file size (20MB = 20 * 1024 * 1024 bytes)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 20MB limit' }, { status: 400 });
    }

    // Save file to local storage (Hostinger)
    const fileUrl = await saveFile(file, file.name);
    
    // Get full URL (for production)
    // Railway auto-sets NEXTAUTH_URL via RAILWAY_PUBLIC_DOMAIN
    const baseUrl = process.env.NEXTAUTH_URL 
      || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null)
      || process.env.NEXT_PUBLIC_BASE_URL 
      || (request.headers.get('host') ? `https://${request.headers.get('host')}` : 'http://localhost:3000');
    const fullUrl = `${baseUrl}${fileUrl}`;

    // Save file metadata to PostgreSQL
    const fileData = await createFile({
      id: nanoid(),
      jobId,
      url: fullUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: session.user.id,
      uploadedAt: new Date().toISOString(),
      userTick: false,
      agentTick: false,
    });

    return NextResponse.json({ success: true, file: fileData });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
