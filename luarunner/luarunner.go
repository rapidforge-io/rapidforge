package luarunner

import (
	"bytes"
	"embed"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/rapidforge-io/rapidforge/runner"
)

// LuaRunner embeds the Lua executable and manages script execution
type LuaRunner struct {
	luaPath string
	libPath string
	tempDir string
}

//go:embed lua
//go:embed libs/*
var embedFS embed.FS

// findSystemLua attempts to locate the system's Lua executable
func findSystemLua() (string, error) {
	luaNames := []string{"lua", "lua5.1", "lua5.2", "lua5.3", "lua5.4"}

	for _, name := range luaNames {
		path, err := exec.LookPath(name)
		if err == nil {
			return path, nil
		}
	}

	return "", fmt.Errorf("no system Lua installation found")
}

// extractLibraries extracts embedded Lua libraries to the specified directory
func extractLibraries(destDir string) error {
	entries, err := embedFS.ReadDir("libs")
	if err != nil {
		return fmt.Errorf("failed to read embedded libraries: %w", err)
	}

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		content, err := embedFS.ReadFile(filepath.Join("libs", entry.Name()))
		if err != nil {
			return fmt.Errorf("failed to read embedded library %s: %w", entry.Name(), err)
		}

		libPath := filepath.Join(destDir, entry.Name())
		if err := os.WriteFile(libPath, content, 0644); err != nil {
			return fmt.Errorf("failed to write library %s: %w", entry.Name(), err)
		}
	}

	return nil
}

// NewLuaRunner initializes LuaRunner by first checking for system Lua,
// falling back to embedded binary if necessary
func NewLuaRunner() (*LuaRunner, error) {
	// Create a temporary directory for libraries
	tmpDir, err := os.MkdirTemp("", "golua")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp dir: %w", err)
	}

	// Create libs subdirectory
	libsDir := filepath.Join(tmpDir, "libs")
	if err := os.MkdirAll(libsDir, 0755); err != nil {
		os.RemoveAll(tmpDir)
		return nil, fmt.Errorf("failed to create libs directory: %w", err)
	}

	// Extract libraries
	if err := extractLibraries(libsDir); err != nil {
		os.RemoveAll(tmpDir)
		return nil, err
	}

	// Try to find system Lua first
	luaPath, err := findSystemLua()
	if err != nil {
		// Fall back to embedded binary
		luaPath = filepath.Join(tmpDir, "lua")
		luaData, err := embedFS.ReadFile("lua")
		if err != nil {
			os.RemoveAll(tmpDir)
			return nil, fmt.Errorf("failed to read embedded lua binary: %w", err)
		}

		if err := os.WriteFile(luaPath, luaData, 0755); err != nil {
			os.RemoveAll(tmpDir)
			return nil, fmt.Errorf("failed to write lua binary: %w", err)
		}
	}

	return &LuaRunner{
		luaPath: luaPath,
		libPath: libsDir,
		tempDir: tmpDir,
	}, nil
}

// Cleanup removes temporary files
func (lr *LuaRunner) Cleanup() error {
	if lr.tempDir != "" {
		return os.RemoveAll(lr.tempDir)
	}
	return nil
}

// Run executes a Lua script and returns the result
func (lr *LuaRunner) Run(script string, envVars map[string]string) (runner.ScriptResult, error) {
	var result runner.ScriptResult

	// Write the script to a temporary file
	scriptFile := filepath.Join(lr.tempDir, "script.lua")
	if err := os.WriteFile(scriptFile, []byte(script), 0644); err != nil {
		return result, fmt.Errorf("failed to write script file: %w", err)
	}

	// Build the environment variables string
	envString := fmt.Sprintf("LUA_PATH='%s/?.lua;'", lr.libPath)
	for key, value := range envVars {
		envString += fmt.Sprintf(" %s='%s'", key, strings.ReplaceAll(value, "'", "'\"'\"'"))
	}

	// Create the shell command to run Lua with the provided script
	shellCmd := fmt.Sprintf("%s %s '%s'", envString, lr.luaPath, scriptFile)

	// Create command
	cmd := exec.Command("sh", "-c", shellCmd)

	// Capture output and errors
	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	// Run the command
	err := cmd.Run()

	// Capture the output and error messages
	result.Output = outBuf.String()
	result.Error = errBuf.String()

	// Get the exit code
	if exitErr, ok := err.(*exec.ExitError); ok {
		result.ExitCode = exitErr.ExitCode()
	} else if err != nil {
		result.ExitCode = 1 // General failure
		return result, fmt.Errorf("failed to run script: %w", err)
	} else {
		result.ExitCode = 0 // Success
	}
	fmt.Println("---------------")
	fmt.Printf("%v\n", result)
	return result, nil
}

// func main() {
// 	// Step 1: Initialize LuaRunner
// 	luaRunner, err := NewLuaRunner()
// 	if err != nil {
// 		log.Fatalf("failed to initialize LuaRunner: %s\n", err)
// 	}
// 	defer luaRunner.Cleanup()

// 	// Step 2: Run a Lua script that uses the JSON library
// 	script := `
// 		local json = require("json")
// 		local data = {
// 			name = "test",
// 			value = 123
// 		}
// 		print(json.encode(data))
// 	`

// 	result, err := luaRunner.Run(script, nil)
// 	if err != nil {
// 		log.Fatalf("Lua script execution failed: %s\n", err)
// 	}

// 	// Step 3: Display the result
// 	resultJSON, _ := json.MarshalIndent(result, "", "  ")
// 	fmt.Println(string(resultJSON))
// }
