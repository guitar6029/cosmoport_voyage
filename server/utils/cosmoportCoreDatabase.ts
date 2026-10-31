import { neon } from "@neondatabase/serverless";

export interface CosmoportApp {
    id: string;
    title: string;
    description: string;
    enabled: boolean;
}

export class CosmoportCoreConfigurationError extends Error {
    constructor() {
        super("Cosmoport Core database is not configured");
        this.name = "CosmoportCoreDatabaseConfigurationError";
    }
}


export async function getCosmoportCoreDatabaseHealth(
    connectionString = process.env.COSMOPORT_CORE_POOLED_URL,
) {
    if (!connectionString) {
        throw new CosmoportCoreConfigurationError();
    }

    const sql = neon(connectionString);
    await sql`SELECT 1 AS connected`;

    return { status: "ok" } as const;
}


export async function getCosmoportApps(
    connectionString = process.env.COSMOPORT_CORE_POOLED_URL
): Promise<CosmoportApp[]> {

    if (!connectionString) {
        throw new CosmoportCoreConfigurationError();
    }

    const sql = neon(connectionString);

    const rows = await sql`SELECT
        id,
        title,
        description,
        enabled
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

    if (!connectionString) {
        throw new CosmoportCoreConfigurationError();
    }

    const sql = neon(connectionString);

    const rows: CosmoportApp[] | null = await sql`UPDATE public.apps SET enabled = ${enabled} WHERE id = ${id} RETURNING id, title, description, enabled` as CosmoportApp[];

    return rows[0] ?? null;
}
