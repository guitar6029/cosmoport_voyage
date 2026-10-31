BEGIN;

CREATE TABLE public.universe_apps (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  enabled BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO public.universe_apps
  (id, title, description, enabled)
VALUES
  (
    'astro-pop',
    'Astro Pop Soda Co.',
    'A retro-futuristic soda shop.',
    TRUE
  ),
  (
    'cosmoport-voyage',
    'CosmoPort Voyage',
    'A space-age travel experience.',
    FALSE
  );

COMMIT;
