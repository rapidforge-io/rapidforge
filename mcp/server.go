package mcp

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/rapidforge-io/rapidforge/models"
)

const protocolVersion = "2025-06-18"

type Server struct {
	store   *models.Store
	version string
}

type resource struct {
	URI         string `json:"uri"`
	Name        string `json:"name"`
	Description string `json:"description"`
	MimeType    string `json:"mimeType"`
}

type rpcRequest struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      json.RawMessage `json:"id,omitempty"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params,omitempty"`
}

type rpcResponse struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      json.RawMessage `json:"id,omitempty"`
	Result  any             `json:"result,omitempty"`
	Error   *rpcError       `json:"error,omitempty"`
}

type rpcError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type tool struct {
	Name        string         `json:"name"`
	Description string         `json:"description"`
	InputSchema map[string]any `json:"inputSchema"`
}

func NewServer(store *models.Store) *Server {
	return NewServerWithVersion(store, "unknown")
}

func NewServerWithVersion(store *models.Store, version string) *Server {
	return &Server{store: store, version: version}
}

func EnabledMiddleware(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		if !store.IsMCPEnabled() {
			c.JSON(http.StatusServiceUnavailable, gin.H{"error": "MCP server is disabled"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func BearerAuthMiddleware(store *models.Store) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		const bearerPrefix = "Bearer "
		if !strings.HasPrefix(authHeader, bearerPrefix) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "MCP bearer token required"})
			c.Abort()
			return
		}

		token, err := store.AuthenticateMCPToken(strings.TrimPrefix(authHeader, bearerPrefix))
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid MCP token"})
			c.Abort()
			return
		}

		c.Set("mcpToken", token)
		c.Next()
	}
}

func (s *Server) HandleHTTP(c *gin.Context) {
	if c.Request.Method == http.MethodGet {
		c.JSON(http.StatusOK, gin.H{
			"name":            "rapidforge",
			"protocolVersion": protocolVersion,
			"tools":           len(tools()),
			"resources":       len(resources()),
		})
		return
	}

	var raw json.RawMessage
	if err := c.ShouldBindJSON(&raw); err != nil {
		c.JSON(http.StatusBadRequest, rpcResponse{
			JSONRPC: "2.0",
			Error:   &rpcError{Code: -32700, Message: "Parse error"},
		})
		return
	}

	if len(raw) > 0 && raw[0] == '[' {
		var requests []rpcRequest
		if err := json.Unmarshal(raw, &requests); err != nil {
			c.JSON(http.StatusBadRequest, rpcResponse{JSONRPC: "2.0", Error: &rpcError{Code: -32700, Message: "Parse error"}})
			return
		}
		responses := make([]rpcResponse, 0, len(requests))
		for _, req := range requests {
			if len(req.ID) == 0 {
				_, _ = s.handleRequest(c, req)
				continue
			}
			res, _ := s.handleRequest(c, req)
			responses = append(responses, res)
		}
		c.JSON(http.StatusOK, responses)
		return
	}

	var req rpcRequest
	if err := json.Unmarshal(raw, &req); err != nil {
		c.JSON(http.StatusBadRequest, rpcResponse{JSONRPC: "2.0", Error: &rpcError{Code: -32700, Message: "Parse error"}})
		return
	}

	res, notification := s.handleRequest(c, req)
	if notification {
		c.Status(http.StatusAccepted)
		return
	}
	c.JSON(http.StatusOK, res)
}

