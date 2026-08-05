package main

import (
	"bytes"
	"crypto/subtle"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"html"
	"io"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"os/exec"

	"github.com/creack/pty"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator"
	"github.com/gorilla/websocket"
	"github.com/rapidforge-io/rapidforge/config"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/models"
	"github.com/rapidforge-io/rapidforge/observability"
	"github.com/rapidforge-io/rapidforge/services"
	"github.com/rapidforge-io/rapidforge/utils"
)

// simple cache
var cache = map[string]any{}

type manualWebhookRunRequest struct {
	Payload      string `json:"payload"`
	Headers      string `json:"headers"`
	EnvOverrides string `json:"envOverrides"`
}

type manualPeriodicRunRequest struct {
	EnvOverrides string `json:"envOverrides"`
}

func getCurrentUser(c *gin.Context) *models.User {
	user, exists := c.Get("user")
	if !exists {
		return nil
	}
	return user.(*models.User)
}

func parseKeyValueLines(input string) (map[string]string, error) {
	result := map[string]string{}
	lines := strings.Split(strings.TrimSpace(input), "\n")

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		key, value, found := strings.Cut(line, "=")
		if !found {
			return nil, fmt.Errorf("invalid format %q, expected KEY=VALUE", line)
		}

		key = strings.TrimSpace(key)
		value = strings.TrimSpace(value)
		if key == "" {
			return nil, fmt.Errorf("invalid format %q, key cannot be empty", line)
		}
		result[key] = value
	}

	return result, nil
}

func parseHeaderLines(input string) (map[string]string, error) {
	result := map[string]string{}
	lines := strings.Split(strings.TrimSpace(input), "\n")

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		var key, value string
		var found bool

		if strings.Contains(line, ":") {
			key, value, found = strings.Cut(line, ":")
		} else {
			key, value, found = strings.Cut(line, "=")
		}

		if !found {
			return nil, fmt.Errorf("invalid header format %q, expected Header=Value or Header: Value", line)
		}

		key = strings.TrimSpace(key)
		value = strings.TrimSpace(value)
		if key == "" {
			return nil, fmt.Errorf("invalid header format %q, key cannot be empty", line)
		}
		result[key] = value
	}

	return result, nil
}

func isOriginAllowed(origin string, allowedOrigins []string) bool {
	for _, allowedOrigin := range allowedOrigins {
		// If the allowed origin is '*', accept any origin
		if allowedOrigin == "*" {
			return true
		}

		// Convert wildcard patterns to regex, e.g., '*.example.com' -> '^https?://.*\.example\.com$'
		regexPattern := "^" + strings.Replace(regexp.QuoteMeta(allowedOrigin), `\*`, `.*`, -1) + "$"
		match, err := regexp.MatchString(regexPattern, origin)
		if err != nil {
			rflog.Error("Regex error:", "err", err)
			return false
		}

		if match {
			return true
		}
	}
	return false
}

