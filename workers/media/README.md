# CosmoPort media Worker

This independent Cloudflare Worker is the future delivery layer for CosmoPort public media at `media.cosmos-universe.com`. It is intentionally fail-closed today: `MEDIA_DELIVERY_ENABLED` defaults to `false`, so every GET and HEAD request returns a non-cacheable `503` without accessing R2. The Worker never writes, lists, or deletes R2 objects.

Its Cloudflare configuration is in `wrangler.jsonc`, and its source and tests are isolated from the Nuxt/Nitro application under `workers/media`.

## Local use

From this directory:

```sh
npm ci
npm test
npm run typecheck
npm run validate:wrangler
npx wrangler dev --local
```

This starts the Worker with the configured safe default: media delivery is disabled. Do not use remote mode for this scaffold.

To exercise delivery locally, override the kill switch for that command only:

```sh
npx wrangler dev --local --var MEDIA_DELIVERY_ENABLED:true
```

`--var MEDIA_DELIVERY_ENABLED:true` injects the Worker's runtime binding; a shell environment variable alone does not override the Wrangler `vars` configuration. `--local` keeps the Worker and R2 binding on local simulation storage.

The Worker accepts only `GET` and `HEAD` for media under the `astro-pop/` prefix. It permits PNG, JPEG, WebP, MP4, MP3, WAV, and OGG files; validates and decodes paths before R2 access; and supports one byte range per request using R2 native ranged reads. Multiple ranges are deliberately rejected with `416` until multipart response support is separately designed.

## Deployment settings for later

When Cloudflare Workers Builds is configured, use:

- Root directory: `workers/media`
- Deploy command: `npx wrangler deploy`
- Production branch: `main`
- Preview builds: disabled initially

No route or custom domain is configured in this repository yet. R2 public access remains disabled; adding media delivery, a `media.cosmos-universe.com` custom domain, caching, and security policies are separate work.
