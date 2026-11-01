export interface AstroPopOrderItem {
    flavorId: string;
    flavorName: string;
    quantity: number;
    unitPriceCents: number;
}

export interface AstroPopOrder {
    clerkUserId: string | null;
    stripeCheckoutSessionId: string;
    stripePaymentIntentId: string | null;
    customerEmail: string;
    totalCents: number;
    currency: string;
    items: readonly AstroPopOrderItem[];
}

export interface AstroPopOrderHistoryItem {
    flavorId: string;
    flavorName: string;
    quantity: number;
    unitPriceCents: number;
}

export interface AstroPopOrderHistory {
    id: string;
    createdAt: string;
    totalCents: number;
    currency: string;
    status: string;
    paymentStatus: string;
    items: AstroPopOrderHistoryItem[];
}
