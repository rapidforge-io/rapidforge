# Make a GET request to the specified URL with echo=true as a query parameter
GET https://main.rapidforge.io/webhook/2-1726006707414424933?echo=true

HTTP 201
[Asserts]
# Check that the status is 201
status == 201

# Check that the response body matches the expected JSON structure
jsonpath "$.BLOCK_LEVEL" == "true"
jsonpath "$.PLAIN_CRED" == "true"
jsonpath "$.WEBHOOK_LEVEL" == "true"
jsonpath "$.URL_PARAM_ECHO" == "true"
jsonpath "$.OVERWRITE" == "true"

# Check that the header contains TEST=true
header "Test" exists

# Test disabled webhook
GET https://main.rapidforge.io/webhook/disabled
HTTP 404

# Test form submit
POST https://main.rapidforge.io/webhook/form-post
[FormParams]
test: true

HTTP 200
[Asserts]
jsonpath "$.FORM_TEST" == "true"

# Test form
GET https://main.rapidforge.io/page/page-4
HTTP 200
[Asserts]
xpath "/html/body/div/div/div/div/div/div/form/div/div[1]/div/input" exists

# Test periodic task
GET https://main.rapidforge.io/webhook/periodic-task
HTTP 200
[Asserts]
jsonpath "$.RESULT" == "true"

# Make a GET request to the specified URL with echo=true as a query parameter
GET https://main.rapidforge.io/webhook/lua-env?echo=true

HTTP 200
[Asserts]
# Check that the status is 200
status == 200

# Check that the response body matches the expected JSON structure
jsonpath "$.BLOCK_LEVEL" == "true"
jsonpath "$.PLAIN_CRED" == "true"
jsonpath "$.WEBHOOK_LEVEL" == "true"
jsonpath "$.URL_PARAM_ECHO" == "true"
jsonpath "$.OVERWRITE" == "true"

# Test periodic task lua
GET https://main.rapidforge.io/webhook/event-count-lua
HTTP 200
[Asserts]
jsonpath "$.RESULT" == "true"

# Test access
GET https://main.rapidforge.io/webhook/access
Authorization: Bearer test
HTTP 200

# Test protected
GET https://main.rapidforge.io/webhook/no-access
HTTP 401
[Asserts]
jsonpath "$.error" == "Authorization required"

# This triggers on fail and returns 201
GET https://main.rapidforge.io/webhook/webhook-fail
HTTP 201

GET https://main.rapidforge.io/webhook/check_fail_results
[Options]
delay: 3000
HTTP 200
[Asserts]
jsonpath "$.RESULT" == "true"
