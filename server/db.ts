import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Please add it to your environment variables.");
}

const connectionString = process.env.DATABASE_URL;
export const queryClient = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10000,
});
export const db = drizzle(queryClient, { schema });
