import sql, { query } from './db-client';
import { User, Job, FileData, Message, SupportTicket, JobAnnotation, JobVersion } from './utils';
import { nanoid } from 'nanoid';

export function isDatabaseError(error: any): boolean {
  if (!error) return false;
  const message = String(error.message || '').toLowerCase();
  return (
    message.includes('database') ||
    message.includes('relation') ||
    message.includes('connection') ||
    message.includes('sql') ||
    error.code === 'ECONNREFUSED'
  );
}

export async function ensureDatabaseSetup() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255) DEFAULT '',
        address TEXT DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        job_count INTEGER DEFAULT 0,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'agent')),
        password VARCHAR(255),
        upi_id TEXT,
        bank_account_name TEXT,
        bank_account_number TEXT,
        bank_ifsc TEXT,
        bank_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS upi_id TEXT
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS bank_account_name TEXT
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS bank_account_number TEXT
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS bank_ifsc TEXT
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS bank_name TEXT
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE
    `;

    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_ready BOOLEAN DEFAULT FALSE
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        agent_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        title TEXT,
        tags TEXT[] DEFAULT ARRAY[]::text[],
        due_at TIMESTAMP,
        sla_status VARCHAR(20) DEFAULT 'pending',
        escalation_level VARCHAR(20) DEFAULT 'none',
        last_escalated_at TIMESTAMP
      )
    `;

    await sql`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS title TEXT
    `;

    await sql`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::text[]
    `;

    await sql`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS due_at TIMESTAMP
    `;

    await sql`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS sla_status VARCHAR(20) DEFAULT 'pending'
    `;

    await sql`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS escalation_level VARCHAR(20) DEFAULT 'none'
    `;

    await sql`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS last_escalated_at TIMESTAMP
    `;

    await sql`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS job_number INTEGER
    `;

    await sql`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS previous_agent_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL
    `;

    await sql`
      ALTER TABLE jobs
      ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent'))
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_jobs_job_number ON jobs(job_number)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_is_ready ON users(is_ready) WHERE role = 'agent'
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS files (
        id VARCHAR(255) PRIMARY KEY,
        job_id VARCHAR(255) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        filename VARCHAR(255) NOT NULL,
        size BIGINT NOT NULL,
        type VARCHAR(100) NOT NULL,
        uploaded_by VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_tick BOOLEAN DEFAULT FALSE,
        agent_tick BOOLEAN DEFAULT FALSE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(255) PRIMARY KEY,
        job_id VARCHAR(255) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        sender_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        read_by_user BOOLEAN DEFAULT FALSE,
        read_by_agent BOOLEAN DEFAULT FALSE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_login_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255),
        email VARCHAR(255),
        role VARCHAR(20),
        provider VARCHAR(50),
        action VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
        email VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'agent')),
        subject VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'open',
        priority VARCHAR(20) DEFAULT 'normal',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        unread_for_admin BOOLEAN DEFAULT TRUE
      )
    `;

    await sql`
      ALTER TABLE support_tickets
      ADD COLUMN IF NOT EXISTS unread_for_admin BOOLEAN DEFAULT TRUE
    `;

    await sql`
      UPDATE support_tickets
      SET unread_for_admin = TRUE
      WHERE unread_for_admin IS NULL
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS job_annotations (
        id VARCHAR(255) PRIMARY KEY,
        job_id VARCHAR(255) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        file_id VARCHAR(255) REFERENCES files(id) ON DELETE SET NULL,
        author_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS job_versions (
        id VARCHAR(255) PRIMARY KEY,
        job_id VARCHAR(255) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        file_id VARCHAR(255) REFERENCES files(id) ON DELETE SET NULL,
        version_number INTEGER NOT NULL,
        notes TEXT,
        created_by VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_job_annotations_job_id ON job_annotations(job_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_job_versions_job_id ON job_versions(job_id)
    `;

    await sql`
      INSERT INTO users (id, email, name, role, password, job_count)
      VALUES ('admin-default', 'admin@thesupport.agency', 'Administrator', 'agent', ${'admin@123@'}, 0)
      ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role, password = EXCLUDED.password
    `;
  } catch (error) {
    if (isDatabaseError(error)) {
      console.warn('Database setup skipped (connection unavailable).');
    } else {
      console.warn('Database setup warning:', error);
    }
  }
}

export async function createLoginLog(log: {
  userId?: string;
  email?: string | null;
  role?: string | null;
  provider?: string | null;
  action?: string;
}) {
  try {
    await sql`
      INSERT INTO user_login_logs (user_id, email, role, provider, action)
      VALUES (${log.userId || null}, ${log.email || null}, ${log.role || null}, ${log.provider || null}, ${log.action || 'login'})
    `;
  } catch (error) {
    if (!isDatabaseError(error)) {
      console.warn('Failed to write login log:', error);
    }
  }
}

