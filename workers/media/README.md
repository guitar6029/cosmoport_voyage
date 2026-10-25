# CosmoPort media Worker

This independent Cloudflare Worker is the future delivery layer for CosmoPort public media at `media.cosmos-universe.com`. It is intentionally fail-closed today: every GET and HEAD request returns `404`, and no R2 objects are read, written, listed, or deleted.

Its Cloudflare configuration is in `wrangler.jsonc`, and its source and tests are isolated from the Nuxt/Nitro application under `workers/media`.

## Local use

From this directory:

```sh
npm ci
npm test
npm run typecheck
npm run validate:wrangler
npm run dev
```

`npm run dev` uses Wrangler's local development mode. Do not use remote mode for this scaffold.

## Deployment settings for later

When Cloudflare Workers Builds is configured, use:

- Root directory: `workers/media`
- Deploy command: `npx wrangler deploy`
- Production branch: `main`
- Preview builds: disabled initially

No route or custom domain is configured in this repository yet. R2 public access remains disabled; adding media delivery, a `media.cosmos-universe.com` custom domain, caching, and security policies are separate work.
