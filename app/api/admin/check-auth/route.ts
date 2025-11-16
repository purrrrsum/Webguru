import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';

const ADMIN_EMAIL = 'jaffarsadiq1001@gmail.com';

export async function GET() {
  try {
    const session = await getServerSession(adminAuthOptions);
    
    if (!session?.user) {
      return NextResponse.json({ authorized: false }, { status: 401 });
    }

    const email = session.user.email?.toLowerCase().trim();
    const adminEmailLower = ADMIN_EMAIL.toLowerCase().trim();
    const isAdmin = (session.user as any)?.isAdmin;
    
    const authorized = isAdmin && email === adminEmailLower;
    
    return NextResponse.json({ authorized });
  } catch (error) {
    return NextResponse.json({ authorized: false }, { status: 500 });
  }
}

