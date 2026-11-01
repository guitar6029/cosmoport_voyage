import type Stripe from "stripe";
import { describe, expect, it } from "vitest";
import {
  AstroPopOrderValidationError,
  getAstroPopOrderFromStripe,
} from "../server/utils/astroPopOrderPersistence";

const session = {
  id: "cs_test_astro_pop_paid",
  mode: "payment",
  status: "complete",
  payment_status: "paid",
  metadata: { astro_pop_order: "true" },
  customer_details: { email: "traveler@example.com" },
  amount_total: 900,
  currency: "usd",
  payment_intent: "pi_test_astro_pop",
} as unknown as Stripe.Checkout.Session;

const lineItems = [
  {
    description: "Atomic Cherry Fizz",
    quantity: 2,
    price: {
      unit_amount: 300,
      product: { metadata: { astro_pop_flavor_id: "atomic-cherry-fizz" } },
    },
  },
  {
    description: "Lunar Lime Lift",
    quantity: 1,
    price: {
      unit_amount: 300,
      product: { metadata: { astro_pop_flavor_id: "lunar-lime-lift" } },
    },
  },
] as unknown as Stripe.LineItem[];

describe("AstroPop paid-order conversion", () => {
  it("uses Stripe's line-item metadata and amounts for multiple flavors", () => {
    expect(getAstroPopOrderFromStripe(session, lineItems)).toEqual({
      clerkUserId: null,
      stripeCheckoutSessionId: "cs_test_astro_pop_paid",
      stripePaymentIntentId: "pi_test_astro_pop",
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
    });
  });

  it("preserves the verified checkout session Clerk user ID", () => {
    const signedIn = {
      ...session,
      metadata: { astro_pop_order: "true", clerk_user_id: "user_verified" },
    } as Stripe.Checkout.Session;
    expect(getAstroPopOrderFromStripe(signedIn, lineItems).clerkUserId).toBe("user_verified");
  });

  it("rejects unpaid sessions before any database write can occur", () => {
    expect(() =>
      getAstroPopOrderFromStripe(
        { ...session, payment_status: "unpaid" } as Stripe.Checkout.Session,
        lineItems,
      ),
    ).toThrow(AstroPopOrderValidationError);
  });

  it("rejects a session whose signed total does not match its Stripe line items", () => {
    expect(() =>
      getAstroPopOrderFromStripe(
        { ...session, amount_total: 901 } as Stripe.Checkout.Session,
        lineItems,
      ),
    ).toThrow(AstroPopOrderValidationError);
  });
});
