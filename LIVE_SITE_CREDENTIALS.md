# Live Site Test Credentials

## Quick Test Account

For testing on **https://www.thesupport.agency/auth/signin**:

**Email:** `sampletest@thesupport.in`  
**Password:** `Test123!`

## All Available Test Accounts

### Users (Can login at `/auth/signin`)

| Email | Password | Status |
|-------|----------|--------|
| `sampletest@thesupport.in` | `Test123!` | ✅ Recommended for testing |
| `user1@thesupport.in` | `User123!` | Available |
| `user2@thesupport.in` | `User123!` | Available |
| `user3@thesupport.in` | `User123!` | Available |
| `user4@thesupport.in` | `User123!` | Available |
| `user5@thesupport.in` | `User123!` | Available |

### Agents (Can login at `/agent-login`)

| Email | Password | Status |
|-------|----------|--------|
| `agent1@thesupport.in` | `Agent123!` | Available |
| `agent2@thesupport.in` | `Agent123!` | Available |
| `agent3@thesupport.in` | `Agent123!` | Available |
| `agent4@thesupport.in` | `Agent123!` | Available |
| `agent5@thesupport.in` | `Agent123!` | Available |

## How to Use These Accounts

### For Users (at https://www.thesupport.agency/auth/signin):

1. Go to: https://www.thesupport.agency/auth/signin
2. Enter email: `sampletest@thesupport.in`
3. Enter password: `Test123!`
4. Click "Sign In"

### For Agents (at https://www.thesupport.agency/agent-login):

1. Go to: https://www.thesupport.agency/agent-login
2. Enter email: `agent1@thesupport.in`
3. Enter password: `Agent123!`
4. Click "Sign In with Password"

## Creating/Updating Accounts on Live Site

To ensure these accounts exist on the live site, run the user creation script:

```bash
npm run create-users
```

Or if deploying to Railway:
```bash
railway run npm run create-users
```

This script is **idempotent** - it will:
- Create accounts if they don't exist
- Update passwords if accounts already exist
- Never create duplicates

## Notes

⚠️ **These are test accounts for development/testing purposes**
- All passwords are hashed using bcrypt before storage
- Accounts may need to be created/updated on the live database
- If login fails, ensure the accounts exist in the production database by running the creation script

---

**Last Updated:** Created sampletest account for easy testing on live site.

