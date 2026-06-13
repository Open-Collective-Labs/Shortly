CREATE TABLE IF NOT EXISTS links (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    code            TEXT UNIQUE NOT NULL,
    original_url    TEXT NOT NULL,
    clicks          INTEGER NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_clicked_at DATETIME,
    expires_at      DATETIME
);

CREATE INDEX IF NOT EXISTS idx_links_code ON links (code);
