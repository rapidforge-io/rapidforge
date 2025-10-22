# Bearer Token Authentication Feature

## Overview
This feature adds Bearer Token authentication to webhooks, allowing you to secure your webhook endpoints with custom tokens.

## Implementation Details

### Database Changes
- Added `auth_config` column to the `webhooks` table (JSON field)
- Migration file: `database/migrations/20251021000000_add_webhook_auth.sql`

### Backend Changes

#### Models (`models/models.go`)
1. **Webhook struct**: Added `AuthConfig` field to store authentication configuration
2. **WebhookAuthConfig struct**: New struct to manage auth settings
   ```go
   type WebhookAuthConfig struct {
       Enabled bool     `json:"enabled"`
       Tokens  []string `json:"tokens"`
   }
   ```
3. **GetAuthConfig() method**: Helper method to parse and retrieve auth configuration
4. **WebhookFormData**: Added `AuthConfig` field to handle form submissions

#### Handlers (`handlers.go`)
1. **webhookHandlers**: Added bearer token validation logic
   - Checks if authentication is enabled
   - Validates `Authorization` header format
   - Verifies token against configured tokens
   - Returns 401 Unauthorized for invalid/missing tokens

2. **getWebhookHandler**: Passes `authConfig` to the template for rendering

#### Routes (`routes.go`)
- Added `toJSON` template function to properly serialize data to JSON in templates

### Frontend Changes

#### Webhook View (`views/webhook.html`)
Added a new "Authorization" section in the settings tab with:
- Toggle switch to enable/disable bearer token authentication
- Input field for new tokens
- "Generate" button to create random tokens with `rf_live_` prefix
- "Add Token" button to save tokens
- List of active tokens with:
  - Masked display (shows only last 4 characters)
  - Copy button to copy full token to clipboard
  - Delete button to remove token
- Hidden input field that stores the auth configuration JSON

#### JavaScript Functionality
- Token generation: Creates random 32-character tokens with `rf_live_` prefix
- Token management: Add, delete, and copy tokens
- Real-time updates: Syncs token list with hidden form field
- Persistence: Saves configuration when form is submitted

## Usage

### Enabling Bearer Token Authentication

1. Navigate to your webhook settings
2. Open the "Authorization" section
3. Toggle "Require Bearer Token Authentication" to enable
4. Click "Generate" to create a new token or paste your own
5. Click "Add Token" to add it to the active tokens list
6. Click "Save" to persist the configuration

### Making Authenticated Requests

Include the bearer token in the `Authorization` header:

```bash
curl -X POST https://your-domain.com/webhook/your-path \
  -H "Authorization: Bearer rf_live_your_token_here" \
  -H "Content-Type: application/json" \
  -d '{"your": "data"}'
```

### Token Management

- **Copy Token**: Click the copy icon to copy the full token to clipboard
- **Delete Token**: Click the trash icon to remove a token
- **Multiple Tokens**: You can have multiple active tokens for rotation purposes

## Security Considerations

1. **Token Storage**: Tokens are stored in plain text in the database. Consider encryption for production use.
2. **Token Format**: Uses `rf_live_` prefix for easy identification
3. **Token Length**: 32 random characters for security
4. **Token Rotation**: Multiple tokens supported for zero-downtime rotation
5. **HTTPS**: Always use HTTPS in production to protect tokens in transit

## Migration

The migration will automatically run on application startup. The `auth_config` column will be added to existing webhooks with a NULL value, which means authentication is disabled by default.

## Testing

To test the feature:

1. Create or edit a webhook
2. Enable bearer token authentication
3. Generate and add a token
4. Save the webhook
5. Try accessing the webhook without the token (should return 401)
6. Try accessing with the correct token (should succeed)
7. Try accessing with an incorrect token (should return 401)

## Error Responses

- **401 Unauthorized**: Returned when:
  - Authorization header is missing (when auth is enabled)
  - Authorization header format is invalid
  - Token is invalid or doesn't match any configured tokens

Example error response:
```json
{
  "error": "Authorization required"
}
```
