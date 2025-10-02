-- +goose Up
-- +goose StatementBegin
ALTER TABLE periodic_tasks ADD COLUMN locked BOOLEAN DEFAULT 0;
ALTER TABLE periodic_tasks ADD COLUMN locked_at DATETIME;
ALTER TABLE periodic_tasks ADD COLUMN last_success_at DATETIME;
ALTER TABLE periodic_tasks ADD COLUMN last_failure_at DATETIME;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE periodic_tasks DROP COLUMN locked;
ALTER TABLE periodic_tasks DROP COLUMN locked_at;
ALTER TABLE periodic_tasks DROP COLUMN last_success_at;
ALTER TABLE periodic_tasks DROP COLUMN last_failure_at;
-- +goose StatementEnd
