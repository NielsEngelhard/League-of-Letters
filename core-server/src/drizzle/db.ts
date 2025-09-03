import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from '../../node_modules/@types/pg';
import * as schema from './schema';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_USE_SSL?.toLowerCase() == 'true'
});

export const db = drizzle(pool, { schema });