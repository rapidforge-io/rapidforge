package main

import (
	"archive/tar"
	"archive/zip"
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"syscall"
	"time"
)

// updateSelf handles the self-update process
func updateSelf(force bool) {
	fmt.Println("=== RapidForge Auto-Updater ===")

	// 1. Get current executable path
	execPath, err := os.Executable()
	if err != nil {
		fmt.Printf("Error: Failed to get executable path: %v\n", err)
		os.Exit(1)
	}
	execPath, err = filepath.EvalSymlinks(execPath)
	if err != nil {
		fmt.Printf("Error: Failed to resolve symlink: %v\n", err)
		os.Exit(1)
	}

	// 2. Determine platform
	platform := detectPlatform()
	fmt.Printf("Platform detected: %s\n", platform)

	// 3. Get latest release info
	releaseInfo, err := getLatestReleaseInfo()
	if err != nil {
		fmt.Printf("Error: Failed to get release info: %v\n", err)
		os.Exit(1)
	}

	latestVersion := releaseInfo.TagName
	fmt.Printf("Latest version: %s\n", latestVersion)
	fmt.Printf("Current version: %s\n", Version)

	// 4. Check if update is needed
	if latestVersion == Version && !force {
		fmt.Println("Already on the latest version.")
		os.Exit(0)
	}

	// 5. Download the release
	downloadURL := ""

	// Debug: Print all available assets
	fmt.Println("Available release assets:")
	for _, asset := range releaseInfo.Assets {
		fmt.Printf("- %s\n", asset.Name)
	}

	// Update the asset matching to be case-insensitive
	for _, asset := range releaseInfo.Assets {
		assetNameLower := strings.ToLower(asset.Name)
		platformLower := strings.ToLower(platform)

		if strings.Contains(assetNameLower, platformLower) {
			downloadURL = asset.DownloadURL
			fmt.Printf("Found matching asset: %s\n", asset.Name)
			break
		}
	}

	if downloadURL == "" {
		fmt.Printf("Error: No release found for platform: %s\n", platform)
		os.Exit(1)
	}

	fmt.Printf("Downloading from: %s\n", downloadURL)

	// Create temporary directory
	tmpDir, err := os.MkdirTemp("", "rapidforge-update-*")
	if err != nil {
		fmt.Printf("Error: Failed to create temp directory: %v\n", err)
		os.Exit(1)
	}
	defer os.RemoveAll(tmpDir)

	// Download the file
	archivePath, err := downloadFile(downloadURL, tmpDir)
	if err != nil {
		fmt.Printf("Error: Failed to download file: %v\n", err)
		os.Exit(1)
	}

	// 6. Extract the archive
	binaryPath, err := extractArchive(archivePath, tmpDir)
	if err != nil {
		fmt.Printf("Error: Failed to extract archive: %v\n", err)
		os.Exit(1)
	}

	// 7. Check if RapidForge is running
	pidFile := "/tmp/rapidforge.pid"
	isRunning := false
	if _, err := os.Stat(pidFile); err == nil {
		pidBytes, err := os.ReadFile(pidFile)
		if err == nil {
			pidStr := strings.TrimSpace(string(pidBytes))
			if pid, err := strconv.Atoi(pidStr); err == nil {
				if isProcessRunning(pid) {
					isRunning = true
					fmt.Println("\nWARNING: RapidForge is currently running!")
					fmt.Printf("Please stop RapidForge before updating (PID: %d)\n", pid)
					fmt.Println("You can stop it with: kill", pid)
					os.Exit(1)
				}
			}
		}
	}

	// 8. Backup current binary
	backupDir := filepath.Join(filepath.Dir(execPath), fmt.Sprintf("backup_%s", time.Now().Format("20060102_150405")))
	err = os.MkdirAll(backupDir, 0755)
	if err != nil {
		fmt.Printf("Error: Failed to create backup directory: %v\n", err)
		os.Exit(1)
	}

	backupPath := filepath.Join(backupDir, filepath.Base(execPath))
	err = copyFile(execPath, backupPath)
	if err != nil {
		fmt.Printf("Error: Failed to backup binary: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Backed up current binary to: %s\n", backupPath)

	// Also backup database if it exists
	dbPath := filepath.Join(filepath.Dir(execPath), "rapidforge.db")
	if _, err := os.Stat(dbPath); err == nil {
		dbBackupPath := filepath.Join(backupDir, "rapidforge.db")
		err = copyFile(dbPath, dbBackupPath)
		if err != nil {
			fmt.Printf("Error: Failed to backup database: %v\n", err)
		} else {
			fmt.Printf("Backed up database to: %s\n", dbBackupPath)
		}
	}

	// 9. Replace the binary
	fmt.Println("Installing new binary...")

	err = copyFile(binaryPath, execPath)
	if err != nil {
		fmt.Printf("Error: Failed to replace binary: %v\n", err)
		fmt.Println("Rolling back...")
		copyFile(backupPath, execPath)
		os.Exit(1)
	}

	fmt.Println("\n✓ Update completed successfully!")
	fmt.Printf("Updated from version %s to %s\n", Version, latestVersion)

	if !isRunning {
		fmt.Println("\nYou can now start RapidForge with:")
		fmt.Printf("  %s\n", execPath)
	}

	fmt.Printf("\nBackup location: %s\n", backupDir)
}

// Helper functions
type ReleaseInfo struct {
	TagName string `json:"tag_name"`
	Assets  []struct {
		Name        string `json:"name"`
		DownloadURL string `json:"browser_download_url"`
	} `json:"assets"`
}

func getLatestReleaseInfo() (ReleaseInfo, error) {
	var info ReleaseInfo
	resp, err := http.Get("https://api.github.com/repos/rapidforge-io/release/releases/latest")
	if err != nil {
		return info, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return info, fmt.Errorf("GitHub API returned status %d", resp.StatusCode)
	}

	err = json.NewDecoder(resp.Body).Decode(&info)
	return info, err
}

func detectPlatform() string {
	os := runtime.GOOS
	arch := runtime.GOARCH
	return fmt.Sprintf("%s_%s", os, arch)
}

func downloadFile(url, destDir string) (string, error) {
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("download returned status %d", resp.StatusCode)
	}

	destPath := filepath.Join(destDir, filepath.Base(url))
	file, err := os.Create(destPath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	_, err = io.Copy(file, resp.Body)
	return destPath, err
}

func extractArchive(archivePath, destDir string) (string, error) {
	switch {
	case strings.HasSuffix(archivePath, ".zip"):
		return extractZip(archivePath, destDir)
	case strings.HasSuffix(archivePath, ".tar.gz") || strings.HasSuffix(archivePath, ".tgz"):
		return extractTarGz(archivePath, destDir)
	default:
		return "", fmt.Errorf("unsupported archive format")
	}
}

func extractZip(zipPath, destDir string) (string, error) {
	reader, err := zip.OpenReader(zipPath)
	if err != nil {
		return "", err
	}
	defer reader.Close()

	for _, file := range reader.File {
		path := filepath.Join(destDir, file.Name)

		if file.FileInfo().IsDir() {
			os.MkdirAll(path, file.Mode())
			continue
		}

		fileReader, err := file.Open()
		if err != nil {
			return "", err
		}
		defer fileReader.Close()

		targetFile, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, file.Mode())
		if err != nil {
			return "", err
		}
		defer targetFile.Close()

		if _, err = io.Copy(targetFile, fileReader); err != nil {
			return "", err
		}

		if strings.Contains(file.Name, "rapidforge") && !file.FileInfo().IsDir() {
			return path, nil
		}
	}

	// If we get here, we didn't find the binary
	return "", fmt.Errorf("binary not found in archive")
}

