-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
ALTER TABLE webhooks ADD on_fail_script TEXT;
ALTER TABLE webhooks ADD on_fail_script_type TEXT DEFAULT 'bash';
ALTER TABLE webhooks ADD on_fail_enabled BOOLEAN DEFAULT 0;
ALTER TABLE periodic_tasks ADD on_fail_script TEXT;
ALTER TABLE periodic_tasks ADD on_fail_script_type TEXT DEFAULT 'bash';
ALTER TABLE periodic_tasks ADD on_fail_enabled BOOLEAN DEFAULT 0;

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
ALTER TABLE webhooks DROP COLUMN on_fail_script;
ALTER TABLE webhooks DROP COLUMN on_fail_script_type;
ALTER TABLE webhooks DROP COLUMN on_fail_enabled;
ALTER TABLE periodic_tasks DROP COLUMN on_fail_script;
ALTER TABLE periodic_tasks DROP COLUMN on_fail_script_type;
ALTER TABLE periodic_tasks DROP COLUMN on_fail_enabled;
