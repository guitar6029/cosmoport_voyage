import type Stripe from "stripe";
import { z } from "zod";

export const checkoutSessionIdSchema = z
  .string()
  .regex(/^cs_[A-Za-z0-9_]+$/, "Invalid checkout session ID")
  .max(255);

export const getCheckoutVerificationResult = (
  sessionId: string,
  session: Pick<Stripe.Checkout.Session, "mode" | "status" | "payment_status">,
) => ({
  sessionId,
  verified:
    session.mode === "payment" &&
    session.status === "complete" &&
    session.payment_status === "paid",
});
