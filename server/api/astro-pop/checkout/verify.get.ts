import Stripe from "stripe";
import { checkoutSessionIdSchema, getCheckoutVerificationResult } from "../../../utils/astroPopCheckoutVerification";

export default defineEventHandler(async (event) => {
  const parsedQuery = checkoutSessionIdSchema.safeParse(
    getQuery(event).session_id,
  );

  if (!parsedQuery.success) {
    throw createError({
      status: 400,
      statusText: "Invalid checkout session ID",
    });
  }

  const secretKey = process.env.ASTROPOP_STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw createError({
      status: 500,
      statusText: "Stripe checkout is not configured",
    });
  }

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(parsedQuery.data);
    return getCheckoutVerificationResult(parsedQuery.data, session);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      throw createError({
        status: 404,
        statusText: "Checkout session not found",
      });
    }

    throw createError({
      status: 502,
      statusText: "Unable to verify checkout session",
    });
  }
});
