package models

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/adhocore/gronx"
	"github.com/rapidforge-io/rapidforge/config"
	"github.com/rapidforge-io/rapidforge/utils"
	"golang.org/x/crypto/bcrypt"
)

const mcpTokenPrefixLength = 16
const MCPEnabledSetting = "mcp.enabled"

type MCPToken struct {
	ID          int64          `json:"id" db:"id"`
	Name        string         `json:"name" db:"name"`
	TokenHash   string         `json:"-" db:"token_hash"`
	TokenPrefix string         `json:"tokenPrefix" db:"token_prefix"`
	Scopes      string         `json:"scopes" db:"scopes"`
	CreatedBy   sql.NullInt64  `json:"createdBy" db:"created_by"`
	CreatedAt   time.Time      `json:"createdAt" db:"created_at"`
	LastUsedAt  sql.NullTime   `json:"lastUsedAt" db:"last_used_at"`
	RevokedAt   sql.NullTime   `json:"revokedAt" db:"revoked_at"`
	CreatorName sql.NullString `json:"creatorName" db:"creator_name"`
}

type CreateMCPTokenResult struct {
	Token  MCPToken
	Secret string
}

var DefaultMCPScopes = []string{
	"blocks:read",
	"blocks:write",
	"pages:write",
	"webhooks:write",
	"cronjobs:write",
	"events:read",
}

func GenerateMCPTokenSecret() (string, error) {
	random, err := utils.GenerateRandomString(24)
	if err != nil {
		return "", err
	}
	return "rf_mcp_" + random, nil
}

func mcpTokenPrefix(token string) string {
	if len(token) <= mcpTokenPrefixLength {
		return token
	}
	return token[:mcpTokenPrefixLength]
}

func NormalizeMCPScopes(scopes []string) string {
	if len(scopes) == 0 {
		scopes = DefaultMCPScopes
	}

	seen := map[string]bool{}
	normalized := []string{}
	for _, scope := range scopes {
		scope = strings.TrimSpace(scope)
		if scope == "" || seen[scope] {
			continue
		}
		seen[scope] = true
		normalized = append(normalized, scope)
	}
	return strings.Join(normalized, ",")
}

func (t MCPToken) HasScope(scope string) bool {
	for _, candidate := range strings.Split(t.Scopes, ",") {
		if strings.TrimSpace(candidate) == scope {
			return true
		}
	}
	return false
}

func (s *Store) IsMCPEnabled() bool {
	return strings.EqualFold(s.GetConfigByKeyDefault(MCPEnabledSetting, "false"), "true")
}

func (s *Store) SetMCPEnabled(enabled bool) error {
	value := "false"
	if enabled {
		value = "true"
	}
	return s.UpsertSetting(MCPEnabledSetting, value)
}

func (s *Store) CreateMCPToken(name string, scopes []string, createdBy int64) (*CreateMCPTokenResult, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		name = "MCP token"
	}

	secret, err := GenerateMCPTokenSecret()
	if err != nil {
		return nil, err
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(secret), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	scopeString := NormalizeMCPScopes(scopes)
	result, err := s.db.Exec(
		`INSERT INTO mcp_tokens (name, token_hash, token_prefix, scopes, created_by) VALUES (?, ?, ?, ?, ?)`,
		name,
		string(hash),
		mcpTokenPrefix(secret),
		scopeString,
		createdBy,
	)
	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	token := MCPToken{
		ID:          id,
		Name:        name,
		TokenPrefix: mcpTokenPrefix(secret),
		Scopes:      scopeString,
		CreatedBy:   sql.NullInt64{Int64: createdBy, Valid: createdBy > 0},
	}

	return &CreateMCPTokenResult{Token: token, Secret: secret}, nil
}

func (s *Store) ListMCPTokens() ([]MCPToken, error) {
	var tokens []MCPToken
	query := `
		SELECT
			mt.id, mt.name, mt.token_hash, mt.token_prefix, mt.scopes, mt.created_by,
			mt.created_at, mt.last_used_at, mt.revoked_at,
			u.username AS creator_name
		FROM mcp_tokens mt
		LEFT JOIN users u ON u.id = mt.created_by
		ORDER BY mt.created_at DESC`
	err := s.db.Select(&tokens, query)
	return tokens, err
}

func (s *Store) RevokeMCPToken(id int64) error {
	_, err := s.db.Exec(`UPDATE mcp_tokens SET revoked_at = ? WHERE id = ?`, time.Now().UTC(), id)
	return err
}

