# CosmoPort Voyage

CosmoPort Voyage is an interactive fictional space-tourism website with a 1950s Space Age retrofuturist / Atompunk visual direction.

## Current Features

- Hero landing page with a call to action
- Browsable voyage cards
- Voyage details modal with destination, difficulty, reward, ship, and imagery
- Loading state while voyage data is requested
- DaisyUI theming and custom display fonts

## Tech Stack

- Vue 3 with the Composition API
- TypeScript
- Vite
- Tailwind CSS v4
- DaisyUI
- lucide-vue-next

Sanity CMS is planned for content management. The former Python/FastAPI/MongoDB backend has been removed from this repository.

## Project Structure

- `client/` – Vue application
  - `src/App.vue` – landing and entry UI
  - `src/components/VoyageContainer.vue` – voyage list and modal
  - `src/ui/VoyageCard.vue` – voyage card
  - `src/components/voyage/VoyageMoreDetails.vue` – modal content
  - `src/composables/useVoyage.ts` – voyage data integration point
  - `src/style/style.css` – Tailwind, DaisyUI, and custom styles

## Local Development

### Prerequisites

- Node.js 22.23.3
- npm

### Client

```bash
cd client
npm ci
npm run dev
```

Vite serves the app at `http://localhost:5173` by default.

### Production Build

```bash
cd client
npm run build
```

## Future Direction

- Connect voyage content to Sanity CMS
- Add error and empty states for voyage data
- Improve responsive behavior and image loading
- Add dedicated voyage details routing when needed

---

Copyright © 2025
