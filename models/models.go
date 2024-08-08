package models

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/rapidforge-io/rapidforge/database"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/utils"
)

type User struct {
	ID           int64          `json:"id" db:"id"`
	Username     string         `json:"username" db:"username"`
	PasswordHash string         `json:"passwordHash" db:"password_hash"`
	Email        sql.NullString `json:"email" db:"email"`
	Settings     sql.NullString `json:"settings" db:"settings"`
	Role         string         `json:"role" db:"role"`
	CreatedAt    time.Time      `json:"createdAt" db:"created_at"`
	UpdatedAt    time.Time      `json:"updatedAt" db:"updated_at"`
}

type Block struct {
	ID           int64          `json:"id" db:"id"`
	Name         string         `json:"name" db:"name"`
	Description  string         `json:"description" db:"description"`
	Active       bool           `json:"active" db:"active"`
	EnvVariables sql.NullString `json:"envVariables" db:"env_variables"`
	CreatedAt    time.Time      `json:"createdAt" db:"created_at"`
}

type Program struct {
	ID        int64     `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
}

type File struct {
	ID        int64     `json:"id" db:"id"`
	ProgramID int       `json:"programId" db:"program_id"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	Filename  string    `json:"filename" db:"filename"`
	Content   string    `json:"content" db:"content"`
}

type Webhook struct {
	ID              int64          `json:"id" db:"id"`
	Name            sql.NullString `json:"name" db:"name"`
	Description     sql.NullString `json:"description" db:"description"`
	Active          bool           `json:"active" db:"active"`
	EnvVariables    sql.NullString `json:"envVariables" db:"env_variables"`
	BlockID         int            `json:"blockId" db:"block_id"`
	Path            string         `json:"path" db:"path"`
	Cors            sql.NullString `json:"cors" db:"cors"`
	HttpMethod      string         `json:"httpMethod" db:"http_method"`
	ResponseHeaders sql.NullString `json:"responseHeaders" db:"response_headers"`
	ExitHttpPair    sql.NullString `json:"exitHttpPair" db:"exit_http_pair"`
	CreatedAt       time.Time      `json:"createdAt" db:"created_at"`
	ProgramID       int            `json:"programId" db:"program_id"`
}

func getEnvVars(envVars sql.NullString) map[string]string {
	envVarsMap := map[string]string{}

	if envVars.String == "" {
		return envVarsMap
	}

	pairs := strings.Split(envVars.String, "\n")

	if len(pairs) == 0 {
		return envVarsMap
	}

	for _, pair := range pairs {
		parts := strings.Split(pair, "=")
		envVarsMap[parts[0]] = parts[1]
	}

	return envVarsMap
}

func (w *Webhook) GetEnvVars() map[string]string {
	return getEnvVars(w.EnvVariables)
}

func (w *Block) GetEnvVars() map[string]string {
	return getEnvVars(w.EnvVariables)
}

func (w *PeriodicTask) GetEnvVars() map[string]string {
	return getEnvVars(w.EnvVariables)
}

func (w *Webhook) GetExitHttpPair() map[int]int {
	envVars := map[int]int{}

	if w.ExitHttpPair.String == "" {
		return envVars
	}

	pairs := strings.Split(w.ExitHttpPair.String, ";")

	if len(pairs) == 0 {
		return envVars
	}

	for _, pair := range pairs {
		parts := strings.Split(pair, "=")
		key := utils.ParseInt(parts[0])
		val := utils.ParseInt(parts[1])

		if key == 0 && val == 0 {
			continue
		}

		envVars[key] = val
	}

	return envVars
}

// Custom type to handle JSON unmarshalling
type JSONRawString map[string]any

// Implement the sql.Scanner interface for JSONRawString
func (j *JSONRawString) Scan(value interface{}) error {
	if value == nil {
		j = nil
		return nil
	}
	str, ok := value.(string)
	if !ok {
		return fmt.Errorf("type assertion to string failed")
	}
	err := json.Unmarshal([]byte(str), &j)
	if err != nil {
		return err
	}
	return nil
}

// Implement the driver.Valuer interface for JSONRawString
func (j JSONRawString) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	bytes, err := json.Marshal(j)
	if err != nil {
		return nil, err
	}
	return string(bytes), nil
}

