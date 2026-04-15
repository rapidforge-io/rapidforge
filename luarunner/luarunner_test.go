package luarunner

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func writeFakeKVCLI(t *testing.T, dir string) string {
	t.Helper()

	path := filepath.Join(dir, "rapidforge-cli.sh")
	script := `#!/bin/sh
STORE_DIR=$(dirname "$0")
STORE_FILE="$STORE_DIR/kv-store.txt"
touch "$STORE_FILE"

cmd="$1"
shift

key=""
value=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --key)
      key="$2"
      shift 2
      ;;
    --value)
      value="$2"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

get_value() {
  awk -F '\t' -v k="$1" '$1 == k { print substr($0, index($0, FS) + 1); found=1; exit } END { if (!found) exit 1 }' "$STORE_FILE"
}

delete_key() {
  if grep -Fq "$(printf '%s\t' "$1")" "$STORE_FILE"; then
    grep -Fv "$(printf '%s\t' "$1")" "$STORE_FILE" > "$STORE_FILE.tmp"
    mv "$STORE_FILE.tmp" "$STORE_FILE"
    exit 0
  fi
  exit 1
}

case "$cmd" in
  set)
    grep -Fv "$(printf '%s\t' "$key")" "$STORE_FILE" > "$STORE_FILE.tmp" || true
    printf '%s\t%s\n' "$key" "$value" >> "$STORE_FILE.tmp"
    mv "$STORE_FILE.tmp" "$STORE_FILE"
    ;;
  get)
    get_value "$key"
    ;;
  del)
    delete_key "$key"
    ;;
  list)
    cut -f1 "$STORE_FILE" | sed '/^$/d' | sort
    ;;
  *)
    exit 2
    ;;
esac
`
	if err := os.WriteFile(path, []byte(script), 0755); err != nil {
		t.Fatalf("failed to write fake cli: %v", err)
	}

	return path
}

func TestLuaRunnerKVHelpers(t *testing.T) {
	tempDir := t.TempDir()
	fakeCLI := writeFakeKVCLI(t, tempDir)

	runner, err := NewLuaRunner()
	if err != nil {
		t.Fatalf("NewLuaRunner() error = %v", err)
	}
	defer runner.Cleanup()

	script := `local kv = require('kv')
local ok, err = kv.set('alpha', 'one')
if not ok then
  error(err)
end

local value = kv.get('alpha')
print('value=' .. tostring(value))

local missing = kv.get('missing')
print('missing=' .. tostring(missing))

local keys = kv.list()
print('count=' .. tostring(#keys))
print('first=' .. tostring(keys[1]))

local deleted = kv.del('alpha')
print('deleted=' .. tostring(deleted))

local deletedMissing = kv.del('missing')
print('deleted_missing=' .. tostring(deletedMissing))
`

	result, err := runner.Run(script, map[string]string{
		"RAPIDFORGE_BIN": fakeCLI,
	})
	if err != nil {
		t.Fatalf("Run() error = %v", err)
	}
	if result.ExitCode != 0 {
		t.Fatalf("Run() exit code = %d, stderr = %s", result.ExitCode, result.Error)
	}

	expected := []string{
		"value=one",
		"missing=nil",
		"count=1",
		"first=alpha",
		"deleted=true",
		"deleted_missing=false",
	}
	for _, item := range expected {
		if !strings.Contains(result.Output, item) {
			t.Fatalf("Run() output missing %q\noutput:\n%s", item, result.Output)
		}
	}
}
