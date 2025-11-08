import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getMessagesByJobId, createMessage, markMessagesAsRead } from '@/lib/db';
import { getJobById } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobId = request.nextUrl.searchParams.get('jobId');
    if (!jobId) {
      return NextResponse.json({ error: 'jobId required' }, { status: 400 });
    }

    // Verify user has access to this job
    const job = await getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (session.user.role === 'user' && job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const messages = await getMessagesByJobId(jobId);
    
    // Mark messages as read
    const isUser = session.user.role === 'user';
    await markMessagesAsRead(jobId, session.user.id, isUser);

    const response = NextResponse.json({ messages });
    // Add no-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error) {
    console.error('Error fetching messages:', error);
    const errorResponse = NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return errorResponse;
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId, message } = await request.json();
    
    if (!jobId || !message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'jobId and message required' }, { status: 400 });
    }

    // Verify user has access to this job
    const job = await getJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (session.user.role === 'user' && job.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const newMessage = await createMessage({
      jobId,
      senderId: session.user.id,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      readByUser: session.user.role === 'user',
      readByAgent: session.user.role === 'agent',
    });

    const response = NextResponse.json({ success: true, message: newMessage });
    // Add no-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  } catch (error: any) {
    console.error('Error sending message:', error);
    // Log detailed error for debugging
    if (error.message) {
      console.error('Message error details:', error.message);
      if (error.code) {
        console.error('Database error code:', error.code);
      }
    }
    const errorResponse = NextResponse.json({ 
      error: 'Failed to send message',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
    errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return errorResponse;
  }
}