func (s *Store) AuthenticateMCPToken(secret string) (*MCPToken, error) {
	secret = strings.TrimSpace(secret)
	if secret == "" {
		return nil, errors.New("missing MCP token")
	}

	var tokens []MCPToken
	err := s.db.Select(&tokens, `SELECT * FROM mcp_tokens WHERE token_prefix = ? AND revoked_at IS NULL`, mcpTokenPrefix(secret))
	if err != nil {
		return nil, err
	}

	for _, token := range tokens {
		if bcrypt.CompareHashAndPassword([]byte(token.TokenHash), []byte(secret)) == nil {
			_, _ = s.db.Exec(`UPDATE mcp_tokens SET last_used_at = ? WHERE id = ?`, time.Now().UTC(), token.ID)
			return &token, nil
		}
	}

	return nil, errors.New("invalid MCP token")
}

type BlockSpec struct {
	Name         string
	Description  string
	Active       bool
	EnvVariables string
}

type PageSpec struct {
	BlockID     int64
	Name        string
	Path        string
	Description string
	Active      bool
	Protected   bool
	CanvasState map[string]any
	HTMLOutput  string
}

type EndpointSpec struct {
	BlockID          int64
	Name             string
	Description      string
	Path             string
	HTTPMethod       string
	ProgramType      string
	Code             string
	EnvVariables     string
	Cors             string
	ResponseHeaders  string
	ExitHTTPPair     string
	AuthConfig       string
	Active           bool
	OnFailScript     string
	OnFailScriptType string
	OnFailEnabled    bool
}

type CronjobSpec struct {
	BlockID          int64
	Name             string
	Description      string
	Cron             string
	ProgramType      string
	Code             string
	EnvVariables     string
	Active           bool
	OnFailScript     string
	OnFailScriptType string
	OnFailEnabled    bool
}

func normalizeEntityPath(path string) string {
	path = strings.TrimSpace(path)
	path = strings.TrimPrefix(path, "/webhook/")
	path = strings.TrimPrefix(path, "webhook/")
	path = strings.TrimPrefix(path, "/page/")
	path = strings.TrimPrefix(path, "page/")
	path = strings.TrimPrefix(path, "/")
	return path
}

func normalizeProgramType(programType string) string {
	programType = strings.ToLower(strings.TrimSpace(programType))
	switch programType {
	case "bash", "lua", "mruby":
		return programType
	default:
		return "bash"
	}
}

func defaultPageCanvasState() map[string]any {
	return map[string]any{
		"version": pagesVersion,
		"root": map[string]any{
			"id":            "dropzone",
			"componentName": "CanvasDropZone",
			"children":      []any{},
			"active":        false,
			"editableProps": map[string]any{
				"style": map[string]any{
					"backgroundColor": "",
					"width":           "100%",
				},
				"classes": "",
			},
		},
	}
}

func normalizePageCanvasState(canvasState map[string]any) map[string]any {
	if len(canvasState) == 0 {
		return defaultPageCanvasState()
	}

	if _, ok := canvasState["root"]; ok {
		canvasState["version"] = pagesVersion
		return canvasState
	}

	return map[string]any{
		"version": pagesVersion,
		"root":    canvasState,
	}
}

func normalizeHTTPMethod(method string) string {
	method = strings.ToUpper(strings.TrimSpace(method))
	switch method {
	case "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS":
		return method
	default:
		return "POST"
	}
}

func (s *Store) CreateBlockFromSpec(spec BlockSpec) (int64, error) {
	name := strings.TrimSpace(spec.Name)
	if name == "" {
		return s.InsertBlockWithAutoName(spec.Description, spec.Active)
	}

	result, err := s.InsertBlock(Block{
		Name:         name,
		Description:  spec.Description,
		Active:       spec.Active,
		EnvVariables: sql.NullString{String: spec.EnvVariables, Valid: spec.EnvVariables != ""},
		CreatedAt:    time.Now().UTC(),
	})
	if err != nil {
		return -1, err
	}
	return result.LastInsertId()
}

