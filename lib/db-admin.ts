import sql, { query } from './db-client';
import { Admin, PasswordResetRequest, JobStats } from './utils';
import { nanoid } from 'nanoid';

// Admin database functions

function mapAdminRow(row: any): Admin {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    fullName: row.full_name,
    role: row.role,
    canCreate: row.can_create || false,
    canDelete: row.can_delete || false,
    canManageUsers: row.can_manage_users || false,
    canManageAgents: row.can_manage_agents || false,
    isActive: row.is_active !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastLogin: row.last_login,
  };
}

function mapPasswordResetRequestRow(row: any): PasswordResetRequest {
  return {
    id: row.id,
    userId: row.user_id,
    requesterId: row.requester_id,
    requesterType: row.requester_type,
    message: row.message,
    status: row.status,
    adminId: row.admin_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at,
  };
}

// Admin functions
export async function getAdminByUsername(username: string): Promise<Admin | null> {
  try {
    const result = await sql`
      SELECT * FROM admins WHERE username = ${username} AND is_active = TRUE
    `;
    return result.rows[0] ? mapAdminRow(result.rows[0]) : null;
  } catch (error: any) {
    if (error.message?.includes('does not exist')) {
      console.error('⚠️  Admins table does not exist! Run: npm run setup-admin-db');
    }
    console.error('Error fetching admin:', error);
    return null;
  }
}

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  try {
    const result = await sql`
      SELECT * FROM admins WHERE email = ${email} AND is_active = TRUE
    `;
    return result.rows[0] ? mapAdminRow(result.rows[0]) : null;
  } catch (error: any) {
    console.error('Error fetching admin by email:', error);
    return null;
  }
}

export async function getAdminById(id: string): Promise<Admin | null> {
  try {
    const result = await sql`
      SELECT * FROM admins WHERE id = ${id} AND is_active = TRUE
    `;
    return result.rows[0] ? mapAdminRow(result.rows[0]) : null;
  } catch (error: any) {
    console.error('Error fetching admin by id:', error);
    return null;
  }
}

