import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getJobsByUserId,
  getJobsByAgentId,
  createJob,
  getFilesByJobId,
  getAllUsers,
} from '@/lib/db';
import { nanoid } from 'nanoid';

function isDatabaseError(error: any) {
  if (!error) return false;
  const message = String(error.message || '').toLowerCase();
  return (
    message.includes('database') ||
    message.includes('connection') ||
    message.includes('relation') ||
    message.includes('sql') ||
    error.code === 'ECONNREFUSED'
  );
}

export async function GET() {
  const session = await getServerSession(authOptions);
  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get jobs based on user role
    let userJobs;
    if (session.user.role === 'user') {
      userJobs = await getJobsByUserId(session.user.id);
    } else if (session.user.role === 'agent') {
      userJobs = await getJobsByAgentId(session.user.id);
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Add file count and unread status to each job
    const jobsWithFiles = await Promise.all(
      userJobs.map(async (job) => {
        const jobFiles = await getFilesByJobId(job.id);
        
        let hasUnread = false;
        if (session.user.role === 'user') {
          hasUnread = jobFiles.some((f) => !f.userTick && f.agentTick);
        } else {
          hasUnread = jobFiles.some((f) => !f.agentTick && f.userTick);
        }

        return {
          ...job,
          fileCount: jobFiles.length,
          hasUnread,
        };
      })
    );

    return NextResponse.json({ jobs: jobsWithFiles });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    if (isDatabaseError(error)) {
      return NextResponse.json({
        jobs: [],
        warning: 'Database is not configured. Showing empty job list.',
      });
    }
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find first agent (or use agent1 as default)
    const users = await getAllUsers();
    const agent = users.find((u) => u.role === 'agent');
    const agentId = agent?.id || 'agent1';

    // If agent doesn't exist, create default agent
    if (!agent) {
      const { createUser } = await import('@/lib/db');
      const defaultAgent = await createUser({
        email: 'agent@thesupport.in',
        name: 'Support Agent',
        company: 'TheSupport.in',
        address: 'Delhi, India',
        phone: '+919900112233',
        jobCount: 0,
        role: 'agent',
      });
      const newJob = await createJob({
        userId: session.user.id,
        agentId: defaultAgent.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ job: newJob });
    }

    const newJob = await createJob({
      userId: session.user.id,
      agentId: agent.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ job: newJob });
  } catch (error) {
    console.error('Error creating job:', error);
    if (isDatabaseError(error)) {
      const fallbackJob = {
        id: `job-temp-${Date.now()}`,
        userId: session?.user?.id || 'user-temp',
        agentId:
          session?.user?.role === 'agent'
            ? session.user.id
            : 'agent-temp',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({
        job: fallbackJob,
        warning:
          'Database is not configured. This job is temporary and not saved to the database.',
      });
    }
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