func (s *Server) handleRequest(c *gin.Context, req rpcRequest) (rpcResponse, bool) {
	res := rpcResponse{JSONRPC: "2.0", ID: req.ID}
	notification := len(req.ID) == 0

	switch req.Method {
	case "initialize":
		res.Result = gin.H{
			"protocolVersion": protocolVersion,
			"capabilities": gin.H{
				"tools":     gin.H{},
				"resources": gin.H{},
			},
			"serverInfo": gin.H{
				"name":    "rapidforge",
				"version": s.version,
			},
			"instructions": systemInstructions,
		}
	case "notifications/initialized":
		return res, notification
	case "ping":
		res.Result = gin.H{}
	case "tools/list":
		res.Result = gin.H{"tools": tools()}
	case "tools/call":
		result, err := s.callTool(c, req.Params)
		if err != nil {
			res.Error = &rpcError{Code: -32602, Message: err.Error()}
		} else {
			res.Result = toolTextResult(result)
		}
	case "resources/list":
		res.Result = gin.H{"resources": resources()}
	case "resources/read":
		result, err := readResource(req.Params)
		if err != nil {
			res.Error = &rpcError{Code: -32602, Message: err.Error()}
		} else {
			res.Result = result
		}
	default:
		res.Error = &rpcError{Code: -32601, Message: "Method not found"}
	}

	return res, notification
}

func toolTextResult(value any) gin.H {
	bytes, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		bytes = []byte(fmt.Sprintf("%v", value))
	}
	return gin.H{
		"content": []gin.H{
			{
				"type": "text",
				"text": string(bytes),
			},
		},
	}
}

func resources() []resource {
	return []resource{
		{
			URI:         "rapidforge://script-runtime-helpers",
			Name:        "RapidForge script runtime helpers",
			Description: "Runtime variables and helper functions available to bash, Lua, and mRuby endpoint/cronjob scripts.",
			MimeType:    "text/markdown",
		},
		{
			URI:         "rapidforge://page-canvas-state",
			Name:        "RapidForge page canvas state",
			Description: "Canvas state shape used by the RapidForge drag-and-drop page editor.",
			MimeType:    "text/markdown",
		},
	}
}

func readResource(rawParams json.RawMessage) (any, error) {
	var params struct {
		URI string `json:"uri"`
	}
	if err := json.Unmarshal(rawParams, &params); err != nil {
		return nil, fmt.Errorf("invalid resource read params: %w", err)
	}

	text, ok := resourceText(params.URI)
	if !ok {
		return nil, fmt.Errorf("unknown resource %q", params.URI)
	}

	return gin.H{
		"contents": []gin.H{
			{
				"uri":      params.URI,
				"mimeType": "text/markdown",
				"text":     text,
			},
		},
	}, nil
}

func resourceText(uri string) (string, bool) {
	switch uri {
	case "rapidforge://script-runtime-helpers":
		return scriptRuntimeHelpersResource, true
	case "rapidforge://page-canvas-state":
		return pageCanvasStateResource, true
	default:
		return "", false
	}
}

