import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createUser, getAllUsers } from '@/lib/db';

// GET - List all users and agents
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow agents to view users
    if (!session?.user || session.user.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    
    // Check if it's a database connection error
    if (error.message?.includes('DATABASE_URL') || error.message?.includes('connection')) {
      return NextResponse.json({
        error: 'Database not configured',
        details: 'DATABASE_URL environment variable is not set in Railway',
        hint: 'Add PostgreSQL database in Railway Dashboard → + New → Database → Add PostgreSQL',
        fullError: error.message,
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch users',
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Create a new user or agent
export async function POST(request: NextRequest) {
  let body: any = {};
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow agents to create users
    if (!session?.user || session.user.role !== 'agent') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    body = await request.json();
    const { email, name, company, address, phone, role, password } = body;

    // Validation
    if (!email || !name) {
      return NextResponse.json({ 
        error: 'Email and name are required' 
      }, { status: 400 });
    }

    if (role && !['user', 'agent'].includes(role)) {
      return NextResponse.json({ 
        error: 'Role must be either "user" or "agent"' 
      }, { status: 400 });
    }

    // Create user
    const newUser = await createUser({
      email,
      name,
      company: company || '',
      address: address || '',
      phone: phone || '',
      jobCount: 0,
      role: (role as 'user' | 'agent') || 'user',
      password: password || undefined,
    });

    return NextResponse.json({ 
      success: true,
      user: newUser,
      message: `${role || 'User'} created successfully`
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Check if it's a database connection error
    if (error.message?.includes('DATABASE_URL') || 
        error.message?.includes('connection') ||
        error.code === 'ECONNREFUSED') {
      return NextResponse.json({
        error: 'Database not configured',
        details: 'DATABASE_URL environment variable is not set in Railway',
        hint: 'Add PostgreSQL database in Railway Dashboard → + New → Database → Add PostgreSQL',
        fullError: error.message,
      }, { status: 503 });
    }

    // Check if it's a duplicate email error
    if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
      return NextResponse.json({
        error: 'User already exists',
        details: `A user with email ${body.email} already exists`,
      }, { status: 409 });
    }

    // Check if tables don't exist
    if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
      return NextResponse.json({
        error: 'Database tables not initialized',
        details: 'Database tables have not been created yet',
        hint: 'Run: npm run setup-db in Railway Dashboard → Deployments → Run Command',
        fullError: error.message,
      }, { status: 503 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to create user',
      details: error.message 
    }, { status: 500 });
  }
}

