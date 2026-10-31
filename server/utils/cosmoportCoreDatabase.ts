import { neon } from "@neondatabase/serverless";
import type { CosmoportApp } from "../../shared/types/cosmoportApp";

export class CosmoportCoreConfigurationError extends Error {
  constructor() {
    super("CosmoPort Core database is not configured");
    this.name = "CosmoportCoreConfigurationError";
  }
}

function getCoreSql(connectionString: string | undefined) {
  if (!connectionString) {
    throw new CosmoportCoreConfigurationError();
  }

  return neon(connectionString);
}

/** Minimal connectivity check; does not inspect application tables. */
export async function getCosmoportCoreDatabaseHealth(
  connectionString = process.env.COSMOPORT_CORE_POOLED_URL,
) {
  const sql = getCoreSql(connectionString);
  await sql`SELECT 1 AS connected`;
  return { status: "ok" } as const;
}

export async function getCosmoportApps(
  connectionString = process.env.COSMOPORT_CORE_POOLED_URL,
): Promise<CosmoportApp[]> {
  const sql = getCoreSql(connectionString);
  const rows = await sql`
    SELECT id, title, description, enabled
    FROM public.apps
    ORDER BY title ASC
  `;
  return rows as CosmoportApp[];
}

export async function updateCosmoportAppStatus(
  id: string,
  enabled: boolean,
  connectionString = process.env.COSMOPORT_CORE_POOLED_URL,
): Promise<CosmoportApp | null> {
  const sql = getCoreSql(connectionString);
  const rows = await sql`
    UPDATE public.apps
    SET enabled = ${enabled}
    WHERE id = ${id}
    RETURNING id, title, description, enabled
  ` as CosmoportApp[];

  return rows[0] ?? null;
}
