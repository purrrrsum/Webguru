# Deploying to Hostinger VPS - Node.js Setup

Since Hostinger's migration tool only supports PHP/WordPress, you need to deploy the Node.js app manually to VPS hosting.

## Option 1: Use Hostinger VPS (Recommended)

Hostinger VPS supports Node.js applications. Here's how to deploy:

### Step 1: Access Your VPS

1. Log into **Hostinger hPanel**
2. Go to **VPS** section
3. Find your VPS server
4. Get **SSH credentials**:
   - IP Address
   - Username
   - Password (or SSH key)

### Step 2: Connect via SSH

**Windows (using PuTTY or PowerShell):**
```bash
ssh username@your-vps-ip
```

**Or use Hostinger's built-in SSH terminal** in hPanel.

### Step 3: Upload Files to VPS

**Method A: Using SCP (Secure Copy)**

From your local machine:
```bash
# Upload the zip file
scp thesupport-agency-for-hostinger.zip username@your-vps-ip:/home/username/

# Or upload entire directory
scp -r D:\Webguru\* username@your-vps-ip:/home/username/thesupport/
```

**Method B: Using SFTP (FileZilla, WinSCP)**

1. Download FileZilla or WinSCP
2. Connect using:
   - Host: Your VPS IP
   - Username: VPS username
   - Password: VPS password
   - Port: 22 (SSH)
3. Upload the extracted files to `/home/username/thesupport/` or your domain folder

**Method C: Git Clone (If using Git)**

```bash
# On VPS
cd /home/username/
git clone your-repo-url thesupport
cd thesupport
```

### Step 4: Install Node.js and PostgreSQL

On your VPS, run:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js
node --version  # Should show v20.x.x
npm --version

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 5: Set Up PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE thesupport_db;
CREATE USER thesupport_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE thesupport_db TO thesupport_user;
\q
```

### Step 6: Extract and Install Application

```bash
# Navigate to your app directory
cd /home/username/thesupport/

# Extract zip if uploaded
unzip thesupport-agency-for-hostinger.zip -d .

# Install dependencies
npm install

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### Step 7: Set Environment Variables

Create `.env.production` file:

```bash
nano .env.production
```

Add:
```env
NEXTAUTH_SECRET=your_generated_secret_here
NEXTAUTH_URL=https://thesupport.agency
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RESEND_API_KEY=your_resend_api_key
DATABASE_URL=postgresql://thesupport_user:your_secure_password@localhost:5432/thesupport_db
ADMIN_EMAIL=agent@thesupport.in
ADMIN_PASSWORD=Support123!
NEXT_PUBLIC_BASE_URL=https://thesupport.agency
NODE_ENV=production
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### Step 8: Initialize Database

```bash
# Run the database schema
sudo -u postgres psql -d thesupport_db -f lib/db-schema.sql

# Or using the script
npx tsx scripts/init-db.ts
```

### Step 9: Build the Application

```bash
npm run build
```

### Step 10: Create Uploads Directory

```bash
mkdir -p public/uploads
chmod 755 public/uploads
```

### Step 11: Start Application with PM2

```bash
# Start the app
pm2 start npm --name "thesupport" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions it provides
```

### Step 12: Configure Nginx (Reverse Proxy)

```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/thesupport.agency
```

Add:
```nginx
server {
    listen 80;
    server_name thesupport.agency www.thesupport.agency;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase upload size limit
    client_max_body_size 20M;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/thesupport.agency /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### Step 13: Set Up SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d thesupport.agency -d www.thesupport.agency

# Auto-renewal (already set up by certbot)
sudo certbot renew --dry-run
```

## Option 2: Use Hostinger Node.js Hosting (If Available)

Some Hostinger plans offer Node.js hosting:

1. **Go to Hostinger hPanel**
2. **Advanced** → **Node.js** (or **Developer Tools** → **Node.js**)
3. **Create Node.js Application**
4. **Upload your zip file** via FTP to the Node.js app directory
5. **Extract** the zip
6. **Set environment variables** in Node.js settings
7. **Run commands**:
   ```bash
   npm install
   npm run build
   npm start
   ```

## Option 3: Alternative Hosting Options

If Hostinger doesn't support Node.js on your plan:

### Option A: Upgrade to VPS
- Contact Hostinger support to upgrade
- Follow Option 1 steps above

### Option B: Use Alternative Hosting
- **Railway**: https://railway.app (Great for Node.js)
- **Render**: https://render.com (Free tier available)
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform
- **Fly.io**: https://fly.io (Good performance)

### Option C: Static Export (Limited Functionality)

Convert to static site (loses API routes):

```js
// next.config.js
const nextConfig = {
  output: 'export',
  // ... rest of config
}
```

Then deploy as static HTML/PHP.

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000
# Kill it
sudo kill -9 <PID>
```

### Permission Denied
```bash
# Fix permissions
sudo chown -R $USER:$USER /home/username/thesupport
chmod -R 755 /home/username/thesupport
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U thesupport_user -d thesupport_db -h localhost
```

### Check PM2 Status
```bash
pm2 list
pm2 logs thesupport
pm2 restart thesupport
```

## Quick Deployment Script

Create `deploy.sh` on VPS:

```bash
#!/bin/bash
cd /home/username/thesupport
git pull  # or extract from zip
npm install
npm run build
pm2 restart thesupport
```

Make executable:
```bash
chmod +x deploy.sh
```

Run:
```bash
./deploy.sh
```

---

**Your app should now be accessible at: https://thesupport.agency** 🚀

