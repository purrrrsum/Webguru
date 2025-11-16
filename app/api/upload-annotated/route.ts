import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createFile } from '@/lib/db';
import { saveFile } from '@/lib/file-storage';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  let savedFileUrl: string | null = null;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobId = formData.get('jobId') as string;
    const originalFileId = formData.get('originalFileId') as string;

    if (!file || !jobId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check file size (20MB = 20 * 1024 * 1024 bytes)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 20MB limit' }, { status: 400 });
    }

    // Save file to local storage
    try {
      savedFileUrl = await saveFile(file, file.name);
    } catch (fileError: any) {
      console.error('Error saving file to disk:', fileError);
      return NextResponse.json({ 
        error: 'Failed to save file to storage',
        details: fileError.message 
      }, { status: 500 });
    }
    
    // Get full URL
    const host = request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.NEXTAUTH_URL 
      || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null)
      || process.env.NEXT_PUBLIC_BASE_URL 
      || (process.env.NODE_ENV === 'production' ? 'https://www.thesupport.agency' : null)
      || (host ? `${protocol}://${host}` : null);
    
    if (!baseUrl) {
      return NextResponse.json({ 
        error: 'Base URL not configured',
        details: 'NEXTAUTH_URL or NEXT_PUBLIC_BASE_URL must be set'
      }, { status: 500 });
    }
    const fullUrl = `${baseUrl}${savedFileUrl}`;

    // Create file record in database
    let fileRecord;
    try {
      fileRecord = await createFile({
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
    } catch (dbError: any) {
      console.error('Database error creating file:', dbError);
      
      // Try to clean up the saved file if database insert fails
      if (savedFileUrl) {
        try {
          const { deleteFile } = await import('@/lib/file-storage');
          await deleteFile(savedFileUrl);
        } catch (cleanupError) {
          console.error('Failed to cleanup file after DB error:', cleanupError);
        }
      }
      
      return NextResponse.json({ 
        error: 'Failed to save file to database',
        details: dbError.message || 'Unknown database error'
      }, { status: 500 });
    }

    return NextResponse.json({ file: fileRecord });
  } catch (error: any) {
    console.error('Error uploading annotated file:', error);
    
    // Cleanup file if it was saved but something else failed
    if (savedFileUrl) {
      try {
        const { deleteFile } = await import('@/lib/file-storage');
        await deleteFile(savedFileUrl);
      } catch (cleanupError) {
        console.error('Failed to cleanup file:', cleanupError);
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to upload annotated file',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}