type Page struct {
	ID          int64          `json:"id" db:"id"`
	Path        string         `json:"path" db:"path"`
	Name        sql.NullString `json:"name" db:"name"`
	Description sql.NullString `json:"description" db:"description"`
	Active      bool           `json:"active" db:"active"`
	BlockID     int            `json:"blockId" db:"block_id"`
	CanvasState JSONRawString  `json:"canvas_state" db:"canvas_state"`
	HTMLOutput  sql.NullString `json:"htmlOutput" db:"html_output"`
	CreatedAt   time.Time      `json:"createdAt" db:"created_at"`
	UpdatedAt   time.Time      `json:"updatedAt" db:"updated_at"`
}

type PeriodicTask struct {
	ID           int64          `json:"id" db:"id"`
	Name         sql.NullString `json:"name" db:"name"`
	Description  sql.NullString `json:"description" db:"description"`
	Active       bool           `json:"active" db:"active"`
	EnvVariables sql.NullString `json:"envVariables" db:"env_variables"`
	BlockID      int            `json:"blockId" db:"block_id"`
	ProgramID    int            `json:"programId" db:"program_id"`
	Timezone     string         `json:"timezone" db:"timezone"`
	Cron         string         `json:"cron" db:"cron"`
	NextRunAt    time.Time      `json:"nextRunAt" db:"next_run_at"`
	CreatedAt    time.Time      `json:"createdAt" db:"created_at"`
	UpdatedAt    time.Time      `json:"updatedAt" db:"updated_at"`
}

// -----------------------------------------------------------------------------

type WebhookFormData struct {
	ExitCodes         []string `form:"exitCode[]" binding:"dive"`
	HTTPResponseCodes []string `form:"httpResponseCode[]" binding:"dive"`
	Name              string   `form:"name"`
	Description       string   `form:"description"`
	Env               string   `form:"env"`
	Active            bool     `form:"active" `
	FileContent       string   `form:"editor" `
	HttpVerb          string   `form:"httpVerb" `
	Cors              string   `form:"cors" `
	Code              string   `form:"editor"`
}

type PeriodicTaskFormData struct {
	Name        string `form:"name"`
	Description string `form:"description"`
	Env         string `form:"env"`
	Active      bool   `form:"active" `
	FileContent string `form:"editor" `
	Cron        string `form:"cron" validate:"cron"`
	Code        string `form:"editor"`
}

type Store struct {
	db *database.DbCon
}

func NewModel(db *database.DbCon) *Store {
	return &Store{
		db: db,
	}
}

func (s *Store) InsertBlock(block Block) (sql.Result, error) {
	query := `INSERT INTO blocks (name, description, active, env_variables, created_at) VALUES (?, ?, ?, ?, ?)`
	result, err := s.db.Exec(query, block.Name, block.Description, block.Active, block.EnvVariables, block.CreatedAt)
	return result, err
}

func (s *Store) ListBlocks() ([]Block, error) {
	var blocks []Block
	query := `SELECT id, name, description, active, env_variables, created_at FROM blocks`
	err := s.db.Select(&blocks, query)
	if err != nil {
		return nil, err
	}
	return blocks, nil
}

func (s *Store) SearchBlocks(query string) ([]Block, error) {
	var blocks []Block
	searchQuery := `SELECT id, name, description, active, env_variables, created_at FROM blocks WHERE name LIKE ? OR description LIKE ?`
	searchTerm := "%" + query + "%"
	err := s.db.Select(&blocks, searchQuery, searchTerm, searchTerm)
	if err != nil {
		return nil, err
	}
	return blocks, nil
}

func (s *Store) SearchPages(blockID int64, query string) ([]Page, error) {
	var pages []Page
	searchQuery := `SELECT * FROM pages WHERE block_id = ? AND (name LIKE ? OR description LIKE ?)`
	searchTerm := "%" + query + "%"
	err := s.db.Select(&pages, searchQuery, blockID, searchTerm, searchTerm)
	if err != nil {
		return nil, err
	}
	return pages, nil
}

