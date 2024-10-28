-- +goose Up
-- +goose StatementBegin
ALTER TABLE programs ADD COLUMN type TEXT NOT NULL DEFAULT 'bash';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE programs DROP COLUMN type;
-- +goose StatementEnd