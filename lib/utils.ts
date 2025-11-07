// Type definitions - now using PostgreSQL instead of JSON files
// Database functions are in lib/db.ts

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  address: string;
  phone: string;
  jobCount: number;
  role: 'user' | 'agent';
  password?: string;
}

export interface Job {
  id: string;
  userId: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
  title?: string | null;
  tags?: string[];
}

export interface FileData {
  id: string;
  jobId: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  userTick: boolean;
  agentTick: boolean;
}

export interface Message {
  id: string;
  jobId: string;
  senderId: string;
  message: string;
  createdAt: string;
  readByUser: boolean;
  readByAgent: boolean;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  role: 'admin' | 'sub_admin';
  canCreate: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canManageAgents: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface PasswordResetRequest {
  id: string;
  userId: string;
  requesterId: string;
  requesterType: 'user' | 'agent';
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminId?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface JobStats {
  totalJobs: number;
  jobsByUser: { userId: string; userName: string; count: number }[];
  jobsByAgent: { agentId: string; agentName: string; count: number }[];
  userAgentMappings: { jobId: string; userId: string; userName: string; agentId: string; agentName: string; createdAt: string }[];
}

export interface SupportTicket {
  id: string;
  userId?: string;
  email: string;
  role: 'user' | 'agent';
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'normal' | 'high';
  createdAt: string;
  updatedAt: string;
  unreadForAdmin: boolean;
}