// Database client using standard PostgreSQL (pg library)
// Maps database column names (snake_case) to TypeScript interface (camelCase)

function mapUserRow(row: any): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    company: row.company || '',
    address: row.address || '',
    phone: row.phone || '',
    jobCount: row.job_count || 0,
    role: row.role,
    password: row.password,
    upiId: row.upi_id || '',
    bankAccountName: row.bank_account_name || '',
    bankAccountNumber: row.bank_account_number || '',
    bankIfsc: row.bank_ifsc || '',
    bankName: row.bank_name || '',
    isOnline: row.is_online || false,
    isReady: row.is_ready || false,
  };
}

function mapJobRow(row: any): Job {
  return {
    id: row.id,
    userId: row.user_id,
    agentId: row.agent_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    title: row.title || null,
    tags: Array.isArray(row.tags) ? row.tags : [],
    userName: typeof row.user_name === 'string' ? row.user_name : null,
    dueAt: row.due_at || null,
    slaStatus: row.sla_status || 'pending',
    escalationLevel: row.escalation_level || 'none',
    lastEscalatedAt: row.last_escalated_at || null,
    jobNumber: row.job_number || null,
    previousAgentId: row.previous_agent_id || null,
    priority: row.priority || 'normal',
  };
}

function mapFileRow(row: any): FileData {
  return {
    id: row.id,
    jobId: row.job_id,
    url: row.url,
    filename: row.filename,
    size: row.size,
    type: row.type,
    uploadedBy: row.uploaded_by,
    uploadedAt: row.uploaded_at,
    userTick: row.user_tick || false,
    agentTick: row.agent_tick || false,
  };
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    return result.rows[0] ? mapUserRow(result.rows[0]) : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return result.rows[0] ? mapUserRow(result.rows[0]) : null;
  } catch (error: any) {
    console.error('Error fetching user by email:', error);
    console.error('Error details:', error.message, error.code);
    // Return null instead of throwing to prevent crashes
    return null;
  }
}

