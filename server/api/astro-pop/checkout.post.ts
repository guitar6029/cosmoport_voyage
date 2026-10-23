
import Stripe from 'stripe'

export default defineEventHandler(async () => {
    const secretKey = process.env.ASTROPOP_STRIPE_SECRET_KEY

    if (!secretKey) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Stripe is not configured',
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
