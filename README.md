# Shortly

A self-hosted, open-source URL shortener built with Gin (Go) + React (Vite).

## Features

- **Link shortening** — Create short, memorable aliases for long URLs
- **Pluggable database** — Supports PostgreSQL and SQLite out of the box
- **Redirect tracking** — Count clicks and see when a link was last used
- **Expiration support** — Set a TTL on links so they auto-expire
- **REST API** — All functionality exposed via a clean JSON API
- **Vite-powered UI** — Modern React frontend with hot module reload
- **Single-command dev** — `npm run dev` starts both servers concurrently

## How it works

1. A user submits a long URL via the UI or API.
2. The backend generates a unique short code (e.g. `abc123`).
3. The code and original URL are stored in the database (PostgreSQL or SQLite).
4. Visiting `http://localhost:8080/abc123` redirects (HTTP 302) to the original URL.
5. Each redirect increments a click counter and records a timestamp.

## Tech stack

| Layer | Tool |
|-------|------|
| Backend | Go + Gin |
| Frontend | React + Vite |
| Database | PostgreSQL / SQLite (configurable) |
| Dev runner | concurrently |

## Getting started

### Prerequisites

- Go 1.21+
- Node.js 18+
- PostgreSQL (optional — SQLite works without any setup)

### 1. Clone and install

```bash
git clone https://github.com/your-org/shortly.git
cd shortly

# Install frontend dependencies
npm install --prefix frontend

# Install root dev dependencies (concurrently)
npm install
```

### 2. Configure the database

Copy `.env.example` to `.env` and set your database choice:

```env
DB_DRIVER=sqlite     # or "postgres"
DB_DSN=shortly.db    # SQLite file path, or Postgres DSN, e.g. "host=localhost user=postgres password=... dbname=shortly port=5432 sslmode=disable"
```

SQLite is the default and requires zero setup.

### 3. Run

```bash
npm run dev
```

This starts:

- Go backend on **http://localhost:8080**
- Vite frontend on **http://localhost:5173** (API calls are proxied to `:8080`)

### Run separately

```bash
npm run dev:backend   # Go server only
npm run dev:frontend  # Vite dev server only
```

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/links` | Create a short link |
| `GET` | `/api/links` | List all links |
| `GET` | `/api/links/:id` | Get link details |
| `DELETE` | `/api/links/:id` | Delete a link |
| `GET` | `/:code` | Redirect to the original URL |

## Contributing

Issues and pull requests are welcome. Please open an issue to discuss any significant changes before submitting a PR.

## Documentation

- [Architecture overview](docs/architecture.md)
- [Backend architecture](docs/backend.md)
- [Frontend architecture](docs/frontend.md)

## License

MIT
