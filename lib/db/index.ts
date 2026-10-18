import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Module-level singleton: one pool per server process, never per request.
// In dev, hot reload re-evaluates this module, so the pool is parked on
// globalThis or every edit would open a new one and exhaust Supabase's limit.
const globalForDb = globalThis as unknown as {
  pgClient?: ReturnType<typeof postgres>;
};

// prepare: false — Supabase's transaction pooler (6543) can't hold prepared statements.
const client =
  globalForDb.pgClient ??
  postgres(process.env.DATABASE_URL!, { prepare: false });

if (process.env.NODE_ENV !== "production") globalForDb.pgClient = client;

export const db = drizzle(client, { schema });
