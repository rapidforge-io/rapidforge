package config

const DefaultScript = `
echo 'You can write any bash script here!'
# Special variables injected by RapidForge
PAYLOAD_DATA # -> this is the payload data for the webhook, whole payload will be assigned to text
HEADER_{HEADER_NAME} # -> will give you header name e.g. HEADER_USER_AGENT
CRED_{CREDENTIAL_NAME} # -> will give you credential name e.g. CRED_GITHUB_OAUTH_TOKEN
`

const DefaultPeriodicTaskScript = `
echo 'You can write any bash script here and ran periodically!'
`
