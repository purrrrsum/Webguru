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
    id: `dumusr${i + 1}`,
    email: `dummyuser${i + 1}@thesupport.in`,
    name: `Dummy User ${i + 1}`,
    company: `Dummy Company ${i + 1}`,
    address: `Dummy Address, City ${i + 1}`,
    phone: `+9198765432${i.toString().padStart(2, '0')}`,
    role: 'user',
    password: 'User1234',
}));

const AGENTS: UserData[] = Array.from({ length: 10 }, (_, i) => ({
    id: `dumagt${i + 1}`,
    email: `dummyagent${i + 1}@thesupport.in`,
    name: `Dummy Agent ${i + 1}`,
    company: `Dummy Agent Services ${i + 1}`,
    address: `Dummy Agent Address, City ${i + 1}`,
    phone: `+9199001122${i.toString().padStart(2, '0')}`,
    role: 'agent',
    password: 'Agnt1234',
}));

async function createUserIfNotExists(userData: UserData): Promise<void> {
    try {
        const existingUser = await sql`
      SELECT id, email FROM users WHERE email = ${userData.email} OR phone = ${userData.phone}
    `;

        if (existingUser.rows.length > 0) {
            console.log(`✓ User ${userData.email} or phone ${userData.phone} already exists, updating password...`);
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
        WHERE email = ${userData.email} OR phone = ${userData.phone}
      `;
        } else {
            console.log(`+ Creating new user: ${userData.email}`);
            const hashedPassword = await hash(userData.password, 10);
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
            console.log(`⚠ User with ID ${userData.id} already exists.`);
            const hashedPassword = await hash(userData.password, 10);
            await sql`
        UPDATE users 
        SET password = ${hashedPassword}
        WHERE id = ${userData.id}
      `;
        } else {
            console.error(`✗ Error creating user ${userData.email}:`, error.message);
            throw error;
        }
    }
}

async function main() {
    console.log('🚀 Starting dummy user and agent creation...\n');
    try {
        for (const user of USERS) {
            await createUserIfNotExists(user);
        }
        for (const agent of AGENTS) {
            await createUserIfNotExists(agent);
        }

        console.log('\n✅ All dummy users and agents created successfully!');
        console.log('\n📋 Credentials:');
        console.log('Users: Emails: dummyuser1@thesupport.in ... dummyuser10@thesupport.in');
        console.log('       Phone: +919876543200 ... +919876543209');
        console.log('       Password: User1234');
        console.log('Agents: Emails: dummyagent1@thesupport.in ... dummyagent10@thesupport.in');
        console.log('        Phone: +919900112200 ... +919900112209');
        console.log('        Password: Agnt1234');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
    process.exit(0);
}

main();
