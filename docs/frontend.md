# Frontend Architecture

This document describes the React frontend for Shortly.

## Tech stack

| Tool | Purpose |
|------|---------|
| React 19 | UI framework |
| Vite 8 | Dev server and build tool |
| React Router 7 | Client-side routing |
| TanStack React Query 5 | Data fetching, caching, loading states |
| react-icons | Icons (Feather + Font Awesome) |
| Bun | Package manager and dev runner |

## Folder structure

```
frontend/
├── public/
│   ├── favicon.svg     # "S" monogram
│   └── icons.svg       # SVG sprite (from Vite template)
├── src/
│   ├── components/
│   │   ├── Header.jsx / .css           # Nav bar with tabs
│   │   ├── Hero.jsx / .css             # Landing section
│   │   ├── ShortenCard.jsx / .css      # URL input + result
│   │   ├── ConfirmModal.jsx / .css     # Delete confirmation dialog
│   │   ├── DotsBackground.jsx          # Canvas particle effect
│   │   └── Skeleton.jsx / .css         # Loading placeholder components
│   ├── pages/
│   │   ├── Home.jsx                    # Landing page (Hero + ShortenCard)
│   │   ├── MyLinks.jsx / .css          # Link table with search/pagination
│   │   └── Dashboard.jsx / .css        # Stats cards + top links
│   ├── lib/
│   │   ├── api.js                      # API client (fetch wrapper)
│   │   └── queryClient.js             # TanStack Query client config
│   ├── App.jsx                         # Route definitions
│   ├── main.jsx                        # Entry point (providers)
│   └── index.css                       # Global styles (Google Sans Flex font)
├── index.html
├── vite.config.js                      # Proxy /api → :8080
└── package.json
```

## Routing

```
/              → Home (Hero + ShortenCard)
/links         → My Links (table with search, pagination, delete)
/dashboard     → Dashboard (stats cards + top links)
```

Header tabs use `<NavLink>` from React Router, which applies an `active` class automatically.

## Data fetching

All data flows through **TanStack React Query**. The API client in `lib/api.js` is a thin `fetch` wrapper.

### Query keys

| Key | Endpoint | Stale time | Pages using it |
|-----|----------|------------|----------------|
| `['links']` | `GET /api/links?limit=&offset=` | 30s | My Links, Dashboard |
| `['stats']` | `GET /api/stats` | 30s | Dashboard |

### Mutations

| Mutation | Endpoint | Invalidates |
|----------|----------|-------------|
| Create link | `POST /api/links` | `['links']`, `['stats']` |
| Delete link | `DELETE /api/links/:id` | `['links']`, `['stats']` |

### Loading states

Each page shows **shimmer skeletons** while data loads:

- **My Links**: `SkeletonTable` — mimics the table layout (header row + 5 body rows)
- **Dashboard**: 4 `SkeletonCard` placeholders for stat cards, shimmer rows for top links

## Styling approach

- Plain CSS files co-located with each component/page
- CSS variables for colors (not used heavily — mostly inline values)
- `Google Sans Flex` loaded via `<link>` tag in `index.html` (variable font, weight 100–900)
- Rounded pills (`border-radius: 9999px`) as the primary shape language

## Dev proxy

Vite is configured to proxy `/api` requests to the Go backend:

```js
// vite.config.js
server: {
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true }
  }
}
```

This means all `fetch('/api/...')` calls in the frontend work seamlessly during development without CORS configuration.
