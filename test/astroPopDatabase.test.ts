import { beforeEach, describe, expect, it, vi } from "vitest";

const neonMock = vi.hoisted(() => vi.fn());

vi.mock("@neondatabase/serverless", () => ({
  neon: neonMock,
}));

import {
  AstroPopDatabaseConfigurationError,
  getAstroPopDatabaseHealth,
  persistAstroPopOrder,
} from "../server/utils/astroPopDatabase";

describe("Astro Pop database health", () => {
  beforeEach(() => {
    neonMock.mockReset();
    vi.unstubAllEnvs();
  });

  it("returns ok after a successful read-only connection query", async () => {
    const sql = vi.fn().mockResolvedValue([{ connected: 1 }]);
    neonMock.mockReturnValue(sql);
    vi.stubEnv("ASTROPOP_POOLED_URL", "postgresql://test.example/astro_pop");

    await expect(getAstroPopDatabaseHealth()).resolves.toEqual({ status: "ok" });
    expect(neonMock).toHaveBeenCalledWith("postgresql://test.example/astro_pop");
    expect(sql).toHaveBeenCalledOnce();
    expect(sql.mock.calls[0]?.[0].raw).toEqual(["SELECT 1 AS connected"]);
  });

  it("fails without a configured pooled connection string", async () => {
    vi.stubEnv("ASTROPOP_POOLED_URL", "");

    await expect(getAstroPopDatabaseHealth()).rejects.toBeInstanceOf(
      AstroPopDatabaseConfigurationError,
    );
    expect(neonMock).not.toHaveBeenCalled();
  });

  it("propagates database failures for the endpoint to sanitize", async () => {
    const databaseError = new Error("connection refused");
    neonMock.mockReturnValue(vi.fn().mockRejectedValue(databaseError));
    vi.stubEnv("ASTROPOP_POOLED_URL", "postgresql://test.example/astro_pop");

    await expect(getAstroPopDatabaseHealth()).rejects.toBe(databaseError);
  });

  it("persists an order and all of its flavors in one atomic statement", async () => {
    const sql = vi.fn().mockResolvedValue([{ id: "order-123" }]);
    neonMock.mockReturnValue(sql);

    await expect(
      persistAstroPopOrder(
        {
          stripeCheckoutSessionId: "cs_test_multiple_flavors",
          stripePaymentIntentId: "pi_test_123",
          customerEmail: "traveler@example.com",
          totalCents: 900,
          currency: "usd",
          items: [
            {
              flavorId: "atomic-cherry-fizz",
              flavorName: "Atomic Cherry Fizz",
              quantity: 2,
              unitPriceCents: 300,
            },
            {
              flavorId: "lunar-lime-lift",
              flavorName: "Lunar Lime Lift",
              quantity: 1,
              unitPriceCents: 300,
            },
          ],
        },
        "postgresql://test.example/astro_pop",
      ),
    ).resolves.toEqual({ persisted: true });

    expect(sql).toHaveBeenCalledOnce();
    expect(sql.mock.calls[0]?.[0].raw.join(" ")).toContain("WITH inserted_order AS");
    expect(sql.mock.calls[0]?.[0].raw.join(" ")).toContain("INSERT INTO public.order_items");
    expect(sql.mock.calls[0]?.[0].raw.join(" ")).toContain("ON CONFLICT (stripe_checkout_session_id) DO NOTHING");
    expect(sql.mock.calls[0]?.[0].raw.join(" ")).toContain("NULL,");
    expect(sql.mock.calls[0]?.[0].raw.join(" ")).toContain("jsonb_to_recordset(");
    expect(sql.mock.calls[0]?.slice(1)).toContain(
      JSON.stringify([
        {
          flavor_id: "atomic-cherry-fizz",
          flavor_name: "Atomic Cherry Fizz",
          quantity: 2,
          unit_price_cents: 300,
        },
        {
          flavor_id: "lunar-lime-lift",
          flavor_name: "Lunar Lime Lift",
          quantity: 1,
          unit_price_cents: 300,
        },
      ]),
    );
  });

  it("treats a replayed Checkout Session as an idempotent no-op", async () => {
    const sql = vi.fn().mockResolvedValue([]);
    neonMock.mockReturnValue(sql);

    await expect(
      persistAstroPopOrder(
        {
          stripeCheckoutSessionId: "cs_test_duplicate",
          stripePaymentIntentId: null,
          customerEmail: "traveler@example.com",
          totalCents: 300,
          currency: "usd",
          items: [
            {
              flavorId: "atomic-cherry-fizz",
              flavorName: "Atomic Cherry Fizz",
              quantity: 1,
              unitPriceCents: 300,
            },
          ],
        },
        "postgresql://test.example/astro_pop",
      ),
    ).resolves.toEqual({ persisted: false });
  });

  it("propagates write failures so Stripe delivery can be retried", async () => {
    const databaseError = new Error("connection refused");
    neonMock.mockReturnValue(vi.fn().mockRejectedValue(databaseError));

    await expect(
      persistAstroPopOrder(
        {
          stripeCheckoutSessionId: "cs_test_database_failure",
          stripePaymentIntentId: null,
          customerEmail: "traveler@example.com",
          totalCents: 300,
          currency: "usd",
          items: [
            {
              flavorId: "atomic-cherry-fizz",
              flavorName: "Atomic Cherry Fizz",
              quantity: 1,
              unitPriceCents: 300,
            },
          ],
        },
        "postgresql://test.example/astro_pop",
      ),
    ).rejects.toBe(databaseError);
  });
});