func (s *Store) SearchPeriodicTasks(blockID int64, query string) ([]PeriodicTask, error) {
	var tasks []PeriodicTask
	searchQuery := `SELECT * FROM periodic_tasks WHERE block_id = ? AND (name LIKE ? OR description LIKE ?)`
	searchTerm := "%" + query + "%"
	err := s.db.Select(&tasks, searchQuery, blockID, searchTerm, searchTerm)
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (s *Store) SearchWebhooks(blockID int64, query string) ([]Webhook, error) {
	var webhooks []Webhook
	searchQuery := `SELECT * FROM webhooks WHERE block_id = ? AND (name LIKE ? OR description LIKE ?)`
	searchTerm := "%" + query + "%"
	err := s.db.Select(&webhooks, searchQuery, blockID, searchTerm, searchTerm)
	if err != nil {
		return nil, err
	}
	return webhooks, nil
}

func (s *Store) InsertPeriodicTaskWithAutoName(blockID int64) (int64, error) {
	tx, err := s.db.Begin()
	if err != nil {
		rflog.Error("failed to begin transaction", err)
		return -1, err
	}

	// Create program with default name "periodicProgram"
	programName := "periodicProgram"
	programQuery := `INSERT INTO programs (name, created_at) VALUES (?, ?)`
	programCreatedAt := time.Now().UTC()
	result, err := tx.Exec(programQuery, programName, programCreatedAt)
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to insert program", err)
		return -1, err
	}
	programID, err := result.LastInsertId()
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to get last insert id for program", err)
		return -1, err
	}

	// Create file with default values
	fileQuery := `INSERT INTO files (program_id, filename, content, created_at) VALUES (?, ?, ?, ?)`
	fileCreatedAt := time.Now().UTC()
	_, err = tx.Exec(fileQuery, programID, "main", "", fileCreatedAt)
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to insert file", err)
		return -1, err
	}

	// Determine new periodic task name
	var maxID int
	err = tx.QueryRow("SELECT COALESCE(MAX(id), 0) FROM periodic_tasks").Scan(&maxID)
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to get max id", err)
		return -1, err
	}
	newTaskName := fmt.Sprintf("periodicTask - %d", maxID+1)

	// Create periodic task
	periodicTaskQuery := `INSERT INTO periodic_tasks (name, block_id, program_id, cron, next_run_at) VALUES (?, ?, ?, ?, ?)`
	nextRunAt := time.Now().UTC().Add(5 * time.Minute)
	cron := "*/5 * * * *" // every 5 minutes
	result, err = tx.Exec(periodicTaskQuery, newTaskName, blockID, programID, cron, nextRunAt)
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to insert periodic task", err)
		return -1, err
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		rflog.Error("failed to commit transaction", err)
		return -1, err
	}

	taskId, _ := result.LastInsertId()

	return taskId, nil
}

func (s *Store) InsertWebhookWithAutoName(blockID int64) (int64, error) {
	tx, err := s.db.Begin()
	if err != nil {
		rflog.Error("failed to begin transaction", err)
		return -1, err
	}

	// Create program with default name "bashProgram"
	programName := "bashProgram"
	programQuery := `INSERT INTO programs (name, created_at) VALUES (?, ?)`
	programCreatedAt := time.Now().UTC()
	result, err := tx.Exec(programQuery, programName, programCreatedAt)
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to insert program", err)
		return -1, err
	}
	programID, err := result.LastInsertId()
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to get last insert id for program", err)
		return -1, err
	}

	// Create file with default values
	fileQuery := `INSERT INTO files (program_id, filename, content, created_at) VALUES (?, ?, ?, ?)`
	fileCreatedAt := time.Now().UTC()
	_, err = tx.Exec(fileQuery, programID, "main", "", fileCreatedAt)
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to insert file", err)
		return -1, err
	}

	// Determine new webhook name
	var maxID int
	err = tx.QueryRow("SELECT COALESCE(MAX(id), 0) FROM webhooks").Scan(&maxID)
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to get max id", err)
		return -1, err
	}
	newWebhookName := fmt.Sprintf("webhook - %d", maxID+1)

	// Create webhook
	webhookQuery := `INSERT INTO webhooks (name, block_id, program_id, path) VALUES (?, ?, ?, ?)`
	uniquePath := fmt.Sprintf("/webhook/%d-%d", blockID, time.Now().UnixNano())
	result, err = tx.Exec(webhookQuery, newWebhookName, blockID, programID, uniquePath)
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to insert webhook", err)
		return -1, err
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		rflog.Error("failed to commit transaction", err)
		return -1, err
	}

	webhookId, _ := result.LastInsertId()

	return webhookId, nil
}

