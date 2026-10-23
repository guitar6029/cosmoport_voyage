
import Stripe from 'stripe'

export default defineEventHandler(async () => {

    const appUrl = process.env.COSMOPORT_APP_URL;
    const secretKey = process.env.ASTROPOP_STRIPE_SECRET_KEY

    if (!appUrl || !secretKey) {
        throw createError({
            status: 500,
            statusText: 'Stripe checkout configuration is missing',
        })
    }

    const stripe = new Stripe(secretKey)

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Astro Pop — Test Soda',
                    },
                    unit_amount: 119,
                },
                quantity: 1,
            },
        ],
        success_url: 'http://localhost:3000/astro-pop?checkout=success',
        cancel_url: 'http://localhost:3000/astro-pop?checkout=cancelled',
    })

    return { url: session.url }
})
