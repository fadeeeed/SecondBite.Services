import { Client, PoolClient, Pool } from 'pg';

import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from '@config';

export const client = new Client({
  connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
});

client.connect();

export const pgPool = new Pool({
  connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
});

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  let pg = await pgPool.connect();
  try {
    await pg.query('BEGIN');
    const result = await callback(pg);
    await pg.query('COMMIT');
    return result;
  } catch (error) {
    await pg.query('ROLLBACK');
    throw error;
  } finally {
    pg.release();
  }
}

export default client;
