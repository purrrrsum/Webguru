import { NextRequest, NextResponse } from 'next/server';
import { getAdminByUsername } from '@/lib/db-admin';
import { compare } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    const admin = await getAdminByUsername(username);

    if (!admin) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    if (!admin.isActive) {
      return NextResponse.json({ error: 'Account is inactive' }, { status: 403 });
    }

    if (!admin.password) {
      return NextResponse.json({ error: 'Password not set' }, { status: 401 });
    }

    // Verify password
    const passwordMatch = await compare(password, admin.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Update last login
    const { updateAdminLastLogin } = await import('@/lib/db-admin');
    await updateAdminLastLogin(admin.id);

    // Return admin info (without password)
    const { password: _, ...adminWithoutPassword } = admin;

    return NextResponse.json({
      success: true,
      admin: adminWithoutPassword,
    });
  } catch (error: any) {
    console.error('Error in admin login:', error);
    return NextResponse.json({ 
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

