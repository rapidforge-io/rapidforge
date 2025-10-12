export const bashSnippets = [
  {
    label: "for loop (range)",
    type: "snippet",
    detail: "Bash for loop over range",
    apply: `for i in {1..10}; do
  echo "$i"
done`
  },
  {
    label: "for loop (list)",
    type: "snippet",
    detail: "Bash for loop over list",
    apply: `for item in a b c; do
  echo "$item"
done`
  },
  {
    label: "while loop",
    type: "snippet",
    detail: "Bash while loop",
    apply: `while [ CONDITION ]; do
  # commands
done`
  },
  {
    label: "if statement",
    type: "snippet",
    detail: "Bash if statement",
    apply: `if [ CONDITION ]; then
  # commands
elif [ OTHER_CONDITION ]; then
  # other commands
else
  # fallback
fi`
  },
  {
    label: "read input",
    type: "function",
    detail: "Read user input",
    apply: `read -p "Enter value: " var`
  },
  {
    label: "echo",
    type: "function",
    detail: "Print to console",
    apply: `echo "$1"`
  },
  {
    label: "function",
    type: "snippet",
    detail: "Define a function",
    apply: `my_func() {
  # commands
}`
  },
  {
    label: "case statement",
    type: "snippet",
    detail: "Bash case statement",
    apply: `case "$1" in
  option1)
    # commands
    ;;
  option2)
    # commands
    ;;
  *)
    # default
    ;;
esac`
  },
  {
    label: "grep",
    type: "function",
    detail: "Search text",
    apply: `grep "pattern" file.txt`
  },
  {
    label: "awk",
    type: "function",
    detail: "Text processing",
    apply: `awk '{ print $1 }' file.txt`
  },
  {
    label: "sed",
    type: "function",
    detail: "Stream editor",
    apply: `sed 's/foo/bar/g' file.txt`
  },
  {
    label: "find",
    type: "function",
    detail: "Find files",
    apply: `find . -name "*.txt"`
  },
  {
    label: "curl",
    type: "function",
    detail: "HTTP request",
    apply: `curl -X GET "https://example.com"`
  },
  {
    label: "export variable",
    type: "function",
    detail: "Set environment variable",
    apply: `export VAR_NAME="value"`
  },
  {
    label: "trap",
    type: "function",
    detail: "Trap signals",
    apply: `trap 'echo "Signal received"' SIGINT SIGTERM`
  },
  {
    label: "jq: filter keys",
    type: "function",
    detail: "Filter JSON keys",
    apply: `jq '.key' file.json`
  },
  {
    label: "jq: select by value",
    type: "function",
    detail: "Select objects by value",
    apply: `jq '.[] | select(.field == "value")' file.json`
  },
  {
    label: "jq: map values",
    type: "function",
    detail: "Map values in array",
    apply: `jq 'map(.field)' file.json`
  },
  {
    label: "jq: pretty print",
    type: "function",
    detail: "Pretty print JSON",
    apply: `jq '.' file.json`
  },
  {
    label: "jq: count elements",
    type: "function",
    detail: "Count elements in array",
    apply: `jq 'length' file.json`
  },
  {
    label: "jq: get nested value",
    type: "function",
    detail: "Get nested JSON value",
    apply: `jq '.parent.child' file.json`
  }
];