func (s *Store) CreatePageFromSpec(spec PageSpec) (int64, error) {
	if spec.BlockID <= 0 {
		return -1, errors.New("blockId is required")
	}
	path := normalizeEntityPath(spec.Path)
	if path == "" {
		return -1, errors.New("path is required")
	}
	name := strings.TrimSpace(spec.Name)
	if name == "" {
		name = path
	}
	canvasState := normalizePageCanvasState(spec.CanvasState)
	canvasJSON, err := json.Marshal(canvasState)
	if err != nil {
		return -1, fmt.Errorf("invalid canvas state: %w", err)
	}

	result, err := s.db.Exec(
		`INSERT INTO pages (name, path, description, active, protected, block_id, canvas_state, html_output, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		name,
		path,
		spec.Description,
		spec.Active,
		spec.Protected,
		spec.BlockID,
		string(canvasJSON),
		spec.HTMLOutput,
		time.Now().UTC(),
	)
	if err != nil {
		return -1, err
	}
	return result.LastInsertId()
}

func (s *Store) CreateEndpointFromSpec(spec EndpointSpec) (int64, error) {
	if spec.BlockID <= 0 {
		return -1, errors.New("blockId is required")
	}
	path := normalizeEntityPath(spec.Path)
	if path == "" {
		return -1, errors.New("path is required")
	}
	name := strings.TrimSpace(spec.Name)
	if name == "" {
		name = path
	}
	programType := normalizeProgramType(spec.ProgramType)
	httpMethod := normalizeHTTPMethod(spec.HTTPMethod)
	exitHTTPPair := strings.TrimSpace(spec.ExitHTTPPair)
	if exitHTTPPair == "" {
		exitHTTPPair = "0=200;1=500"
	}

	tx, err := s.db.BeginImmediateTransaction()
	if err != nil {
		return -1, err
	}
	defer tx.Rollback()

	result, err := tx.Exec(`INSERT INTO programs (name, type, created_at) VALUES (?, ?, ?)`, name+" program", programType, time.Now().UTC())
	if err != nil {
		return -1, err
	}
	programID, err := result.LastInsertId()
	if err != nil {
		return -1, err
	}
	_, err = tx.Exec(`INSERT INTO files (program_id, filename, content, created_at) VALUES (?, ?, ?, ?)`, programID, "main", spec.Code, time.Now().UTC())
	if err != nil {
		return -1, err
	}

	result, err = tx.Exec(
		`INSERT INTO webhooks (
			name, description, active, env_variables, block_id, path, cors, http_method,
			response_headers, exit_http_pair, auth_config, on_fail_script, on_fail_script_type,
			on_fail_enabled, program_id
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		name,
		spec.Description,
		spec.Active,
		spec.EnvVariables,
		spec.BlockID,
		path,
		spec.Cors,
		httpMethod,
		spec.ResponseHeaders,
		exitHTTPPair,
		spec.AuthConfig,
		spec.OnFailScript,
		normalizeProgramType(spec.OnFailScriptType),
		spec.OnFailEnabled,
		programID,
	)
	if err != nil {
		return -1, err
	}
	if err := tx.Commit(); err != nil {
		return -1, err
	}
	return result.LastInsertId()
}

func (s *Store) CreateCronjobFromSpec(spec CronjobSpec) (int64, error) {
	if spec.BlockID <= 0 {
		return -1, errors.New("blockId is required")
	}
	cron := strings.TrimSpace(spec.Cron)
	if cron == "" {
		return -1, errors.New("cron is required")
	}
	nextRunAt, err := gronx.NextTickAfter(cron, time.Now().UTC(), false)
	if err != nil {
		return -1, fmt.Errorf("invalid cron: %w", err)
	}
	name := strings.TrimSpace(spec.Name)
	if name == "" {
		name = "cronjob " + strconv.FormatInt(time.Now().Unix(), 10)
	}
	programType := normalizeProgramType(spec.ProgramType)

	tx, err := s.db.BeginImmediateTransaction()
	if err != nil {
		return -1, err
	}
	defer tx.Rollback()

	result, err := tx.Exec(`INSERT INTO programs (name, type, created_at) VALUES (?, ?, ?)`, name+" program", programType, time.Now().UTC())
	if err != nil {
		return -1, err
	}
	programID, err := result.LastInsertId()
	if err != nil {
		return -1, err
	}
	_, err = tx.Exec(`INSERT INTO files (program_id, filename, content, created_at) VALUES (?, ?, ?, ?)`, programID, "main", spec.Code, time.Now().UTC())
	if err != nil {
		return -1, err
	}

	result, err = tx.Exec(
		`INSERT INTO periodic_tasks (
			name, description, active, env_variables, block_id, program_id, cron, next_run_at,
			on_fail_script, on_fail_script_type, on_fail_enabled
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		name,
		spec.Description,
		spec.Active,
		spec.EnvVariables,
		spec.BlockID,
		programID,
		cron,
		nextRunAt,
		spec.OnFailScript,
		normalizeProgramType(spec.OnFailScriptType),
		spec.OnFailEnabled,
	)
	if err != nil {
		return -1, err
	}
	if err := tx.Commit(); err != nil {
		return -1, err
	}
	return result.LastInsertId()
}

func PublicPageURL(path string) string {
	return config.BaseUrl() + "/page/" + normalizeEntityPath(path)
}

func PublicWebhookURL(path string) string {
	return config.BaseUrl() + "/webhook/" + normalizeEntityPath(path)
}
