import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserById, updateUser, isDatabaseError } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching profile:', error);
    if (isDatabaseError(error)) {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
      }

      return NextResponse.json({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email?.split('@')[0] || 'User',
        company: '',
        address: '',
        phone: '',
        jobCount: 0,
        role: session.user.role,
        warning: 'Database is not configured. Showing profile from session only.',
      });
    }
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, company, address, email, phone } = await request.json();

    const user = await updateUser(session.user.id, {
      name,
      company,
      address,
      email,
      phone,
    });

    if (!user) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating profile:', error);
    if (isDatabaseError(error)) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
      }

      const body = await request.json().catch(() => ({}));

      return NextResponse.json({
        id: session.user.id,
        email: body.email || session.user.email,
        name: body.name || session.user.name || 'User',
        company: body.company || '',
        address: body.address || '',
        phone: body.phone || '',
        jobCount: 0,
        role: session.user.role,
        warning: 'Database is not configured. Changes are not persisted.',
      });
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
