import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getJobsByUserId, getJobsByAgentId, createJob } from '@/lib/db';
import { getFilesByJobId } from '@/lib/db';
import { getAllUsers } from '@/lib/db';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
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
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
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
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
