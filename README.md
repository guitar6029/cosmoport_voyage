# CosmoPort Voyage

CosmoPort Voyage is an interactive fictional space-tourism website with a 1950s Space Age retrofuturist / Atompunk visual direction.

This repository currently contains the minimal Nuxt frontend foundation with the official Sanity integration configured for future content management. No CMS content is fetched yet.

## Tech Stack

- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS v4
- DaisyUI v5
- Vitest

## Local Development

### Prerequisites

- Node.js 22.23.4
- npm

### Install dependencies

```bash
npm ci
```

### Start the development server

```bash
npm run dev
```

Nuxt serves the app at `http://localhost:3000` by default.

### Run tests

```bash
npm run test
```

### Build for production

```bash
npm run build
```

## Project Structure

- `app/app.vue` – Nuxt application shell
- `app/pages/index.vue` – universe directory linking to both experiences
- `app/pages/astro-pop.vue` – AstroPop Soda Co. page
- `app/pages/cosmoport-voyage.vue` – CosmoPort Voyage page
- `app/components/astro-pop/` – AstroPop sections and cards
- `app/components/cosmoport-voyage/` – CosmoPort destination sections
- `app/components/shared/` – brand-independent UI components
- `app/site.ts` – shared site metadata
- `app/assets/css/main.css` – Tailwind and DaisyUI entrypoint

Pages and components explicitly import their component dependencies. Keep brand-specific components in their respective folders and reusable, brand-independent components in `shared/`.

## Sanity setup

The Nuxt Sanity module reads these values from the environment:

- `SANITY_PROJECT_ID` – the project ID shown in the Sanity dashboard under the project settings
- `SANITY_DATASET` – the dataset name shown in the Sanity project configuration, usually `production`

Copy `.env.example` to `.env` for local development and fill in the values. The integration is configured in `nuxt.config.ts` with a fixed API version. The project does not yet define schemas, queries, or application content views, so live CMS connectivity is not required for the current test or build commands.

### Sanity Studio

The standalone Studio lives in `studio/` and remains independent from the Nuxt application. Its project and dataset are configured in `studio/sanity.config.ts` and `studio/sanity.cli.ts`.

```bash
cd studio
npm ci
npm run dev
```

The Studio runs at `http://localhost:3333`. It currently has no destination schemas. When it is ready to host, run `npm run deploy` from `studio/` and follow Sanity's deployment prompts.

## Clerk shared account foundation

The Nuxt app uses the official `@clerk/nuxt` module as the CosmoPort Universe identity foundation. Configure both applications to use the same Clerk instance; it belongs to the Universe rather than to either Astro Pop Soda Co. or CosmoPort Voyage.

Set these Doppler-managed variables for each environment:

- `NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY` – the Clerk publishable key, safe to expose to the browser.
- `NUXT_CLERK_SECRET_KEY` – the corresponding server-only Clerk secret key.

For local development, use Doppler's shared Universe development configuration rather than a populated local `.env` file:

```bash
npm run doppler:dev
```

That command runs the app with the `cosmoport-universe` project and `dev` configuration, where the two Clerk variables must be set to development keys from the shared Clerk instance. `.env.example` documents the required names only; do not commit keys, create substitute credentials, or expose the secret key through Nuxt public runtime configuration.

The integration intentionally leaves all existing routes public: anonymous browsing and guest checkout continue to work, and no Stripe, Neon, order, or webhook behavior is changed. Clerk's built-in server middleware is registered automatically by the module, but no application routes are protected yet. When an authenticated feature is added, obtain its user identity from Clerk's server-side `event.context.auth()` result; never trust a user ID supplied by the client.

The future root-level account routes are reserved for:

- `/sign-in`
- `/sign-up`
- `/account`

They are not implemented in this foundation change.

### CI and deployment configuration

`@clerk/nuxt` can complete a Nuxt production build without Clerk keys because its keys are runtime configuration. That is appropriate for CI validation: keep the variables absent in build-only CI and do not add fake keys. A deployed server must receive a valid matching publishable/secret key pair through Doppler before it handles requests. Clerk's development keyless fallback is not a production configuration and must not be relied upon for deployment.

---

Copyright © 2025
