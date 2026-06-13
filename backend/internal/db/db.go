package db

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
	_ "modernc.org/sqlite"
)

func New(driver, dsn string) (*sql.DB, error) {
	var sqlDriverName, migrationPath string

	switch driver {
	case "postgres":
		sqlDriverName = "pgx"
		migrationPath = "migrations/postgres/0001_init.sql"
	case "sqlite":
		sqlDriverName = "sqlite"
		migrationPath = "migrations/sqlite/0001_init.sql"
	default:
		return nil, fmt.Errorf("unsupported DB_DRIVER: %s", driver)
	}

	conn, err := sql.Open(sqlDriverName, dsn)
	if err != nil {
		return nil, err
	}

	if err := conn.Ping(); err != nil {
		return nil, err
	}

	schema, err := os.ReadFile(migrationPath)
	if err != nil {
		return nil, err
	}

	if _, err := conn.Exec(string(schema)); err != nil {
		return nil, err
	}

	return conn, nil
}
