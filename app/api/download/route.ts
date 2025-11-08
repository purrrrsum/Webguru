import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFileById } from '@/lib/db';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fileId = request.nextUrl.searchParams.get('fileId');
    if (!fileId) {
      return NextResponse.json({ error: 'fileId required' }, { status: 400 });
    }

    // Get file metadata from database
    const file = await getFileById(fileId);
    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if user has access to this file
    // Get the job to check user access
    const { getJobById } = await import('@/lib/db');
    const job = await getJobById(file.jobId);
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if user has access (either the user or agent of this job)
    if (session.user.role === 'user' && job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Extract filename from URL (handle both full URLs and relative paths)
    let filename = file.url;
    if (filename.includes('/uploads/')) {
      filename = filename.split('/uploads/')[1];
      // If it's a full URL, extract just the filename
      if (filename.includes('?')) {
        filename = filename.split('?')[0];
      }
    } else if (filename.startsWith('http')) {
      // Full URL - extract just the filename part
      const urlParts = new URL(filename);
      filename = urlParts.pathname.split('/').pop() || file.filename;
    }

    // Try to read file from local storage
    const filePath = join(process.cwd(), 'public', 'uploads', filename);
    
    if (!existsSync(filePath)) {
      // If file doesn't exist locally, try to fetch from URL
      try {
        const response = await fetch(file.url);
        if (!response.ok) {
          return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
        }
        const blob = await response.blob();
        const buffer = Buffer.from(await blob.arrayBuffer());
        
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': file.type,
            'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`,
            'Content-Length': buffer.length.toString(),
          },
        });
      } catch (error) {
        console.error('Error fetching file from URL:', error);
        return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
      }
    }

    // Read file from local storage
    const fileBuffer = await readFile(filePath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': file.type,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 });
  }
}

