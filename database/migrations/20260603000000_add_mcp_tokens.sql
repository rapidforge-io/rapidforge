-- +goose Up
-- +goose StatementBegin
CREATE TABLE mcp_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    token_prefix TEXT NOT NULL,
    scopes TEXT NOT NULL,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc')),
    last_used_at TIMESTAMP,
    revoked_at TIMESTAMP,
    FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_mcp_tokens_token_prefix ON mcp_tokens(token_prefix);
CREATE INDEX idx_mcp_tokens_revoked_at ON mcp_tokens(revoked_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_settings_name_unique ON settings(name);

INSERT INTO settings (name, value)
VALUES ('mcp.enabled', 'false')
ON CONFLICT(name) DO NOTHING;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS mcp_tokens;
DELETE FROM settings WHERE name = 'mcp.enabled';
DROP INDEX IF EXISTS idx_settings_name_unique;
-- +goose StatementEnd