func (s *Store) InsertPageWithAutoName(blockID int64) (int64, error) {
	tx, err := s.db.Begin()
	if err != nil {
		rflog.Error("failed to begin transaction for page", err)
		return -1, err
	}
	var maxID int
	err = tx.QueryRow("SELECT COALESCE(MAX(id), 0) FROM pages").Scan(&maxID)
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to get max id", err)
		return -1, err
	}
	newPageName := fmt.Sprintf("page-%d", maxID+1)

	canvasState := JSONRawString{
		"width":  1024,
		"height": 768,
		"layers": []string{"background", "foreground"},
	}

	// Create page
	pageQuery := `INSERT INTO pages (name, path, block_id, canvas_state) VALUES (?, ?,?, ?)`
	result, err := tx.Exec(pageQuery, newPageName, newPageName, blockID, canvasState)
	if err != nil {
		tx.Rollback()
		rflog.Error("failed to insert page", err)
		return -1, err
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		rflog.Error("failed to commit transaction", err)
		return -1, err
	}

	pageID, _ := result.LastInsertId()

	return pageID, nil
}

func (s *Store) SelectWebhookById(id int64) (*Webhook, error) {
	var webhook Webhook
	query := `SELECT id, name, description, active, env_variables, block_id, path, cors, http_method, response_headers, exit_http_pair, program_id, created_at FROM webhooks WHERE id = ?`
	err := s.db.Get(&webhook, query, id)
	if err != nil {
		return nil, err
	}
	return &webhook, nil
}

// InsertBlockWithAutoName inserts a new block with an auto-generated name based on the max id in the blocks table.
func (s *Store) InsertBlockWithAutoName(description string, active bool) (int64, error) {
	var maxID int
	const nilInsertID = -1
	err := s.db.QueryRow("SELECT COALESCE(MAX(id), 0) FROM blocks").Scan(&maxID)
	if err != nil {
		rflog.Error("failed to get max id", err)
		return nilInsertID, err
	}

	newName := fmt.Sprintf("block - %d", maxID+1)
	createdAt := time.Now().UTC()

	block := Block{
		Name:        newName,
		Description: "Block description",
		Active:      true,
		CreatedAt:   createdAt,
	}

	result, err := s.InsertBlock(block)
	if err != nil {
		rflog.Error("failed to insert block", err)
		return nilInsertID, err
	}

	id, _ := result.LastInsertId()

	return id, nil
}

// make it shorter
func (s *Store) UpdateName(table string, id int64, newName string) (string, error) {
	var query string

	switch table {
	case utils.BlockEntity:
		query = `UPDATE blocks SET name = ? WHERE id = ?`
	case utils.WebhookEntity:
		query = `UPDATE webhooks SET name = ? WHERE id = ?`
	case utils.PeriodicTaskEntity:
		query = `UPDATE periodic_tasks SET name = ? WHERE id = ?`
	default:
		return "", fmt.Errorf("invalid table type: %s", table)
	}

	_, err := s.db.Exec(query, newName, id)
	if err != nil {
		return "", err
	}

	return newName, nil
}

// ListPeriodicTasksByBlockID retrieves periodic runs associated with a given block ID.
func (s *Store) ListPeriodicTasksByBlockID(blockID int64) ([]PeriodicTask, error) {
	var periodicRuns []PeriodicTask
	query := `SELECT id, name, description, active, env_variables, block_id, program_id, timezone, cron, next_run_at, created_at, updated_at
			  FROM periodic_tasks
			  WHERE block_id = ?`
	err := s.db.Select(&periodicRuns, query, blockID)
	if err != nil {
		return nil, err
	}
	return periodicRuns, nil
}

