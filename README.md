# CosmoPort Voyage

CosmoPort Voyage is an interactive fictional space-tourism website with a 1950s Space Age retrofuturist / Atompunk visual direction.

This repository currently contains the minimal Nuxt frontend foundation. Sanity CMS is planned for content management but is not yet integrated.

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

---

Copyright © 2025
