package mrubyrunner

import (
	"net"
	"net/http"
	"net/http/httptest"
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

func TestMRubyRunnerHelpers(t *testing.T) {
	listener, err := net.Listen("tcp4", "127.0.0.1:0")
	if err != nil {
		t.Skipf("skipping HTTP helper test because local listeners are unavailable: %v", err)
	}

	server := httptest.NewUnstartedServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		_, _ = w.Write([]byte(`{"path":"` + r.URL.Path + `"}`))
	}))
	server.Listener = listener
	server.Start()
	defer server.Close()

	tempDir := t.TempDir()
	fakeCLI := writeFakeKVCLI(t, tempDir)

	runner, err := NewMRubyRunner()
	if err != nil {
		t.Fatalf("NewMRubyRunner() error = %v", err)
	}
	defer runner.Cleanup()

	script := `payload = JSON.parse(env("PAYLOAD_DATA") || "{}")
puts "payload_id=#{payload["id"]}"

kv_set("alpha", "one")
puts "kv=#{kv_get("alpha")}"
puts "keys=#{kv_list.join(",")}"
puts "deleted=#{kv_del("alpha")}"
puts "missing=#{kv_get("missing").inspect}"

body, status = http_get(env("TEST_URL"), { "Accept" => "application/json" })
parsed = JSON.parse(body)
puts "status=#{status}"
puts "http_path=#{parsed["path"]}"

puts JSON.generate({ "ok" => true, "env" => env("HEADER_USER_AGENT") })`

	result, err := runner.Run(script, map[string]string{
		"PAYLOAD_DATA":      `{"id":"abc123"}`,
		"HEADER_USER_AGENT": "rapidforge-test",
		"TEST_URL":          server.URL + "/hello",
		"RAPIDFORGE_BIN":    fakeCLI,
	})
	if err != nil {
		t.Fatalf("Run() error = %v", err)
	}
	if result.ExitCode != 0 {
		t.Fatalf("Run() exit code = %d, stderr = %s", result.ExitCode, result.Error)
	}

	expected := []string{
		"payload_id=abc123",
		"kv=one",
		"keys=alpha",
		"deleted=true",
		"missing=nil",
		"status=201",
		"http_path=/hello",
		`{"ok":true,"env":"rapidforge-test"}`,
	}
	for _, item := range expected {
		if !strings.Contains(result.Output, item) {
			t.Fatalf("Run() output missing %q\noutput:\n%s", item, result.Output)
		}
	}
}

func TestMRubyRunnerFailureContext(t *testing.T) {
	runner, err := NewMRubyRunner()
	if err != nil {
		t.Fatalf("NewMRubyRunner() error = %v", err)
	}
	defer runner.Cleanup()

	result, err := runner.Run(`puts "#{env("FAILURE_EXIT_CODE")}:#{env("TASK_ID")}:#{env("FAILURE_ERROR")}"`, map[string]string{
		"FAILURE_EXIT_CODE": "7",
		"TASK_ID":           "42",
		"FAILURE_ERROR":     "boom",
	})
	if err != nil {
		t.Fatalf("Run() error = %v", err)
	}
	if result.ExitCode != 0 {
		t.Fatalf("Run() exit code = %d, stderr = %s", result.ExitCode, result.Error)
	}
	if !strings.Contains(result.Output, "7:42:boom") {
		t.Fatalf("Run() output = %q, want failure context", result.Output)
	}
}
