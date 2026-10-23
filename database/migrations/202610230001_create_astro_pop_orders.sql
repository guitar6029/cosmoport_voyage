BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT,
  customer_email TEXT NOT NULL CHECK (customer_email <> ''),
  stripe_checkout_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  total_cents INTEGER NOT NULL CHECK (total_cents > 0),
  currency TEXT NOT NULL CHECK (currency ~ '^[a-z]{3}$'),
  order_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    order_status IN ('pending', 'confirmed', 'fulfilled', 'cancelled')
  ),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'failed', 'refunded')
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  flavor_id TEXT NOT NULL,
  flavor_name TEXT NOT NULL CHECK (flavor_name <> ''),
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 6),
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0),
  UNIQUE (order_id, flavor_id)
);

COMMIT;