// ListPagesByBlockID retrieves pages associated with a given block ID.
func (s *Store) ListPagesByBlockID(blockID int64) ([]Page, error) {
	var pages []Page
	query := `SELECT id, name, description, active, block_id, canvas_state, html_output, created_at
			  FROM pages
			  WHERE block_id = ?`
	err := s.db.Select(&pages, query, blockID)
	if err != nil {
		return nil, err
	}
	return pages, nil
}

func (s *Store) ListWebhooksByBlockID(blockID int64) ([]Webhook, error) {
	var webhooks []Webhook
	query := `SELECT id, name, description, active,
	                 env_variables, block_id, path, cors, http_method,
					 exit_http_pair, program_id, created_at
			  FROM webhooks WHERE block_id = ?`
	err := s.db.Select(&webhooks, query, blockID)
	if err != nil {
		return nil, err
	}
	return webhooks, nil
}

func (s *Store) SelectBlockById(id int64) (*Block, error) {
	var block Block
	query := `SELECT id, name, description, active, env_variables, created_at FROM blocks WHERE id = ?`
	err := s.db.Get(&block, query, id)
	if err != nil {
		return nil, err
	}
	return &block, nil
}

type WebHookDetail struct {
	Webhook Webhook `json:"periodicTask" db:"webhook"`
	File    File    `json:"file" db:"file"`
	Block   Block   `json:"block" db:"block"`
}

func (s *Store) SelectWebhookByPath(path string, verb string) (*WebHookDetail, error) {
	// Query to fetch the webhook, program, and files
	query := `
	SELECT f.content AS "file.content",
           w.id AS "webhook.id",
	       w.env_variables AS "webhook.env_variables",
		   w.response_headers AS "webhook.response_headers",
		   w.exit_http_pair AS "webhook.exit_http_pair",
		   b.env_variables AS "block.env_variables",
		   b.id AS "block.id"
	FROM
		webhooks w
	JOIN
		programs p ON w.program_id = p.id
	JOIN
		files f ON p.id = f.program_id
    JOIN
        blocks b on b.id = w.block_id
	WHERE
		w.path = ? AND w.http_method = ? AND w.active = 1 AND b.active = 1`

	var webhookWithDetails WebHookDetail

	err := s.db.Get(&webhookWithDetails, query, path, verb)
	if err != nil {
		return nil, err
	}

	return &webhookWithDetails, nil
}

func constructKeyValueFormat(exitCodes, httpResponseCodes []string) string {
	if len(exitCodes) != len(httpResponseCodes) {
		// Handle error case where lengths of arrays do not match
		return ""
	}

	var pairs []string
	for i := 0; i < len(exitCodes); i++ {
		pair := exitCodes[i] + "=" + httpResponseCodes[i]
		pairs = append(pairs, pair)
	}

	result := strings.Join(pairs, ";")
	return result
}

func (s *Store) UpdateFileContentByWebhookID(webhookID int64, formData WebhookFormData) error {
	tx, err := s.db.Beginx()
	if err != nil {
		rflog.Error("failed to begin transaction", err)
		return err
	}

	query := `
		UPDATE files
		SET content = ?
		WHERE program_id = (
			SELECT program_id
			FROM webhooks
			WHERE id = ?
		)
	`

	_, err = tx.Exec(query, formData.FileContent, webhookID)
	if err != nil {
		tx.Rollback()
		rflog.Info("failed to update file content:", err)
		return err
	}
	query = ` UPDATE webhooks SET env_variables = ?,
	              		          name = ?,
						          description = ?,
	                              cors = ?,
								  active = ?,
								  http_method = ?,
								  exit_http_pair = ?
	                          WHERE id = ?`

	exitHttpPair := constructKeyValueFormat(formData.ExitCodes, formData.HTTPResponseCodes)
	_, err = tx.Exec(query, formData.Env, formData.Name, formData.Description, formData.Cors, formData.Active, formData.HttpVerb, exitHttpPair, webhookID)

	if err != nil {
		tx.Rollback()
		rflog.Info("failed to update webhook:", err)
		return err
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		rflog.Error("failed to commit transaction", err)
		return err
	}

	return nil
}