func tools() []tool {
	return []tool{
		{
			Name:        "rapidforge_list_blocks",
			Description: "List RapidForge blocks. Use a blockId from this tool when creating pages, endpoints, or cronjobs.",
			InputSchema: objectSchema(map[string]any{}),
		},
		{
			Name:        "rapidforge_create_block",
			Description: "Create a RapidForge block to group related pages, endpoints, and cronjobs.",
			InputSchema: objectSchema(map[string]any{
				"name":        stringSchema("Block name."),
				"description": stringSchema("Optional block description."),
				"active":      boolSchema("Whether the block is active. Defaults to true."),
				"env":         stringMapSchema("Optional environment variables inherited by endpoints and cronjobs in this block."),
			}, "name"),
		},
		{
			Name:        "rapidforge_create_page",
			Description: "Create a dynamic RapidForge page. Read the rapidforge://page-canvas-state resource to learn the component tree schema. Prefer passing canvasState so the page is fully editable in the drag-and-drop editor. Only use htmlOutput as a fallback when a component tree is not suitable.",
			InputSchema: objectSchema(map[string]any{
				"blockId":     intSchema("Parent RapidForge block ID."),
				"name":        stringSchema("Page name/title."),
				"path":        stringSchema("Public page path, without /page/."),
				"description": stringSchema("Optional page description."),
				"canvasState": map[string]any{"type": "object", "description": "Drag-and-drop editor component tree. Read rapidforge://page-canvas-state for the TreeNode schema and available component names. Pass either the full stored tree (with a root field) or a root TreeNode and RapidForge will wrap it. Preferred over htmlOutput."},
				"htmlOutput":  stringSchema("Rendered HTML body to serve for this page. Use only when canvasState is not suitable."),
				"active":      boolSchema("Whether the page is active. Defaults to true."),
				"protected":   boolSchema("Whether the public page requires RapidForge login."),
			}, "blockId", "path"),
		},
		{
			Name:        "rapidforge_create_endpoint",
			Description: "Create a working RapidForge HTTP endpoint. Before writing any code, read the rapidforge://script-runtime-helpers resource — it documents the exact env var names for form fields (FORM_{NAME}), query params (URL_PARAM_{NAME}), headers (HEADER_{NAME}), credentials (CRED_{NAME}), and all per-runtime helper functions for bash, Lua, and mRuby. The script stdout becomes the HTTP response body.",
			InputSchema: objectSchema(map[string]any{
				"blockId":         intSchema("Parent RapidForge block ID."),
				"name":            stringSchema("Endpoint name."),
				"description":     stringSchema("Optional endpoint description."),
				"path":            stringSchema("Endpoint path, without /webhook/."),
				"method":          enumSchema("HTTP method.", []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}),
				"programType":     enumSchema("Script runtime.", []string{"bash", "lua", "mruby"}),
				"code":            stringSchema("Business logic script. Print to stdout to set the HTTP response body."),
				"env":             stringMapSchema("Optional endpoint-specific environment variables."),
				"responseHeaders": stringMapSchema("Optional response headers, e.g. Content-Type=application/json."),
				"cors":            arrayStringSchema("Optional allowed CORS origins. Use * to allow all."),
				"exitHttpPair":    objectNumberSchema("Optional exit-code to HTTP-status mapping, e.g. {\"0\": 200, \"1\": 500}."),
				"active":          boolSchema("Whether the endpoint is active. Defaults to true."),
			}, "blockId", "path", "method", "programType", "code"),
		},
		{
			Name:        "rapidforge_create_cronjob",
			Description: "Create a working RapidForge scheduled task. The code field is the cronjob business logic in bash, lua, or mruby.",
			InputSchema: objectSchema(map[string]any{
				"blockId":     intSchema("Parent RapidForge block ID."),
				"name":        stringSchema("Cronjob name."),
				"description": stringSchema("Optional cronjob description."),
				"cron":        stringSchema("Cron expression."),
				"programType": enumSchema("Script runtime.", []string{"bash", "lua", "mruby"}),
				"code":        stringSchema("Business logic script."),
				"env":         stringMapSchema("Optional cronjob-specific environment variables."),
				"active":      boolSchema("Whether the cronjob is active. Defaults to true."),
			}, "blockId", "cron", "programType", "code"),
		},
	}
}

func objectSchema(properties map[string]any, required ...string) map[string]any {
	return map[string]any{
		"type":                 "object",
		"properties":           properties,
		"required":             required,
		"additionalProperties": false,
	}
}

func stringSchema(description string) map[string]any {
	return map[string]any{"type": "string", "description": description}
}

func boolSchema(description string) map[string]any {
	return map[string]any{"type": "boolean", "description": description}
}

func intSchema(description string) map[string]any {
	return map[string]any{"type": "integer", "description": description}
}

func enumSchema(description string, values []string) map[string]any {
	return map[string]any{"type": "string", "description": description, "enum": values}
}

func stringMapSchema(description string) map[string]any {
	return map[string]any{
		"type":                 "object",
		"description":          description,
		"additionalProperties": map[string]any{"type": "string"},
	}
}

func arrayStringSchema(description string) map[string]any {
	return map[string]any{
		"type":        "array",
		"description": description,
		"items":       map[string]any{"type": "string"},
	}
}

func objectNumberSchema(description string) map[string]any {
	return map[string]any{
		"type":                 "object",
		"description":          description,
		"additionalProperties": map[string]any{"type": "integer"},
	}
}