func webhookHandlers(store *models.Store) gin.HandlerFunc {
	tracer := otel.Tracer("rapidforge/webhook")
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		startTime := time.Now()
		httpVerb := c.Request.Method
		path := c.Param("path")
		path = strings.TrimPrefix(path, "/")

		ctx, span := tracer.Start(ctx, "webhook.execute",
			trace.WithAttributes(
				attribute.String("webhook.path", path),
				attribute.String("http.method", httpVerb),
			),
		)
		defer span.End()

		success := false
		defer func() {
			duration := time.Since(startTime)
			if metricsInitialized := observability.GetMeterProvider() != nil; metricsInitialized {
				observability.RecordWebhookExecution(ctx, duration, path, success)
			}
		}()

		envVars := map[string]string{}
		webhook, err := store.SelectWebhookByPath(path, httpVerb)
		if errors.Is(err, sql.ErrNoRows) {
			rflog.Error("failed to get webhook", err, "path", path)
			c.Status(http.StatusNotFound)
			return
		}

		// Check bearer token authentication if enabled
		authConfig := webhook.Webhook.GetAuthConfig()
		if authConfig.Enabled && len(authConfig.Tokens) > 0 {
			authHeader := c.GetHeader("Authorization")
			if authHeader == "" {
				rflog.Error("Missing authorization header", "path", path)
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization required"})
				return
			}

			// Extract bearer token
			const bearerPrefix = "Bearer "
			if !strings.HasPrefix(authHeader, bearerPrefix) {
				rflog.Error("Invalid authorization header format", "path", path)
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
				return
			}

			token := strings.TrimPrefix(authHeader, bearerPrefix)

			validToken := false
			for _, validTokenValue := range authConfig.Tokens {
				if subtle.ConstantTimeCompare([]byte(token), []byte(validTokenValue)) == 1 {
					validToken = true
					break
				}
			}

			if !validToken {
				rflog.Error("Invalid bearer token", "path", path)
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
				return
			}
		}

		origin := c.GetHeader("Origin")

		if origin != "" && !isOriginAllowed(origin, webhook.Webhook.GetCors()) {
			rflog.Error("Cors error", "path", path)
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		blockEnvVariables := webhook.Block.GetEnvVars()
		webhookEnvVariables := webhook.Webhook.GetEnvVars()

		envVars = utils.MergeMaps(envVars, blockEnvVariables)
		envVars = utils.MergeMaps(envVars, webhookEnvVariables)
		creds, err := store.ListCredentialsForEnv()
		if err == nil {
			envVars = utils.MergeMaps(envVars, creds)
		} else {
			rflog.Error("failed to get credentials", err)
		}

		if httpVerb == "POST" || httpVerb == "PUT" || httpVerb == "PATCH" {
			var bodyBuffer bytes.Buffer
			_, err := io.Copy(&bodyBuffer, c.Request.Body)

			if err != nil {
				rflog.Error("failed to copy request body", "err", err)
			}

			c.Request.Body = io.NopCloser(bytes.NewReader(bodyBuffer.Bytes()))

			err = c.Request.ParseForm()

			if err != nil {
				rflog.Error("failed to read request body", "err", err)
			}

			for k, v := range c.Request.Form {
				key := fmt.Sprintf("FORM_%s", strings.ToUpper(k))
				envVars[key] = strings.Join(v, ",")
			}

			payload := io.NopCloser(bytes.NewReader(bodyBuffer.Bytes()))
			body, err := io.ReadAll(payload)
			if err != nil {
				c.String(http.StatusBadRequest, "Failed to read request body")
				return
			}

			envVars["PAYLOAD_DATA"] = string(body)
		} else {
			const prefix = "URL_PARAM"
			values := c.Request.URL.Query()
			for k, v := range values {
				key := prefix + "_" + strings.ToUpper(k)
				envVars[key] = v[0]
			}
		}

		headers := c.Request.Header
		const prefix = "HEADER"

		eventArgs := map[string]any{
			"payload": envVars["PAYLOAD_DATA"],
			"headers": map[string]any{},
		}

		// injecting request headers
		for key, values := range headers {
			value := strings.Join(values, ",")
			// for _, value := range values {
			key := prefix + "_" + strings.Replace(strings.ToUpper(key), "-", "_", -1)
			envVars[key] = value
			// prep for recording event args
			tmp := eventArgs["headers"].(map[string]any)
			tmp[key] = value
			// }
		}

		envVars = utils.MergeMaps(envVars, webhookEnvVariables)

		exitHttpPair := webhook.Webhook.GetExitHttpPair()
		runner := services.GetRunner(services.RunnerType(webhook.Program.ProgramType))
		res, err := runner.Run(webhook.File.Content, envVars)

		if res.ExitCode != 0 && webhook.Webhook.OnFailEnabled && webhook.Webhook.OnFailScript.Valid && webhook.Webhook.OnFailScript.String != "" {

			failScriptType := "bash"
			if webhook.Webhook.OnFailScriptType.Valid && webhook.Webhook.OnFailScriptType.String != "" {
				failScriptType = webhook.Webhook.OnFailScriptType.String
			}
			// Add failure context to environment
			envVars["FAILURE_EXIT_CODE"] = fmt.Sprintf("%d", res.ExitCode)
			envVars["FAILURE_OUTPUT"] = res.Output
			envVars["FAILURE_ERROR"] = res.Error
			envVars["WEBHOOK_ID"] = fmt.Sprintf("%d", webhook.Webhook.ID)
			envVars["WEBHOOK_PATH"] = webhook.Webhook.Path
			failRunner := services.GetRunner(services.RunnerType(failScriptType))
			failRes, failErr := failRunner.Run(webhook.Webhook.OnFailScript.String, envVars)
			if failErr != nil {
				rflog.Error("Failed to execute on-fail script", "webhook_id=", webhook.Webhook.ID, "err=", failErr)
			} else if failRes.ExitCode != 0 {
				rflog.Error("On-fail script exited with non-zero status", "webhook_id=", webhook.Webhook.ID, "exit_code=", failRes.ExitCode)
			}
		}

		args, _ := json.Marshal(eventArgs)

		insertEvent := func() {
			_, err := store.InsertEvent(models.Event{
				Status:    fmt.Sprint(res.ExitCode),
				EventType: utils.WebhookEntity,
				Args:      sql.NullString{String: string(args), Valid: true},
				Logs:      sql.NullString{String: string(res.Error), Valid: true},
				WebhookID: sql.NullInt64{Int64: webhook.Webhook.ID, Valid: true},
				BlockID:   webhook.Block.ID,
			})

			if err != nil {
				rflog.Error("Error inserting event for webhook", "err", err)
			}
		}

		defer insertEvent()

		httpCode, ok := exitHttpPair[res.ExitCode]

		if !ok {
			httpCode = http.StatusOK
		}

		if err != nil {
			rflog.Error("failed to run webhook", err)
			span.RecordError(err)
			span.SetStatus(codes.Error, err.Error())
			c.Status(http.StatusInternalServerError)
			return
		}

		// Mark as successful if exit code is 0
		if res.ExitCode == 0 {
			success = true
			span.SetStatus(codes.Ok, "")
		} else {
			span.SetAttributes(attribute.Int("exit_code", res.ExitCode))
			span.SetStatus(codes.Error, fmt.Sprintf("Script exited with code %d", res.ExitCode))
		}

		responseHeaders := webhook.Webhook.GetResponseHeaders()

		for header, value := range webhook.Webhook.GetResponseHeaders() {
			c.Header(header, value)
		}

		if _, ok := responseHeaders["Content-Type"]; !ok {
			responseHeaders["Content-Type"] = "text/html; charset=utf-8"
		}

		contentType := responseHeaders["Content-Type"]
		c.Data(httpCode, contentType, []byte(res.Output))
	}
}

func runWebhookNowHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		startTime := time.Now()
		id := parseInt(c.Param("id"))
		webhookWithDetails, err := store.SelectWebhookDetailsById(id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "webhook not found"})
			return
		}

		var req manualWebhookRunRequest
		if err := c.ShouldBindJSON(&req); err != nil && !errors.Is(err, io.EOF) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request payload"})
			return
		}

		envVars := map[string]string{}
		envVars = utils.MergeMaps(envVars, webhookWithDetails.Block.GetEnvVars())
		envVars = utils.MergeMaps(envVars, webhookWithDetails.Webhook.GetEnvVars())

		creds, err := store.ListCredentialsForEnv()
		if err == nil {
			envVars = utils.MergeMaps(envVars, creds)
		} else {
			rflog.Error("failed to get credentials", err)
		}

		overrideEnv, err := parseKeyValueLines(req.EnvOverrides)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		envVars = utils.MergeMaps(envVars, overrideEnv)

		headers, err := parseHeaderLines(req.Headers)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		const headerPrefix = "HEADER_"
		eventArgs := map[string]any{
			"manual":  true,
			"payload": req.Payload,
			"headers": map[string]any{},
		}

		for key, value := range headers {
			envKey := headerPrefix + strings.ReplaceAll(strings.ToUpper(strings.TrimSpace(key)), "-", "_")
			envVars[envKey] = value
			eventArgs["headers"].(map[string]any)[envKey] = value
		}

		envVars["PAYLOAD_DATA"] = req.Payload

		runner := services.GetRunner(services.RunnerType(webhookWithDetails.Program.ProgramType))
		res, runErr := runner.Run(webhookWithDetails.File.Content, envVars)

		if res.ExitCode != 0 && webhookWithDetails.Webhook.OnFailEnabled && webhookWithDetails.Webhook.OnFailScript.Valid && webhookWithDetails.Webhook.OnFailScript.String != "" {
			failScriptType := "bash"
			if webhookWithDetails.Webhook.OnFailScriptType.Valid && webhookWithDetails.Webhook.OnFailScriptType.String != "" {
				failScriptType = webhookWithDetails.Webhook.OnFailScriptType.String
			}
			envVars["FAILURE_EXIT_CODE"] = fmt.Sprintf("%d", res.ExitCode)
			envVars["FAILURE_OUTPUT"] = res.Output
			envVars["FAILURE_ERROR"] = res.Error
			envVars["WEBHOOK_ID"] = fmt.Sprintf("%d", webhookWithDetails.Webhook.ID)
			envVars["WEBHOOK_PATH"] = webhookWithDetails.Webhook.Path

			failRunner := services.GetRunner(services.RunnerType(failScriptType))
			failRes, failErr := failRunner.Run(webhookWithDetails.Webhook.OnFailScript.String, envVars)
			if failErr != nil {
				rflog.Error("Failed to execute on-fail script", "webhook_id=", webhookWithDetails.Webhook.ID, "err=", failErr)
			} else if failRes.ExitCode != 0 {
				rflog.Error("On-fail script exited with non-zero status", "webhook_id=", webhookWithDetails.Webhook.ID, "exit_code=", failRes.ExitCode)
			}
		}

		args, _ := json.Marshal(eventArgs)
		logLines := []string{}
		if res.Output != "" {
			logLines = append(logLines, res.Output)
		}
		if res.Error != "" {
			logLines = append(logLines, res.Error)
		}
		combinedLogs := strings.TrimSpace(strings.Join(logLines, "\n"))

		var insertedEventID int64
		eventRes, insertErr := store.InsertEvent(models.Event{
			Status:    fmt.Sprint(res.ExitCode),
			EventType: utils.WebhookEntity,
			Args:      sql.NullString{String: string(args), Valid: true},
			Logs:      sql.NullString{String: combinedLogs, Valid: combinedLogs != ""},
			WebhookID: sql.NullInt64{Int64: webhookWithDetails.Webhook.ID, Valid: true},
			BlockID:   webhookWithDetails.Block.ID,
		})
		if insertErr != nil {
			rflog.Error("Error inserting manual webhook run event", "err", insertErr)
		} else {
			insertedEventID, _ = eventRes.LastInsertId()
		}

		status := "success"
		if res.ExitCode != 0 {
			status = "failure"
		}
		if runErr != nil {
			status = "error"
		}

		c.JSON(http.StatusOK, gin.H{
			"status":     status,
			"exitCode":   res.ExitCode,
			"output":     res.Output,
			"stderr":     res.Error,
			"runner":     webhookWithDetails.Program.ProgramType,
			"eventId":    insertedEventID,
			"durationMs": time.Since(startTime).Milliseconds(),
			"runError": func() string {
				if runErr != nil {
					return runErr.Error()
				}
				return ""
			}(),
			"timestamp": time.Now().UTC(),
		})
	}
}

func runPeriodicTaskNowHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		startTime := time.Now()
		id := parseInt(c.Param("id"))
		taskDetails, err := store.SelectPeriodicTaskDetailsById(id)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "periodic task not found"})
			return
		}

		var req manualPeriodicRunRequest
		if err := c.ShouldBindJSON(&req); err != nil && !errors.Is(err, io.EOF) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request payload"})
			return
		}

		envVars := map[string]string{}
		envVars = utils.MergeMaps(envVars, taskDetails.Block.GetEnvVars())
		envVars = utils.MergeMaps(envVars, taskDetails.PeriodicTask.GetEnvVars())

		creds, err := store.ListCredentialsForEnv()
		if err == nil {
			envVars = utils.MergeMaps(envVars, creds)
		} else {
			rflog.Error("failed to get credentials", err)
		}

		overrideEnv, err := parseKeyValueLines(req.EnvOverrides)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		envVars = utils.MergeMaps(envVars, overrideEnv)

		runner := services.GetRunner(services.RunnerType(taskDetails.Program.ProgramType))
		res, runErr := runner.Run(taskDetails.File.Content, envVars)

		if res.ExitCode != 0 && taskDetails.PeriodicTask.OnFailEnabled && taskDetails.PeriodicTask.OnFailScript.Valid && taskDetails.PeriodicTask.OnFailScript.String != "" {
			failScriptType := "bash"
			if taskDetails.PeriodicTask.OnFailScriptType.Valid && taskDetails.PeriodicTask.OnFailScriptType.String != "" {
				failScriptType = taskDetails.PeriodicTask.OnFailScriptType.String
			}
			envVars["FAILURE_EXIT_CODE"] = fmt.Sprintf("%d", res.ExitCode)
			envVars["FAILURE_OUTPUT"] = res.Output
			envVars["FAILURE_ERROR"] = res.Error
			envVars["TASK_ID"] = fmt.Sprintf("%d", taskDetails.PeriodicTask.ID)

			failRunner := services.GetRunner(services.RunnerType(failScriptType))
			failRes, failErr := failRunner.Run(taskDetails.PeriodicTask.OnFailScript.String, envVars)
			if failErr != nil {
				rflog.Error("Failed to execute on-fail script", "task_id=", taskDetails.PeriodicTask.ID, "err=", failErr)
			} else if failRes.ExitCode != 0 {
				rflog.Error("On-fail script exited with non-zero status", "task_id=", taskDetails.PeriodicTask.ID, "exit_code=", failRes.ExitCode)
			}
		}

		var insertedEventID int64
		eventRes, insertErr := store.InsertEvent(models.Event{
			Status:         fmt.Sprint(res.ExitCode),
			EventType:      utils.PeriodicTaskEntity,
			Logs:           sql.NullString{String: strings.TrimSpace(res.Output), Valid: strings.TrimSpace(res.Output) != ""},
			PeriodicTaskID: sql.NullInt64{Int64: taskDetails.PeriodicTask.ID, Valid: true},
			BlockID:        taskDetails.Block.ID,
		})
		if insertErr != nil {
			rflog.Error("Error inserting manual periodic run event", "err", insertErr)
		} else {
			insertedEventID, _ = eventRes.LastInsertId()
		}

		status := "success"
		if res.ExitCode != 0 {
			status = "failure"
		}
		if runErr != nil {
			status = "error"
		}

		c.JSON(http.StatusOK, gin.H{
			"status":     status,
			"exitCode":   res.ExitCode,
			"output":     res.Output,
			"stderr":     res.Error,
			"runner":     taskDetails.Program.ProgramType,
			"eventId":    insertedEventID,
			"durationMs": time.Since(startTime).Milliseconds(),
			"runError": func() string {
				if runErr != nil {
					return runErr.Error()
				}
				return ""
			}(),
			"timestamp": time.Now().UTC(),
		})
	}
}

func loginHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		next := c.Query("next")
		if next == "" || !strings.HasPrefix(next, "/") || strings.HasPrefix(next, "//") {
			next = "/blocks"
		}

		c.HTML(http.StatusOK, "login", gin.H{
			"isDemoMode": config.Get().IsDemoMode(),
			"next":       next,
		})
	}
}

func logoutHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.SetCookie("token", "", -1, "/", "", false, true)
		c.Redirect(http.StatusFound, "/")
	}
}

func infoHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.HTML(http.StatusOK, "info", gin.H{
			"version":     Version,
			"package":     Package,
			"license":     config.License,
			"currentUser": getCurrentUser(c),
		})
	}
}

func mcpSettingsHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokens, err := store.ListMCPTokens()
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"currentUser": getCurrentUser(c),
				"error":       err.Error(),
			})
			return
		}

		c.HTML(http.StatusOK, "mcp_settings", gin.H{
			"currentUser": getCurrentUser(c),
			"tokens":      tokens,
			"newToken":    "",
			"baseUrl":     config.BaseUrl(),
			"scopes":      models.DefaultMCPScopes,
		})
	}
}

func createMCPTokenHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		user := getCurrentUser(c)
		if user == nil || user.Role != models.AdminRole {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		result, err := store.CreateMCPToken(c.PostForm("name"), c.PostFormArray("scopes"), user.ID)
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"currentUser": user,
				"error":       err.Error(),
			})
			return
		}

		tokens, err := store.ListMCPTokens()
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"currentUser": user,
				"error":       err.Error(),
			})
			return
		}

		c.HTML(http.StatusOK, "mcp_settings", gin.H{
			"currentUser": user,
			"tokens":      tokens,
			"newToken":    result.Secret,
			"baseUrl":     config.BaseUrl(),
			"scopes":      models.DefaultMCPScopes,
		})
	}
}

func revokeMCPTokenHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := parseInt(c.Param("id"))
		if err := store.RevokeMCPToken(id); err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"currentUser": getCurrentUser(c),
				"error":       err.Error(),
			})
			return
		}

		c.Header("HX-Redirect", "/settings/mcp")
		c.Redirect(http.StatusFound, "/settings/mcp")
	}
}

func doLoginHandler(loginService *services.LoginService) gin.HandlerFunc {
	type LoginForm struct {
		Username string `form:"username" binding:"required"`
		Password string `form:"password" binding:"required"`
	}

	return func(c *gin.Context) {
		var loginForm LoginForm

		if err := c.ShouldBind(&loginForm); err != nil {
			c.Header("Content-Type", "text/html")
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "Invalid parameters"))
			return
		}

		token, err := loginService.Login(loginForm.Username, loginForm.Password)

		if errors.Is(err, services.ErrTooManyAttempts) {
			c.Header("Content-Type", "text/html")

			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "Too many failed login attempts"))
			return
		} else if errors.Is(err, services.ErrInvalidUsernameOrPassword) {
			c.Header("Content-Type", "text/html")

			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "Invalid username or password"))
			return
		}

		day := int(config.Get().TokenExpiry.Seconds())

		if config.Get().Env == "production" {
			c.SetCookie("token", token, day, "/", "", true, true)
		} else {
			c.SetCookie("token", token, day, "/", "", false, true)
		}

		week := 3600 * 24 * 7
		expirationTime := time.Now().UTC().Add(config.Get().TokenExpiry).Unix()
		c.SetCookie("exp", fmt.Sprint(expirationTime), week, "/", "", false, false)
		redirectTo := c.Query("next")
		if redirectTo == "" || !strings.HasPrefix(redirectTo, "/") || strings.HasPrefix(redirectTo, "//") {
			redirectTo = "/blocks"
		}

		c.Header("HX-Redirect", redirectTo)
		c.Status(http.StatusFound)
	}
}

func eventsHandler(store *models.Store) gin.HandlerFunc {
	const limit = 100
	return func(c *gin.Context) {
		typeName := c.Param("type")
		id := c.Param("id")
		pageParam := c.Query("page")
		page := 0

		if pageParam != "" {
			tpage, err := strconv.Atoi(pageParam)
			if err == nil {
				page = tpage
			}
		}

		idField := map[string]string{
			utils.WebhookEntity:      "webhook_id",
			utils.BlockEntity:        "block_id",
			utils.PeriodicTaskEntity: "periodic_task_id",
		}

		if typeName == "" {
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "typeName is required"))
			return
		}

		if id == "" {
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "id is required"))
			return
		}

		events, err := store.FetchEvents(typeName, parseInt(id), idField[typeName], limit, page)

		if err != nil {
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.HTML(http.StatusOK, "event_table", gin.H{
			"events": events,
			"Page":   page,
			"Type":   typeName,
			"ID":     id,
		})
	}
}

func usersHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		users, err := store.ListUsers()

		if err != nil {
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.HTML(http.StatusOK, "users", gin.H{
			"Users":       users,
			"currentUser": getCurrentUser(c),
		})
	}
}

type UserInput struct {
	Username string `form:"username"`
	Password string `form:"password"`
	Email    string `form:"email"`
	Role     string `form:"role"`
}

func updateUserHandler(store *models.Store) gin.HandlerFunc {

	return func(c *gin.Context) {
		if config.Get().IsDemoMode() {
			c.String(http.StatusForbidden, utils.AlertBox(utils.Error, "User management is disabled in demo mode"))
			return
		}

		id := c.Param("id")

		var userInput UserInput
		var user models.User
		err := c.ShouldBind(&userInput)

		if err != nil {
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		user.ID = utils.ParseInt64(id)
		user.Username = userInput.Username
		user.Email = sql.NullString{String: userInput.Email, Valid: true}
		user.PasswordHash = userInput.Password
		user.Role = userInput.Role

		err = store.UpdateUser(&user)

		if err != nil {
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.Status(http.StatusOK)
		c.String(http.StatusOK, utils.AlertBox(utils.Success, "User updated"))
	}
}

func resetUserLoginHandler(loginService *services.LoginService) gin.HandlerFunc {
	return func(c *gin.Context) {
		username := c.Param("username")

		err := loginService.ResetLoginAttempts(username)

		if err != nil {
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.Status(http.StatusOK)
		c.String(http.StatusOK, utils.AlertBox(utils.Success, "Login count restarted"))
	}
}

func createUserHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		if config.Get().IsDemoMode() {
			c.String(http.StatusForbidden, utils.AlertBox(utils.Error, "User management is disabled in demo mode"))
			return
		}

		var userInput UserInput
		var user models.User

		err := c.ShouldBind(&userInput)

		if err != nil {
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		user.Username = userInput.Username
		user.Email = sql.NullString{String: userInput.Email, Valid: true}
		user.PasswordHash = userInput.Password
		user.Role = userInput.Role

		err = store.InsertUser(&user)

		if err != nil {
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.Status(http.StatusOK)
		c.String(http.StatusOK, utils.AlertBox(utils.Success, "User created"))

	}
}

func deleteUserHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		if config.Get().IsDemoMode() {
			c.String(http.StatusForbidden, utils.AlertBox(utils.Error, "User management is disabled in demo mode"))
			return
		}

		id := c.Param("id")
		err := store.DeleteUser(utils.ParseInt64(id))
		if err != nil {
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.Status(http.StatusOK)
		c.String(http.StatusOK, utils.AlertBox(utils.Success, "User deleted"))
	}
}

func eventsDetailHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		c.Header("Content-Type", "text/html")

		if id == "" {
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "id is required"))
			return
		}

		event, err := store.FetchEventByID(parseInt(id))

		if err != nil {
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		tmpl := `<div class="container">
		            <div id="payload">
					  <sl-textarea style="font-family: monospace; width: 100%;" label="Logs" readonly value={{.Logs}}></sl-textarea>
                      <sl-divider></sl-divider>
					  <div style="font-family: monospace; font-size:1.2em;">Args</div>
                      <div id="args"></div>
		        	</div>
		        </div>
               <script>
                  new JsonViewer({
                    value: JSON.parse({{.Args}}),
					displayDataTypes: false,
					theme: localStorage.getItem('theme') || 'auto',
                    }).render('#args')
                </script>`

		logs := `""`
		if event.Logs.Valid && event.Logs.String != "" {
			logs = event.Logs.String
		}

		args := `""`
		if event.Args.Valid && event.Args.String != "" {
			args = event.Args.String
		}

		data := map[string]string{
			"Logs": logs,
			"Args": args,
		}

		outputHtml, err := utils.GenerateHTML(tmpl, data)

		if err != nil {
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.String(http.StatusOK, outputHtml)
	}
}

