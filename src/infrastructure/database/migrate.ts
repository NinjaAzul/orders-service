import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Pool } from 'pg';

async function migrate(): Promise<void> {
  const databaseUrl =
    process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/order_service';
  const pool = new Pool({ connectionString: databaseUrl });
  const migration = await readFile(join(__dirname, 'migrations', '001_initial_schema.sql'), 'utf8');

  try {
    await pool.query(migration);
    process.stdout.write('Migrations executed successfully\n');
  } finally {
    await pool.end();
  }
}

void migrate();
