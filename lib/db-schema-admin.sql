-- Admin System Schema Extension
-- Run this SQL after the main schema (lib/db-schema.sql)

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'sub_admin')),
  can_create BOOLEAN DEFAULT TRUE,
  can_delete BOOLEAN DEFAULT TRUE,
  can_manage_users BOOLEAN DEFAULT TRUE,
  can_manage_agents BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Password reset requests table
CREATE TABLE IF NOT EXISTS password_reset_requests (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requester_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requester_type VARCHAR(20) NOT NULL CHECK (requester_type IN ('user', 'agent')),
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_id VARCHAR(255) REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Admin activity log (optional, for audit trail)
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id VARCHAR(255) PRIMARY KEY,
  admin_id VARCHAR(255) NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50) NOT NULL, -- 'user', 'agent', 'password_reset', etc.
  target_id VARCHAR(255),
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admins_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_user_id ON password_reset_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_requests_status ON password_reset_requests(status);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);

-- Insert default admin (password: Admin123! - should be changed)
-- Password hash for "Admin123!" generated with bcrypt.hash('Admin123!', 10)
INSERT INTO admins (id, username, email, password, full_name, role, can_create, can_delete, can_manage_users, can_manage_agents)
VALUES (
  'admin1',
  'admin',
  'admin@thesupport.agency',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'System Administrator',
  'admin',
  TRUE,
  TRUE,
  TRUE,
  TRUE
)
ON CONFLICT (username) DO NOTHING;

-- Note: Default password is "Admin123!" - CHANGE THIS IMMEDIATELY after first login!
-- To create more admins, use: npm run create-admin

