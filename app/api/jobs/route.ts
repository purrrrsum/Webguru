import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getJobsByUserId,
  createJob,
  getFilesByJobId,
  getAllUsers,
  ensureDatabaseSetup,
  isDatabaseError,
  getAllJobsWithUsers,
  getUserById,
  evaluateSLAStatuses,
} from '@/lib/db';
import { nanoid } from 'nanoid';

export async function GET() {
  const session = await getServerSession(authOptions);
  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureDatabaseSetup();
    await evaluateSLAStatuses();

    // Get jobs based on user role
    let userJobs;
    if (session.user.role === 'user') {
      userJobs = await getJobsByUserId(session.user.id);
    } else if (session.user.role === 'agent') {
      userJobs = await getAllJobsWithUsers();
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Add file count and unread status to each job
    const jobsWithFiles = await Promise.all(
      userJobs.map(async (job) => {
        const jobFiles = await getFilesByJobId(job.id);
        let userName = job.userName || null;
        if (!userName && session.user.role === 'agent') {
          const jobUser = await getUserById(job.userId);
          userName = jobUser?.name || null;
        }

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
          userName,
          dueAt: job.dueAt || null,
          slaStatus: job.slaStatus || 'pending',
          escalationLevel: job.escalationLevel || 'none',
          jobNumber: job.jobNumber || null,
          priority: job.priority || 'normal',
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
  let payload: any = {};
  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureDatabaseSetup();

    payload = await request.json().catch(() => ({}));
    const rawTitle = typeof payload.title === 'string' ? payload.title.trim() : '';
    const rawTags = Array.isArray(payload.tags) ? payload.tags : [];

    const title = rawTitle.length > 0 ? rawTitle.slice(0, 120) : null;
    const tags = rawTags
      .filter((tag: unknown): tag is string => typeof tag === 'string')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0)
      .slice(0, 3);

    // Job will be auto-assigned to available agent by createJob function
    const dueAt =
      typeof payload?.dueAt === 'string' && payload.dueAt.trim().length
        ? new Date(payload.dueAt).toISOString()
        : null;

    const newJob = await createJob({
      userId: session.user.id,
      // agentId will be auto-assigned by createJob to available agent
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title,
      tags,
      dueAt,
      slaStatus: dueAt ? 'on_track' : 'pending',
      escalationLevel: 'none',
      serviceType: payload.serviceType || 'other',
      pricingModel: payload.pricingModel || 'single_project',
    });

    return NextResponse.json({
      job: {
        ...newJob,
        userName: session.user.name || null,
      },
    });
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
        title: payload?.title || null,
        tags: Array.isArray(payload?.tags)
          ? payload.tags.slice(0, 3)
          : [],
        dueAt: payload?.dueAt || null,
        slaStatus: 'pending',
        escalationLevel: 'none',
        userName:
          session?.user?.role === 'agent'
            ? 'User'
            : session?.user?.name || null,
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
