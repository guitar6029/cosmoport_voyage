# CosmoPort Voyage

A small sci‑fi themed web app to explore space “voyages”. The client shows a hero section and a browsable list of voyages fetched from the FastAPI server. Each voyage displays name, description, difficulty, origin/destination, and an image, with a modal for expanded details.

## Features
- Hero landing with call‑to‑action to explore voyages
- Browse voyages with cards and difficulty badges
- Modal with more details (reward, recommended ship, image)
- Loading state while fetching data from the API
- FastAPI backend for paginated voyage data
- Voyage interest bookings with create, list, update, and delete endpoints
- Request validation and cleanup with Pydantic models
- Service layer for booking business logic
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
  - MongoDB (database: `cosmoport`)
  - Collections: `voyages`, `voyage_booking`

## Project Structure
- `client/` – Vue app
  - `src/App.vue` – Landing and entry UI
  - `src/components/VoyageContainer.vue` – Voyage list + modal
  - `src/ui/VoyageCard.vue` – Voyage card
  - `src/components/voyage/VoyageMoreDetails.vue` – Modal content
  - `src/composables/useVoyage.ts` – Fetches voyages from API
  - `src/style/style.css` – Tailwind/DaisyUI setup and custom styles
- `server/` – FastAPI app
  - `main.py` – API app setup, CORS, lifespan, and route registration
  - `database.py` – Beanie/Mongo initialization (uses `.env`)
  - `models/models.py` – `Voyage` Beanie document model
  - `models/voyageBooking.py` – Voyage booking request models and Beanie document
  - `routes/voyages.py` – Voyage and booking HTTP route handlers
  - `services/voyage_booking_service.py` – Booking service logic

## API
Base URL during local development:

```text
http://localhost:8000
```

### Health

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | Confirms the FastAPI app is running |

### Voyages

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/voyages?limit=10&skip=0` | Returns paginated voyages from MongoDB |

Query params:

| Name | Default | Rules |
| --- | --- | --- |
| `limit` | `10` | Minimum `1`, maximum `100` |
| `skip` | `0` | Minimum `0` |

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

### Voyage Bookings

Bookings are stored separately from voyages and linked by `voyage_id`.

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/voyages/{voyage_id}/interest` | Creates an interest booking for a voyage |
| `GET` | `/voyages/{voyage_id}/interest?limit=10&skip=0` | Lists bookings for one voyage |
| `PATCH` | `/voyages/{voyage_id}/interest/{booking_id}` | Updates a booking message |
| `DELETE` | `/voyages/{voyage_id}/interest/{booking_id}` | Deletes a booking |

Create booking request:

```json
{
  "name": "Josh",
  "email": "josh@example.com",
  "message": "I want to join this voyage."
}
```

Validation and normalization:
- `name` is required and trimmed
- `email` is required, trimmed, lowercased, and validated as an email address
- `message` is optional, trimmed, and blank values become `null`

Example create response:

```json
{
  "booking": {
    "_id": "6a012f268d2fba5cb6b66361",
    "voyage_id": 1,
    "name": "Josh",
    "email": "josh@example.com",
    "message": "I want to join this voyage."
  }
}
```

Update booking request:

```json
{
  "message": "Updated message"
}
```

Delete booking response:

```json
{
  "message": "Booking deleted"
}
```

Notes:
- `{voyage_id}` is the app-level integer voyage id.
- `{booking_id}` is the Beanie/Mongo document id returned as `_id`.
- Booking routes return `404` if the voyage does not exist, the booking does not exist, or the booking does not belong to that voyage.

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
   pip install -r server/requirements.txt
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
- Add automated backend tests for booking create/list/update/delete
- Consider response models for stable API serialization

## Screenshots
- Coming soon

---
Copyright © 2025
