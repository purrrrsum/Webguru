import { Pool } from 'pg';
import { User, Job, FileData } from './utils';

// Database connection pool for Hostinger PostgreSQL
// Uses standard PostgreSQL connection string

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!connectionString) {
      throw new Error(
        'DATABASE_URL or POSTGRES_URL environment variable is required. ' +
        'Please set it in your .env file or hosting environment variables.'
      );
    }

    pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

// Helper function to execute queries
export async function query(text: string, params?: any[]) {
  const pool = getPool();
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Template literal tag function that works like @vercel/postgres
function sqlTemplate(strings: TemplateStringsArray, ...values: any[]) {
  let text = '';
  const params: any[] = [];
  let paramIndex = 1;

  for (let i = 0; i < strings.length; i++) {
    text += strings[i];
    if (i < values.length) {
      text += `$${paramIndex}`;
      params.push(values[i]);
      paramIndex++;
    }
  }

  return query(text, params);
}

// Export as default with template tag support
export default sqlTemplate as typeof sqlTemplate & { query: typeof query };
(sqlTemplate as any).query = query;

