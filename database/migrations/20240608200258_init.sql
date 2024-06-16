-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    email TEXT NOT NULL,
    settings JSON,
    role TEXT,
    created_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc')),
    updated_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc'))
);

CREATE TABLE credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc')),
    type TEXT,
    value TEXT
);

CREATE TABLE blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL,
    env_variables TEXT,
    created_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc'))
);

CREATE TABLE programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc'))
);

CREATE TABLE files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    program_id INTEGER,
    created_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc')),
    filename TEXT,
    content TEXT,
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

CREATE TABLE webhooks (
    Name TEXT,
    Description TEXT,
    Active BOOLEAN,
    EnvVariables TEXT,
    Block_id INTEGER,
    Path TEXT,
    Cors TEXT,
    HttpMethod TEXT,
    ExitHttpPair TEXT,
    program_id INTEGER,
    FOREIGN KEY(Block_id) REFERENCES Blocks(id),
    FOREIGN KEY(program_id) REFERENCES Programs(id)
);

CREATE TABLE pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL,
    env_variables TEXT,
    blocks BLOB,
    program_id INTEGER,
    canvas_state JSON,
    html_output TEXT,
    created_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc')),
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

CREATE TABLE periodic_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    active BOOLEAN NOT NULL,
    env_variables TEXT,
    blocks BLOB,
    program_id INTEGER,
    timezone TEXT,
    cron TEXT,
    next_run_at DATETIME,
    created_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc')),
    updated_at TIMESTAMP DEFAULT (strftime('%Y-%m-%d %H:%M:%f', 'now', 'utc')),
    FOREIGN KEY (program_id) REFERENCES programs(id)
);

CREATE TABLE settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value TEXT
);

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS periodic_runs;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS webhooks;
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS blocks;
DROP TABLE IF EXISTS credentials;
DROP TABLE IF EXISTS users;