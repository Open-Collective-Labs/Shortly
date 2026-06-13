# Shortly Architecture

A self-hosted, open-source URL shortener built with Go (Gin) + React (Vite).

## Overview

```
┌─────────────┐       ┌──────────────┐       ┌───────────┐
│  React/Vite  │  ──►  │  Gin (Go)   │  ──►  │ SQLite or │
│  Frontend    │  API  │  Backend    │  DB   │ Postgres  │
│  :5173       │  ◄──  │  :8080      │  ◄──  │           │
└─────────────┘       └──────────────┘       └───────────┘
```

- **Frontend** proxies `/api/*` requests to the backend during development (Vite proxy config).
- **Backend** serves the REST API and handles redirects (`/:code`).
- **Database** is selected at startup via the `DB_DRIVER` env var — SQLite (default, zero config) or PostgreSQL.

## Key design decisions

### Layered backend

```
handler → service → repository (interface) → sqlite or postgres implementation
```

- Handlers parse requests, call the service, return JSON.
- Services hold business rules (URL validation, code generation, expiration checks).
- Repositories abstract the database — the service never knows which DB is running.
- The concrete repository is selected once in `cmd/server/main.go`.

### No authentication

The API is intentionally open (no auth) for self-hosted simplicity. See "Security notes" in the backend docs for limitations and hardening options.

### Click counting

Clicks are stored as a column (`clicks INTEGER`) and incremented atomically on every redirect — no separate analytics pipeline needed.

## Repo structure

```
shortly/
├── backend/
│   ├── cmd/server/main.go       # Entry point
│   ├── internal/
│   │   ├── config/              # Env-based config
│   │   ├── db/                  # DB connection + migration runner
│   │   ├── model/               # Shared structs
│   │   ├── repository/          # Interface + implementations
│   │   ├── service/             # Business logic
│   │   ├── handler/             # HTTP handlers
│   │   └── middleware/          # Rate limiter
│   ├── migrations/              # SQL per driver
│   ├── go.mod / go.sum
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI
│   │   ├── pages/               # Route-level pages
│   │   └── lib/                 # API client, query client
│   ├── index.html
│   └── package.json
├── docs/                        # Architecture docs
├── package.json                 # Root dev script (runs both)
└── README.md
```

## Data flow

### Creating a short link

```
User types URL → POST /api/links { url: "..." }
  → handler validates JSON
  → service validates URL (scheme, length, self-loop check)
  → service generates 6-char base62 code (collision retry x5)
  → repository inserts row
  → returns { code, short_url, original_url, created_at }
```

### Redirect

```
Browser hits GET /:code
  → handler extracts code from path
  → service looks up by code (404 if missing, 410 if expired)
  → repository increments clicks + updates last_clicked_at
  → 302 redirect to original_url
```

## Frontend data fetching

All data fetching uses **TanStack React Query** for caching, loading states, and automatic refetch:

| Query key | Endpoint | Used by |
|-----------|----------|---------|
| `['links']` | `GET /api/links` | My Links page, Dashboard (top links) |
| `['stats']` | `GET /api/stats` | Dashboard (summary cards) |

Mutations invalidate both `['links']` and `['stats']` on success to keep the UI in sync.

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/links` | Create a short link |
| `GET` | `/api/links?limit=&offset=` | List links (paginated) |
| `GET` | `/api/links/:id` | Get link details |
| `DELETE` | `/api/links/:id` | Delete a link |
| `GET` | `/api/stats` | Dashboard stats |
| `GET` | `/:code` | Redirect (302) |

## Rate limiting

Applied per-IP using in-memory token buckets:

- API routes: 2 req/s, burst 10
- Redirect route: 20 req/s, burst 40
