# RapidForge MCP

RapidForge exposes a hosted MCP endpoint so AI tools can connect to a deployed
RapidForge instance and create working pages, endpoints, and cronjobs.

## Endpoint

```text
https://your-rapidforge-instance.com/mcp
```

The endpoint requires a dedicated MCP bearer token:

```text
Authorization: Bearer rf_mcp_...
```

Browser login cookies are used to manage MCP tokens in the admin UI, but MCP
clients authenticate with bearer tokens because they run outside the browser.

## Admin Setup

1. Log in as an admin.
2. Open `Settings -> MCP`.
3. Create a token.
4. Copy the token immediately. RapidForge only shows it once.
5. Configure your AI tool with the `/mcp` URL and bearer token.

RapidForge stores only a hash of the token. Existing tokens can be revoked from
the same screen.

## Tools

The first MCP tools are:

- `rapidforge_list_blocks`
- `rapidforge_create_block`
- `rapidforge_create_page`
- `rapidforge_create_endpoint`
- `rapidforge_create_cronjob`

`rapidforge_create_endpoint` and `rapidforge_create_cronjob` accept a `code`
field. This is the business logic script that RapidForge saves and executes.
Supported `programType` values are:

- `bash`
- `lua`
- `mruby`

For endpoints, the incoming request body is available as `PAYLOAD_DATA`.
Whatever the script writes to stdout becomes the HTTP response body.

Example Lua response:

```lua
local json = require("json")
print(json.encode({ ok = true }))
```

With `Content-Type=application/json` in `responseHeaders`, this returns a JSON
response body to the HTTP caller.

## Example Client Configuration

```json
{
  "mcpServers": {
    "rapidforge": {
      "url": "https://your-rapidforge-instance.com/mcp",
      "headers": {
        "Authorization": "Bearer rf_mcp_your_token_here"
      }
    }
  }
}
```