func startRapidForge(execPath string, isRestart bool) error {
	execDir := filepath.Dir(execPath)
	logFile := filepath.Join(execDir, "rapidforge.log")

	if runtime.GOOS == "windows" {
		// Windows implementation TODO
		return nil
	}

	// POSIX systems (Linux, macOS, BSD)
	// Use a daemonization script that properly detaches the process
	scriptContent := fmt.Sprintf(`#!/bin/sh
(
  # Double fork to completely detach from parent
  cd %s
  %s >> %s 2>&1 &
  echo $! > /tmp/rapidforge.pid
) &
`, execDir, execPath, logFile)

	// Create temporary script
	scriptPath := filepath.Join(execDir, "start_rapidforge.sh")
	if err := os.WriteFile(scriptPath, []byte(scriptContent), 0755); err != nil {
		return fmt.Errorf("failed to create start script: %v", err)
	}
	defer os.Remove(scriptPath)

	// Execute the script in background
	cmd := exec.Command("sh", scriptPath)

	// Completely detach: no stdin, stdout, stderr
	cmd.Stdin = nil
	cmd.Stdout = nil
	cmd.Stderr = nil

	// Set process group to detach from parent
	cmd.SysProcAttr = &syscall.SysProcAttr{
		Setpgid: true,
	}

	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start: %v", err)
	}

	// Don't wait for the command - let it run independently
	go cmd.Wait()

	// Give it time to start and write PID file
	time.Sleep(2 * time.Second)

	// Read the PID from the file
	pidFile := "/tmp/rapidforge.pid"
	if pidData, err := os.ReadFile(pidFile); err == nil {
		pidStr := strings.TrimSpace(string(pidData))
		if pid, err := strconv.Atoi(pidStr); err == nil {
			// Verify it's running
			if isProcessRunning(pid) {
				if isRestart {
					fmt.Printf("Restarted RapidForge (PID: %d)\n", pid)
				} else {
					fmt.Printf("Started RapidForge (PID: %d)\n", pid)
				}
				return nil
			}
		}
	}

	// Fallback: check if process is running even if we couldn't get PID
	time.Sleep(1 * time.Second)
	pidCmd := exec.Command("pgrep", "-f", filepath.Base(execPath))
	if output, err := pidCmd.Output(); err == nil && len(output) > 0 {
		if isRestart {
			fmt.Println("Restarted RapidForge")
		} else {
			fmt.Println("Started RapidForge in background")
		}
		return nil
	}

	return fmt.Errorf("failed to start RapidForge - check %s for errors", logFile)
}

