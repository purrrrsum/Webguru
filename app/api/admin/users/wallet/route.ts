import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { adminAuthOptions } from '@/lib/admin-auth';
import { updateWalletBalance } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(adminAuthOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const email = session.user.email?.toLowerCase().trim();
        const isAdmin = (session.user as any)?.isAdmin;

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { userId, amount } = await request.json();

        if (!userId || typeof amount !== 'number') {
            return NextResponse.json({ error: 'User ID and amount are required' }, { status: 400 });
        }

        // Amount can be positive or negative (for manual adjustments)
        await updateWalletBalance(userId, amount);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating wallet:', error);
        return NextResponse.json(
            { error: 'Failed to update wallet balance' },
            { status: 500 }
        );
    }
}
