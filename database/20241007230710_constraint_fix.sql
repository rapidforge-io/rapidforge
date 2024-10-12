-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied

-- Step 1: Rename the existing 'webhooks' table
ALTER TABLE webhooks RENAME TO webhooks_old;

-- Step 2: Create the new 'webhooks' table with the corrected foreign key constraint
CREATE TABLE webhooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    active BOOLEAN DEFAULT 1,
    env_variables TEXT,
    response_headers TEXT,
    block_id INTEGER,
    path TEXT NOT NULL UNIQUE,
    cors TEXT,
    http_method TEXT DEFAULT 'GET',
    exit_http_pair TEXT,
    program_id INTEGER,
    created_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc')),
    FOREIGN KEY(block_id) REFERENCES blocks(id) ON DELETE CASCADE,
    FOREIGN KEY(program_id) REFERENCES programs(id)  -- Corrected here
);

-- Step 3: Copy data from 'webhooks_old' to the new 'webhooks' table
INSERT INTO webhooks (
    id, name, description, active, env_variables, response_headers, block_id,
    path, cors, http_method, exit_http_pair, program_id, created_at
)
SELECT
    id, name, description, active, env_variables, response_headers, block_id,
    path, cors, http_method, exit_http_pair, program_id, created_at
FROM webhooks_old;

-- Step 4: Drop the old 'webhooks_old' table
DROP TABLE webhooks_old;

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back

-- Step 1: Rename the corrected 'webhooks' table back to 'webhooks_new'
ALTER TABLE webhooks RENAME TO webhooks_new;

-- Step 2: Recreate the original 'webhooks' table with the old foreign key constraint
CREATE TABLE webhooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    active BOOLEAN DEFAULT 1,
    env_variables TEXT,
    response_headers TEXT,
    block_id INTEGER,
    path TEXT NOT NULL UNIQUE,
    cors TEXT,
    http_method TEXT DEFAULT 'GET',
    exit_http_pair TEXT,
    program_id INTEGER,
    created_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc')),
    FOREIGN KEY(block_id) REFERENCES blocks(id) ON DELETE CASCADE,
    FOREIGN KEY(program_id) REFERENCES Programs(id)  -- Original incorrect constraint
);

-- Step 3: Copy data back to the original 'webhooks' table
INSERT INTO webhooks (
    id, name, description, active, env_variables, response_headers, block_id,
    path, cors, http_method, exit_http_pair, program_id, created_at
)
SELECT
    id, name, description, active, env_variables, response_headers, block_id,
    path, cors, http_method, exit_http_pair, program_id, created_at
FROM webhooks_new;

-- Step 4: Drop the 'webhooks_new' table
DROP TABLE webhooks_new;