func extractTarGz(tarPath, destDir string) (string, error) {
	file, err := os.Open(tarPath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	gzr, err := gzip.NewReader(file)
	if err != nil {
		return "", err
	}
	defer gzr.Close()

	tr := tar.NewReader(gzr)
	var binaryPath string

	for {
		header, err := tr.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return "", err
		}

		path := filepath.Join(destDir, header.Name)

		switch header.Typeflag {
		case tar.TypeDir:
			if err := os.MkdirAll(path, 0755); err != nil {
				return "", err
			}
		case tar.TypeReg:
			if err := os.MkdirAll(filepath.Dir(path), 0755); err != nil {
				return "", err
			}

			outFile, err := os.Create(path)
			if err != nil {
				return "", err
			}

			if _, err := io.Copy(outFile, tr); err != nil {
				outFile.Close()
				return "", err
			}
			outFile.Close()

			if err := os.Chmod(path, header.FileInfo().Mode()); err != nil {
				return "", err
			}

			// Find the binary by name
			if strings.Contains(strings.ToLower(filepath.Base(header.Name)), "rapidforge") {
				binaryPath = path
			}
		}
	}

	if binaryPath == "" {
		return "", fmt.Errorf("binary not found in archive")
	}

	return binaryPath, nil
}

func copyFile(src, dst string) error {
	srcFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	dstFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer dstFile.Close()

	_, err = io.Copy(dstFile, srcFile)
	if err != nil {
		return err
	}

	srcInfo, err := os.Stat(src)
	if err != nil {
		return err
	}

	return os.Chmod(dst, srcInfo.Mode())
}

// Add this helper function to check if process is running
func isProcessRunning(pid int) bool {
	process, err := os.FindProcess(pid)
	if err != nil {
		return false
	}

	// On Unix-like systems, FindProcess always succeeds, so we need to send
	// signal 0 to check if the process exists
	err = process.Signal(syscall.Signal(0))
	return err == nil
}
