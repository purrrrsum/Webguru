# Test Chat URLs Guide

## Direct URL Format

The chat pages use this format:
```
http://localhost:3000/chat/[jobId]
```

For production:
```
https://yourdomain.com/chat/[jobId]
```

## Important Notes

⚠️ **Authentication Required**: Chat pages require login. You cannot access them without authentication.

- **Users** can only access jobs where they are the `userId`
- **Agents** can only access jobs where they are the `agentId`

## How to Get Job IDs for Testing

### Method 1: Using the Dashboard (Recommended)

1. **Login as User:**
   - Go to: `http://localhost:3000/auth/signin`
   - Sign in with your user credentials
   - Click "New Job" on the dashboard
   - The job ID will be in the URL when you're redirected to the chat

2. **Login as Agent:**
   - Go to: `http://localhost:3000/agent-login`
   - Sign in with agent credentials
   - View jobs from the dashboard
   - Click on any job to see the job ID in the URL

### Method 2: Using Test Chat Page

Visit the test page to see available jobs:
```
http://localhost:3000/test-chat
```

This page will:
- Show all jobs you have access to (if logged in)
- Display direct URLs for each job
- Allow you to enter a job ID manually

### Method 3: Query Database Directly

Connect to your PostgreSQL database and run:

```sql
-- Get recent jobs with user and agent info
SELECT 
    j.id as job_id,
    u1.email as user_email,
    u1.name as user_name,
    u2.email as agent_email,
    u2.name as agent_name,
    j.created_at
FROM jobs j
JOIN users u1 ON j.user_id = u1.id
JOIN users u2 ON j.agent_id = u2.id
ORDER BY j.created_at DESC
LIMIT 10;
```

Then use the `job_id` in the URL format above.

### Method 4: Check API Response

If logged in, you can fetch jobs via API:

```bash
# Get your session cookie first by logging in via browser
# Then use that cookie in this request:
curl http://localhost:3000/api/jobs \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

## Example URLs

If you have a job with ID `job1234567890`:

**User View:**
```
http://localhost:3000/chat/job1234567890
```
(Only accessible if logged in as the user who created this job)

**Agent View:**
```
http://localhost:3000/chat/job1234567890
```
(Only accessible if logged in as the agent assigned to this job)

## Testing Workflow

1. **Create Test Users:**
   - User: Sign up at `/auth/signin`
   - Agent: Login at `/agent-login` (or create via database)

2. **Create a Job:**
   - Login as user
   - Go to dashboard
   - Click "New Job"
   - Copy the job ID from the URL

3. **Test User Chat:**
   - Keep logged in as user
   - Access: `/chat/[jobId]`
   - Upload files and test functionality

4. **Test Agent Chat:**
   - Logout and login as agent
   - Access: `/chat/[jobId]` (same job ID)
   - Upload files and test functionality

## Quick Test Script

You can also create a test job programmatically. Create a file `test-job.js`:

```javascript
// Run this in browser console after logging in
fetch('/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(data => {
  console.log('Job created:', data.job.id);
  console.log('Chat URL:', window.location.origin + '/chat/' + data.job.id);
});
```

## Notes

- Job IDs are auto-generated using `nanoid()` or timestamp-based IDs
- Each job links one user to one agent
- Files uploaded in a job are shared between user and agent
- The same chat URL works for both user and agent (they see the same conversation)

