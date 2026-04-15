package bashrunner

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/rapidforge-io/rapidforge/runner"
)

type BashRunner struct {
	tempDir string // allows overriding temp directory for testing
}

// MockRunner implements Runner interface for testing
type MockRunner struct {
	Result runner.ScriptResult
	Error  error
}

// Run implements the Runner interface for MockRunner
func (m *MockRunner) Run(script string, envVars map[string]string) (runner.ScriptResult, error) {
	return m.Result, m.Error
}

type Option func(*BashRunner)

// NewBashRunner creates a new BashRunner instance
func NewBashRunner(opts ...Option) *BashRunner {
	br := &BashRunner{
		tempDir: os.TempDir(), // default to system temp dir
	}

	// Apply any custom options
	for _, opt := range opts {
		opt(br)
	}

	return br
}

// WithTempDir sets a custom temporary directory
func WithTempDir(dir string) Option {
	return func(br *BashRunner) {
		br.tempDir = dir
	}
}

const kvPrelude = `
kv_get() {
  "$RAPIDFORGE_BIN" get --key "$1"
}

kv_set() {
  "$RAPIDFORGE_BIN" set --key "$1" --value "$2"
}

kv_del() {
  "$RAPIDFORGE_BIN" del --key "$1"
}

kv_list() {
  "$RAPIDFORGE_BIN" list
}
`

func (br *BashRunner) Run(script string, envVars map[string]string) (runner.ScriptResult, error) {
	// Create temporary script file
	fileName := fmt.Sprintf("script-%d.sh", time.Now().Unix())
	tmpFile, err := os.CreateTemp(br.tempDir, fileName)
	if err != nil {
		return runner.ScriptResult{}, fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tmpFile.Name()) // Clean up the file afterwards

	executablePath := envVars["RAPIDFORGE_BIN"]
	if executablePath == "" {
		executablePath, err = os.Executable()
		if err != nil {
			return runner.ScriptResult{}, fmt.Errorf("failed to locate rapidforge binary: %w", err)
		}
	}

	fullScript := kvPrelude + "\n" + script

	// Write the script to the temporary file
	if _, err := tmpFile.Write([]byte(fullScript)); err != nil {
		return runner.ScriptResult{}, fmt.Errorf("failed to write script to temp file: %w", err)
	}
	if err := tmpFile.Close(); err != nil {
		return runner.ScriptResult{}, fmt.Errorf("failed to close temp file: %w", err)
	}

	// Make the temporary file executable
	if err := os.Chmod(tmpFile.Name(), 0755); err != nil {
		return runner.ScriptResult{}, fmt.Errorf("failed to make script executable: %w", err)
	}

	var cmd *exec.Cmd
	// Check if the script starts with a shebang line
	scriptTrimmed := strings.TrimLeft(script, " \t\r\n")
	if strings.HasPrefix(scriptTrimmed, "#!") {
		// Execute the script directly
		cmd = exec.Command(tmpFile.Name())
	} else {
		// No shebang, assume bash script
		cmd = exec.Command("bash", tmpFile.Name())
	}

	// Create buffers to capture the standard output and error
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	// Set environment variables
	env := os.Environ()
	for key, value := range envVars {
		env = append(env, fmt.Sprintf("%s=%s", key, value))
	}
	env = append(env, fmt.Sprintf("RAPIDFORGE_BIN=%s", executablePath))
	cmd.Env = env

	// Run the command
	err = cmd.Run()

	fmt.Println(stderr.String())

	// Process the result
	result := runner.ScriptResult{
		Output: stdout.String(),
		Error:  stderr.String(),
	}

	// Get the exit code
	if exitErr, ok := err.(*exec.ExitError); ok {
		result.ExitCode = exitErr.ExitCode()
	} else if err != nil {
		// Non-exit error (command not found, etc.)
		result.ExitCode = -1
		return result, fmt.Errorf("failed to execute script: %w", err)
	}

	return result, nil
}
