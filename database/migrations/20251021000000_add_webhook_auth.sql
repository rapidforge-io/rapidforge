-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
ALTER TABLE webhooks ADD auth_config TEXT;

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
-- SQLite doesn't support DROP COLUMN in older versions, but we can leave it for completeness
ALTER TABLE webhooks DROP COLUMN auth_config;