func pageHandler(store *models.Store, loginService *services.LoginService) gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Param("path")
		decodedURL, _ := url.QueryUnescape(path)
		page, err := store.SelectPageByPath(decodedURL)

		if err != nil {
			rflog.Error("failed to get page", err)
			c.Status(http.StatusNotFound)
			return
		}
		if page == nil {
			c.Status(http.StatusNotFound)
			return
		}

		if page.Protected {
			tokenString, err := c.Cookie("token")
			if err != nil {
				c.Redirect(http.StatusFound, "/login?next="+url.QueryEscape(c.Request.RequestURI))
				return
			}

			user, err := loginService.LoginWithToken(tokenString)
			if err != nil {
				c.Redirect(http.StatusFound, "/login?next="+url.QueryEscape(c.Request.RequestURI))
				return
			}
			c.Set("user", user)
		}

		html := utils.DefaultString(page.HTMLOutput, "<p>Page is empty</p>")

		etag := fmt.Sprintf(`"p%d-%d"`, page.ID, page.UpdatedAt.Unix())

		// If-None-Match may contain multiple values: "etag1", "etag2"
		if inm := c.GetHeader("If-None-Match"); inm != "" {
			fmt.Printf("etag=%s inm=%s", etag, inm)
			for _, v := range strings.Split(inm, ",") {
				if strings.TrimSpace(v) == etag {
					c.Status(http.StatusNotModified)
					return
				}
			}
		}

		// Optional Last-Modified validation (secondary)
		if modifiedSince := c.GetHeader("If-Modified-Since"); modifiedSince != "" {
			if t, err := time.Parse(http.TimeFormat, modifiedSince); err == nil {
				// Allow 1s skew
				if page.UpdatedAt.Before(t.Add(1 * time.Second)) {
					c.Status(http.StatusNotModified)
					return
				}
			}
		}

		c.Header("ETag", etag)
		c.Header("Last-Modified", page.UpdatedAt.Format(http.TimeFormat))
		c.Header("Cache-Control", "public, max-age=3600")
		c.Data(http.StatusOK, "text/html; charset=utf-8", []byte(html))
	}
}

func renameHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		tableType := c.Param("type")
		intId := parseInt(id)
		newName := c.PostForm("val")
		newName = strings.Trim(newName, " ")
		if newName == "" {
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "Name cannot be empty"))
			return
		}

		var updatedField string
		var err error
		var htmlContent string
		if tableType != utils.WebhookEntity {
			updatedField, err = store.UpdateName(tableType, intId, newName)
			htmlContent = fmt.Sprintf(`<div id="blockTitle">%v</div>`, html.EscapeString(updatedField))
		} else {
			updatedField, err = store.UpdateWebhookPath(intId, newName)
			htmlContent = fmt.Sprintf(`<div id="blockTitle">%v/webhook/%v</div>`, config.BaseUrl(), html.EscapeString(updatedField))
		}

		if err != nil {
			rflog.Error("failed to update name", err)
			key, value := utils.ToastHeader(err.Error())
			c.Header(key, value)
			return
		}
		c.Header("Content-Type", "text/html")
		c.String(200, htmlContent)
	}
}

func blocksListHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		blocks, err := store.ListBlocks()

		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}

		mapBlocks := utils.TransformToMaps(blocks, "blocks")

		if len(mapBlocks) == 0 {
			c.Header("Content-Type", "text/html")

			message := "Blocks are used to group entities together."

			tmpl := `<div class="is-flex is-align-items-center is-justify-content-center">
                    <sl-alert open>
					  <div >
					  <sl-icon slot="icon" name="info-circle"></sl-icon>
					   {{.Message}}
					  </div>
                      <div class="is-flex is-justify-content-center">
 			            <sl-button size="medium" variant="primary" hx-post="/blocks/create">Create Block</sl-button>
                      </div>
                    </sl-alert>
                    </div>`

			outputHtml, err := utils.GenerateHTML(tmpl, map[string]any{"Message": message, "Type": utils.BlockEntity})

			if err != nil {
				c.String(http.StatusOK, outputHtml)
				return
			}
		}

		c.HTML(http.StatusOK, "blocks", gin.H{
			"blockMaps": mapBlocks,
		})
	}
}

func blocksSearchHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		searchQuery := c.Query("q")
		c.Header("Content-Type", "text/html")
		if searchQuery == "" {
			blocks, err := store.ListBlocks()
			if err != nil {
				c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
				return
			}

			mapBlocks := utils.TransformToMaps(blocks, "blocks")
			c.HTML(http.StatusOK, "blocks", gin.H{
				"blockMaps": mapBlocks,
			})
			return
		}

		blocks, err := store.SearchBlocks(searchQuery)
		if err != nil {
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		if len(blocks) == 0 {
			c.Header("Content-Type", "text/html")
			message := "No blocks found for the given search query."

			tmpl := `<div class="is-flex is-align-items-center is-justify-content-center">
                    <sl-alert open>
					  <div >
					  <sl-icon slot="icon" name="info-circle"></sl-icon>
					   {{.Message}}
					  </div>
                      <div class="is-flex is-justify-content-center">
 			            <sl-button size="medium" variant="primary" hx-post="/blocks/create">Create Block</sl-button>
                      </div>
                    </sl-alert>
                    </div>`

			outputHtml, err := utils.GenerateHTML(tmpl, map[string]any{"Message": message, "Type": utils.BlockEntity})

			if err != nil {
				rflog.Error("failed to generate html", "err", err.Error())
				return
			}

			c.String(http.StatusOK, outputHtml)
			return
		}

		mapBlocks := utils.TransformToMaps(blocks, "blocks")
		c.HTML(http.StatusOK, "blocks", gin.H{
			"blockMaps": mapBlocks,
		})
	}
}

func getBlockHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		block, err := store.SelectBlockById(intId)
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}
		webhooks, err := store.ListWebhooksByBlockID(block.ID)

		if err != nil {
			rflog.Error("failed to get webhooks", err)
			return
		}

		editableComponentArgs := utils.ToMap(block)
		editableComponentArgs["Type"] = utils.BlockEntity
		editableComponentArgs["Field"] = block.Name

		webhookMaps := utils.TransformToMaps(webhooks, utils.WebhookEntity)

		c.HTML(http.StatusOK, "block", gin.H{
			"block":                   block,
			"Type":                    utils.BlockEntity,
			"webhooks":                webhookMaps,
			"editableComponentParams": editableComponentArgs,
			"currentUser":             getCurrentUser(c),
		})
	}
}

type BlockForm struct {
	Name        string `form:"name"`
	Description string `form:"description"`
	Active      bool   `form:"active"`
	Env         string `form:"env"`
}

func updateBlockHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := utils.ParseInt64(c.Param("id"))
		var blockForm BlockForm

		c.Header("Content-Type", "text/html")
		err := c.ShouldBind(&blockForm)
		if err != nil {
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		block := models.Block{
			Description:  blockForm.Description,
			Active:       blockForm.Active,
			EnvVariables: sql.NullString{String: blockForm.Env, Valid: true},
		}

		err = store.UpdateBlock(id, block)
		if err != nil {
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.String(http.StatusOK, utils.AlertBox(utils.Success, "Block updated"))
	}
}

func getBlockEntitiesHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		entityType := c.Param("type")
		blockId := parseInt(id)

		var data []map[string]any

		switch entityType {
		case utils.WebhookEntity:
			webhooks, err := store.ListWebhooksByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get pages", err)
				return
			}
			data = utils.TransformToMaps(webhooks, utils.WebhookEntity)
		case utils.PageEntity:
			pages, err := store.ListPagesByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get pages", err)
				return
			}
			data = utils.TransformToMaps(pages, utils.PageEntity)
		case utils.PeriodicTaskEntity:
			periodicRuns, err := store.ListPeriodicTasksByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get periodic runs", err)
				return
			}
			data = utils.TransformToMaps(periodicRuns, utils.PeriodicTaskEntity)
		case "all":
			// Fetch all types
			webhooks, err := store.ListWebhooksByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get webhooks", err)
				c.AbortWithStatus(http.StatusInternalServerError)
				return
			}
			pages, err := store.ListPagesByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get pages", err)
				c.AbortWithStatus(http.StatusInternalServerError)
				return
			}
			periodicRuns, err := store.ListPeriodicTasksByBlockID(blockId)
			if err != nil {
				rflog.Error("failed to get periodic runs", err)
				c.AbortWithStatus(http.StatusInternalServerError)
				return
			}

			// Transform each type to maps and combine
			data = append(data, utils.TransformToMaps(webhooks, utils.WebhookEntity)...)
			data = append(data, utils.TransformToMaps(pages, utils.PageEntity)...)
			data = append(data, utils.TransformToMaps(periodicRuns, utils.PeriodicTaskEntity)...)
		}

		if len(data) == 0 {
			c.Header("Content-Type", "text/html")

			helpText := map[string]string{
				utils.WebhookEntity:      "Webhooks are used to trigger actions when a specific http request hits endpoint .",
				utils.PageEntity:         "Pages are used generate user interface.",
				utils.PeriodicTaskEntity: "Periodic tasks are used to run a task at a specific interval.",
				"all":                    "Create webhooks, pages, and periodic tasks to get started.",
			}

			tmpl := `<div class="is-flex is-align-items-center is-justify-content-center">
                    <sl-alert open>
                      <div >
                      <sl-icon slot="icon" name="info-circle"></sl-icon>
					   {{.Message}}
                      </div>
                      <div class="is-flex is-justify-content-center">
	                    <sl-button variant="primary" hx-post="/{{.Type}}/create" hx-vals='{"blockId": "{{.ID}}" }'> Create</sl-button>
                      </div>
                    </sl-alert>
                    </div>`

			linkType := ""
			if entityType == "all" {
				linkType = utils.WebhookEntity
			} else {
				linkType = entityType
			}

			outputHtml, err := utils.GenerateHTML(tmpl, map[string]any{"Message": helpText[entityType], "ID": blockId, "Type": linkType})

			if err != nil {
				c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
				return
			}

			c.String(http.StatusOK, outputHtml)
		}

		c.HTML(http.StatusOK, "entities", gin.H{
			"data": data,
		})
	}
}

func usersSearchHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		searchQuery := c.Query("q")
		if searchQuery == "" {
			users, err := store.ListUsers()
			if err != nil {
				c.Header("Content-Type", "text/html")
				c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
				return
			}

			c.HTML(http.StatusOK, "user_cards", gin.H{
				"Users": users,
			})
			return
		}

		users, err := store.SearchUsers(searchQuery)
		if err != nil {
			c.Header("Content-Type", "text/html")
			c.String(http.StatusInternalServerError, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.HTML(http.StatusOK, "user_cards", gin.H{
			"Users": users,
		})
	}
}

func createBlockHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		var block models.Block
		id, err := store.InsertBlockWithAutoName(block.Description, block.Active)
		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}
		redirectTo := fmt.Sprintf("/blocks/%d", id)

		c.Header("HX-Redirect", redirectTo)
		c.Status(http.StatusFound)
	}
}

func blocksEntitiesSearchHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		blockIDStr := c.Param("id")
		blockID, err := strconv.ParseInt(blockIDStr, 10, 64)
		if err != nil {
			c.Header("Content-Type", "text/html")
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "Invalid block ID"))
			return
		}

		searchQuery := c.Query("q")
		entityType := c.DefaultQuery("entityType", utils.WebhookEntity)

		var results any

		switch entityType {
		case utils.PageEntity:
			results, err = store.SearchPages(blockID, searchQuery)
		case utils.PeriodicTaskEntity:
			results, err = store.SearchPeriodicTasks(blockID, searchQuery)
		case utils.WebhookEntity:
			results, err = store.SearchWebhooks(blockID, searchQuery)
		default:
			c.Header("Content-Type", "text/html")
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "Invalid entity type"))
			return
		}

		if err != nil {
			c.Header("Content-Type", "text/html")
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, "Invalid entity type"))
			return
		}

		switch res := results.(type) {
		case []models.Webhook:
			results = utils.TransformToMaps(res, utils.WebhookEntity)
		case []models.Page:
			results = utils.TransformToMaps(res, utils.PageEntity)
		case []models.PeriodicTask:
			results = utils.TransformToMaps(res, utils.PeriodicTaskEntity)
		}

		c.HTML(http.StatusOK, "entities", gin.H{
			"data": results,
		})
	}
}

func createWebhookHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		blockId := parseInt(c.PostForm("blockId"))

		webhookId, err := store.InsertWebhookWithAutoName(blockId)

		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}

		redirectTo := fmt.Sprintf("/webhooks/%d", webhookId)
		c.Header("HX-Redirect", redirectTo)
		c.Status(http.StatusFound)
	}
}

func blocksBaseHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "blocks_base", gin.H{
		"currentUser": getCurrentUser(c),
	})
}

var upgrader = websocket.Upgrader{}

func terminalViewHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {

		if config.Get().IsDemoMode() {
			c.String(http.StatusForbidden, "Terminal access is disabled in demo mode")
			return
		}

		allowed := os.Getenv("RF_TERM")

		if config.Get().Env == "production" && allowed != "true" {
			c.String(http.StatusOK, "Change the environment variable RF_TERM to true to enable terminal")
			return
		}

		c.HTML(http.StatusOK, "terminal-view", gin.H{
			"currentUser": getCurrentUser(c),
		})
	}
}

func terminalHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {

		if config.Get().IsDemoMode() {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		allowed := os.Getenv("RF_TERM")

		if config.Get().Env == "production" && allowed != "true" {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			return
		}
		cmd := exec.Command("bash")

		if _, err := exec.LookPath("bash"); err != nil {
			cmd = exec.Command("sh")
		}

		// Set proper terminal environment variables
		cmd.Env = append(os.Environ(),
			"TERM=xterm-256color",
			"COLORTERM=truecolor",
		)

		ptmx, err := pty.Start(cmd)
		if err != nil {
			return
		}

		// Set initial window size (matches terminal.html: term.resize(100, 50))
		_ = pty.Setsize(ptmx, &pty.Winsize{
			Rows: 50,
			Cols: 100,
		})

		defer func() {
			ptmx.Close()
			_ = cmd.Process.Kill()
		}()

		go func() {
			buf := make([]byte, 1024)
			for {
				n, err := ptmx.Read(buf)
				if err != nil {
					break
				}
				_ = conn.WriteMessage(websocket.TextMessage, buf[:n])
			}
		}()

		for {
			messageType, msg, err := conn.ReadMessage()
			if err != nil {
				break
			}

			// Handle resize messages (JSON: {"type":"resize","cols":100,"rows":50})
			if messageType == websocket.TextMessage && len(msg) > 0 && msg[0] == '{' {
				var resizeMsg struct {
					Type string `json:"type"`
					Cols uint16 `json:"cols"`
					Rows uint16 `json:"rows"`
				}
				if json.Unmarshal(msg, &resizeMsg) == nil && resizeMsg.Type == "resize" {
					_ = pty.Setsize(ptmx, &pty.Winsize{
						Rows: resizeMsg.Rows,
						Cols: resizeMsg.Cols,
					})
					continue
				}
			}

			_, _ = ptmx.Write(msg)
		}
	}
}

func updateWebhookHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		_, err := store.SelectWebhookById(intId)
		if err != nil {
			rflog.Error("failed to get webhook", err)
			return
		}

		var form models.WebhookFormData

		if err := c.ShouldBind(&form); err != nil {
			var errs []string
			if validationErrors, ok := err.(validator.ValidationErrors); ok {
				for _, e := range validationErrors {
					errs = append(errs, e.Field()+": "+e.ActualTag())
				}
				c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, strings.Join(errs, ", ")))
			} else {
				c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, err.Error()))
			}
			return
		}

		form.ResponseHeaders = strings.TrimSpace(form.ResponseHeaders)

		err = store.UpdateFileContentByWebhookID(intId, form)

		if err != nil {
			rflog.Error("failed to update file content", err)
			return
		}

		c.Header("Content-Type", "text/html")
		c.String(200, utils.AlertBox(utils.Success, "Webhook updated"))
	}
}

func updatePeriodicTaskHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)

		var form models.PeriodicTaskFormData

		if err := c.ShouldBind(&form); err != nil {
			var errs []string
			if validationErrors, ok := err.(validator.ValidationErrors); ok {
				for _, e := range validationErrors {
					errs = append(errs, e.Field()+": "+e.ActualTag())
				}
				c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, strings.Join(errs, ", ")))
			} else {
				c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, err.Error()))
			}
			return
		}

		err := store.UpdatePeriodicTaskByFrom(intId, form)

		if err != nil {
			rflog.Error("failed to update periodic task", err)
			c.String(http.StatusBadRequest, utils.AlertBox(utils.Error, err.Error()))
			return
		}

		c.Header("Content-Type", "text/html")
		c.String(200, utils.AlertBox(utils.Success, "Periodic task updated"))
	}
}

func getWebhookHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		webhookWithDetails, err := store.SelectWebhookDetailsById(intId)
		if err != nil {
			rflog.Error("failed to get webhook", err)
			return
		}

		if cache["showCurlGenerator"] == nil {
			cache["showCurlGenerator"] = utils.IsCommandAvailable("curl")
		}

		variables := getAutoCompleteVars(webhookWithDetails, store)

		editableComponentArgs := utils.ToMap(webhookWithDetails.Webhook)
		editableComponentArgs["Type"] = utils.WebhookEntity
		editableComponentArgs["Field"] = webhookWithDetails.Webhook.Path
		editableComponentArgs["Url"] = fmt.Sprintf("%s/webhook/%s", config.BaseUrl(), webhookWithDetails.Webhook.Path)

		authConfig := webhookWithDetails.Webhook.GetAuthConfig()

		c.HTML(http.StatusOK, "webhook", gin.H{
			"variables":               variables,
			"helperData":              buildCodeHelperData(utils.WebhookEntity, variables),
			"webhook":                 webhookWithDetails.Webhook,
			"programType":             webhookWithDetails.Program.ProgramType,
			"Type":                    utils.WebhookEntity,
			"httpExitPair":            webhookWithDetails.Webhook.GetExitHttpPair(),
			"fileContent":             utils.DefaultString(webhookWithDetails.File.Content, config.DefaultScript),
			"editableComponentParams": editableComponentArgs,
			"currentUser":             getCurrentUser(c),
			"showCurlGenerator":       cache["showCurlGenerator"],
			"authConfig":              authConfig,
		})
	}
}

