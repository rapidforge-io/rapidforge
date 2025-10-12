export const luaSnippets = [
  {
    label: "for loop",
    type: "snippet",
    detail: "Lua for loop",
    apply: `for i = 1, 10 do
  print(i)
end`
  },
  { label: "function", type: "keyword", apply: "function $1()\n  $2\nend" },
  { label: "if", type: "keyword", apply: "if $1 then\n  $2\nend" },
  { label: "for", type: "keyword", apply: "for $1 = 1, $2 do\n  $3\nend" },

  // String methods
  { label: "string.len", type: "function", detail: "Get string length", apply: "string.len($1)" },
  { label: "string.sub", type: "function", detail: "Substring", apply: "string.sub($1, $2, $3)" },
  { label: "string.find", type: "function", detail: "Find substring", apply: "string.find($1, $2)" },
  { label: "string.format", type: "function", detail: "Format string", apply: "string.format('$1', $2)" },
  { label: "string.gsub", type: "function", detail: "Replace substring", apply: "string.gsub($1, '$2', '$3')" },

  // Table methods
  { label: "table.insert", type: "function", detail: "Insert into table", apply: "table.insert($1, $2)" },
  { label: "table.remove", type: "function", detail: "Remove from table", apply: "table.remove($1, $2)" },
  { label: "table.concat", type: "function", detail: "Concatenate table", apply: "table.concat($1, '$2')" },
  { label: "pairs", type: "function", detail: "Iterate table (unordered)", apply: "for k, v in pairs($1) do\n  $2\nend" },
  { label: "ipairs", type: "function", detail: "Iterate table (ordered)", apply: "for i, v in ipairs($1) do\n  $2\nend" },

  // Math methods
  { label: "math.abs", type: "function", detail: "Absolute value", apply: "math.abs($1)" },
  { label: "math.floor", type: "function", detail: "Floor", apply: "math.floor($1)" },
  { label: "math.ceil", type: "function", detail: "Ceil", apply: "math.ceil($1)" },
  { label: "math.max", type: "function", detail: "Max value", apply: "math.max($1, $2)" },
  { label: "math.min", type: "function", detail: "Min value", apply: "math.min($1, $2)" },
  { label: "math.random", type: "function", detail: "Random number", apply: "math.random($1, $2)" },

  // IO methods
  { label: "print", type: "function", detail: "Print to console", apply: "print($1)" },
  { label: "io.read", type: "function", detail: "Read input", apply: "io.read()" },
  { label: "io.write", type: "function", detail: "Write output", apply: "io.write($1)" },

  // Misc
  { label: "require", type: "function", detail: "Require module", apply: "require('$1')" },
  { label: "os.getenv", type: "function", detail: "Get environment variable", apply: "os.getenv('$1')" },

  // RapidForge requires
  { label: "require json", type: "snippet", detail: "Import RapidForge JSON library", apply: "local json = require('json')" },
  { label: "require http", type: "snippet", detail: "Import RapidForge HTTP library", apply: "local http = require('http')" },

  // RapidForge libs: JSON
  { label: "json.encode", type: "function", detail: "Encode Lua table to JSON", apply: "json.encode($1)" },
  { label: "json.decode", type: "function", detail: "Decode JSON string to Lua value", apply: "json.decode($1)" },
  { label: "json.encode example", type: "snippet", detail: "Encode a table and print", apply: `local json = require('json')
local data = { key = '$1', value = $2 }
local s = json.encode(data)
print(s)` },
  { label: "json.decode example", type: "snippet", detail: "Decode JSON and use fields", apply: `local json = require('json')
local obj = json.decode($1)
print(obj.$1)` },

  // RapidForge libs: HTTP
  { label: "http.get", type: "function", detail: "GET (returns body, status)", apply: `local body, status = http.get('$1', { ['$2'] = '$3' })` },
  { label: "http.post", type: "function", detail: "POST data (returns body, status)", apply: `local body, status = http.post('$1', $2, { ['$3'] = '$4' })` },
  { label: "http.put", type: "function", detail: "PUT data (returns body, status)", apply: `local body, status = http.put('$1', $2, { ['$3'] = '$4' })` },
  { label: "http.delete", type: "function", detail: "DELETE (returns body, status)", apply: `local body, status = http.delete('$1', { ['$2'] = '$3' })` },

  { label: "http.headers", type: "snippet", detail: "Headers table skeleton", apply: `{ ['Content-Type'] = 'application/json', ['Authorization'] = 'Bearer $1' }` },

  { label: "http.get example", type: "snippet", detail: "GET with headers and status check", apply: `local http = require('http')
local body, status = http.get('$1', { ['Authorization'] = 'Bearer $2' })
if status == 200 then
  print(body)
else
  print('HTTP error', status)
end` },

  { label: "http.post json example", type: "snippet", detail: "POST JSON with Content-Type", apply: `local http = require('http')
local json = require('json')
local payload = { $1 = '$2' }
local body, status = http.post('$3', json.encode(payload), { ['Content-Type'] = 'application/json' })
print(status, body)` },

  { label: "json.parse response", type: "snippet", detail: "Decode HTTP response JSON", apply: `local json = require('json')
local t = json.decode(body)
print(t.$1)` },
];