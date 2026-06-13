CREATE TABLE IF NOT EXISTS links (
    id         SERIAL PRIMARY KEY,
    code       VARCHAR(16) NOT NULL UNIQUE,
    url        VARCHAR(2048) NOT NULL,
    clicks     INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_links_code ON links (code);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links (created_at);
