# KV Helpers

RapidForge has a separate SQLite database for lightweight key-value storage, configured via `RF_KV_URL`.

## Purpose

The KV store is meant for small temporary or convenience data that scripts may want to reuse across webhook and periodic-task runs.

Values are stored as plain text strings.

## Script Helpers

These helpers are included automatically in script runtimes.

### Bash

- `kv_get KEY`
- `kv_set KEY VALUE`
- `kv_del KEY`
- `kv_list`

Behavior:

- `kv_get` prints the value and exits `0` if found
- `kv_get` exits `1` if the key is missing
- `kv_set` exits `0` on success
- `kv_del` exits `0` if a key was deleted, `1` if missing
- `kv_list` prints keys one per line

### Lua

Use:

```lua
local kv = require("kv")
```

Available methods:

- `kv.get(key)` -> `string` or `nil`
- `kv.set(key, value)` -> `true` or `nil, err`
- `kv.del(key)` -> `true`, `false`, or `nil, err`
- `kv.list()` -> `{ "key1", "key2" }` or `nil, err`

## Implementation Notes

The helpers do not call `sqlite3` directly from scripts.

Instead, both Bash and Lua call back into the RapidForge binary through `RAPIDFORGE_BIN`, which is injected automatically by:

- [bashrunner.go](/Users/caneldem/rapidforge/bashrunner/bashrunner.go)
- [luarunner.go](/Users/caneldem/rapidforge/luarunner/luarunner.go)

This keeps the feature working even when `sqlite3` is not installed in the script environment.

## CLI

The same KV store is also exposed through the RapidForge CLI:

- `rapidforge set --key KEY --value VALUE`
- `rapidforge get --key KEY`
- `rapidforge del --key KEY`
- `rapidforge list`