func (s *Store) UpdatePeriodicTaskByFrom(periodicTaskID int64, formData PeriodicTaskFormData) error {
	tx, err := s.db.Beginx()
	if err != nil {
		rflog.Error("failed to begin transaction", err)
		return err
	}

	query := `
		UPDATE files
		SET content = ?
		WHERE program_id = (
			SELECT program_id
			FROM periodic_tasks
			WHERE id = ?
		)
	`

	_, err = tx.Exec(query, formData.FileContent, periodicTaskID)
	if err != nil {
		tx.Rollback()
		rflog.Info("failed to update file content:", err)
		return err
	}
	query = `UPDATE periodic_tasks SET env_variables = ?,
	              		               name = ?,
						               description = ?,
	                                   cron = ?,
								       active = ?
	                                WHERE id = ?`

	_, err = tx.Exec(query, formData.Env, formData.Name, formData.Description, formData.Cron, formData.Active, periodicTaskID)

	if err != nil {
		tx.Rollback()
		rflog.Info("failed to update periodic tasks:", err)
		return err
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		rflog.Error("failed to commit transaction", err)
		return err
	}

	return nil
}

func (s *Store) UpdateWebhookPath(id int64, newPath string) (string, error) {
	// Check if the new path starts with "/webhooks" and remove it if present
	newPath = strings.TrimPrefix(newPath, "/webhooks")
	newPath = strings.TrimPrefix(newPath, "webhooks")
	newPath = strings.TrimPrefix(newPath, "/")

	// Ensure new path starts with "/"
	// if strings.HasPrefix(newPath, "/") {
	// 	newPath = "/" + newPath
	// }

	// Update the webhook path in the database
	query := `UPDATE webhooks SET path = ? WHERE id = ?`
	_, err := s.db.Exec(query, newPath, id)
	if err != nil {
		rflog.Error("failed to update webhook path", err)
		return "", err
	}

	return newPath, nil
}

// db tag is needed for matching in same cases
type PeriodicTaskDetail struct {
	PeriodicTask PeriodicTask `json:"periodicTask" db:"periodic_task"`
	Program      Program      `json:"program" db:"program"`
	File         File         `json:"file" db:"file"`
}

func (s *Store) SelectPeriodicTaskDetailsById(id int64) (*PeriodicTaskDetail, error) {
	var periodicTaskDetail PeriodicTaskDetail

	query := `
		SELECT
			pt.id AS "periodic_task.id", pt.name AS "periodic_task.name", pt.description AS "periodic_task.description", pt.active AS "periodic_task.active",
			pt.env_variables AS "periodic_task.env_variables", pt.block_id AS "periodic_task.block_id", pt.program_id AS "periodic_task.program_id",
			pt.timezone AS "periodic_task.timezone", pt.cron AS "periodic_task.cron", pt.next_run_at AS "periodic_task.next_run_at",
			pt.created_at AS "periodic_task.created_at", pt.updated_at AS "periodic_task.updated_at",
			p.id AS "program.id", p.name AS "program.name", p.created_at AS "program.created_at",
			f.id AS "file.id", f.program_id AS "file.program_id", f.created_at AS "file.created_at",
			f.filename AS "file.filename", f.content AS "file.content"
		FROM
			periodic_tasks pt
		JOIN
			programs p ON pt.program_id = p.id
		JOIN
			files f ON p.id = f.program_id
		WHERE
			pt.id = ?`

	err := s.db.Get(&periodicTaskDetail, query, id)
	if err != nil {
		return nil, err
	}

	return &periodicTaskDetail, nil
}

type WebhookDetail struct {
	Webhook Webhook `json:"webhook"`
	Program Program `json:"program"`
	File    File    `json:"file"`
}

func (s *Store) SelectWebhookDetailsById(id int64) (*WebhookDetail, error) {
	var webhookDetail WebhookDetail

	query := `
		SELECT
			w.id AS "webhook.id", w.name AS "webhook.name", w.description AS "webhook.description", w.active AS "webhook.active",
			w.env_variables AS "webhook.env_variables", w.block_id AS "webhook.block_id", w.path AS "webhook.path",
			w.cors AS "webhook.cors", w.http_method AS "webhook.http_method", w.exit_http_pair AS "webhook.exit_http_pair",
			w.program_id AS "webhook.program_id", w.created_at AS "webhook.created_at",
			p.id AS "program.id", p.name AS "program.name", p.created_at AS "program.created_at",
			f.id AS "file.id", f.program_id AS "file.program_id", f.created_at AS "file.created_at",
			f.filename AS "file.filename", f.content AS "file.content"
		FROM
			webhooks w
		JOIN
			programs p ON w.program_id = p.id
		JOIN
			files f ON p.id = f.program_id
		WHERE
			w.id = ?`

	err := s.db.Get(&webhookDetail, query, id)
	if err != nil {
		return nil, err
	}

	return &webhookDetail, nil
}

