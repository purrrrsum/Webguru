import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { FileData } from '@/lib/utils';
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

    if (!file || !jobId) {
      return NextResponse.json({ error: 'File and jobId required' }, { status: 400 });
    }

    // Check file size (20MB = 20 * 1024 * 1024 bytes)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 20MB limit' }, { status: 400 });
    }

    // Save file to local storage first
    try {
      savedFileUrl = await saveFile(file, file.name);
    } catch (fileError: any) {
      console.error('Error saving file to disk:', fileError);
      return NextResponse.json({ 
        error: 'Failed to save file to storage',
        details: fileError.message 
      }, { status: 500 });
    }
    
    // Get full URL (for production)
    // Railway auto-sets NEXTAUTH_URL via RAILWAY_PUBLIC_DOMAIN
    const baseUrl = process.env.NEXTAUTH_URL 
      || (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : null)
      || process.env.NEXT_PUBLIC_BASE_URL 
      || (request.headers.get('host') ? `https://${request.headers.get('host')}` : 'http://localhost:3000');
    const fullUrl = `${baseUrl}${savedFileUrl}`;

    // Save file metadata to PostgreSQL
    let fileData;
    try {
      fileData = await createFile({
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
      
      // Provide detailed error message for database issues
      const errorMessage = dbError.message || 'Unknown database error';
      const isConnectionError = 
        errorMessage.includes('connection') || 
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('timeout') ||
        dbError.code === 'ECONNREFUSED';
      
      if (isConnectionError) {
        return NextResponse.json({ 
          error: 'Database connection failed',
          details: 'Cannot connect to database. Please check DATABASE_URL and ensure database is running.',
          hint: 'Check Railway PostgreSQL service status'
        }, { status: 500 });
      }
      
      if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Database table not found',
          details: 'The files table does not exist. Please run database setup.',
          hint: 'Run: npm run setup-db'
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: 'Failed to save file to database',
        details: errorMessage,
        errorCode: dbError.code
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, file: fileData });
  } catch (error: any) {
    console.error('Unexpected error uploading file:', error);
    
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
      error: 'Failed to upload file',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
