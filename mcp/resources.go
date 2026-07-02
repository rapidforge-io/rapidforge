package mcp

const systemInstructions = `RapidForge is a self-hosted automation platform. When a user asks you to build something — a blog, a contact form, an API, a dashboard, a notification system — your job is to decompose it into RapidForge primitives and create all the pieces.

## Primitives

**Block** — a named project that groups related pages, endpoints, and cronjobs. Always create or reuse one block per "program". Set shared environment variables (API keys, config) at the block level so all children inherit them.

**Page** — a public-facing HTML page at /page/{path}. Use the drag-and-drop component tree (canvasState) so pages stay editable in the RapidForge UI. Read the rapidforge://page-canvas-state resource for the full component schema before creating any page.

**Endpoint** — an HTTP handler at /webhook/{path} that runs a bash, Lua, or mRuby script. The script stdout is the HTTP response body. Read rapidforge://script-runtime-helpers before writing any script — it documents exactly how to read form fields, query params, headers, and credentials.

**Cronjob** — a scheduled script (bash, Lua, or mRuby) that runs on a cron expression. Use for periodic tasks: syncing data, sending digests, cleaning up records, polling external APIs.

## Planning Before Creating

When the user's request implies multiple pieces, plan all of them before calling any tool:

1. Identify the block (create it first, everything else references its blockId).
2. List every page the user will interact with.
3. List every endpoint those pages post to, plus any API endpoints.
4. List any recurring tasks that should run on a schedule.

Then create them in order: block → endpoints → pages (pages reference endpoint paths in FormComponent action fields).

## Common Patterns

**Form that saves data:**
- Page with FormComponent → posts to an endpoint
- Endpoint reads FORM_{FIELD} env vars, stores with kv_set, returns JSON

**Blog / content site:**
- One endpoint per content type (list, detail, create, delete)
- Pages for listing and viewing posts; admin page for creating/editing
- Cronjob for any scheduled publishing or cleanup

**Webhook receiver / integration:**
- POST endpoint reads PAYLOAD_DATA, parses JSON, acts on it
- Optionally a cronjob to poll an external API on a schedule

**Authenticated API:**
- Endpoints check HEADER_AUTHORIZATION or a CRED_ credential
- Return appropriate JSON with exitHttpPair mapping exit codes to HTTP statuses

## Key Rules

- Always read rapidforge://script-runtime-helpers before writing endpoint/cronjob code.
- Always read rapidforge://page-canvas-state before building a page with canvasState.
- Form fields submitted to endpoints are available as FORM_{NAME} (uppercased), not as a params hash or body object.
- Print to stdout to set the response body — there is no return value or response object.
- Never invent helper functions or env var names; only use what the resources document.
`

const scriptRuntimeHelpersResource = `# RapidForge Script Runtime Helpers

RapidForge endpoint and cronjob scripts can be written in bash, Lua, or mRuby.

## Common Endpoint Environment

- PAYLOAD_DATA: raw request body for POST, PUT, and PATCH requests.
- FORM_{NAME}: submitted form values, uppercased.
- URL_PARAM_{NAME}: query string values for GET requests, uppercased.
- HEADER_{HEADER_NAME}: request headers, uppercased with dashes replaced by underscores.
- CRED_{CREDENTIAL_NAME}: configured RapidForge credentials.

Endpoint stdout becomes the HTTP response body. Print JSON, text, or HTML to stdout to set the body.

## On-Fail Environment

Endpoint and cronjob on-fail scripts receive:

- FAILURE_EXIT_CODE
- FAILURE_OUTPUT
- FAILURE_ERROR

Endpoint on-fail scripts also receive:

- WEBHOOK_ID
- WEBHOOK_PATH

Cronjob on-fail scripts also receive:

- TASK_ID

## Bash Helpers

Bash scripts can call:

- kv_get KEY
- kv_set KEY VALUE
- kv_del KEY
- kv_list

Example:

` + "```bash" + `
payload="$PAYLOAD_DATA"
kv_set last_payload "$payload"
printf '{"ok":true}\n'
` + "```" + `

## Lua Helpers

Lua scripts can require RapidForge libraries:

` + "```lua" + `
local json = require("json")
local http = require("http")
local kv = require("kv")
` + "```" + `

HTTP helpers return body, status:

- http.get(url, headers)
- http.post(url, data, headers)
- http.put(url, data, headers)
- http.delete(url, headers)

JSON helpers:

- json.encode(value)
- json.decode(str)

KV helpers:

- kv.get(key) → value or nil
- kv.set(key, value)
- kv.del(key)
- kv.list() → array of key strings

Example:

` + "```lua" + `
local json = require("json")
local kv = require("kv")

local payload = os.getenv("PAYLOAD_DATA")
kv.set("last_payload", payload)
print(json.encode({ ok = true }))
` + "```" + `

## mRuby Helpers

mRuby scripts can use top-level helpers:

- env(name) → string or nil
- http_get(url, headers = {}) → [body, status_code]
- http_post(url, body = "", headers = {}) → [body, status_code]
- http_put(url, body = "", headers = {}) → [body, status_code]
- http_patch(url, body = "", headers = {}) → [body, status_code]
- http_delete(url, headers = {}) → [body, status_code]
- kv_get(key) → string or nil
- kv_set(key, value)
- kv_del(key)
- kv_list() → array of key strings
- RAPIDFORGE_ENV: raw hash of all context variables; prefer env(name) to read individual values.

Use JSON.parse and JSON.generate for JSON.

Example:

` + "```ruby" + `
payload = env("PAYLOAD_DATA")
kv_set("last_payload", payload)
puts JSON.generate({ ok: true })
` + "```" + `
`

