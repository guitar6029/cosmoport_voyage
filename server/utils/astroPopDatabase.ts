import { neon } from "@neondatabase/serverless";

export class AstroPopDatabaseConfigurationError extends Error {
  constructor() {
    super("Astro Pop database is not configured");
    this.name = "AstroPopDatabaseConfigurationError";
  }
}

/**
 * Performs the smallest possible read-only database check. This utility is
 * server-only: its connection string is read from the Nitro process at call
 * time and is never returned to callers.
 */
export async function getAstroPopDatabaseHealth(
  connectionString = process.env.ASTROPOP_POOLED_URL,
) {
  if (!connectionString) {
    throw new AstroPopDatabaseConfigurationError();
  }

  const sql = neon(connectionString);
  await sql`SELECT 1 AS connected`;

  return { status: "ok" } as const;
}
