# CosmoPort Universe

A collection of interconnected fictional experiences set in a colorful, 1950s-inspired **Atomic Age / Atompunk future**. The Grand Concourse serves as the shared entry point to a retrofuturistic world of interplanetary travel, neighborhood soda shops, and more.

This is a **portfolio / product-engineering project**, not a real travel-booking service or fulfillment business. It combines immersive UI and storytelling with practical application architecture, integrations, and testing.

## Explore the Universe

| Experience | Route | Current state |
| --- | --- | --- |
| **Grand Concourse** | `/` | Main Universe homepage with responsive illustrated hero, experience directory, navigation, and CosmoPort Radio controls |
| **Astro Pop Soda Co.** | `/astro-pop` | Interactive fictional storefront with flavor pages, crate builder/cart, Stripe Checkout integration, and order confirmation |
| **Passport Office** | `/passport-office` | Custom traveler registration, email verification, and returning-traveler sign-in powered by Clerk |
| **CosmoPort Voyage** | `/cosmoport-voyage` | Illustrated space-tourism landing page and destination sections; search, comparison, and booking are **not** implemented |
| **About the Universe** | `/about` | The shared world introduction and multiverse artwork |

Astro Pop also includes an Our Story page (`/astro-pop/our-story`), individual flavor routes (`/astro-pop/flavors/[slug]`), and a cart (`/astro-pop/cart`).

**Still planned:** issued traveler passports/profiles, cross-app personalization, deeper Cosmos Voyage functionality, and customer/operations tooling. Existing registration and login do **not** imply that passport issuance or account dashboards exist today.

## What has been built

- **Shared Universe experience:** Grand Concourse illustration, responsive floating navigation, signed-in/out controls, About page, and user-controlled radio playback.
- **Astro Pop shopping flow:** flavor catalog and detail pages, a six-bottle crate/cart, delivery-plan presentation, animated customer testimonials, checkout status feedback, and notifications.
- **Checkout and persistence:** server-side cart validation, Stripe Checkout session creation, webhook-driven Neon/Postgres order recording, duplicate-event handling, guest verification, and bounded status polling.
- **Authentication:** shared Clerk identity instance with a custom Passport Office UI for registration/email verification and sign-in. Public browsing and guest checkout remain available.
- **Media delivery:** a separate Cloudflare Worker serves allowlisted public assets from R2 through `media.cosmos-universe.com`, with read-only access, safe request handling, image caching, byte-range support, and operational safeguards.
- **Content foundation:** Sanity integration and a standalone Studio with a `destination` schema. The current CosmoPort Voyage page is still built from local/static content rather than live CMS data.

## Technology

| Layer | Tools |
| --- | --- |
| Web application | Nuxt 4, Vue 3, TypeScript, Nitro |
| UI and state | Tailwind CSS v4, DaisyUI v5, Pinia |
| Authentication | Clerk (`@clerk/nuxt`) |
| Commerce and data | Stripe, Neon serverless Postgres, Zod |
| Media | Cloudflare R2, Workers, Cache API |
| Content | Sanity CMS / standalone Sanity Studio (partially integrated) |
| Configuration | Doppler-managed development environment |
| Quality | Vitest, Playwright, GitHub Actions |

The repository includes a Nuxt app, Nitro API routes, database migrations, a standalone Sanity Studio, and an independently configured media Worker. Not every integration is required to browse every public page.

## Getting started

### Prerequisites

- Node.js **22.23.4** (see `.nvmrc`) and npm
- [Doppler](https://docs.doppler.com/docs/install-cli), configured for the `cosmoport-universe` project's `dev` environment, for integrated local development
- Optional: [Stripe CLI](https://docs.stripe.com/stripe-cli) for local checkout/webhook testing

### Run the Nuxt application

```bash
nvm use
npm ci
npm run doppler:dev
```

Open `http://localhost:3000`.

`npm run dev` starts Nuxt without Doppler; use it only when the necessary configuration is already supplied by your environment. See `.env.example` for **variable names only**. Never commit populated environment files, credentials, or API secrets.

### Local Stripe webhook forwarding

For a functional local checkout-to-order-recording flow, keep the Nuxt server running and start the Stripe CLI in a **second terminal**:

```bash
npm run stripe:webhook:dev
```

The script forwards supported Stripe checkout events to `/api/astro-pop/stripe-webhook`. The CLI must be authenticated and the matching webhook secret must be provided through the development environment. If the listener is stopped, a completed local checkout may not be recorded in Neon until its event is delivered. Use Stripe test-mode credentials for development.

### Tests and build

```bash
npm run test
npm run test:e2e
npm run build
```

Clerk-specific end-to-end tests have a separate configuration and require suitable Clerk development/test credentials:

```bash
npm run test:e2e:clerk
```

To test the independent Cloudflare media Worker:

```bash
npm --prefix workers/media ci
npm --prefix workers/media test
npm --prefix workers/media run typecheck
npm --prefix workers/media run validate:wrangler
```

See [media Worker README](workers/media/README.md) and [operations guide](workers/media/OPERATIONS.md) before changing its deployment, access, or emergency controls. A successful app build does not validate live Cloudflare configuration.

### Sanity Studio (optional)

The Studio lives separately under `studio/` and currently defines a destination document schema.

```bash
cd studio
npm ci
npm run dev
```

Its local development server typically runs at `http://localhost:3333`. Configure the `SANITY_PROJECT_ID` and `SANITY_DATASET` values for the intended environment. The main Voyage landing page does not yet read destination entries from Sanity.

## Repository layout

```text
app/
  pages/                 # Grand Concourse, About, Astro Pop, Voyage, Passport Office
  components/            # Experience-specific and shared Vue components
  composables/           # Radio, auth flows, checkout, notifications
  data/                  # Page content and media mappings
server/
  api/astro-pop/         # Checkout, status, and Stripe webhook routes
database/migrations/     # Database schema changes
shared/                  # Shared checkout status types
workers/media/           # Standalone Cloudflare R2 delivery Worker
studio/                  # Standalone Sanity Studio and destination schema
e2e/                     # Playwright end-to-end tests
test/                    # Unit/integration tests
docs/                    # Architecture notes, audits, test plans, style guide
AGENTS.md                # Repository workflow and agent safeguards
```

The shared media Worker and Sanity Studio have their **own** configuration/dependency context; they are not separate routes served by the Nuxt application.

## Development and contribution workflow

Repository work follows [AGENTS.md](AGENTS.md): use an isolated feature branch/worktree from the latest `origin/main`, keep changes focused, validate them, and open a PR. Never develop directly on `main` or merge a PR without explicit authorization.

Useful technical references include the [Astro Pop database notes](docs/ASTRO-POP-DATABASE.md), [CosmoPort visual style guide](docs/COSMOPORT-VISUAL-STYLE-GUIDE.md), and [Passport Office Clerk testing guide](docs/PASSPORT-OFFICE-CLERK-INTEGRATION-TESTS.md).

---

CosmoPort Universe is a fictional creative and engineering project.
