# Test Accounts Credentials

This document contains the credentials for all test users and agents created by the `create-test-users` script.

## Sample Test Account (Recommended for Quick Testing)

**Email:** `sampletest@thesupport.in`  
**Password:** `Test123!`  
**Name:** Sample Test User  
**Role:** User

This account is specifically created for quick testing on the live site.

## Users (5 accounts)

All users have the password: **`User123!`**

| Email | Name | Company | ID |
|-------|------|---------|-----|
| user1@thesupport.in | Alice Johnson | Creative Designs Co. | user1 |
| user2@thesupport.in | Bob Smith | Digital Marketing Pro | user2 |
| user3@thesupport.in | Carol Williams | Brand Studio | user3 |
| user4@thesupport.in | David Brown | Marketing Solutions | user4 |
| user5@thesupport.in | Emma Davis | Design Hub | user5 |

## Agents (5 accounts)

All agents have the password: **`Agent123!`**

| Email | Name | Company | ID |
|-------|------|---------|-----|
| agent1@thesupport.in | Support Agent One | TheSupport.in | agent1 |
| agent2@thesupport.in | Support Agent Two | TheSupport.in | agent2 |
| agent3@thesupport.in | Support Agent Three | TheSupport.in | agent3 |
| agent4@thesupport.in | Support Agent Four | TheSupport.in | agent4 |
| agent5@thesupport.in | Support Agent Five | TheSupport.in | agent5 |

## Login Instructions

### For Users:
1. Go to: `http://localhost:3000/auth/signin`
2. Click "Password Login" tab
3. Enter email (e.g., `user1@thesupport.in`)
4. Enter password: `User123!`
5. Click "Sign In"

### For Agents:
1. Go to: `http://localhost:3000/agent-login`
2. Enter email (e.g., `agent1@thesupport.in`)
3. Enter password: `Agent123!`
4. Click "Sign In with Password"

## Creating/Updating Accounts

Run the script to create or update all accounts:

```bash
npm run create-users
```

The script is **idempotent** - it will:
- Create new accounts if they don't exist
- Update existing accounts (including passwords) if they already exist
- Never create duplicates

## Security Notes

⚠️ **These are test accounts only!**
- Passwords are hashed using bcrypt before storage
- In production, use strong, unique passwords
- These credentials are for development/testing only

## Access Control

- **Users** can only access jobs where they are the `userId`
- **Agents** can only access jobs where they are the `agentId`
- Each account has independent access based on their role and job assignments

