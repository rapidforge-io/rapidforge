package bashrunner

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/rapidforge-io/rapidforge/runner"
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

func TestBashRunner(t *testing.T) {
	testDir, err := os.MkdirTemp("", "bashrunner-test")
	if err != nil {
		t.Fatalf("Failed to create test directory: %v", err)
	}
	defer os.RemoveAll(testDir)

	arg := WithTempDir(testDir)
	runner := NewBashRunner(arg)

	tests := []struct {
		name     string
		script   string
		envVars  map[string]string
		wantOut  string
		wantCode int
	}{
		{
			name:     "simple echo",
			script:   "echo 'hello'",
			wantOut:  "hello\n",
			wantCode: 0,
		},
		{
			name:   "with environment variable",
			script: `echo "$TEST_VAR"`,
			envVars: map[string]string{
				"TEST_VAR": "test_value",
			},
			wantOut:  "test_value\n",
			wantCode: 0,
		},
		{
			name:     "failed command",
			script:   "unknown",
			wantCode: 127,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, _ := runner.Run(tt.script, tt.envVars)

			if result.ExitCode != tt.wantCode {
				t.Errorf("Run() exit code = %v, want %v", result.ExitCode, tt.wantCode)
			}

			if tt.wantOut != "" && !strings.Contains(result.Output, tt.wantOut) {
				t.Errorf("Run() output = %v, want %v", result.Output, tt.wantOut)
			}

		})
	}
}

func TestMockRunner(t *testing.T) {
	// Create a mock runner with predetermined results
	mock := &MockRunner{
		Result: runner.ScriptResult{
			ExitCode: 0,
			Output:   "mocked output",
		},
		Error: nil,
	}

	// Use the mock runner
	result, err := mock.Run("any script", nil)
	if err != nil {
		t.Errorf("MockRunner.Run() unexpected error: %v", err)
	}
	if result.Output != "mocked output" {
		t.Errorf("MockRunner.Run() output = %v, want %v", result.Output, "mocked output")
	}
}

func TestBashRunnerKVHelpers(t *testing.T) {
	testDir := t.TempDir()
	fakeCLI := writeFakeKVCLI(t, testDir)

	arg := WithTempDir(testDir)
	runner := NewBashRunner(arg)

	script := `kv_set "alpha" "one"
value="$(kv_get "alpha")"
echo "value=$value"

if kv_get "missing" >/dev/null 2>&1; then
  echo "missing=unexpected"
else
  echo "missing=not-found"
fi

echo "keys=$(kv_list | tr '\n' ',' | sed 's/,$//')"
kv_del "alpha"

if kv_del "missing" >/dev/null 2>&1; then
  echo "deleted_missing=unexpected"
else
  echo "deleted_missing=false"
fi
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
		"missing=not-found",
		"keys=alpha",
		"deleted_missing=false",
	}
	for _, item := range expected {
		if !strings.Contains(result.Output, item) {
			t.Fatalf("Run() output missing %q\noutput:\n%s", item, result.Output)
		}
	}
}
