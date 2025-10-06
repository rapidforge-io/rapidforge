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
  { label: "os.getenv", type: "function", detail: "Get environment variable", apply: "os.getenv('$1')" }
];