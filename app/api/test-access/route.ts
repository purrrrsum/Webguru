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

    // Check if DATABASE_URL is set
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      console.error('DATABASE_URL is not set');
      return NextResponse.json({ 
        error: 'Database not configured',
        details: 'DATABASE_URL environment variable is not set. Please configure your database connection.',
        hint: 'Add PostgreSQL database in Railway or set DATABASE_URL environment variable'
      }, { status: 500 });
    }

    // Test database connection first
    try {
      await getAllUsers();
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      console.error('Error code:', dbError.code);
      console.error('Error message:', dbError.message);
      
      // Check if it's a table doesn't exist error
      if (dbError.message?.includes('relation') && dbError.message?.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Database tables not found',
          details: 'Database schema not initialized. Tables do not exist.',
          hint: 'Run: npm run setup-db or execute lib/db-schema.sql in your database',
          errorCode: dbError.code,
          fullError: dbError.message
        }, { status: 500 });
      }
      
      // Check if it's a connection error
      if (dbError.code === 'ECONNREFUSED' || dbError.message?.includes('connection')) {
        return NextResponse.json({ 
          error: 'Database connection refused',
          details: 'Cannot connect to database server. Check DATABASE_URL and ensure database is running.',
          errorCode: dbError.code,
          fullError: dbError.message
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError.message,
        errorCode: dbError.code,
        fullError: process.env.NODE_ENV === 'development' ? dbError.message : undefined
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
      
      // Check if user with that ID already exists (might have different email)
      const { getUserById } = await import('@/lib/db');
      const existingById = await getUserById(type === 'user' ? 'sampletest' : 'agent1');
      
      if (existingById) {
        // User exists with this ID but different email - update it
        console.log(`Updating existing user ID with new email: ${email}`);
        const { updateUser } = await import('@/lib/db');
        const hashedPassword = await hash(password, 10);
        await updateUser(existingById.id, {
          email,
          name: type === 'user' ? 'Sample Test User' : 'Support Agent One',
          company: type === 'user' ? 'Test Company' : 'TheSupport.in',
          address: 'Test Address',
          phone: '+919999999999',
          role: role as 'user' | 'agent',
          password: hashedPassword,
        });
        user = await getUserByEmail(email);
      } else {
        // Create new user
        try {
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
        } catch (createError: any) {
          // If creation fails due to duplicate key, try to get existing user
          if (createError.code === '23505' || createError.message.includes('duplicate')) {
            console.log(`User with ID exists, fetching by email instead`);
            user = await getUserByEmail(email);
            if (!user) {
              // Try to get by ID and update
              const existingUser = await getUserById(type === 'user' ? 'sampletest' : 'agent1');
              if (existingUser) {
                const { updateUser } = await import('@/lib/db');
                const hashedPassword = await hash(password, 10);
                await updateUser(existingUser.id, {
                  email,
                  name: type === 'user' ? 'Sample Test User' : 'Support Agent One',
                  company: type === 'user' ? 'Test Company' : 'TheSupport.in',
                  address: 'Test Address',
                  phone: '+919999999999',
                  role: role as 'user' | 'agent',
                  password: hashedPassword,
                });
                user = await getUserByEmail(email);
              }
            }
          } else {
            throw createError;
          }
        }
      }
    } else {
      // User exists - update password if it's missing
      const { updateUser } = await import('@/lib/db');
      const hashedPassword = await hash(password, 10);
      await updateUser(user.id, { 
        password: hashedPassword,
        name: type === 'user' ? 'Sample Test User' : 'Support Agent One',
        company: type === 'user' ? 'Test Company' : 'TheSupport.in',
        role: role as 'user' | 'agent',
      });
      // Refresh user data
      user = await getUserByEmail(email);
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
          try {
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
          } catch (agentError: any) {
            // If agent with ID exists, get it by email
            if (agentError.code === '23505' || agentError.message.includes('duplicate')) {
              agent = await getUserByEmail('agent1@thesupport.in');
              if (!agent) {
                // Try to get by ID and update
                const { getUserById, updateUser } = await import('@/lib/db');
                const existingAgent = await getUserById('agent1');
                if (existingAgent) {
                  await updateUser('agent1', {
                    email: 'agent1@thesupport.in',
                    name: 'Support Agent One',
                    company: 'TheSupport.in',
                    address: 'Delhi, India',
                    phone: '+919900112231',
                    role: 'agent',
                    password: hashedAgentPassword,
                  });
                  agent = await getUserByEmail('agent1@thesupport.in');
                }
              }
            } else {
              throw agentError;
            }
          }
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
          try {
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
          } catch (userError: any) {
            // If user with ID exists, get it by email
            if (userError.code === '23505' || userError.message.includes('duplicate')) {
              testUser = await getUserByEmail('sampletest@thesupport.in');
              if (!testUser) {
                // Try to get by ID and update
                const { getUserById, updateUser } = await import('@/lib/db');
                const existingUser = await getUserById('sampletest');
                if (existingUser) {
                  await updateUser('sampletest', {
                    email: 'sampletest@thesupport.in',
                    name: 'Sample Test User',
                    company: 'Test Company',
                    address: 'Test Address',
                    phone: '+919999999999',
                    role: 'user',
                    password: hashedUserPassword,
                  });
                  testUser = await getUserByEmail('sampletest@thesupport.in');
                }
              }
            } else {
              throw userError;
            }
          }
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