export async function updateAdminLastLogin(id: string): Promise<void> {
  try {
    await sql`
      UPDATE admins SET last_login = NOW() WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Error updating admin last login:', error);
  }
}

export async function getAllAdmins(): Promise<Admin[]> {
  try {
    const result = await sql`
      SELECT * FROM admins WHERE is_active = TRUE ORDER BY created_at DESC
    `;
    return result.rows.map(mapAdminRow);
  } catch (error: any) {
    if (error.message?.includes('does not exist')) {
      return [];
    }
    console.error('Error fetching admins:', error);
    return [];
  }
}

export async function createAdmin(admin: Omit<Admin, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Admin> {
  const adminId = admin.id || nanoid();
  try {
    const result = await sql`
      INSERT INTO admins (id, username, email, password, full_name, role, can_create, can_delete, can_manage_users, can_manage_agents, is_active)
      VALUES (${adminId}, ${admin.username}, ${admin.email}, ${admin.password}, ${admin.fullName}, ${admin.role}, ${admin.canCreate}, ${admin.canDelete}, ${admin.canManageUsers}, ${admin.canManageAgents}, ${admin.isActive !== false})
      RETURNING *
    `;
    return mapAdminRow(result.rows[0]);
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
}

export async function updateAdmin(id: string, updates: Partial<Admin>): Promise<Admin | null> {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.username !== undefined) {
      fields.push('username');
      values.push(updates.username);
    }
    if (updates.email !== undefined) {
      fields.push('email');
      values.push(updates.email);
    }
    if (updates.password !== undefined) {
      fields.push('password');
      values.push(updates.password);
    }
    if (updates.fullName !== undefined) {
      fields.push('full_name');
      values.push(updates.fullName);
    }
    if (updates.role !== undefined) {
      fields.push('role');
      values.push(updates.role);
      // Auto-update canDelete based on role
      if (updates.role === 'sub_admin') {
        fields.push('can_delete');
        values.push(false);
      }
    }
    if (updates.canCreate !== undefined) {
      fields.push('can_create');
      values.push(updates.canCreate);
    }
    if (updates.canDelete !== undefined) {
      fields.push('can_delete');
      values.push(updates.canDelete);
    }
    if (updates.isActive !== undefined) {
      fields.push('is_active');
      values.push(updates.isActive);
    }

    if (fields.length === 0) {
      return await getAdminById(id);
    }

    fields.push('updated_at');
    values.push(new Date().toISOString());

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const queryText = `UPDATE admins SET ${setClause} WHERE id = $${fields.length} RETURNING *`;
    
    const result = await query(queryText, [...values, id]);
    return result.rows[0] ? mapAdminRow(result.rows[0]) : null;
  } catch (error) {
    console.error('Error updating admin:', error);
    return null;
  }
}

export async function deleteAdmin(id: string): Promise<boolean> {
  try {
    // Soft delete by setting is_active to false
    await sql`
      UPDATE admins SET is_active = FALSE, updated_at = NOW() WHERE id = ${id}
    `;
    return true;
  } catch (error) {
    console.error('Error deleting admin:', error);
    return false;
  }
}

// Password Reset Request functions
export async function createPasswordResetRequest(request: Omit<PasswordResetRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'> & { id?: string }): Promise<PasswordResetRequest> {
  const requestId = request.id || nanoid();
  try {
    const result = await sql`
      INSERT INTO password_reset_requests (id, user_id, requester_id, requester_type, message, status)
      VALUES (${requestId}, ${request.userId}, ${request.requesterId}, ${request.requesterType}, ${request.message || null}, 'pending')
      RETURNING *
    `;
    return mapPasswordResetRequestRow(result.rows[0]);
  } catch (error) {
    console.error('Error creating password reset request:', error);
    throw error;
  }
}

export async function getPasswordResetRequests(status?: string): Promise<PasswordResetRequest[]> {
  try {
    if (status) {
      const result = await sql`
        SELECT prr.*, u1.name as user_name, u1.email as user_email, u2.name as requester_name, u2.email as requester_email
        FROM password_reset_requests prr
        LEFT JOIN users u1 ON prr.user_id = u1.id
        LEFT JOIN users u2 ON prr.requester_id = u2.id
        WHERE prr.status = ${status}
        ORDER BY prr.created_at DESC
      `;
      return result.rows.map(mapPasswordResetRequestRow);
    } else {
      const result = await sql`
        SELECT prr.*, u1.name as user_name, u1.email as user_email, u2.name as requester_name, u2.email as requester_email
        FROM password_reset_requests prr
        LEFT JOIN users u1 ON prr.user_id = u1.id
        LEFT JOIN users u2 ON prr.requester_id = u2.id
        ORDER BY prr.created_at DESC
      `;
      return result.rows.map(mapPasswordResetRequestRow);
    }
  } catch (error: any) {
    if (error.message?.includes('does not exist')) {
      return [];
    }
    console.error('Error fetching password reset requests:', error);
    return [];
  }
}

export async function updatePasswordResetRequest(id: string, updates: Partial<PasswordResetRequest>): Promise<PasswordResetRequest | null> {
  try {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.status !== undefined) {
      fields.push('status');
      values.push(updates.status);
      if (updates.status === 'completed' || updates.status === 'rejected') {
        fields.push('resolved_at');
        values.push(new Date().toISOString());
      }
    }
    if (updates.adminId !== undefined) {
      fields.push('admin_id');
      values.push(updates.adminId);
    }
    if (updates.message !== undefined) {
      fields.push('message');
      values.push(updates.message);
    }

    if (fields.length === 0) {
      return null;
    }

    fields.push('updated_at');
    values.push(new Date().toISOString());

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const queryText = `UPDATE password_reset_requests SET ${setClause} WHERE id = $${fields.length} RETURNING *`;
    
    const result = await query(queryText, [...values, id]);
    return result.rows[0] ? mapPasswordResetRequestRow(result.rows[0]) : null;
  } catch (error) {
    console.error('Error updating password reset request:', error);
    return null;
  }
}

// Statistics functions
export async function getJobStatistics(): Promise<JobStats> {
  try {
    // Total jobs
    const totalResult = await sql`SELECT COUNT(*) as count FROM jobs`;
    const totalJobs = parseInt(totalResult.rows[0]?.count || '0');

    // Jobs by user
    const userJobsResult = await sql`
      SELECT j.user_id, u.name as user_name, COUNT(*) as count
      FROM jobs j
      JOIN users u ON j.user_id = u.id
      GROUP BY j.user_id, u.name
      ORDER BY count DESC
    `;

    // Jobs by agent
    const agentJobsResult = await sql`
      SELECT j.agent_id, u.name as agent_name, COUNT(*) as count
      FROM jobs j
      JOIN users u ON j.agent_id = u.id
      GROUP BY j.agent_id, u.name
      ORDER BY count DESC
    `;

    // User-Agent mappings
    const mappingsResult = await sql`
      SELECT j.id as job_id, j.user_id, u1.name as user_name, j.agent_id, u2.name as agent_name, j.created_at
      FROM jobs j
      JOIN users u1 ON j.user_id = u1.id
      JOIN users u2 ON j.agent_id = u2.id
      ORDER BY j.created_at DESC
    `;

    return {
      totalJobs,
      jobsByUser: userJobsResult.rows.map((row: any) => ({
        userId: row.user_id,
        userName: row.user_name,
        count: parseInt(row.count || '0'),
      })),
      jobsByAgent: agentJobsResult.rows.map((row: any) => ({
        agentId: row.agent_id,
        agentName: row.agent_name,
        count: parseInt(row.count || '0'),
      })),
      userAgentMappings: mappingsResult.rows.map((row: any) => ({
        jobId: row.job_id,
        userId: row.user_id,
        userName: row.user_name,
        agentId: row.agent_id,
        agentName: row.agent_name,
        createdAt: row.created_at,
      })),
    };
  } catch (error: any) {
    console.error('Error fetching job statistics:', error);
    return {
      totalJobs: 0,
      jobsByUser: [],
      jobsByAgent: [],
      userAgentMappings: [],
    };
  }
}

// Log admin activity
export async function logAdminActivity(adminId: string, action: string, targetType: string, targetId?: string, details?: any): Promise<void> {
  try {
    await sql`
      INSERT INTO admin_activity_log (id, admin_id, action, target_type, target_id, details)
      VALUES (${nanoid()}, ${adminId}, ${action}, ${targetType}, ${targetId || null}, ${details ? JSON.stringify(details) : null})
    `;
  } catch (error) {
    // Don't fail if logging fails
    console.error('Error logging admin activity:', error);
  }
}