func (s *Server) callTool(c *gin.Context, rawParams json.RawMessage) (any, error) {
	var params struct {
		Name      string          `json:"name"`
		Arguments json.RawMessage `json:"arguments"`
	}
	if err := json.Unmarshal(rawParams, &params); err != nil {
		return nil, fmt.Errorf("invalid tool call params: %w", err)
	}

	switch params.Name {
	case "rapidforge_list_blocks":
		return s.listBlocks(c)
	case "rapidforge_create_block":
		return s.createBlock(c, params.Arguments)
	case "rapidforge_create_page":
		return s.createPage(c, params.Arguments)
	case "rapidforge_create_endpoint":
		return s.createEndpoint(c, params.Arguments)
	case "rapidforge_create_cronjob":
		return s.createCronjob(c, params.Arguments)
	default:
		return nil, fmt.Errorf("unknown tool %q", params.Name)
	}
}

func requireScope(c *gin.Context, scope string) error {
	token, ok := c.Get("mcpToken")
	if !ok {
		return fmt.Errorf("missing MCP token context")
	}
	mcpToken, ok := token.(*models.MCPToken)
	if !ok {
		return fmt.Errorf("invalid MCP token context")
	}
	if !mcpToken.HasScope(scope) {
		return fmt.Errorf("MCP token missing required scope %s", scope)
	}
	return nil
}

func (s *Server) listBlocks(c *gin.Context) (any, error) {
	if err := requireScope(c, "blocks:read"); err != nil {
		return nil, err
	}
	blocks, err := s.store.ListBlocks()
	if err != nil {
		return nil, err
	}
	return gin.H{"blocks": blocks}, nil
}

func (s *Server) createBlock(c *gin.Context, raw json.RawMessage) (any, error) {
	if err := requireScope(c, "blocks:write"); err != nil {
		return nil, err
	}
	var args struct {
		Name        string            `json:"name"`
		Description string            `json:"description"`
		Active      *bool             `json:"active"`
		Env         map[string]string `json:"env"`
	}
	if err := json.Unmarshal(raw, &args); err != nil {
		return nil, err
	}
	active := defaultTrue(args.Active)
	id, err := s.store.CreateBlockFromSpec(models.BlockSpec{
		Name:         args.Name,
		Description:  args.Description,
		Active:       active,
		EnvVariables: keyValueLines(args.Env),
	})
	if err != nil {
		return nil, err
	}
	return gin.H{"blockId": id, "editUrl": fmt.Sprintf("/blocks/%d", id)}, nil
}

func (s *Server) createPage(c *gin.Context, raw json.RawMessage) (any, error) {
	if err := requireScope(c, "pages:write"); err != nil {
		return nil, err
	}
	var args struct {
		BlockID     int64          `json:"blockId"`
		Name        string         `json:"name"`
		Path        string         `json:"path"`
		Description string         `json:"description"`
		CanvasState map[string]any `json:"canvasState"`
		HTMLOutput  string         `json:"htmlOutput"`
		Active      *bool          `json:"active"`
		Protected   bool           `json:"protected"`
	}
	if err := json.Unmarshal(raw, &args); err != nil {
		return nil, err
	}
	id, err := s.store.CreatePageFromSpec(models.PageSpec{
		BlockID:     args.BlockID,
		Name:        args.Name,
		Path:        args.Path,
		Description: args.Description,
		CanvasState: args.CanvasState,
		HTMLOutput:  args.HTMLOutput,
		Active:      defaultTrue(args.Active),
		Protected:   args.Protected,
	})
	if err != nil {
		return nil, err
	}
	return gin.H{
		"pageId":    id,
		"publicUrl": models.PublicPageURL(args.Path),
		"editUrl":   fmt.Sprintf("/pages/%d", id),
	}, nil
}

