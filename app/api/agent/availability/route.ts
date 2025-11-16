import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateAgentAvailability, getUserById } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.user.role !== 'agent') {
    return NextResponse.json({ error: 'Only agents can update availability' }, { status: 403 });
  }

  try {
    const { isOnline, isReady } = await request.json();
    
    if (typeof isOnline !== 'boolean' || typeof isReady !== 'boolean') {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const updated = await updateAgentAvailability(session.user.id, isOnline, isReady);
    
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        isOnline: updated.isOnline,
        isReady: updated.isReady,
      }
    });
  } catch (error) {
    console.error('Error updating agent availability:', error);
    return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await getUserById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      isOnline: user.isOnline || false,
      isReady: user.isReady || false,
    });
  } catch (error) {
    console.error('Error fetching agent availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
}

