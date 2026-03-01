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
  upiId?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  bankName?: string;
  isOnline?: boolean;
  isReady?: boolean;
}

export interface Job {
  id: string;
  userId: string;
  agentId?: string | null;
  createdAt: string;
  updatedAt: string;
  title?: string | null;
  tags?: string[];
  userName?: string | null;
  agentName?: string | null;
  dueAt?: string | null;
  slaStatus?: 'pending' | 'on_track' | 'due_soon' | 'overdue' | 'escalated';
  escalationLevel?: 'none' | 'warning' | 'escalated';
  lastEscalatedAt?: string | null;
  jobNumber?: number | null;
  previousAgentId?: string | null;
  priority?: 'normal' | 'high' | 'urgent';
  status?: 'pending_match' | 'assigned' | 'in_progress' | 'completed' | 'closed';
  serviceType?: 'design' | 'content_creation' | 'video_editing' | 'text_editing' | 'proofreading' | 'other';
  pricingModel?: 'single_project' | 'monthly_subscription' | 'yearly_subscription';
  fileCount?: number;
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

export interface JobAnnotation {
  id: string;
  jobId: string;
  fileId?: string | null;
  authorId: string;
  authorName?: string | null;
  content: string;
  status: 'open' | 'resolved';
  createdAt: string;
  resolvedAt?: string | null;
}

export interface JobVersion {
  id: string;
  jobId: string;
  fileId?: string | null;
  versionNumber: number;
  notes?: string | null;
  createdBy: string;
  createdByName?: string | null;
  createdAt: string;
}

