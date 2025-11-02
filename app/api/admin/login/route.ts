import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Check hardcoded admin credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'agent@thesupport.in';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Support123!';

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Find agent user in database
    const agent = await getUserByEmail(email);

    if (!agent || agent.role !== 'agent') {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Return agent info (password verification already done above)
    const { password: _, ...agentWithoutPassword } = agent;
    return NextResponse.json({
      success: true,
      user: agentWithoutPassword,
      email: agent.email,
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
