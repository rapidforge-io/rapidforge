package models

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/rapidforge-io/rapidforge/database"
	rflog "github.com/rapidforge-io/rapidforge/logger"
)

type User struct {
	ID           int       `json:"id" db:"id"`
	Username     string    `json:"username" db:"username"`
	PasswordHash string    `json:"password_hash" db:"password_hash"`
	Email        string    `json:"email" db:"email"`
	Settings     string    `json:"settings" db:"settings"`
	Role         string    `json:"role" db:"role"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

type Credential struct {
	ID          int       `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Description string    `json:"description" db:"description"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	Type        string    `json:"type" db:"type"`
	Value       string    `json:"value" db:"value"`
}

type Block struct {
	ID           int       `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	Description  string    `json:"description" db:"description"`
	Active       bool      `json:"active" db:"active"`
	EnvVariables string    `json:"env_variables" db:"env_variables"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

type Program struct {
	ID        int       `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type File struct {
	ID        int       `json:"id" db:"id"`
	ProgramID int       `json:"program_id" db:"program_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	Filename  string    `json:"filename" db:"filename"`
	Content   string    `json:"content" db:"content"`
}

type Webhook struct {
	Name         string `json:"name" db:"name"`
	Description  string `json:"description" db:"description"`
	Active       bool   `json:"active" db:"active"`
	EnvVariables string `json:"env_variables" db:"env_variables"`
	BlockID      int    `json:"block_id" db:"block_id"`
	Path         string `json:"path" db:"path"`
	Cors         string `json:"cors" db:"cors"`
	HttpMethod   string `json:"http_method" db:"http_method"`
	ExitHttpPair string `json:"exit_http_pair" db:"exit_http_pair"`
	ProgramID    int    `json:"program_id" db:"program_id"`
}

type Page struct {
	ID           int       `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	Description  string    `json:"description" db:"description"`
	Active       bool      `json:"active" db:"active"`
	EnvVariables string    `json:"env_variables" db:"env_variables"`
	Blocks       []byte    `json:"blocks" db:"blocks"`
	ProgramID    int       `json:"program_id" db:"program_id"`
	CanvasState  string    `json:"canvas_state" db:"canvas_state"`
	HTMLOutput   string    `json:"html_output" db:"html_output"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

type PeriodicRun struct {
	ID           int       `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	Description  string    `json:"description" db:"description"`
	Active       bool      `json:"active" db:"active"`
	EnvVariables string    `json:"env_variables" db:"env_variables"`
	Blocks       []byte    `json:"blocks" db:"blocks"`
	ProgramID    int       `json:"program_id" db:"program_id"`
	Timezone     string    `json:"timezone" db:"timezone"`
	Cron         string    `json:"cron" db:"cron"`
	NextRunAt    time.Time `json:"next_run_at" db:"next_run_at"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

type Setting struct {
	ID    int    `json:"id" db:"id"`
	Name  string `json:"name" db:"name"`
	Value string `json:"value" db:"value"`
}

type Store struct {
	db *database.DbCon
}

func NewModel(db *database.DbCon) *Store {
	return &Store{
		db: db,
	}
	// Block.ListBlocks
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

// InsertBlockWithAutoName inserts a new block with an auto-generated name based on the max id in the blocks table.
func (s *Store) InsertBlockWithAutoName(description string, active bool, envVariables string) (int64, error) {
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

func (s *Store) UpdateName(table string, id int, newName string) (string, error) {
	var query string

	switch table {
	case "block":
		query = `UPDATE blocks SET name = ? WHERE id = ?`
	case "webhook":
		query = `UPDATE webhooks SET name = ? WHERE id = ?`
	case "periodic_run":
		query = `UPDATE periodic_runs SET name = ? WHERE id = ?`
	default:
		return "", fmt.Errorf("invalid table type: %s", table)
	}

	_, err := s.db.Exec(query, newName, id)
	if err != nil {
		return "", err
	}

	return newName, nil
}

func (s *Store) SelectBlockById(id int) (*Block, error) {
	var block Block
	query := `SELECT id, name, description, active, env_variables, created_at FROM blocks WHERE id = ?`
	err := s.db.Get(&block, query, id)
	if err != nil {
		return nil, err
	}
	return &block, nil
}
