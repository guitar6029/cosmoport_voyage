import { describe, expect, it } from "vitest";
import {
  checkoutSessionIdSchema,
  getCheckoutVerificationResult,
} from "../server/utils/astroPopCheckoutVerification";

describe("AstroPop checkout verification", () => {
  const sessionId = "cs_test_astro_pop_123";

  it("recognizes a complete, paid payment session", () => {
    expect(
      getCheckoutVerificationResult(sessionId, {
        mode: "payment",
        status: "complete",
        payment_status: "paid",
      }),
    ).toEqual({ sessionId, verified: true });
  });

  it.each([
    { mode: "payment", status: "open", payment_status: "paid" },
    { mode: "payment", status: "complete", payment_status: "unpaid" },
    { mode: "setup", status: "complete", payment_status: "paid" },
  ] as const)("rejects an unpaid or incomplete session", (session) => {
    expect(getCheckoutVerificationResult(sessionId, session)).toEqual({
      sessionId,
      verified: false,
    });
  });

  it("only accepts Stripe Checkout session identifiers", () => {
    expect(checkoutSessionIdSchema.safeParse(sessionId).success).toBe(true);
    expect(checkoutSessionIdSchema.safeParse("pi_not_a_checkout_session").success).toBe(false);
  });
});
