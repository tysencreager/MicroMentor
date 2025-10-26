import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Please add it to your .env file.\n" +
    "Get a free PostgreSQL database at: https://neon.tech\n" +
    "Then add: DATABASE_URL=your-connection-string to .env file"
  );
}

if (process.env.DATABASE_URL === "postgresql://user:password@host/database") {
  throw new Error(
    "DATABASE_URL is not configured yet!\n" +
    "Please:\n" +
    "1. Create a free database at https://neon.tech\n" +
    "2. Copy your connection string\n" +
    "3. Replace the DATABASE_URL value in your .env file"
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
