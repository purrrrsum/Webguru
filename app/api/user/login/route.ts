import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { compare } from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Find user in database
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if user has a password
    if (!user.password) {
      return NextResponse.json({ error: 'Password not set for this account' }, { status: 401 });
    }

    // Verify password
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Return user info (without password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      email: user.email,
    });
  } catch (error) {
    console.error('Error in user login:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

