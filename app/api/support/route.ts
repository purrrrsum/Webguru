import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  ensureDatabaseSetup,
  createSupportTicket,
  getSupportTicketsByUser,
  getAllSupportTickets,
  updateSupportTicketStatus,
  markSupportTicketsAsRead,
  isDatabaseError,
} from '@/lib/db';

function sanitizeDescription(input: string): string {
  return input.trim().slice(0, 5000);
}

function sanitizeSubject(input: string): string {
  return input.trim().slice(0, 200);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureDatabaseSetup();

    const summaryOnly = request.nextUrl.searchParams.get('summary') === 'true';
    const markRead = request.nextUrl.searchParams.get('markRead') === 'true';

    // Treat admin as agent for support tickets
    const isAgentOrAdmin = session.user.role === 'agent' || session.user.role === 'admin';

    if (summaryOnly) {
      if (!isAgentOrAdmin) {
        return NextResponse.json({ unreadCount: 0 });
      }

      const tickets = await getAllSupportTickets();
      const unreadCount = tickets.filter((ticket) => ticket.unreadForAdmin).length;
      return NextResponse.json({ unreadCount });
    }

    const tickets = isAgentOrAdmin
      ? await getAllSupportTickets()
      : await getSupportTicketsByUser(session.user.id);

    let unreadCount: number | undefined;

    if (isAgentOrAdmin) {
      unreadCount = tickets.filter((ticket) => ticket.unreadForAdmin).length;
      if (markRead && unreadCount > 0) {
        await markSupportTicketsAsRead();
        unreadCount = 0;
      }
    }

    return NextResponse.json({ tickets, unreadCount });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    if (isDatabaseError(error)) {
      return NextResponse.json({ tickets: [], warning: 'Database not available' }, { status: 200 });
    }
    return NextResponse.json({ error: 'Failed to load support tickets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, description, priority } = body || {};

    if (!subject || !description) {
      return NextResponse.json({ error: 'Subject and description are required' }, { status: 400 });
    }

    await ensureDatabaseSetup();

    const sanitizedSubject = sanitizeSubject(subject);
    const sanitizedDescription = sanitizeDescription(description);

    // Map admin role to agent for support tickets
    const ticketRole = session.user.role === 'admin' ? 'agent' : session.user.role;

    const ticket = await createSupportTicket({
      userId: session.user.id,
      email: session.user.email,
      role: ticketRole as 'user' | 'agent',
      subject: sanitizedSubject,
      description: sanitizedDescription,
      priority: priority && ['low', 'normal', 'high'].includes(priority) ? priority : 'normal',
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    if (isDatabaseError(error)) {
      return NextResponse.json({
        error: 'Database not available. Please try again later.',
      }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to create support ticket' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Allow both agent and admin to update support tickets
    const isAgentOrAdmin = session?.user?.role === 'agent' || session?.user?.role === 'admin';
    if (!session?.user?.id || !isAgentOrAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, priority, action } = body || {};

    if (action === 'mark_read') {
      await ensureDatabaseSetup();
      await markSupportTicketsAsRead({ ticketId: id });
      return NextResponse.json({ success: true });
    }

    if (!id || (!status && !priority)) {
      return NextResponse.json({ error: 'Ticket id and an update are required' }, { status: 400 });
    }

    await ensureDatabaseSetup();

    const ticket = await updateSupportTicketStatus(id, {
      status: status && ['open', 'in_progress', 'resolved'].includes(status) ? status : undefined,
      priority: priority && ['low', 'normal', 'high'].includes(priority) ? priority : undefined,
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found or no changes applied' }, { status: 404 });
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Error updating support ticket:', error);
    if (isDatabaseError(error)) {
      return NextResponse.json({ error: 'Database not available.' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Failed to update support ticket' }, { status: 500 });
  }
}

