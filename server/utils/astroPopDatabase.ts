import { neon } from "@neondatabase/serverless";

export interface AstroPopOrderItem {
  flavorId: string;
  flavorName: string;
  quantity: number;
  unitPriceCents: number;
}

export interface AstroPopOrder {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  customerEmail: string;
  totalCents: number;
  currency: string;
  items: readonly AstroPopOrderItem[];
}

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

/**
 * Creates a paid order and its line items as one database statement. The
 * Checkout Session ID is unique in the schema, so replayed Stripe webhooks
 * return `persisted: false` without adding another order or any items.
 */
export async function persistAstroPopOrder(
  order: AstroPopOrder,
  connectionString = process.env.ASTROPOP_POOLED_URL,
) {
  if (!connectionString) {
    throw new AstroPopDatabaseConfigurationError();
  }

  const sql = neon(connectionString);
  const items = JSON.stringify(
    order.items.map((item) => ({
      flavor_id: item.flavorId,
      flavor_name: item.flavorName,
      quantity: item.quantity,
      unit_price_cents: item.unitPriceCents,
    })),
  );


  if (order.items.length === 0) {
    throw new Error("Cannot persist an order without items");
  }

  const rows = await sql`
    WITH inserted_order AS (
      INSERT INTO public.orders (
        clerk_user_id,
        customer_email,
        stripe_checkout_session_id,
        stripe_payment_intent_id,
        total_cents,
        currency
      ) VALUES (
        NULL,
        ${order.customerEmail},
        ${order.stripeCheckoutSessionId},
        ${order.stripePaymentIntentId},
        ${order.totalCents},
        ${order.currency}
      )
      ON CONFLICT (stripe_checkout_session_id) DO NOTHING
      RETURNING id
    ), inserted_items AS (
      INSERT INTO public.order_items (
        order_id,
        flavor_id,
        flavor_name,
        quantity,
        unit_price_cents
      )
      SELECT
        inserted_order.id,
        item.flavor_id,
        item.flavor_name,
        item.quantity,
        item.unit_price_cents
      FROM inserted_order
      CROSS JOIN jsonb_to_recordset(${items}::jsonb) AS item(
        flavor_id TEXT,
        flavor_name TEXT,
        quantity SMALLINT,
        unit_price_cents INTEGER
      )
    )
    SELECT id FROM inserted_order
  `;

  return { persisted: rows.length === 1 } as const;
}



/**
 * Checks whether a Stripe Checkout Session has
 * a persisted Astro Pop order in Neon.
 *
 * Read-only: this function never creates an order.
 */
export async function isAstroPopOrderRecorded(
  sessionId: string,
  connectionString = process.env.ASTROPOP_POOLED_URL,
): Promise<boolean> {
  if (!connectionString) {
    throw new AstroPopDatabaseConfigurationError();
  }

  const sql = neon(connectionString);

  const rows = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM public.orders
      WHERE stripe_checkout_session_id = ${sessionId}
    ) AS recorded
  `;

  if (!rows[0]) {
    throw new Error("Order lookup returned no result");
  }

  return rows[0].recorded === true;
}
