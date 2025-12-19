# On Fail Script Feature

## Overview
This feature allows users to configure a custom script that automatically executes when a webhook or periodic task fails (exits with a non-zero exit code). This is useful for error handling, notifications, cleanup tasks, or recovery procedures.

## Implementation Details

### Database Changes
Added two new columns to both `webhooks` and `periodic_tasks` tables:
- `on_fail_script` (TEXT): Stores the script content to execute on failure
- `on_fail_script_type` (TEXT): Stores the script type ('bash' or 'lua'), defaults to 'bash'

Migration file: `database/migrations/20251027000000_add_on_fail_script.sql`

### Model Updates
Updated the following structs in `models/models.go`:
- `Webhook`: Added `OnFailScript` and `OnFailScriptType` fields
- `PeriodicTask`: Added `OnFailScript` and `OnFailScriptType` fields
- `WebhookFormData`: Added `OnFailScript` and `OnFailScriptType` form fields
- `PeriodicTaskFormData`: Added `OnFailScript` and `OnFailScriptType` form fields

### Database Queries Updated
- `UpdateFileContentByWebhookID`: Now saves on_fail_script and on_fail_script_type
- `UpdatePeriodicTaskByFrom`: Now saves on_fail_script and on_fail_script_type
- `SelectWebhookDetailsById`: Fetches on_fail_script fields
- `SelectWebhookByPath`: Fetches on_fail_script fields
- `SelectPeriodicTaskDetailsById`: Fetches on_fail_script fields
- `GetAndLockDuePeriodicTasks`: Fetches on_fail_script fields

### Execution Logic

#### Periodic Tasks (`services/periodic_task_service.go`)
When a periodic task fails (exit code != 0):
1. Records the failure
2. Checks if an on-fail script is configured
3. Adds failure context to environment variables:
   - `FAILURE_EXIT_CODE`: The exit code of the failed script
   - `FAILURE_OUTPUT`: The output of the failed script
   - `FAILURE_ERROR`: The error message from the failed script
   - `TASK_ID`: The ID of the periodic task
4. Executes the on-fail script using the configured runner (bash or lua)
5. Logs any errors from the on-fail script execution

#### Webhooks (`handlers.go`)
When a webhook fails (exit code != 0):
1. Checks if an on-fail script is configured
2. Adds failure context to environment variables:
   - `FAILURE_EXIT_CODE`: The exit code of the failed script
   - `FAILURE_OUTPUT`: The output of the failed script
   - `FAILURE_ERROR`: The error message from the failed script
   - `WEBHOOK_ID`: The ID of the webhook
   - `WEBHOOK_PATH`: The path of the webhook
3. Executes the on-fail script using the configured runner (bash or lua)
4. Logs any errors from the on-fail script execution
5. Continues with normal webhook response handling

### UI Changes

#### Periodic Task Settings (`views/periodic_task.html`)
Added a new "On Fail Script" section in the Settings tab with:
- Description explaining when the script runs and available environment variables
- Script type selector (Bash or Lua)
- CodeMirror editor for writing the on-fail script
- Custom autocomplete words for the failure context variables

#### Webhook Settings (`views/webhook.html`)
Added a new "On Fail Script" section in the Settings tab with:
- Description explaining when the script runs and available environment variables
- Script type selector (Bash or Lua)
- CodeMirror editor for writing the on-fail script
- Custom autocomplete words for the failure context variables

## Usage Examples

### Example 1: Send Slack Notification on Webhook Failure (Bash)
```bash
#!/bin/bash
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d "{\"text\":\"Webhook ${WEBHOOK_PATH} failed with exit code ${FAILURE_EXIT_CODE}\"}"
```

### Example 2: Log Failure Details (Bash)
```bash
#!/bin/bash
echo "Task ${TASK_ID} failed at $(date)" >> /var/log/task_failures.log
echo "Exit Code: ${FAILURE_EXIT_CODE}" >> /var/log/task_failures.log
echo "Output: ${FAILURE_OUTPUT}" >> /var/log/task_failures.log
echo "---" >> /var/log/task_failures.log
```

### Example 3: Cleanup and Retry (Lua)
```lua
-- Clean up temporary files
os.execute("rm -f /tmp/task_" .. os.getenv("TASK_ID") .. "_*")

-- Send email notification
local http = require("http")
local email_body = string.format(
  "Task failed with exit code %s. Error: %s",
  os.getenv("FAILURE_EXIT_CODE"),
  os.getenv("FAILURE_ERROR")
)
-- Send email logic here
```

## Environment Variables Available in On-Fail Scripts

### For Periodic Tasks:
- `FAILURE_EXIT_CODE`: The exit code that caused the failure
- `FAILURE_OUTPUT`: Standard output from the failed script
- `FAILURE_ERROR`: Error output from the failed script
- `TASK_ID`: The database ID of the periodic task
- All environment variables from the parent script are also available

### For Webhooks:
- `FAILURE_EXIT_CODE`: The exit code that caused the failure
- `FAILURE_OUTPUT`: Standard output from the failed script
- `FAILURE_ERROR`: Error output from the failed script
- `WEBHOOK_ID`: The database ID of the webhook
- `WEBHOOK_PATH`: The URL path of the webhook
- All environment variables from the parent script (including HEADER_*, FORM_*, PAYLOAD_DATA, etc.)

## Notes
- On-fail scripts are executed asynchronously and do not affect the main script's response
- If the on-fail script itself fails, it is logged but does not trigger another on-fail script
- On-fail scripts have access to all credentials and environment variables from the parent script
- The on-fail script type (bash/lua) is independent of the main script type
