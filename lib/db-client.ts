import { Pool } from 'pg';
import { User, Job, FileData } from './utils';

// Database connection pool for PostgreSQL
// Uses standard PostgreSQL connection string (works with Railway, Hostinger, or any PostgreSQL)

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    
    if (!connectionString) {
      // Don't throw immediately - log warning but allow server to start
      console.error('⚠️  WARNING: DATABASE_URL or POSTGRES_URL environment variable is not set.');
      console.error('   Database operations will fail. Please set DATABASE_URL in Railway Variables.');
      // Return a pool that will fail on first query, but doesn't crash the server
      // This allows the server to start and show error pages instead of crashing
      pool = new Pool({
        connectionString: 'postgresql://invalid', // Will fail on actual query, not on startup
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
      return pool;
    }

    try {
      pool = new Pool({
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Set timezone on new connections (optional, defaults to server timezone)
      // You can set DB_TIMEZONE env var to 'Asia/Kolkata' or any timezone
      const timezone = process.env.DB_TIMEZONE || process.env.TZ;
      if (timezone) {
        pool.on('connect', async (client) => {
          try {
            await client.query(`SET TIME ZONE '${timezone}'`);
          } catch (err) {
            console.warn('Failed to set database timezone:', err);
          }
        });
      }

      pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
      });
    } catch (error) {
      console.error('Failed to create database pool:', error);
      // Return a pool that will fail gracefully
      pool = new Pool({
        connectionString: 'postgresql://invalid',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }
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

// Template literal tag function for SQL queries (similar to @vercel/postgres API)
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