const pageCanvasStateResource = `# RapidForge Page Canvas State

RapidForge's drag-and-drop page editor stores canvas state as a JSON tree.

When creating a page over MCP, pass canvasState as either:

1. The full stored tree object with a root field.
2. A root TreeNode object.

RapidForge will wrap root nodes into the stored shape:

` + "```json" + `
{
  "version": 1,
  "root": {
    "id": "dropzone",
    "componentName": "CanvasDropZone",
    "children": [],
    "active": false,
    "editableProps": {
      "style": { "backgroundColor": "", "width": "100%" },
      "classes": ""
    }
  }
}
` + "```" + `

TreeNode fields:

- id: stable unique string (use short descriptive slugs, e.g. "form-1", "name-input").
- componentName: one of the component names listed below.
- children: nested TreeNode array.
- active: boolean (set to false).
- editableProps: component-specific props — see per-component schemas below.

If canvasState is omitted, RapidForge creates an empty CanvasDropZone root.

## Component editableProps Reference

### CanvasDropZone
Top-level canvas root. Always use as the outermost node.
` + "```json" + `
{ "style": { "backgroundColor": "", "width": "100%" }, "classes": "" }
` + "```" + `

### ContainerComponent
A vertical stack (renders as div.rf-stack). Use to group children vertically.
` + "```json" + `
{ "classes": "" }
` + "```" + `

### GridComponent
A horizontal row of columns (renders as div.columns). Children should be Dropzone nodes.
No editableProps required — use an empty object {}.

### Dropzone
A single column inside a GridComponent (renders as div.column.rf-stack).
No editableProps required — use an empty object {}.

### FormComponent
An HTML form. Children are form fields and a submit button.
` + "```json" + `
{ "action": "/webhook/your-endpoint-path" }
` + "```" + `
Method is always POST. Set action to the /webhook/{path} of the target endpoint.

### TextInputComponent
A single-line text input. The name value is used for both the HTML name attribute and placeholder.
` + "```json" + `
{ "name": "field_name" }
` + "```" + `
The form will submit this as FORM_{NAME} (uppercased) to the endpoint.

### TextAreaComponent
A multi-line text area.
` + "```json" + `
{ "name": "field_name" }
` + "```" + `

### ButtonComponent
A submit or regular button.
` + "```json" + `
{ "label": "Submit", "name": "", "type": "submit", "style": {} }
` + "```" + `
type is "submit" or "button".

### CheckboxComponent
A group of checkboxes sharing the same name.
` + "```json" + `
{
  "label": "Choose options",
  "name": "field_name",
  "items": [
    { "key": "Display Label", "value": "submitted_value" }
  ]
}
` + "```" + `

### RadioboxComponent
A group of radio buttons sharing the same name.
` + "```json" + `
{
  "label": "Choose one",
  "name": "field_name",
  "items": [
    { "key": "Display Label", "value": "submitted_value" }
  ]
}
` + "```" + `

### DropdownComponent
A select element. The label is used as the disabled placeholder option.
` + "```json" + `
{
  "label": "Select an option",
  "name": "field_name",
  "items": [
    { "key": "Display Label", "value": "submitted_value" }
  ]
}
` + "```" + `

### ParagraphComponent
A paragraph of text.
` + "```json" + `
{ "label": "Your text here", "style": {} }
` + "```" + `

### MarkdownContainer
Renders markdown as HTML.
` + "```json" + `
{ "markdown": "## Heading\n\nSome **bold** text." }
` + "```" + `

### HtmlContainer
Raw HTML passthrough.
` + "```json" + `
{ "html": "<p>Any raw HTML here</p>" }
` + "```" + `

### DividerComponent
A horizontal rule. No editableProps required — use an empty object {}.

## Full Example: Name Form

` + "```json" + `
{
  "id": "dropzone",
  "componentName": "CanvasDropZone",
  "active": false,
  "editableProps": { "style": { "width": "100%" }, "classes": "" },
  "children": [
    {
      "id": "form-1",
      "componentName": "FormComponent",
      "active": false,
      "editableProps": { "action": "/webhook/submit-name" },
      "children": [
        {
          "id": "name-input",
          "componentName": "TextInputComponent",
          "active": false,
          "editableProps": { "name": "name" },
          "children": []
        },
        {
          "id": "submit-btn",
          "componentName": "ButtonComponent",
          "active": false,
          "editableProps": { "label": "Submit", "name": "", "type": "submit", "style": {} },
          "children": []
        }
      ]
    }
  ]
}
` + "```" + `
`
