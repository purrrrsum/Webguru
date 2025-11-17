import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import { updateUser } from '@/lib/db';

const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const session = await getServerSession(adminAuthOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email?.toLowerCase().trim();
    const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
    const isAdmin = (session.user as any)?.isAdmin;
    
    if (!isAdmin || !email || email !== adminEmailLower) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    if (role !== 'user' && role !== 'agent') {
      return NextResponse.json(
        { error: 'Invalid role. Must be "user" or "agent"' },
        { status: 400 }
      );
    }

    // Update user role (admin can change roles)
    const updated = await updateUser(userId, { role });

    if (!updated) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        role: updated.role,
      },
    });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}

