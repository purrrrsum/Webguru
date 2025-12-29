import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import { getAllWebsiteContent, getAllWebsiteColors } from '@/lib/db';

const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';

export const dynamic = 'force-dynamic';

export async function GET() {
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

    const [content, colors] = await Promise.all([
      getAllWebsiteContent(),
      getAllWebsiteColors(),
    ]);

    return NextResponse.json({ content, colors });
  } catch (error) {
    console.error('Error fetching CMS data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

