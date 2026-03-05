-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
ALTER TABLE pages ADD protected BOOLEAN DEFAULT 0;

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
ALTER TABLE pages DROP COLUMN protected;
