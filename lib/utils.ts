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

