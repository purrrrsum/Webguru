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
    id: 'sampletest',
    email: 'sampletest@thesupport.in',
    name: 'Sample Test User',
    company: 'Test Company',
    address: 'Test Address',
    phone: '+919999999999',
    role: 'user',
    password: 'Test123!',
  },
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

async function createUserIfNotExists(userData: UserData): Promise<void> {
  try {
    // Check if user already exists
    const existingUser = await sql`
      SELECT id, email FROM users WHERE email = ${userData.email}
    `;

    if (existingUser.rows.length > 0) {
      console.log(`✓ User ${userData.email} already exists, updating password...`);
      
      // Hash password
      const hashedPassword = await hash(userData.password, 10);
      
      // Update existing user (idempotent - only update password if needed)
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
      console.log(`  Updated password for ${userData.email}`);
    } else {
      console.log(`+ Creating new user: ${userData.email}`);
      
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
      console.log(`  ✓ Created user ${userData.email} with ID ${userData.id}`);
    }
  } catch (error: any) {
    if (error.code === '23505') {
      // Unique constraint violation - user with this ID already exists
      console.log(`⚠ User with ID ${userData.id} already exists, trying with email...`);
      
      // Try to update by email instead
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
      console.log(`  ✓ Updated user ${userData.email}`);
    } else {
      console.error(`✗ Error creating user ${userData.email}:`, error.message);
      throw error;
    }
  }
}

async function main() {
  console.log('🚀 Starting user and agent creation...\n');

  try {
    // Create users
    console.log('📝 Creating Users...');
    for (const user of USERS) {
      await createUserIfNotExists(user);
    }
    console.log(`\n✓ Created/Updated ${USERS.length} users\n`);

    // Create agents
    console.log('👥 Creating Agents...');
    for (const agent of AGENTS) {
      await createUserIfNotExists(agent);
    }
    console.log(`\n✓ Created/Updated ${AGENTS.length} agents\n`);

    // Verify all users were created
    console.log('🔍 Verifying users...');
    const allEmails = [...USERS, ...AGENTS].map(u => u.email);
    const result = await sql`
      SELECT email, name, role FROM users 
      WHERE email = ANY(${allEmails})
      ORDER BY role, email
    `;

    console.log(`\n📊 Summary:`);
    console.log(`Total users in database (from our list): ${result.rows.length}`);
    console.log(`\nUsers:`);
    result.rows
      .filter(r => r.role === 'user')
      .forEach(r => console.log(`  - ${r.email} (${r.name})`));
    console.log(`\nAgents:`);
    result.rows
      .filter(r => r.role === 'agent')
      .forEach(r => console.log(`  - ${r.email} (${r.name})`));

    console.log('\n✅ All users and agents created/updated successfully!');
    console.log('\n📋 Credentials:');
    console.log('Users: password = User123!');
    console.log('Agents: password = Agent123!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();

