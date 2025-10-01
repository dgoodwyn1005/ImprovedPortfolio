import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

// Export once and assign at runtime
export let pool: Pool | null = null;
export let db: any = null;

if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'DATABASE_URL must be set. Did you forget to provision a database?',
    );
  }

  console.warn('[api/db] WARNING: DATABASE_URL not set. Exporting stubbed db for development.');
  pool = null;
  db = new Proxy({}, {
    get() {
      return () => { throw new Error('Drizzle client not available in development without DATABASE_URL'); };
    }
  });
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool);
}