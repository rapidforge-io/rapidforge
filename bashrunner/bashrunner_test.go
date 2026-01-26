package bashrunner

import (
	"os"
	"strings"
	"testing"

	"github.com/rapidforge-io/rapidforge/runner"
)

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
