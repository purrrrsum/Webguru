import sql, { query } from './db-client';
import { User, Job, FileData, Message } from './utils';
import { nanoid } from 'nanoid';

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
  };
}

function mapJobRow(row: any): Job {
  return {
    id: row.id,
    userId: row.user_id,
    agentId: row.agent_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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
    // Check if user already exists by email
    const existing = await getUserByEmail(user.email);
    if (existing) {
      // Update existing user instead of creating new one
      return await updateUser(existing.id, {
        name: user.name,
        company: user.company,
        address: user.address,
        phone: user.phone,
        role: user.role,
        password: user.password,
      }) || existing;
    }

    const result = await sql`
      INSERT INTO users (id, email, name, company, address, phone, job_count, role, password)
      VALUES (${userId}, ${user.email}, ${user.name}, ${user.company || ''}, ${user.address || ''}, ${user.phone || ''}, ${user.jobCount || 0}, ${user.role || 'user'}, ${user.password || null})
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

export async function createJob(job: Omit<Job, 'id'> & { id?: string }): Promise<Job> {
  let jobId = job.id;
  
  // Generate sequential job ID if not provided
  if (!jobId) {
    try {
      // Get the highest job number
      const result = await sql`
        SELECT id FROM jobs 
        WHERE id LIKE 'job%' 
        ORDER BY CAST(SUBSTRING(id FROM 4) AS INTEGER) DESC 
        LIMIT 1
      `;
      
      if (result.rows.length > 0) {
        const lastId = result.rows[0].id;
        const lastNumber = parseInt(lastId.replace('job', '')) || 0;
        jobId = `job${String(lastNumber + 1).padStart(6, '0')}`;
      } else {
        jobId = 'job000001';
      }
    } catch (error) {
      // Fallback to timestamp if sequential fails
      console.warn('Sequential ID generation failed, using timestamp:', error);
      jobId = `job${Date.now()}`;
    }
  }
  
  const now = new Date().toISOString();
  try {
    const result = await sql`
      INSERT INTO jobs (id, user_id, agent_id, created_at, updated_at)
      VALUES (${jobId}, ${job.userId}, ${job.agentId}, ${now}, ${now})
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

    if (updateFields.length === 0) {
      return await getJobById(id);
    }

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

