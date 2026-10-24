import type Stripe from "stripe";

/** Keeps signature verification at the webhook boundary and easy to test. */
export function constructAstroPopStripeEvent(
  stripe: Stripe,
  rawBody: string | Buffer,
  signature: string,
  webhookSecret: string,
) {
  return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
}
