/**
 * Complete Database Setup Script
 * 
 * This script:
 * 1. Creates all tables (users, jobs, files)
 * 2. Creates 5 users and 5 agents with passwords
 * 3. Verifies the setup
 * 
 * Usage:
 *   npx tsx scripts/setup-database.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { query } from '../lib/db-client';
import { hash } from 'bcryptjs';
import sql from '../lib/db-client';

interface UserData {
  id: string;
  email: string;
  name: string;
  company: string;
  address: string;
  phone: string;
  role: 'user' | 'agent';
  password: string;
}

const USERS: UserData[] = [
  {
    id: 'user1',
    email: 'user1@thesupport.in',
    name: 'Alice Johnson',
    company: 'Creative Designs Co.',
    address: '123 Main St, Mumbai, India',
    phone: '+919876543210',
    role: 'user',
    password: 'User123!',
  },
  {
    id: 'user2',
    email: 'user2@thesupport.in',
    name: 'Bob Smith',
    company: 'Digital Marketing Pro',
    address: '456 Park Ave, Delhi, India',
    phone: '+919876543211',
    role: 'user',
    password: 'User123!',
  },
  {
    id: 'user3',
    email: 'user3@thesupport.in',
    name: 'Carol Williams',
    company: 'Brand Studio',
    address: '789 Business Rd, Bangalore, India',
    phone: '+919876543212',
    role: 'user',
    password: 'User123!',
  },
  {
    id: 'user4',
    email: 'user4@thesupport.in',
    name: 'David Brown',
    company: 'Marketing Solutions',
    address: '321 Commerce St, Pune, India',
    phone: '+919876543213',
    role: 'user',
    password: 'User123!',
  },
  {
    id: 'user5',
    email: 'user5@thesupport.in',
    name: 'Emma Davis',
    company: 'Design Hub',
    address: '654 Creative Ave, Chennai, India',
    phone: '+919876543214',
    role: 'user',
    password: 'User123!',
  },
];

const AGENTS: UserData[] = [
  {
    id: 'agent1',
    email: 'agent1@thesupport.in',
    name: 'Support Agent One',
    company: 'TheSupport.in',
    address: 'Delhi, India',
    phone: '+919900112231',
    role: 'agent',
    password: 'Agent123!',
  },
  {
    id: 'agent2',
    email: 'agent2@thesupport.in',
    name: 'Support Agent Two',
    company: 'TheSupport.in',
    address: 'Mumbai, India',
    phone: '+919900112232',
    role: 'agent',
    password: 'Agent123!',
  },
  {
    id: 'agent3',
    email: 'agent3@thesupport.in',
    name: 'Support Agent Three',
    company: 'TheSupport.in',
    address: 'Bangalore, India',
    phone: '+919900112233',
    role: 'agent',
    password: 'Agent123!',
  },
  {
    id: 'agent4',
    email: 'agent4@thesupport.in',
    name: 'Support Agent Four',
    company: 'TheSupport.in',
    address: 'Pune, India',
    phone: '+919900112234',
    role: 'agent',
    password: 'Agent123!',
  },
  {
    id: 'agent5',
    email: 'agent5@thesupport.in',
    name: 'Support Agent Five',
    company: 'TheSupport.in',
    address: 'Chennai, India',
    phone: '+919900112235',
    role: 'agent',
    password: 'Agent123!',
  },
];

async function createTables() {
  console.log('\n📋 Step 1: Creating database tables...\n');
  
  const schemaPath = join(process.cwd(), 'lib', 'db-schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');
  
  // Split by semicolons and execute each statement
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  let successCount = 0;
  let errorCount = 0;

  for (const statement of statements) {
    try {
      await query(statement);
      successCount++;
      console.log(`✓ Executed: ${statement.substring(0, 60)}...`);
    } catch (error: any) {
      // Ignore "already exists" errors
      if (error.message.includes('already exists') || error.message.includes('duplicate')) {
        console.log(`ℹ Skipped (already exists): ${statement.substring(0, 60)}...`);
      } else {
        errorCount++;
        console.error(`✗ Error: ${error.message}`);
        console.error(`  Statement: ${statement.substring(0, 100)}`);
      }
    }
  }

  console.log(`\n✅ Tables created: ${successCount} successful, ${errorCount} errors\n`);
}

async function createUser(userData: UserData): Promise<void> {
  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id, email FROM users WHERE email = ${userData.email}
    `;

    if (existingUser.rows.length > 0) {
      console.log(`  ↻ Updating existing user: ${userData.email}`);
      
      // Hash password
      const hashedPassword = await hash(userData.password, 10);
      
      // Update existing user
      await sql`
        UPDATE users 
        SET 
          name = ${userData.name},
          company = ${userData.company},
          address = ${userData.address},
          phone = ${userData.phone},
          role = ${userData.role},
          password = ${hashedPassword},
          updated_at = CURRENT_TIMESTAMP
        WHERE email = ${userData.email}
      `;
    } else {
      console.log(`  + Creating new user: ${userData.email}`);
      
      // Hash password
      const hashedPassword = await hash(userData.password, 10);
      
      // Insert new user
      await sql`
        INSERT INTO users (id, email, name, company, address, phone, job_count, role, password)
        VALUES (
          ${userData.id},
          ${userData.email},
          ${userData.name},
          ${userData.company},
          ${userData.address},
          ${userData.phone},
          0,
          ${userData.role},
          ${hashedPassword}
        )
      `;
    }
  } catch (error: any) {
    if (error.code === '23505') {
      // Unique constraint violation - try to update by email instead
      console.log(`  ↻ User with ID ${userData.id} exists, updating by email...`);
      
      const hashedPassword = await hash(userData.password, 10);
      await sql`
        UPDATE users 
        SET 
          name = ${userData.name},
          company = ${userData.company},
          address = ${userData.address},
          phone = ${userData.phone},
          role = ${userData.role},
          password = ${hashedPassword},
          updated_at = CURRENT_TIMESTAMP
        WHERE email = ${userData.email}
      `;
    } else {
      console.error(`  ✗ Error creating user ${userData.email}:`, error.message);
      throw error;
    }
  }
}

async function createUsers() {
  console.log('👥 Step 2: Creating users and agents...\n');
  
  console.log('Creating Users:');
  for (const user of USERS) {
    await createUser(user);
  }
  console.log(`\n✅ Created/Updated ${USERS.length} users\n`);

  console.log('Creating Agents:');
  for (const agent of AGENTS) {
    await createUser(agent);
  }
  console.log(`\n✅ Created/Updated ${AGENTS.length} agents\n`);
}

async function verifyDatabase() {
  console.log('🔍 Step 3: Verifying database setup...\n');

  try {
    // Check tables exist
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'jobs', 'files')
      ORDER BY table_name
    `);

    const tables = tablesResult.rows.map((r: any) => r.table_name);
    console.log('📊 Tables found:', tables.join(', '));
    
    if (tables.length !== 3) {
      console.error('⚠️  Warning: Expected 3 tables, found', tables.length);
    }

    // Check users
    const usersResult = await sql`
      SELECT id, email, name, role, 
             CASE WHEN password IS NOT NULL THEN 'Yes' ELSE 'No' END as has_password
      FROM users 
      ORDER BY role, email
    `;

    console.log(`\n📋 Users in database: ${usersResult.rows.length}\n`);
    
    console.log('Users:');
    usersResult.rows
      .filter((r: any) => r.role === 'user')
      .forEach((r: any) => {
        console.log(`  - ${r.email} (${r.name}) - Password: ${r.has_password}`);
      });

    console.log('\nAgents:');
    usersResult.rows
      .filter((r: any) => r.role === 'agent')
      .forEach((r: any) => {
        console.log(`  - ${r.email} (${r.name}) - Password: ${r.has_password}`);
      });

    // Check for required test accounts
    const requiredEmails = [
      'user1@thesupport.in',
      'agent1@thesupport.in'
    ];

    const foundEmails = usersResult.rows.map((r: any) => r.email);
    const missingEmails = requiredEmails.filter(e => !foundEmails.includes(e));

    if (missingEmails.length > 0) {
      console.error(`\n⚠️  Warning: Missing required accounts: ${missingEmails.join(', ')}`);
    } else {
      console.log('\n✅ All required test accounts found!');
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`  Tables: ${tables.length}/3`);
    console.log(`  Total users: ${usersResult.rows.length}`);
    console.log(`  Users: ${usersResult.rows.filter((r: any) => r.role === 'user').length}`);
    console.log(`  Agents: ${usersResult.rows.filter((r: any) => r.role === 'agent').length}`);
    console.log(`  Users with passwords: ${usersResult.rows.filter((r: any) => r.has_password === 'Yes').length}`);

  } catch (error: any) {
    console.error('❌ Error verifying database:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting complete database setup...\n');
  console.log('='.repeat(60));

  try {
    // Step 1: Create tables
    await createTables();

    // Step 2: Create users and agents
    await createUsers();

    // Step 3: Verify setup
    await verifyDatabase();

    console.log('\n' + '='.repeat(60));
    console.log('✅ Database setup completed successfully!\n');
    console.log('📋 Test Credentials:');
    console.log('  Users: password = User123!');
    console.log('  Agents: password = Agent123!');
    console.log('\n🔐 Test Accounts:');
    console.log('  User: user1@thesupport.in / User123!');
    console.log('  Agent: agent1@thesupport.in / Agent123!\n');

  } catch (error: any) {
    console.error('\n❌ Error during setup:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

