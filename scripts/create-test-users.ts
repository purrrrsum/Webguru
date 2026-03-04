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

const USERS: UserData[] = Array.from({ length: 10 }, (_, i) => ({
  id: `testuser${i + 1}`,
  email: `user${i + 1}@thesupport.in`,
  name: `Test User ${i + 1}`,
  company: `Test Company ${i + 1}`,
  address: `Test Address, City ${i + 1}`,
  phone: `+9198765000${(i + 10).toString().padStart(2, '0')}`,
  role: 'user',
  password: 'Password123!',
}));

const AGENTS: UserData[] = Array.from({ length: 4 }, (_, i) => ({
  id: `testagent${i + 1}`,
  email: `agent${i + 1}@thesupport.in`,
  name: `Test Agent ${i + 1}`,
  company: `Agent Services ${i + 1}`,
  address: `Agent Address, City ${i + 1}`,
  phone: `+9199001000${(i + 10).toString().padStart(2, '0')}`,
  role: 'agent',
  password: 'Password123!',
}));

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

