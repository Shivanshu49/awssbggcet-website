import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit only auto-loads .env; our secrets live in .env.local.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Direct connection (5432): the transaction pooler breaks on DDL.
  dbCredentials: { url: process.env.DIRECT_URL! },
});
