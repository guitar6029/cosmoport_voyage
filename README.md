# CosmoPort Voyage

A small sci‑fi themed web app to explore space “voyages”. The client shows a hero section and a browsable list of voyages fetched from the FastAPI server. Each voyage displays name, description, difficulty, origin/destination, and an image, with a modal for expanded details.

## Features
- Hero landing with call‑to‑action to explore voyages
- Browse voyages with cards and difficulty badges
- Modal with more details (reward, recommended ship, image)
- Loading state while fetching data from the API
- Theming via DaisyUI (default theme: `abyss`)

## Tech Stack
- Client
  - Vue 3 (Composition API + `<script setup>`)
  - TypeScript
  - Vite
  - Tailwind CSS v4 + DaisyUI
  - lucide-vue-next (icon set)
- Server
  - FastAPI
  - Beanie (MongoDB ODM) + Motor (async MongoDB driver)
  - Pydantic (data validation)
  - python-dotenv (env loading)
  - CORS enabled for local development
- Database
  - MongoDB (database: `cosmoport`, collection: `voyages`)

## Project Structure
- `client/` – Vue app
  - `src/App.vue` – Landing and entry UI
  - `src/components/VoyageContainer.vue` – Voyage list + modal
  - `src/ui/VoyageCard.vue` – Voyage card
  - `src/components/voyage/VoyageMoreDetails.vue` – Modal content
  - `src/composables/useVoyage.ts` – Fetches voyages from API
  - `src/style/style.css` – Tailwind/DaisyUI setup and custom styles
- `server/` – FastAPI app
  - `main.py` – API app and routes (`/` and `/voyages`)
  - `database.py` – Beanie/Mongo initialization (uses `.env`)
  - `models/models.py` – `Voyage` Beanie document model

## API
- `GET /voyages` → Returns an array of voyages from MongoDB

Example document shape (server):
```json
{
  "id": 1,
  "name": "Nova Dawn",
  "description": "…",
  "origin": "…",
  "destination": "…",
  "difficulty": "Moderate",
  "recommendedShip": "Explorer",
  "reward": 1200,
  "imageUrlKey": "nova-dawn"
}
```

## Local Development

### Prerequisites
- Node.js 18+ and npm (or pnpm)
- Python 3.11+ (FastAPI/Beanie)
- A MongoDB instance and connection string

### Server
1. Create `server/.env` with your Mongo connection:
   ```env
   MONGODB_URI=mongodb+srv://user:pass@cluster/dbname?retryWrites=true&w=majority
   ```
2. Install dependencies (ideally in a venv):
   ```bash
   pip install fastapi uvicorn[standard] beanie motor python-dotenv
   ```
3. Start the API:
   ```bash
   uvicorn server.main:app --reload
   ```
   - Runs on `http://localhost:8000`

### Client
1. Install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
   - Vite serves the app (by default on `http://localhost:5173`)

The client currently fetches voyages from `http://localhost:8000/voyages` (see `client/src/composables/useVoyage.ts`). If your API URL differs, update that file accordingly.

## Notes & Future Enhancements
- Add vue-router and a dedicated voyage details route (a `RouterLink` exists in the card component but no router is configured yet)
- Move API base URL to `VITE_API_URL` for environment‑based configuration
- Add error/empty states and retry in the voyage list
- Optimize images with `loading="lazy"` and improve mobile responsiveness

## Screenshots
- Coming soon

---
Copyright © 2025