export async function createUser(user: Omit<User, 'id'> & { id?: string }): Promise<User> {
  const userId = user.id || `user${Date.now()}`;
  try {
    const intendedRole = user.role || 'user';
    // Check if user already exists by email
    const existing = await getUserByEmail(user.email);
    if (existing) {
      if (existing.role !== intendedRole) {
        throw new Error('This email is already registered with a different role.');
      }
      // Update existing user instead of creating new one
      return await updateUser(existing.id, {
        name: user.name,
        company: user.company,
        address: user.address,
        phone: user.phone,
        role: intendedRole,
        password: user.password,
        upiId: user.upiId,
        bankAccountName: user.bankAccountName,
        bankAccountNumber: user.bankAccountNumber,
        bankIfsc: user.bankIfsc,
        bankName: user.bankName,
      }) || existing;
    }

    const result = await sql`
      INSERT INTO users (
        id,
        email,
        name,
        company,
        address,
        phone,
        job_count,
        role,
        password,
        upi_id,
        bank_account_name,
        bank_account_number,
        bank_ifsc,
        bank_name
      )
      VALUES (
        ${userId},
        ${user.email},
        ${user.name},
        ${user.company || ''},
        ${user.address || ''},
        ${user.phone || ''},
        ${user.jobCount || 0},
        ${intendedRole},
        ${user.password || null},
        ${user.upiId || null},
        ${user.bankAccountName || null},
        ${user.bankAccountNumber || null},
        ${user.bankIfsc || null},
        ${user.bankName || null}
      )
      RETURNING *
    `;
    return mapUserRow(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Provide more helpful error messages
    if (error.code === '23505') {
      // Unique constraint violation - try to get existing user
      const existing = await getUserByEmail(user.email);
      if (existing) {
        return existing;
      }
      throw new Error(`User with email ${user.email} already exists`);
    }
    
    if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
      throw new Error('Database tables not initialized. Run: npm run setup-db');
    }
    
    if (error.message?.includes('DATABASE_URL') || error.code === 'ECONNREFUSED') {
      throw new Error('Database not configured. Add PostgreSQL in Railway Dashboard.');
    }
    
    throw error;
  }
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  try {
    if (updates.email) {
      const existing = await getUserByEmail(updates.email);
      if (existing && existing.id !== id) {
        const newRole = updates.role || existing.role;
        if (existing.role !== newRole) {
          throw new Error('Email already in use by another account with a different role.');
        }
      }
    }

    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.name !== undefined) {
      fields.push('name');
      values.push(updates.name);
    }
    if (updates.email !== undefined) {
      fields.push('email');
      values.push(updates.email);
    }
    if (updates.company !== undefined) {
      fields.push('company');
      values.push(updates.company);
    }
    if (updates.address !== undefined) {
      fields.push('address');
      values.push(updates.address);
    }
    if (updates.phone !== undefined) {
      fields.push('phone');
      values.push(updates.phone);
    }
    if (updates.jobCount !== undefined) {
      fields.push('job_count');
      values.push(updates.jobCount);
    }
    if (updates.role !== undefined) {
      fields.push('role');
      values.push(updates.role);
    }
    if (updates.password !== undefined) {
      fields.push('password');
      values.push(updates.password);
    }
  if (updates.upiId !== undefined) {
    fields.push('upi_id');
    values.push(updates.upiId);
  }
  if (updates.bankAccountName !== undefined) {
    fields.push('bank_account_name');
    values.push(updates.bankAccountName);
  }
  if (updates.bankAccountNumber !== undefined) {
    fields.push('bank_account_number');
    values.push(updates.bankAccountNumber);
  }
  if (updates.bankIfsc !== undefined) {
    fields.push('bank_ifsc');
    values.push(updates.bankIfsc);
  }
  if (updates.bankName !== undefined) {
    fields.push('bank_name');
    values.push(updates.bankName);
  }

  if (updates.isOnline !== undefined) {
    fields.push('is_online');
    values.push(updates.isOnline);
  }

  if (updates.isReady !== undefined) {
    fields.push('is_ready');
    values.push(updates.isReady);
  }

  // If agent goes offline or not ready, check and reassign their jobs
  if ((updates.isOnline === false || updates.isReady === false) && fields.length > 0) {
    const user = await getUserById(id);
    if (user?.role === 'agent') {
      // Get final state after update
      const finalIsOnline = updates.isOnline !== undefined ? updates.isOnline : user.isOnline;
      const finalIsReady = updates.isReady !== undefined ? updates.isReady : user.isReady;
      
      // If agent is going offline or not ready, reassign jobs
      if (finalIsOnline === false || finalIsReady === false) {
        // Reassign jobs in background (don't wait)
        checkAndReassignJobsForOfflineAgent(id).catch(err => 
          console.error('Error reassigning jobs:', err)
        );
      }
    }
  }

    if (fields.length === 0) {
      return await getUserById(id);
    }

    const setClause = fields.map((field, index) => 
      `${field} = $${index + 2}`
    ).join(', ');

    const result = await query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );

    return result.rows[0] ? mapUserRow(result.rows[0]) : null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

export async function incrementUserJobCount(userId: string): Promise<void> {
  try {
    await sql`
      UPDATE users SET job_count = job_count + 1 WHERE id = ${userId}
    `;
  } catch (error) {
    console.error('Error incrementing job count:', error);
    throw error;
  }
}

export async function getAllUsers(): Promise<User[]> {
  try {
    const result = await sql`SELECT * FROM users ORDER BY created_at DESC`;
    return result.rows.map(mapUserRow);
  } catch (error: any) {
    console.error('Error fetching all users:', error);
    console.error('Error details:', error.message, error.code);
    return [];
  }
}

