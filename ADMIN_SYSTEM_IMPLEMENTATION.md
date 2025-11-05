# Admin System Implementation Plan

## Overview
Complete admin panel system for managing users, agents, and password resets.

## Features to Implement

### 1. Admin Authentication
- Admin login with username/password
- Separate from user/agent authentication
- Session management

### 2. Admin Dashboard
- Statistics dashboard
- Job counts by user/agent
- User-agent job mappings
- Recent activity

### 3. User Management
- View all users
- Create new users (with password)
- Edit user profiles
- Delete users
- View user job history

### 4. Agent Management
- View all agents
- Create new agents (with password)
- Edit agent profiles
- Delete agents
- View agent job history

### 5. Sub-Admin Role
- Can create users/agents
- Cannot delete users/agents
- Limited access to sensitive operations

### 6. Password Reset System
- Users/agents can request password reset via messages
- Admin receives requests
- Admin can approve/reject and reset passwords
- System generates new passwords

## Database Schema
- `admins` table (username, password, role, permissions)
- `password_reset_requests` table
- `admin_activity_log` table (optional)

## Implementation Steps
1. Fix login issues
2. Create admin schema
3. Create admin login API
4. Create admin dashboard
5. Implement user management
6. Implement agent management
7. Implement sub-admin permissions
8. Implement password reset system

