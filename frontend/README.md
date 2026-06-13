# Shortly — Frontend

React + Vite frontend for the Shortly URL shortener.

## Tech stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite 8 | Dev server and build tool |
| React Router 7 | Client-side routing |
| TanStack React Query 5 | Data fetching, caching, loading states |
| react-icons | Icons (Feather) |
| Bun | Package manager and dev runner |

## Dev

From the project root:

```bash
bun run dev
```

This starts both the frontend (port 5173) and backend (port 8080). API calls to `/api/*` are proxied to the backend via Vite's dev proxy.

## Env vars

See `.env.example`. All frontend env vars use the `VITE_` prefix.

| Var | Default | Description |
|-----|---------|-------------|
| `VITE_PORT` | `5173` | Dev server port |
| `VITE_API_TARGET` | `http://localhost:8080` | Backend proxy target |
| `VITE_API_URL` | `(empty)` | API base URL — empty uses the Vite proxy; set to a full URL for direct backend access |

## Project structure

```
src/
├── components/     # Reusable UI (Header, Hero, ShortenCard, ConfirmModal, Skeleton, DotsBackground)
├── pages/          # Route-level pages (Home, MyLinks, Dashboard)
├── lib/            # API client, TanStack Query client
├── App.jsx         # Route definitions
├── main.jsx        # Entry point with providers
└── index.css       # Global styles
```
