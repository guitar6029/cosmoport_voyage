import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { constructAstroPopStripeEvent } from "../server/utils/astroPopStripeWebhook";

describe("AstroPop Stripe webhook signatures", () => {
  const webhookSecret = "whsec_test_astro_pop";
  const payload = JSON.stringify({
    id: "evt_test_astro_pop",
    object: "event",
    type: "checkout.session.completed",
    data: { object: { id: "cs_test_astro_pop" } },
  });
  const stripe = new Stripe("sk_test_astro_pop");

  it("accepts a valid Stripe-signed payload", () => {
    const signature = Stripe.webhooks.generateTestHeaderString({
      payload,
      secret: webhookSecret,
    });

    expect(constructAstroPopStripeEvent(stripe, payload, signature, webhookSecret).id).toBe(
      "evt_test_astro_pop",
    );
  });

  it("rejects an invalid webhook signature", () => {
    expect(() =>
      constructAstroPopStripeEvent(stripe, payload, "t=1,v1=not-a-signature", webhookSecret),
    ).toThrow();
  });
});
