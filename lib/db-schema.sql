-- Database Schema for thesupport.in
-- Run this SQL in your PostgreSQL database (Hostinger or any PostgreSQL server)

-- Users table
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Files table
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
);

-- Messages table for text messages
CREATE TABLE IF NOT EXISTS messages (
  id VARCHAR(255) PRIMARY KEY,
  job_id VARCHAR(255) NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sender_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_by_user BOOLEAN DEFAULT FALSE,
  read_by_agent BOOLEAN DEFAULT FALSE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_agent_id ON jobs(agent_id);
CREATE INDEX IF NOT EXISTS idx_files_job_id ON files(job_id);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_messages_job_id ON messages(job_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Insert default agent user
-- Note: Password hash is for "Support123!" - admin login uses plain text comparison from env vars
INSERT INTO users (id, email, name, company, address, phone, job_count, role, password)
VALUES (
  'agent1',
  'agent@thesupport.in',
  'Support Agent',
  'TheSupport.in',
  'Delhi, India',
  '+919900112233',
  0,
  'agent',
  '$2a$10$ONwyTUXOP6VukZFuyv6yRuwzhneu4nO8Kx3mVF8kFKz.0grdkkfQ2'
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  password = EXCLUDED.password;

-- Insert sample user
INSERT INTO users (id, email, name, company, address, phone, job_count, role)
VALUES (
  'user1',
  'user@example.com',
  'John Doe',
  'ABC Designs',
  '123, MG Road, Mumbai, India',
  '+919876543210',
  0,
  'user'
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  address = EXCLUDED.address,
  phone = EXCLUDED.phone;

