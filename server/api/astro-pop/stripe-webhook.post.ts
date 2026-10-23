import Stripe from "stripe";

const STRIPE_SESSION_COMPLETED = 'checkout.session.completed';
const STRIPE_PAYMENT_STATUS_PAID = 'paid';

export default defineEventHandler(async (event) => {

    const secretKey = process.env.ASTROPOP_STRIPE_SECRET_KEY;
    const webhookSecret = process.env.ASTROPOP_STRIPE_WEBHOOK_SECRET;

    if (!secretKey || !webhookSecret) {
        throw createError({
            status: 500,
            statusText: 'Stripe webhook is not configured',
        })
    }

    const stripe = new Stripe(secretKey);

    // read the original payload and stripe signature
    const rawBody = await readRawBody(event);
    const signature = getHeader(event, 'stripe-signature');

    if (!rawBody || !signature) {
        throw createError({
            status: 400,
            statusText: 'Missing webhook payload or signature'
        })
    }

    let stripeEvent: Stripe.Event;

    try {
        stripeEvent = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            webhookSecret
        )
    } catch {
        throw createError({
            status: 400,
            statusText: 'Invalid Stripe webhook signature',
        })
    }

    //if completed
    if (stripeEvent.type === STRIPE_SESSION_COMPLETED) {
        const session = stripeEvent.data.object;

        if (session.payment_status === STRIPE_PAYMENT_STATUS_PAID) {
            console.log('stripe payment confirmed:', session.id);
        }
    }

    return { received: true }

})
