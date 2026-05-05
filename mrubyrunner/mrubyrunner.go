package mrubyrunner

import (
	"bytes"
	"embed"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/rapidforge-io/rapidforge/runner"
)

// MRubyRunner embeds the mruby executable and manages script execution.
type MRubyRunner struct {
	mrubyPath string
	tempDir   string
}

//go:embed mruby.com
//go:embed libs/*
var embedFS embed.FS

func extractEmbeddedFile(srcPath, destPath string, mode os.FileMode) error {
	content, err := embedFS.ReadFile(srcPath)
	if err != nil {
		return fmt.Errorf("failed to read embedded file %s: %w", srcPath, err)
	}

	if err := os.WriteFile(destPath, content, mode); err != nil {
		return fmt.Errorf("failed to write embedded file %s: %w", srcPath, err)
	}

	return nil
}

func extractLibraries(destDir string) error {
	entries, err := embedFS.ReadDir("libs")
	if err != nil {
		return fmt.Errorf("failed to read embedded libraries: %w", err)
	}

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		srcPath := filepath.Join("libs", entry.Name())
		destPath := filepath.Join(destDir, entry.Name())
		if err := extractEmbeddedFile(srcPath, destPath, 0644); err != nil {
			return err
		}
	}

	return nil
}

func localBundledMRubyPath() string {
	_, currentFile, _, ok := runtime.Caller(0)
	if !ok {
		return ""
	}

	candidate := filepath.Join(filepath.Dir(currentFile), "mruby.com")
	if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
		return candidate
	}

	return ""
}

func shellQuote(value string) string {
	return "'" + strings.ReplaceAll(value, "'", "'\"'\"'") + "'"
}

// NewMRubyRunner initializes MRubyRunner from the embedded binary.
func NewMRubyRunner() (*MRubyRunner, error) {
	tmpDir, err := os.MkdirTemp("", "gomruby")
	if err != nil {
		return nil, fmt.Errorf("failed to create temp dir: %w", err)
	}

	libsDir := filepath.Join(tmpDir, "libs")
	if err := os.MkdirAll(libsDir, 0755); err != nil {
		os.RemoveAll(tmpDir)
		return nil, fmt.Errorf("failed to create libs directory: %w", err)
	}

	if err := extractLibraries(libsDir); err != nil {
		os.RemoveAll(tmpDir)
		return nil, err
	}

	mrubyPath := ""
	localBinaryPath := localBundledMRubyPath()
	if localBinaryPath != "" {
		mrubyPath = localBinaryPath
	}

	if mrubyPath == "" {
		mrubyPath = filepath.Join(tmpDir, "mruby.com")
		if err := extractEmbeddedFile("mruby.com", mrubyPath, 0755); err != nil {
			os.RemoveAll(tmpDir)
			return nil, err
		}
	}

	return &MRubyRunner{
		mrubyPath: mrubyPath,
		tempDir:   tmpDir,
	}, nil
}

// Cleanup removes temporary files.
func (mr *MRubyRunner) Cleanup() error {
	if mr.tempDir != "" {
		return os.RemoveAll(mr.tempDir)
	}
	return nil
}

func (mr *MRubyRunner) writeRuntimeFiles(script string, envVars map[string]string) (string, error) {
	executablePath := envVars["RAPIDFORGE_BIN"]
	if executablePath == "" {
		var err error
		executablePath, err = os.Executable()
		if err != nil {
			return "", fmt.Errorf("failed to locate rapidforge binary: %w", err)
		}
	}

	context := make(map[string]string, len(envVars)+1)
	for key, value := range envVars {
		context[key] = value
	}
	context["RAPIDFORGE_BIN"] = executablePath

	contextJSON, err := json.Marshal(context)
	if err != nil {
		return "", fmt.Errorf("failed to encode runtime context: %w", err)
	}

	contextPath := filepath.Join(mr.tempDir, "context.json")
	if err := os.WriteFile(contextPath, contextJSON, 0644); err != nil {
		return "", fmt.Errorf("failed to write runtime context: %w", err)
	}

	scriptPath := filepath.Join(mr.tempDir, "script.rb")
	if err := os.WriteFile(scriptPath, []byte(script), 0644); err != nil {
		return "", fmt.Errorf("failed to write script file: %w", err)
	}

	return scriptPath, nil
}

// Run executes an mRuby script and returns the result.
func (mr *MRubyRunner) Run(script string, envVars map[string]string) (runner.ScriptResult, error) {
	var result runner.ScriptResult

	scriptPath, err := mr.writeRuntimeFiles(script, envVars)
	if err != nil {
		return result, err
	}

	bootstrapPath := filepath.Join(mr.tempDir, "libs", "bootstrap.rb")
	contextPath := filepath.Join(mr.tempDir, "context.json")

	shellCmd := fmt.Sprintf(
		"%s %s %s %s",
		shellQuote(mr.mrubyPath),
		shellQuote(bootstrapPath),
		shellQuote(contextPath),
		shellQuote(scriptPath),
	)

	cmd := exec.Command("sh", "-c", shellCmd)
	cmd.Env = os.Environ()

	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	err = cmd.Run()

	result.Output = outBuf.String()
	result.Error = errBuf.String()

	if exitErr, ok := err.(*exec.ExitError); ok {
		result.ExitCode = exitErr.ExitCode()
	} else if err != nil {
		result.ExitCode = 1
		return result, fmt.Errorf("failed to run script: %w", err)
	} else {
		result.ExitCode = 0
	}

	return result, nil
}