func (s *Server) createEndpoint(c *gin.Context, raw json.RawMessage) (any, error) {
	if err := requireScope(c, "webhooks:write"); err != nil {
		return nil, err
	}
	var args struct {
		BlockID         int64             `json:"blockId"`
		Name            string            `json:"name"`
		Description     string            `json:"description"`
		Path            string            `json:"path"`
		Method          string            `json:"method"`
		ProgramType     string            `json:"programType"`
		Code            string            `json:"code"`
		Env             map[string]string `json:"env"`
		ResponseHeaders map[string]string `json:"responseHeaders"`
		Cors            []string          `json:"cors"`
		ExitHTTPPair    map[string]int    `json:"exitHttpPair"`
		Active          *bool             `json:"active"`
	}
	if err := json.Unmarshal(raw, &args); err != nil {
		return nil, err
	}
	id, err := s.store.CreateEndpointFromSpec(models.EndpointSpec{
		BlockID:         args.BlockID,
		Name:            args.Name,
		Description:     args.Description,
		Path:            args.Path,
		HTTPMethod:      args.Method,
		ProgramType:     args.ProgramType,
		Code:            args.Code,
		EnvVariables:    keyValueLines(args.Env),
		ResponseHeaders: keyValueLines(args.ResponseHeaders),
		Cors:            strings.Join(args.Cors, "\n"),
		ExitHTTPPair:    exitHTTPPair(args.ExitHTTPPair),
		Active:          defaultTrue(args.Active),
	})
	if err != nil {
		return nil, err
	}
	return gin.H{
		"endpointId": id,
		"publicUrl":  models.PublicWebhookURL(args.Path),
		"editUrl":    fmt.Sprintf("/webhooks/%d", id),
		"body":       "The endpoint response body is produced by the script stdout.",
	}, nil
}

func (s *Server) createCronjob(c *gin.Context, raw json.RawMessage) (any, error) {
	if err := requireScope(c, "cronjobs:write"); err != nil {
		return nil, err
	}
	var args struct {
		BlockID     int64             `json:"blockId"`
		Name        string            `json:"name"`
		Description string            `json:"description"`
		Cron        string            `json:"cron"`
		ProgramType string            `json:"programType"`
		Code        string            `json:"code"`
		Env         map[string]string `json:"env"`
		Active      *bool             `json:"active"`
	}
	if err := json.Unmarshal(raw, &args); err != nil {
		return nil, err
	}
	id, err := s.store.CreateCronjobFromSpec(models.CronjobSpec{
		BlockID:      args.BlockID,
		Name:         args.Name,
		Description:  args.Description,
		Cron:         args.Cron,
		ProgramType:  args.ProgramType,
		Code:         args.Code,
		EnvVariables: keyValueLines(args.Env),
		Active:       defaultTrue(args.Active),
	})
	if err != nil {
		return nil, err
	}
	return gin.H{"cronjobId": id, "editUrl": fmt.Sprintf("/periodic_tasks/%d", id)}, nil
}

func defaultTrue(value *bool) bool {
	if value == nil {
		return true
	}
	return *value
}

func keyValueLines(values map[string]string) string {
	if len(values) == 0 {
		return ""
	}
	keys := make([]string, 0, len(values))
	for key := range values {
		keys = append(keys, key)
	}
	sort.Strings(keys)
	lines := make([]string, 0, len(keys))
	for _, key := range keys {
		if strings.TrimSpace(key) == "" {
			continue
		}
		lines = append(lines, key+"="+values[key])
	}
	return strings.Join(lines, "\n")
}

func exitHTTPPair(values map[string]int) string {
	if len(values) == 0 {
		return ""
	}
	keys := make([]int, 0, len(values))
	for key := range values {
		parsed, err := strconv.Atoi(key)
		if err == nil {
			keys = append(keys, parsed)
		}
	}
	sort.Ints(keys)
	pairs := make([]string, 0, len(keys))
	for _, key := range keys {
		pairs = append(pairs, fmt.Sprintf("%d=%d", key, values[strconv.Itoa(key)]))
	}
	return strings.Join(pairs, ";")
}
