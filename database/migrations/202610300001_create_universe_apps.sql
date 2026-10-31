-- Apply against the cosmoport_core database on each Neon branch.
BEGIN;

CREATE TABLE public.apps (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO public.apps (id, title, description, enabled)
VALUES
  (
    'astro-pop',
    'Astro Pop Soda Co.',
    'A retro-futuristic soda shop serving the universe.',
    TRUE
  ),
  (
    'cosmoport-voyage',
    'CosmoPort Voyage',
    'Explore extraordinary destinations across the cosmos.',
    FALSE
  );

COMMIT;
