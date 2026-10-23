# Astro Pop database migrations

The initial Astro Pop schema is version-controlled in
`database/migrations/202610230001_create_astro_pop_orders.sql`. The project
intentionally does not use an ORM, Prisma, or a migration framework; apply the
SQL directly with a PostgreSQL client.

## Fresh database setup

1. Create a new empty PostgreSQL database.
2. Set `ASTROPOP_DIRECT_URL` to that database's direct connection URL. Use the
   direct URL for one-off schema changes; reserve `ASTROPOP_POOLED_URL` for
   future application connections.
3. Run the initial migration once:

   ```sh
   psql "$ASTROPOP_DIRECT_URL" \
     -f database/migrations/202610230001_create_astro_pop_orders.sql
   ```

The migration enables `pgcrypto` for UUID generation, then creates
`public.orders` before `public.order_items` so the latter can enforce its
foreign key. The table creation is deliberately not idempotent: a failed repeat
run signals that the schema already exists and should be investigated rather
than silently changed.

## Existing Neon development database

The existing Neon `dev` database already contains `public.orders` and
`public.order_items`, created manually before this migration was added. Do not
run this initial migration against that database, and do not alter the live
database as part of introducing this file. Treat this migration as the baseline
for newly created databases.
