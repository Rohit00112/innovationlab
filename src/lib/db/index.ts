import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/postgres";

const enableSSL =
  process.env.POSTGRES_SSL === "true" ||
  /supabase\.co/.test(connectionString) ||
  process.env.NODE_ENV === "production";

const globalForDb = globalThis as unknown as {
  postgresClient?: ReturnType<typeof postgres>;
  drizzleClient?: ReturnType<typeof drizzle<typeof schema>>;
};

const postgresClient =
  globalForDb.postgresClient ??
  postgres(connectionString, {
    ssl: enableSSL ? { rejectUnauthorized: false } : undefined,
    max: Number.parseInt(process.env.POSTGRES_POOL_SIZE ?? "10", 10),
    prepare: true
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = postgresClient;
}

export const db =
  globalForDb.drizzleClient ??
  drizzle(postgresClient, {
    schema,
    logger: process.env.NODE_ENV === "development"
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.drizzleClient = db;
}

export type DbClient = typeof db;
export { schema };
