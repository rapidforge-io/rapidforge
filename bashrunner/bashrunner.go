package bashrunner

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"time"
)

// ScriptResult represents the result of executing a script.
type ScriptResult struct {
	ExitCode int    `json:"exit_code"`
	Output   string `json:"output"`
	Error    string `json:"error,omitempty"`
}

// ExecuteBashScriptWithEnv takes a string representing a Bash script, a map of environment variables, writes the script to a temporary file, executes it, and returns the result as a ScriptResult struct.
func Run(script string, envVars map[string]string) (ScriptResult, error) {

	fileName := fmt.Sprintf("script-%d.sh", time.Now().Unix())
	tmpFile, err := os.CreateTemp(os.TempDir(), fileName)
	if err != nil {
		return ScriptResult{}, err
	}
	defer os.Remove(tmpFile.Name()) // Clean up the file afterwards

	// Write the script to the temporary file
	if _, err := tmpFile.Write([]byte(script)); err != nil {
		return ScriptResult{}, err
	}
	if err := tmpFile.Close(); err != nil {
		return ScriptResult{}, err
	}

	// Make the temporary file executable
	if err := os.Chmod(tmpFile.Name(), 0755); err != nil {
		return ScriptResult{}, err
	}

	// Create a new command to execute the temporary bash script file
	cmd := exec.Command("bash", tmpFile.Name())

	// Create a buffer to capture the standard output
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	// Set environment variables
	env := os.Environ()
	for key, value := range envVars {
		env = append(env, fmt.Sprintf("%s=%s", key, value))
	}
	cmd.Env = env

	// Run the command
	err = cmd.Run()

	// Get the exit code
	exitCode := 0
	if exitErr, ok := err.(*exec.ExitError); ok {
		exitCode = exitErr.ExitCode()
	} else if err != nil {
		// Non-exit error (command not found, etc.)
		return ScriptResult{ExitCode: -1, Output: "", Error: err.Error()}, nil
	}

	// Get the output as a string
	output := stdout.String()
	errs := stderr.String()

	return ScriptResult{ExitCode: exitCode, Output: output, Error: errs}, nil
}
