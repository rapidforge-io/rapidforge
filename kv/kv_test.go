package kv

import (
	"bytes"
	"os"
	"path/filepath"
	"reflect"
	"testing"

	"github.com/rapidforge-io/rapidforge/database"
)

func TestKVOperations(t *testing.T) {
	tempDir := t.TempDir()
	originalWD, err := os.Getwd()
	if err != nil {
		t.Fatalf("failed to get working directory: %v", err)
	}
	defer os.Chdir(originalWD)

	if err := os.Chdir(tempDir); err != nil {
		t.Fatalf("failed to change working directory: %v", err)
	}

	database.SetupKV()

	if err := Set("alpha", "one"); err != nil {
		t.Fatalf("Set() error = %v", err)
	}

	value, found, err := Get("alpha")
	if err != nil {
		t.Fatalf("Get() error = %v", err)
	}
	if !found {
		t.Fatalf("Get() found = false, want true")
	}
	if value != "one" {
		t.Fatalf("Get() value = %q, want %q", value, "one")
	}

	missingValue, missingFound, err := Get("missing")
	if err != nil {
		t.Fatalf("Get(missing) error = %v", err)
	}
	if missingFound {
		t.Fatalf("Get(missing) found = true, want false")
	}
	if missingValue != "" {
		t.Fatalf("Get(missing) value = %q, want empty string", missingValue)
	}

	if err := Set("beta", "two"); err != nil {
		t.Fatalf("Set(beta) error = %v", err)
	}

	keys, err := List()
	if err != nil {
		t.Fatalf("List() error = %v", err)
	}
	if !reflect.DeepEqual(keys, []string{"alpha", "beta"}) {
		t.Fatalf("List() = %v, want %v", keys, []string{"alpha", "beta"})
	}

	deleted, err := Del("alpha")
	if err != nil {
		t.Fatalf("Del(alpha) error = %v", err)
	}
	if !deleted {
		t.Fatalf("Del(alpha) = false, want true")
	}

	deleted, err = Del("missing")
	if err != nil {
		t.Fatalf("Del(missing) error = %v", err)
	}
	if deleted {
		t.Fatalf("Del(missing) = true, want false")
	}

	var stdout bytes.Buffer
	var stderr bytes.Buffer
	if err := ExecuteSQL("SELECT key, value FROM KV ORDER BY key", &stdout, &stderr); err != nil {
		t.Fatalf("ExecuteSQL() error = %v", err)
	}
	if stderr.Len() != 0 {
		t.Fatalf("ExecuteSQL() stderr = %q, want empty", stderr.String())
	}
	if stdout.String() != "beta|two\n" {
		t.Fatalf("ExecuteSQL() stdout = %q, want %q", stdout.String(), "beta|two\n")
	}

	if _, err := os.Stat(filepath.Join(tempDir, "rapidforgekv.sqlite3")); err != nil {
		t.Fatalf("expected kv database file to exist: %v", err)
	}
}
