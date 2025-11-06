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
    
    // Provide specific error messages
    if (error.message?.includes('does not exist')) {
      return NextResponse.json({ 
        error: 'Database table not found',
        details: 'Admins table does not exist. Please run database setup.',
        hint: 'Run: npm run setup-admin-db or npm run setup-complete-db'
      }, { status: 500 });
    }
    
    if (error.message?.includes('connection') || error.code === 'ECONNREFUSED') {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: 'Cannot connect to database. Please check DATABASE_URL.',
        hint: 'Check Railway PostgreSQL service status'
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Login failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

