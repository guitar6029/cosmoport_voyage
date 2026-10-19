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

- Node.js 22.23.3
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
- `app/pages/index.vue` – accessible placeholder homepage
- `app/site.ts` – shared site metadata
- `assets/css/main.css` – Tailwind and DaisyUI entrypoint

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

---

Copyright © 2025
