# Admin Login Guide 🔐

## Quick Start

### Step 1: Ensure Database is Set Up

First, make sure the admin database tables are created:

```bash
npm run setup-admin-db
```

Or if you need the complete database setup:

```bash
npm run setup-complete-db
```

### Step 2: Create an Admin User

If no admin user exists, create one:

```bash
npm run create-admin
```

You'll be prompted to enter:
- **Username**: (e.g., `admin`)
- **Email**: (e.g., `admin@thesupport.agency`)
- **Password**: (e.g., `Admin123!`)
- **Full Name**: (e.g., `System Administrator`)
- **Role**: `admin` or `sub_admin` (default: `admin`)

### Step 3: Login

1. **Go to the admin login page**: `/admin-panel/login`
   - Or visit: `http://localhost:3000/admin-panel/login` (in development)
   - Or: `https://your-domain.com/admin-panel/login` (in production)

2. **Enter your credentials**:
   - **Username**: The username you created (e.g., `admin`)
   - **Password**: The password you set (e.g., `Admin123!`)

3. **Click "Sign In"**

4. You'll be redirected to `/admin-panel` (the admin dashboard)

---

## Default Admin Credentials

If you ran the database setup script (`npm run setup-admin-db`), a default admin user is automatically created:

- **Username**: `admin`
- **Email**: `admin@thesupport.agency`
- **Password**: `Admin123!`
- **Full Name**: `System Administrator`

⚠️ **IMPORTANT**: Change the default password immediately after first login!

---

## Troubleshooting

### "Invalid username or password"

**Possible causes:**
1. Admin user doesn't exist in database
   - **Solution**: Run `npm run create-admin` to create an admin user

2. Wrong username or password
   - **Solution**: Double-check your credentials
   - **Solution**: Create a new admin user with `npm run create-admin`

3. Database table doesn't exist
   - **Solution**: Run `npm run setup-admin-db` to create the admin tables

### "Database table not found"

**Solution**: Run the database setup:
```bash
npm run setup-admin-db
```

### "Database connection failed"

**Possible causes:**
1. `DATABASE_URL` environment variable is not set
   - **Solution**: Check your `.env.local` file (development) or Railway environment variables (production)

2. Database service is not running
   - **Solution**: Check Railway PostgreSQL service status

3. Connection string is incorrect
   - **Solution**: Verify your `DATABASE_URL` format: `postgresql://user:password@host:port/database`

### "Account is inactive"

**Solution**: The admin account has been deactivated. Contact another admin to reactivate it, or create a new admin account.

---

## Admin Panel Features

Once logged in, you can access:

- **Dashboard** (`/admin-panel`) - Overview of jobs, SLA status, and annotations
- **User Management** - Manage users and agents
- **Password Reset Requests** - Approve/reject password reset requests
- **Job Statistics** - View job statistics and analytics

---

## Creating Additional Admin Users

To create more admin users:

```bash
npm run create-admin
```

Follow the prompts to create a new admin account.

---

## Security Best Practices

1. ✅ **Change default password** immediately after first login
2. ✅ **Use strong passwords** (minimum 8 characters, mix of letters, numbers, symbols)
3. ✅ **Don't share admin credentials**
4. ✅ **Create separate admin accounts** for each administrator
5. ✅ **Use `sub_admin` role** for users who don't need full admin privileges
6. ✅ **Deactivate unused admin accounts** instead of deleting them

---

## Admin Roles

- **`admin`**: Full access, can delete records
- **`sub_admin`**: Limited access, cannot delete records

Both roles can:
- Create users and agents
- Manage users and agents
- Approve password reset requests
- View all jobs and statistics

Only `admin` role can:
- Delete records
- Delete other admins

---

## Need Help?

If you're still having issues:

1. Check the browser console for errors
2. Check server logs for detailed error messages
3. Verify database connection: `npm run verify-db`
4. Check that all environment variables are set correctly

