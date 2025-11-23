import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import { setWebsiteColor } from '@/lib/db';

const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(adminAuthOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email?.toLowerCase().trim();
    const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
    const isAdmin = (session.user as any)?.isAdmin;
    
    if (!isAdmin || !email || email !== adminEmailLower) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { key, value } = await request.json();

    if (!key || !value) {
      return NextResponse.json({ error: 'Key and value required' }, { status: 400 });
    }

    // Validate hex color
    if (!/^#[0-9A-F]{6}$/i.test(value)) {
      return NextResponse.json({ error: 'Invalid color format' }, { status: 400 });
    }

    await setWebsiteColor(key, value);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting website color:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

