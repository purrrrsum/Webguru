import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createUser, getAllUsers, getJobsByUserId, getJobsByAgentId, createJob } from '@/lib/db';
import { hash } from 'bcryptjs';
import { nanoid } from 'nanoid';

// Direct access endpoint that bypasses NextAuth for testing
// This creates/verifies users and jobs, then returns session info

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();
    
    if (type !== 'user' && type !== 'agent') {
      return NextResponse.json({ error: 'Invalid type. Use "user" or "agent"' }, { status: 400 });
    }

    // Test database connection first
    try {
      await getAllUsers();
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError.message 
      }, { status: 500 });
    }

    const email = type === 'user' 
      ? 'sampletest@thesupport.in' 
      : 'agent1@thesupport.in';
    const password = type === 'user' ? 'Test123!' : 'Agent123!';
    const role = type;

    // Get or create user
    let user = await getUserByEmail(email);
    
    if (!user) {
      console.log(`Creating ${role} user: ${email}`);
      const hashedPassword = await hash(password, 10);
      user = await createUser({
        id: type === 'user' ? 'sampletest' : 'agent1',
        email,
        name: type === 'user' ? 'Sample Test User' : 'Support Agent One',
        company: type === 'user' ? 'Test Company' : 'TheSupport.in',
        address: 'Test Address',
        phone: '+919999999999',
        jobCount: 0,
        role: role as 'user' | 'agent',
        password: hashedPassword,
      });
    } else {
      // Update password if it's missing or different
      if (!user.password) {
        const hashedPassword = await hash(password, 10);
        const { updateUser } = await import('@/lib/db');
        await updateUser(user.id, { password: hashedPassword });
      }
    }

    // For users: Get or create a job
    // For agents: Get existing job or create one with a test user
    let jobId: string | null = null;

    if (type === 'user') {
      const userJobs = await getJobsByUserId(user.id);
      if (userJobs.length > 0) {
        jobId = userJobs[0].id;
      } else {
        // Create a new job - find or create an agent
        const allUsers = await getAllUsers();
        let agent = allUsers.find(u => u.role === 'agent');
        
        if (!agent) {
          // Create default agent if none exists
          const hashedAgentPassword = await hash('Agent123!', 10);
          agent = await createUser({
            id: 'agent1',
            email: 'agent1@thesupport.in',
            name: 'Support Agent One',
            company: 'TheSupport.in',
            address: 'Delhi, India',
            phone: '+919900112231',
            jobCount: 0,
            role: 'agent',
            password: hashedAgentPassword,
          });
        }

        const newJob = await createJob({
          userId: user.id,
          agentId: agent.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        jobId = newJob.id;
      }
    } else {
      // Agent: find existing job
      const agentJobs = await getJobsByAgentId(user.id);
      if (agentJobs.length > 0) {
        jobId = agentJobs[0].id;
      } else {
        // Create a job with a test user
        const allUsers = await getAllUsers();
        let testUser = allUsers.find(u => u.role === 'user' && u.email === 'sampletest@thesupport.in');
        
        if (!testUser) {
          const hashedUserPassword = await hash('Test123!', 10);
          testUser = await createUser({
            id: 'sampletest',
            email: 'sampletest@thesupport.in',
            name: 'Sample Test User',
            company: 'Test Company',
            address: 'Test Address',
            phone: '+919999999999',
            jobCount: 0,
            role: 'user',
            password: hashedUserPassword,
          });
        }

        const newJob = await createJob({
          userId: testUser.id,
          agentId: user.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        jobId = newJob.id;
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      jobId,
      message: `${type} access ready`,
    });
  } catch (error: any) {
    console.error('Error in test-access:', error);
    return NextResponse.json({ 
      error: 'Failed to setup access',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

