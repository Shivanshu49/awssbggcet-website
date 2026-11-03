import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

import { dbCredentials } from "./lib/db/ssl";

// drizzle-kit only auto-loads .env; our secrets live in .env.local.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Session pooler (5432): the transaction pooler breaks on DDL, and the
  // Direct connection is IPv6-only.
  dbCredentials: dbCredentials(process.env.DIRECT_URL),
});
