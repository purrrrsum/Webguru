import sql, { query } from './db-client';
import { User, Job, FileData } from './utils';

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
    const result = await sql`
      INSERT INTO users (id, email, name, company, address, phone, job_count, role, password)
      VALUES (${userId}, ${user.email}, ${user.name}, ${user.company || ''}, ${user.address || ''}, ${user.phone || ''}, ${user.jobCount || 0}, ${user.role || 'user'}, ${user.password || null})
      RETURNING *
    `;
    return mapUserRow(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
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
  const jobId = job.id || `job${Date.now()}`;
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