// Define an interface for types that have GetEnvVars method
type EnvVarProvider interface {
	GetEnvVars() map[string]string
}

func getAutoCompleteVarsGeneric(envVarProvider EnvVarProvider, block models.Block, store *models.Store, defaults []string) []string {
	keys := defaults
	keys = append(keys, utils.GetMapKeys(envVarProvider.GetEnvVars())...)

	keys = append(keys, utils.GetMapKeys(block.GetEnvVars())...)

	creds, err := store.ListCredentialsForEnv()

	if err == nil {
		tmp := utils.GetMapKeys(creds)
		keys = append(keys, tmp...)
	}

	keys = utils.RemoveDuplicates(keys)
	return keys
}

func getAutoCompleteVars(details *models.WebhookDetail, store *models.Store) []string {
	defaults := []string{
		"PAYLOAD_DATA",
		"FORM_{NAME}",
		"URL_PARAM_{NAME}",
		"HEADER_{HEADER_NAME}",
		"CRED_{CREDENTIAL_NAME}",
	}
	return getAutoCompleteVarsGeneric(&details.Webhook, details.Block, store, defaults)
}

func getAutoCompleteVarsPeriodic(details *models.PeriodicTaskDetail, store *models.Store) []string {
	defaults := []string{}
	return getAutoCompleteVarsGeneric(&details.PeriodicTask, details.Block, store, defaults)
}

func getPeriodicTaskHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		periodicTaskDetails, err := store.SelectPeriodicTaskDetailsById(intId)
		if err != nil {
			rflog.Error("failed to get periodic tasks", err)
			return
		}

		if cache["showCurlGenerator"] == nil {
			cache["showCurlGenerator"] = utils.IsCommandAvailable("curl")
		}

		variables := getAutoCompleteVarsPeriodic(periodicTaskDetails, store)

		editableComponentArgs := utils.ToMap(periodicTaskDetails.PeriodicTask)
		editableComponentArgs["Type"] = utils.PeriodicTaskEntity
		editableComponentArgs["Field"] = utils.DefaultString(periodicTaskDetails.PeriodicTask.Name, "No Name")
		c.HTML(http.StatusOK, "periodic_task", gin.H{
			"variables":               variables,
			"helperData":              buildCodeHelperData(utils.PeriodicTaskEntity, variables),
			"periodicTask":            periodicTaskDetails.PeriodicTask,
			"programType":             periodicTaskDetails.Program.ProgramType,
			"Type":                    utils.PeriodicTaskEntity,
			"fileContent":             utils.DefaultString(periodicTaskDetails.File.Content, "echo 'Hello World!'"),
			"editableComponentParams": editableComponentArgs,
			"currentUser":             getCurrentUser(c),
			"showCurlGenerator":       cache["showCurlGenerator"],
		})
	}
}

func createPageHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		blockId := parseInt(c.PostForm("blockId"))

		pageId, err := store.InsertPageWithAutoName(blockId)

		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}

		redirectTo := fmt.Sprintf("/pages/%d", pageId)
		c.Header("HX-Redirect", redirectTo)
		c.Status(http.StatusFound)
	}
}

func createPeriodicTaskHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		blockId := parseInt(c.PostForm("blockId"))

		periodicTaskId, err := store.InsertPeriodicTaskWithAutoName(blockId)

		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}

		redirectTo := fmt.Sprintf("/periodic_tasks/%d", periodicTaskId)
		c.Header("HX-Redirect", redirectTo)
		c.Status(http.StatusFound)
	}
}

func deleteHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		typeName := c.Param("type")
		intId := parseInt(id)

		if typeName == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "typeName is required"})
			return
		}

		switch typeName {
		case utils.BlockEntity:
			err := store.DeleteBlockById(intId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		case utils.WebhookEntity:
			err := store.DeleteWebhookById(intId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		case utils.PageEntity:
			err := store.DeletePageById(intId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		case utils.PeriodicTaskEntity:
			err := store.DeletePeriodicTaskById(intId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}
		default:
			c.JSON(http.StatusBadRequest, gin.H{"error": "typeName is invalid"})
			return
		}

		c.Status(http.StatusOK)
		c.String(200, utils.AlertBox(utils.Success, "Item deleted"))
	}
}

func updatePageHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		var pageData models.PageData

		if err := c.ShouldBindJSON(&pageData); err != nil {
			rflog.Error("failed to bind JSON", "error", err.Error())

			var errs []string
			if validationErrors, ok := err.(validator.ValidationErrors); ok {
				for _, err := range validationErrors {
					errs = append(errs, err.Field()+": "+err.ActualTag())
				}
			} else {
				errs = append(errs, err.Error())
			}
			c.JSON(http.StatusBadRequest, gin.H{"errors": errs})
			return
		}

		err := store.UpdatePageByID(intId, pageData)

		if err != nil {
			rflog.Error("failed to update page", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.Status(http.StatusOK)
	}
}

func pagesHandler(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		intId := parseInt(id)
		page, err := store.SelectPageById(intId)

		if err != nil {
			c.HTML(http.StatusInternalServerError, "error", gin.H{
				"error": err.Error(),
			})
			return
		}

		jsContent, cssContent := extractEditorAssets(page.HTMLOutput.String)

		c.HTML(http.StatusOK, "page", gin.H{
			"page":        page,
			"baseUrl":     config.BaseUrl(),
			"blockId":     page.BlockID,
			"js":          jsContent,
			"css":         cssContent,
			"currentUser": getCurrentUser(c),
		})
	}
}

var (
	// Use non-greedy (.*?) — previous (.-) was a Lua-style idea and literally matched a dot + hyphen, so no capture.
	reEditorScript = regexp.MustCompile(`(?is)<script[^>]*id=["']rfJsEditor["'][^>]*>(.*?)</script>`)
	reEditorStyle  = regexp.MustCompile(`(?is)<style[^>]*id=["']rfCssEditor["'][^>]*>(.*?)</style>`)
)

func extractEditorAssets(html string) (js, css string) {
	if m := reEditorScript.FindStringSubmatch(html); len(m) > 1 {
		js = strings.TrimSpace(m[1])
	}
	if m := reEditorStyle.FindStringSubmatch(html); len(m) > 1 {
		css = strings.TrimSpace(m[1])
	}
	return
}

func parseInt(s string) int64 {
	i, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return 0
	}
	return i
}
