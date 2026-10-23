BEGIN;

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT,
  customer_email TEXT NOT NULL,
  stripe_checkout_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  total_cents INTEGER NOT NULL CHECK (total_cents > 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'PLACED' CHECK (
    status IN ('PLACED', 'CANCELLED')
  ),
  payment_status TEXT NOT NULL DEFAULT 'PAID' CHECK (
    payment_status IN ('PAID', 'PARTIALLY_REFUNDED', 'REFUNDED')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  flavor_id TEXT NOT NULL,
  flavor_name TEXT NOT NULL,
  quantity SMALLINT NOT NULL CHECK (quantity BETWEEN 1 AND 6),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0),
  UNIQUE (order_id, flavor_id)
);

COMMIT;