export async function getJobById(id: string): Promise<Job | null> {
  try {
    const result = await sql`
      SELECT * FROM jobs WHERE id = ${id}
    `;
    return result.rows[0] ? mapJobRow(result.rows[0]) : null;
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export async function getJobsByUserId(userId: string): Promise<Job[]> {
  try {
    const result = await sql`
      SELECT * FROM jobs WHERE user_id = ${userId} ORDER BY created_at DESC
    `;
    return result.rows.map(mapJobRow);
  } catch (error: any) {
    console.error('Error fetching jobs by user ID:', error);
    console.error('Error details:', error.message, error.code);
    return [];
  }
}

export async function getJobsByAgentId(agentId: string): Promise<Job[]> {
  try {
    const result = await sql`
      SELECT * FROM jobs WHERE agent_id = ${agentId} ORDER BY created_at DESC
    `;
    return result.rows.map(mapJobRow);
  } catch (error: any) {
    console.error('Error fetching jobs by agent ID:', error);
    console.error('Error details:', error.message, error.code);
    return [];
  }
}

export async function getAllJobsWithUsers(): Promise<Job[]> {
  try {
    const result = await sql`
      SELECT jobs.*, users.name AS user_name
      FROM jobs
      LEFT JOIN users ON users.id = jobs.user_id
      ORDER BY jobs.created_at DESC
    `;
    return result.rows.map(mapJobRow);
  } catch (error: any) {
    console.error('Error fetching all jobs with users:', error);
    console.error('Error details:', error.message, error.code);
    return [];
  }
}

// Get available agents (online and ready)
export async function getAvailableAgents(): Promise<User[]> {
  try {
    const result = await sql`
      SELECT * FROM users 
      WHERE role = 'agent' AND is_online = TRUE AND is_ready = TRUE
      ORDER BY created_at ASC
    `;
    return result.rows.map(mapUserRow);
  } catch (error) {
    console.error('Error fetching available agents:', error);
    return [];
  }
}

// Update agent availability
export async function updateAgentAvailability(agentId: string, isOnline: boolean, isReady: boolean): Promise<User | null> {
  try {
    const result = await sql`
      UPDATE users 
      SET is_online = ${isOnline}, is_ready = ${isReady}, updated_at = NOW()
      WHERE id = ${agentId} AND role = 'agent'
      RETURNING *
    `;
    return result.rows[0] ? mapUserRow(result.rows[0]) : null;
  } catch (error) {
    console.error('Error updating agent availability:', error);
    return null;
  }
}

// Reassign job to available agent when current agent goes offline
export async function reassignJobToAvailableAgent(jobId: string, previousAgentId: string): Promise<Job | null> {
  try {
    // Get available agents (excluding the previous one)
    const availableAgents = await getAvailableAgents();
    const newAgent = availableAgents.find(a => a.id !== previousAgentId) || availableAgents[0];
    
    if (!newAgent) {
      console.warn('No available agents to reassign job', jobId);
      return null;
    }

    // Update job with new agent and set priority to high
    const result = await sql`
      UPDATE jobs 
      SET agent_id = ${newAgent.id},
          previous_agent_id = ${previousAgentId},
          priority = 'high',
          updated_at = NOW()
      WHERE id = ${jobId}
      RETURNING *
    `;
    
    return result.rows[0] ? mapJobRow(result.rows[0]) : null;
  } catch (error) {
    console.error('Error reassigning job:', error);
    return null;
  }
}

// Check and reassign jobs when agent goes offline
export async function checkAndReassignJobsForOfflineAgent(agentId: string): Promise<number> {
  try {
    const jobs = await getJobsByAgentId(agentId);
    let reassignedCount = 0;
    
    for (const job of jobs) {
      // Check if there are unread messages from user (user is waiting for response)
      const messages = await getMessagesByJobId(job.id);
      const hasUnreadUserMessages = messages.some(m => 
        m.senderId === job.userId && !m.readByAgent
      );
      
      if (hasUnreadUserMessages) {
        const reassigned = await reassignJobToAvailableAgent(job.id, agentId);
        if (reassigned) {
          reassignedCount++;
        }
      }
    }
    
    return reassignedCount;
  } catch (error) {
    console.error('Error checking and reassigning jobs:', error);
    return 0;
  }
}

export async function createJob(job: Omit<Job, 'id'> & { id?: string }): Promise<Job> {
  let jobId = job.id;
  let jobNumber = job.jobNumber;
  
  // Generate sequential job number if not provided
  if (!jobNumber) {
    try {
      const result = await sql`
        SELECT COALESCE(MAX(job_number), 0) + 1 AS next_number FROM jobs
      `;
      jobNumber = result.rows[0]?.next_number || 1;
    } catch (error) {
      console.warn('Failed to get next job number:', error);
      jobNumber = 1;
    }
  }
  
  // Generate sequential job ID if not provided
  if (!jobId) {
    jobId = `job${String(jobNumber).padStart(6, '0')}`;
  }
  
  // If no agent specified, assign to available agent
  let agentId = job.agentId;
  if (!agentId) {
    const availableAgents = await getAvailableAgents();
    if (availableAgents.length > 0) {
      // Assign to agent with least jobs
      const agentJobCounts = await Promise.all(
        availableAgents.map(async (agent) => {
          const jobs = await getJobsByAgentId(agent.id);
          return { agent, count: jobs.length };
        })
      );
      agentJobCounts.sort((a, b) => a.count - b.count);
      agentId = agentJobCounts[0].agent.id;
    } else {
      // Fallback to first agent if none available
      const allAgents = await sql`SELECT * FROM users WHERE role = 'agent' LIMIT 1`;
      if (allAgents.rows.length > 0) {
        agentId = allAgents.rows[0].id;
      } else {
        throw new Error('No agents available');
      }
    }
  }
  
  const now = new Date().toISOString();
  try {
    const result = await sql`
      INSERT INTO jobs (id, user_id, agent_id, created_at, updated_at, title, tags, due_at, sla_status, escalation_level, job_number, priority)
      VALUES (
        ${jobId},
        ${job.userId},
        ${agentId},
        ${now},
        ${now},
        ${job.title || null},
        ${job.tags && job.tags.length ? job.tags : []},
        ${job.dueAt || null},
        ${job.slaStatus || 'pending'},
        ${job.escalationLevel || 'none'},
        ${jobNumber},
        ${job.priority || 'normal'}
      )
      RETURNING *
    `;
    return mapJobRow(result.rows[0]);
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
}

export async function updateJob(id: string, updates: Partial<Job>): Promise<Job | null> {
  try {
    const updateFields: string[] = [];
    const values: any[] = [id];

    if (updates.updatedAt !== undefined) {
      updateFields.push('updated_at');
      values.push(updates.updatedAt);
    }

    if (updates.jobNumber !== undefined) {
      updateFields.push('job_number');
      values.push(updates.jobNumber);
    }

    if (updates.title !== undefined) {
      updateFields.push('title');
      values.push(updates.title);
    }

    if (updates.agentId !== undefined) {
      updateFields.push('agent_id');
      values.push(updates.agentId);
    }

    if (updates.priority !== undefined) {
      updateFields.push('priority');
      values.push(updates.priority);
    }

    if (updateFields.length === 0) {
      return await getJobById(id);
    }

    updateFields.push('updated_at');
    values.push(new Date().toISOString());

    const setClause = updateFields.map((field, index) => 
      `${field} = $${index + 2}`
    ).join(', ');

    const result = await query(
      `UPDATE jobs SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );

    return result.rows[0] ? mapJobRow(result.rows[0]) : null;
  } catch (error) {
    console.error('Error updating job:', error);
    return null;
  }
}

export async function getFileById(id: string): Promise<FileData | null> {
  try {
    const result = await sql`
      SELECT * FROM files WHERE id = ${id}
    `;
    return result.rows[0] ? mapFileRow(result.rows[0]) : null;
  } catch (error) {
    console.error('Error fetching file:', error);
    return null;
  }
}

export async function getFilesByJobId(jobId: string): Promise<FileData[]> {
  try {
    const result = await sql`
      SELECT * FROM files WHERE job_id = ${jobId} ORDER BY uploaded_at ASC
    `;
    return result.rows.map(mapFileRow);
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}

export async function createFile(file: Omit<FileData, 'id'> & { id?: string }): Promise<FileData> {
  const fileId = file.id || `file${Date.now()}`;
  try {
    const result = await sql`
      INSERT INTO files (id, job_id, url, filename, size, type, uploaded_by, uploaded_at, user_tick, agent_tick)
      VALUES (${fileId}, ${file.jobId}, ${file.url}, ${file.filename}, ${file.size}, ${file.type}, ${file.uploadedBy}, ${file.uploadedAt}, ${file.userTick || false}, ${file.agentTick || false})
      RETURNING *
    `;
    return mapFileRow(result.rows[0]);
  } catch (error) {
    console.error('Error creating file:', error);
    throw error;
  }
}

export async function updateFile(id: string, updates: Partial<FileData>): Promise<FileData | null> {
  try {
    const fields: string[] = [];
    const values: any[] = [id];

    if (updates.userTick !== undefined) {
      fields.push('user_tick');
      values.push(updates.userTick);
    }
    if (updates.agentTick !== undefined) {
      fields.push('agent_tick');
      values.push(updates.agentTick);
    }

    if (fields.length === 0) {
      return await getFileById(id);
    }

    const setClause = fields.map((field, index) => 
      `${field} = $${index + 2}`
    ).join(', ');

    const result = await query(
      `UPDATE files SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );

    return result.rows[0] ? mapFileRow(result.rows[0]) : null;
  } catch (error) {
    console.error('Error updating file:', error);
    return null;
  }
}

export async function deleteFile(id: string): Promise<boolean> {
  try {
    await sql`DELETE FROM files WHERE id = ${id}`;
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

export async function getAllFiles(): Promise<FileData[]> {
  try {
    const result = await sql`SELECT * FROM files`;
    return result.rows.map(mapFileRow);
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}

// Message functions
function mapMessageRow(row: any): Message {
  return {
    id: row.id,
    jobId: row.job_id,
    senderId: row.sender_id,
    message: row.message,
    createdAt: row.created_at,
    readByUser: row.read_by_user || false,
    readByAgent: row.read_by_agent || false,
  };
}

export async function getMessagesByJobId(jobId: string): Promise<Message[]> {
  try {
    const result = await sql`
      SELECT * FROM messages 
      WHERE job_id = ${jobId} 
      ORDER BY created_at ASC
    `;
    return result.rows.map(mapMessageRow);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      console.error('⚠️  Messages table does not exist! Run: npm run setup-db');
      throw new Error('Messages table not found. Please run database setup.');
    }
    return [];
  }
}

export async function createMessage(message: Omit<Message, 'id'> & { id?: string }): Promise<Message> {
  const messageId = message.id || nanoid();
  try {
    const result = await sql`
      INSERT INTO messages (id, job_id, sender_id, message, created_at, read_by_user, read_by_agent)
      VALUES (${messageId}, ${message.jobId}, ${message.senderId}, ${message.message}, ${message.createdAt}, ${message.readByUser || false}, ${message.readByAgent || false})
      RETURNING *
    `;
    return mapMessageRow(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating message:', error);
    if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      console.error('⚠️  Messages table does not exist! Run: npm run setup-db');
      throw new Error('Messages table not found. Please run database setup.');
    }
    if (error.code === '23503') {
      console.error('⚠️  Foreign key constraint violation - check job_id and sender_id exist');
      throw new Error('Invalid job or sender. Please check the job exists and user has access.');
    }
    throw error;
  }
}

export async function markMessagesAsRead(jobId: string, userId: string, isUser: boolean): Promise<void> {
  try {
    if (isUser) {
      await sql`
        UPDATE messages 
        SET read_by_user = TRUE 
        WHERE job_id = ${jobId} AND sender_id != ${userId}
      `;
    } else {
      await sql`
        UPDATE messages 
        SET read_by_agent = TRUE 
        WHERE job_id = ${jobId} AND sender_id != ${userId}
      `;
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
}

function mapSupportTicketRow(row: any): SupportTicket {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    email: row.email,
    role: row.role,
    subject: row.subject,
    description: row.description,
    status: row.status,
    priority: row.priority || 'normal',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    unreadForAdmin: row.unread_for_admin !== false,
  };
}

async function generateSupportTicketId(): Promise<string> {
  try {
    const result = await sql`
      SELECT id FROM support_tickets 
      WHERE id LIKE 'ticket%' 
      ORDER BY CAST(SUBSTRING(id FROM 7) AS INTEGER) DESC 
      LIMIT 1
    `;

    if (result.rows.length > 0) {
      const lastId = result.rows[0].id;
      const lastNumber = parseInt(lastId.replace('ticket', '')) || 0;
      return `ticket${String(lastNumber + 1).padStart(6, '0')}`;
    }

    return 'ticket000001';
  } catch (error) {
    console.warn('Sequential support ticket ID generation failed, using nanoid:', error);
    return `ticket-${nanoid(10)}`;
  }
}

export async function createSupportTicket(ticket: {
  userId?: string;
  email: string;
  role: 'user' | 'agent';
  subject: string;
  description: string;
  priority?: 'low' | 'normal' | 'high';
}): Promise<SupportTicket> {
  const now = new Date().toISOString();
  const ticketId = await generateSupportTicketId();

  const result = await sql`
    INSERT INTO support_tickets (id, user_id, email, role, subject, description, status, priority, created_at, updated_at, unread_for_admin)
    VALUES (
      ${ticketId},
      ${ticket.userId || null},
      ${ticket.email},
      ${ticket.role},
      ${ticket.subject},
      ${ticket.description},
      'open',
      ${ticket.priority || 'normal'},
      ${now},
      ${now},
      TRUE
    )
    RETURNING *
  `;

  return mapSupportTicketRow(result.rows[0]);
}

export async function getSupportTicketsByUser(userId: string): Promise<SupportTicket[]> {
  try {
    const result = await sql`
      SELECT * FROM support_tickets
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return result.rows.map(mapSupportTicketRow);
  } catch (error) {
    console.error('Error fetching support tickets by user:', error);
    return [];
  }
}

export async function getAllSupportTickets(): Promise<SupportTicket[]> {
  try {
    const result = await sql`
      SELECT * FROM support_tickets
      ORDER BY status, created_at DESC
    `;

    return result.rows.map(mapSupportTicketRow);
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    return [];
  }
}

export async function updateSupportTicketStatus(
  id: string,
  updates: { status?: 'open' | 'in_progress' | 'resolved'; priority?: 'low' | 'normal' | 'high' }
): Promise<SupportTicket | null> {
  if (!updates.status && !updates.priority) {
    return null;
  }

  const fields: string[] = [];
  const values: any[] = [id];

  if (updates.status) {
    fields.push('status');
    values.push(updates.status);
  }

  if (updates.priority) {
    fields.push('priority');
    values.push(updates.priority);
  }

  fields.push('unread_for_admin');
  values.push(false);

  fields.push('updated_at');
  values.push(new Date().toISOString());

  const setClause = fields
    .map((field, index) => `${field} = $${index + 2}`)
    .join(', ');

  const result = await query(
    `UPDATE support_tickets SET ${setClause} WHERE id = $1 RETURNING *`,
    values
  );

  if (!result.rows[0]) {
    return null;
  }

  return mapSupportTicketRow(result.rows[0]);
}

export async function markSupportTicketsAsRead(options: { ticketId?: string } = {}): Promise<void> {
  try {
    const now = new Date().toISOString();
    if (options.ticketId) {
      await sql`
        UPDATE support_tickets
        SET unread_for_admin = FALSE,
            updated_at = ${now}
        WHERE id = ${options.ticketId}
      `;
    } else {
      await sql`
        UPDATE support_tickets
        SET unread_for_admin = FALSE,
            updated_at = ${now}
        WHERE unread_for_admin = TRUE
      `;
    }
  } catch (error) {
    console.error('Error marking support tickets as read:', error);
  }
}

function mapAnnotationRow(row: any): JobAnnotation {
  return {
    id: row.id,
    jobId: row.job_id,
    fileId: row.file_id || null,
    authorId: row.author_id,
    authorName: row.author_name || null,
    content: row.content,
    status: (row.status as JobAnnotation['status']) || 'open',
    createdAt: row.created_at,
    resolvedAt: row.resolved_at || null,
  };
}

function mapVersionRow(row: any): JobVersion {
  return {
    id: row.id,
    jobId: row.job_id,
    fileId: row.file_id || null,
    versionNumber: row.version_number,
    notes: row.notes || null,
    createdBy: row.created_by,
    createdByName: row.created_by_name || null,
    createdAt: row.created_at,
  };
}

export async function getAnnotationsByJobId(jobId: string): Promise<JobAnnotation[]> {
  try {
    const result = await sql`
      SELECT ja.*, u.name AS author_name
      FROM job_annotations ja
      LEFT JOIN users u ON u.id = ja.author_id
      WHERE ja.job_id = ${jobId}
      ORDER BY ja.created_at ASC
    `;
    return result.rows.map(mapAnnotationRow);
  } catch (error) {
    console.error('Error fetching annotations:', error);
    return [];
  }
}

export async function createJobAnnotation(annotation: {
  id: string;
  jobId: string;
  fileId?: string | null;
  authorId: string;
  content: string;
}): Promise<JobAnnotation> {
  const result = await sql`
    INSERT INTO job_annotations (id, job_id, file_id, author_id, content, status, created_at)
    VALUES (${annotation.id}, ${annotation.jobId}, ${annotation.fileId || null}, ${annotation.authorId}, ${annotation.content}, 'open', ${new Date().toISOString()})
    RETURNING *
  `;
  return mapAnnotationRow(result.rows[0]);
}

export async function resolveJobAnnotation(annotationId: string, resolverId: string): Promise<JobAnnotation | null> {
  const result = await sql`
    UPDATE job_annotations
    SET status = 'resolved',
        resolved_at = ${new Date().toISOString()},
        author_id = author_id -- no change; placeholder to keep SQL valid
    WHERE id = ${annotationId}
    RETURNING *
  `;
  return result.rows[0] ? mapAnnotationRow(result.rows[0]) : null;
}

export async function getVersionsByJobId(jobId: string): Promise<JobVersion[]> {
  try {
    const result = await sql`
      SELECT jv.*, u.name AS created_by_name
      FROM job_versions jv
      LEFT JOIN users u ON u.id = jv.created_by
      WHERE jv.job_id = ${jobId}
      ORDER BY jv.version_number DESC
    `;
    return result.rows.map(mapVersionRow);
  } catch (error) {
    console.error('Error fetching job versions:', error);
    return [];
  }
}

export async function createJobVersion(version: {
  id: string;
  jobId: string;
  fileId?: string | null;
  notes?: string | null;
  createdBy: string;
}): Promise<JobVersion> {
  const nextVersionResult = await sql`
    SELECT COALESCE(MAX(version_number), 0) + 1 AS next_version
    FROM job_versions
    WHERE job_id = ${version.jobId}
  `;

  const versionNumber = nextVersionResult.rows[0]?.next_version || 1;

  const result = await sql`
    INSERT INTO job_versions (id, job_id, file_id, version_number, notes, created_by, created_at)
    VALUES (
      ${version.id},
      ${version.jobId},
      ${version.fileId || null},
      ${versionNumber},
      ${version.notes || null},
      ${version.createdBy},
      ${new Date().toISOString()}
    )
    RETURNING *
  `;

  return mapVersionRow(result.rows[0]);
}

export async function updateJobDueDate(jobId: string, dueAt?: string | null): Promise<Job | null> {
  const result = await sql`
    UPDATE jobs
    SET due_at = ${dueAt || null},
        sla_status = CASE
          WHEN ${dueAt || null} IS NULL THEN 'pending'
          ELSE sla_status
        END
    WHERE id = ${jobId}
    RETURNING *
  `;
  return result.rows[0] ? mapJobRow(result.rows[0]) : null;
}

export async function updateSLAStatus(jobId: string, status: Job['slaStatus'], escalationLevel: Job['escalationLevel']): Promise<void> {
  await sql`
    UPDATE jobs
    SET sla_status = ${status || 'pending'},
        escalation_level = ${escalationLevel || 'none'},
        last_escalated_at = CASE WHEN ${escalationLevel === 'escalated' ? 'escalated' : 'none'} = 'escalated' THEN ${new Date().toISOString()} ELSE last_escalated_at END
    WHERE id = ${jobId}
  `;
}

export async function evaluateSLAStatuses(): Promise<Job[]> {
  try {
    const now = new Date();
    const warningThreshold = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour ahead

    const result = await sql`
      SELECT jobs.*, users.name AS user_name
      FROM jobs
      LEFT JOIN users ON users.id = jobs.user_id
      WHERE due_at IS NOT NULL
    `;

    const jobs = result.rows.map(mapJobRow);

    for (const job of jobs) {
      if (!job.dueAt) {
        continue;
      }
      const dueDate = new Date(job.dueAt);
      if (dueDate.getTime() <= now.getTime() && job.slaStatus !== 'overdue' && job.escalationLevel !== 'escalated') {
        await updateSLAStatus(job.id, 'overdue', 'escalated');
        job.slaStatus = 'overdue';
        job.escalationLevel = 'escalated';
        job.lastEscalatedAt = new Date().toISOString();
      } else if (dueDate.getTime() <= warningThreshold.getTime() && job.slaStatus !== 'overdue' && job.escalationLevel === 'none') {
        await updateSLAStatus(job.id, 'due_soon', 'warning');
        job.slaStatus = 'due_soon';
        job.escalationLevel = 'warning';
      } else if (dueDate.getTime() > warningThreshold.getTime() && (job.slaStatus === 'due_soon' || job.slaStatus === 'overdue')) {
        await updateSLAStatus(job.id, 'on_track', 'none');
        job.slaStatus = 'on_track';
        job.escalationLevel = 'none';
      }
    }

    return jobs;
  } catch (error) {
    console.error('Error evaluating SLA statuses:', error);
    return [];
  }
}

export async function getSLAOverview() {
  try {
    const result = await sql`
      SELECT
        COUNT(*)::INT AS total_jobs,
        COUNT(*) FILTER (WHERE sla_status = 'overdue')::INT AS overdue_jobs,
        COUNT(*) FILTER (WHERE sla_status = 'due_soon')::INT AS due_soon_jobs,
        COUNT(*) FILTER (WHERE sla_status = 'on_track')::INT AS on_track_jobs
      FROM jobs
    `;
    return result.rows[0] || {
      total_jobs: 0,
      overdue_jobs: 0,
      due_soon_jobs: 0,
      on_track_jobs: 0,
    };
  } catch (error) {
    console.error('Error fetching SLA overview:', error);
    return {
      total_jobs: 0,
      overdue_jobs: 0,
      due_soon_jobs: 0,
      on_track_jobs: 0,
    };
  }
}

export async function getOpenAnnotations(limit = 50): Promise<JobAnnotation[]> {
  try {
    const result = await sql`
      SELECT ja.*, u.name AS author_name
      FROM job_annotations ja
      LEFT JOIN users u ON u.id = ja.author_id
      WHERE ja.status = 'open'
      ORDER BY ja.created_at ASC
      LIMIT ${limit}
    `;
    return result.rows.map(mapAnnotationRow);
  } catch (error) {
    console.error('Error fetching open annotations:', error);
    return [];
  }
}

export async function getJobsSummaryForAdmin(limit = 20): Promise<Job[]> {
  try {
    const result = await sql`
      SELECT jobs.*, users.name AS user_name
      FROM jobs
      LEFT JOIN users ON users.id = jobs.user_id
      ORDER BY jobs.created_at DESC
      LIMIT ${limit}
    `;
    return result.rows.map(mapJobRow);
  } catch (error) {
    console.error('Error fetching jobs summary for admin:', error);
    return [];
  }
}