func (s *Store) SelectPageById(id int64) (*Page, error) {
	var page Page
	query := `SELECT id, path, name, description, active, block_id, canvas_state
			  FROM pages WHERE id = ?`
	err := s.db.Get(&page, query, id)
	if err != nil {
		return nil, err
	}
	return &page, nil
}

func (s *Store) SelectPageByPath(path string) (*Page, error) {
	var page Page
	query := `SELECT path, description, active, html_output FROM pages WHERE path = ? AND active = 1`
	err := s.db.Get(&page, query, path)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &page, nil
}

type PageData struct {
	Path        string `json:"path"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Active      bool   `json:"active"`
	Metadata    any    `json:"metadata"`
	CanvasItems any    `json:"canvasItems"`
	HtmlOutput  any    `json:"htmlOutput"`
}

const pagesVersion = 1

func (s *Store) UpdatePageByID(id int64, pageData PageData) error {
	tmp := pageData.CanvasItems.(map[string]any)
	tmp["version"] = pagesVersion

	canvasItemsJSON, err := json.Marshal(tmp)
	if err != nil {
		return fmt.Errorf("failed to marshal CanvasItems: %w", err)
	}

	query := `
        UPDATE pages
        SET name = ?,
		    description = ?,
		    canvas_state = ?,
			html_output = ?,
			active = ?,
			updated_at = ?
        WHERE id = ?`

	// Execute the query
	_, err = s.db.Exec(query,
		pageData.Title,
		pageData.Description,
		string(canvasItemsJSON),
		pageData.HtmlOutput,
		pageData.Active,
		time.Now().UTC(),
		id,
	)
	if err != nil {
		return fmt.Errorf("failed to update page: %w", err)
	}

	return nil
}
func (s *Store) DeleteBlockById(id int64) error {
	tx, err := s.db.Beginx()
	if err != nil {
		rflog.Error("failed to begin transaction", err)
		return err
	}

	query := "DELETE FROM blocks WHERE id = ?"
	_, err = tx.Exec(query, id)
	if err != nil {
		tx.Rollback()
		rflog.Info("failed to delete block:", err)
		return err
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		rflog.Error("failed to commit transaction", err)
		return err
	}

	return nil
}

func (s *Store) DeleteWebhookById(id int64) error {
	tx, err := s.db.Beginx()
	if err != nil {
		rflog.Error("failed to begin transaction", err)
		return err
	}

	query := "DELETE FROM webhooks WHERE id = ?"
	_, err = tx.Exec(query, id)
	if err != nil {
		tx.Rollback()
		rflog.Info("failed to delete webhook:", err)
		return err
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		rflog.Error("failed to commit transaction", err)
		return err
	}

	return nil
}
func (s *Store) DeletePageById(id int64) error {
	tx, err := s.db.Beginx()
	if err != nil {
		rflog.Error("failed to begin transaction", err)
		return err
	}

	query := "DELETE FROM pages WHERE id = ?"
	_, err = tx.Exec(query, id)
	if err != nil {
		tx.Rollback()
		rflog.Info("failed to delete page:", err)
		return err
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		rflog.Error("failed to commit transaction", err)
		return err
	}

	return nil
}

func (s *Store) DeletePeriodicTaskById(id int64) error {
	tx, err := s.db.Beginx()
	if err != nil {
		rflog.Error("failed to begin transaction", err)
		return err
	}

	query := "DELETE FROM periodic_tasks WHERE id = ?"
	_, err = tx.Exec(query, id)
	if err != nil {
		tx.Rollback()
		rflog.Info("failed to delete periodic task:", err)
		return err
	}

	if err := tx.Commit(); err != nil {
		tx.Rollback()
		rflog.Error("failed to commit transaction", err)
		return err
	}

	return nil
}
