# Backend Architecture

This document describes the Go backend for Shortly.

## Folder structure

```
backend/
├── cmd/server/main.go                  # Entry point — wires everything together
├── internal/
│   ├── config/config.go                # Env-based configuration
│   ├── db/db.go                        # DB connection + migration runner
│   ├── model/link.go                   # Link + Stats structs
│   ├── repository/
│   │   ├── repository.go              # LinkRepository interface
│   │   ├── sqlite/link_repository.go  # SQLite implementation
│   │   └── postgres/link_repository.go# PostgreSQL implementation
│   ├── service/
│   │   ├── link_service.go            # Business logic
│   │   └── shortcode.go               # Base62 code generator
│   ├── handler/
│   │   ├── link_handler.go            # CRUD endpoints
│   │   ├── redirect_handler.go        # GET /:code → 302
│   │   └── stats_handler.go           # GET /api/stats
│   └── middleware/
│       └── ratelimit.go               # Per-IP token bucket
├── migrations/
│   ├── sqlite/0001_init.sql
│   └── postgres/0001_init.sql
├── go.mod / go.sum
└── .env.example
```

## Layers

### Handler → Service → Repository → DB

Each layer only talks to the one directly below it:

```
HTTP request
    ↓
Handler        — parse input, call service, return JSON
    ↓
Service        — validate URL, generate code, check expiry
    ↓
Repository     — CRUD operations (interface)
    ↓
SQLite/Postgres — concrete implementation
```

### Dependency injection in main.go

`cmd/server/main.go` is the only file that constructs concrete types:

```go
var linkRepo repository.LinkRepository
switch cfg.DBDriver {
case "postgres":
    linkRepo = postgres.NewLinkRepository(conn)
case "sqlite":
    linkRepo = sqlite.NewLinkRepository(conn)
}
linkService := service.NewLinkService(linkRepo, cfg.BaseHost)
linkHandler := handler.NewLinkHandler(linkService, cfg.BaseURL)
```

The service and handlers depend only on the `repository.LinkRepository` interface — they never know which database is running.

## Database

### Dual driver support

Both SQLite and PostgreSQL use the same table structure (same column names, same types at the logical level). The schema differs only in:

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| ID column | `INTEGER PRIMARY KEY AUTOINCREMENT` | `BIGSERIAL PRIMARY KEY` |
| Timestamps | `DATETIME` / `CURRENT_TIMESTAMP` | `TIMESTAMPTZ` / `NOW()` |
| Placeholders | `?` | `$1`, `$2`, ... |
| Create return | `LastInsertId()` | `INSERT ... RETURNING id` |

### Migration runner

`internal/db/db.go` reads the env var, opens the connection, reads the matching SQL file from `migrations/`, and executes it. The SQL uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run on every startup.

## Config

All config comes from environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | HTTP listen port |
| `DB_DRIVER` | `sqlite` | `sqlite` or `postgres` |
| `DB_DSN` | `shortly.db` | File path (sqlite) or connection URL (postgres) |
| `BASE_URL` | `http://localhost:8080` | Used for generating short URLs + self-redirect loop check |

`os.Getenv` is called exactly once, in `config.Load()`. The returned `Config` struct is passed everywhere.

## Security notes

- **Rate limiting** is per-instance and in-memory. If you run multiple replicas behind a load balancer, limits are not shared across them.
- **No authentication** — anyone with API access can create and delete links. For public deployments, put this behind a reverse proxy with IP allowlisting, a WAF, or add an API key middleware.
- **No malicious-URL checking** — the service does not inspect destination content. Operators should monitor usage and consider adding a blocklist check (e.g., Google Safe Browsing API).
- **Self-redirect loop prevention** — the service rejects URLs whose host matches `BASE_URL`.

## Dependencies

```
require (
    github.com/gin-gonic/gin v1.10.0
    github.com/jackc/pgx/v5 v5.6.0
    golang.org/x/time v0.5.0
    modernc.org/sqlite v1.34.4
)
```
