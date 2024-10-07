package database

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"os"
	"os/exec"
	"sync"

	"github.com/jmoiron/sqlx"
	"github.com/pressly/goose/v3"
	"github.com/rapidforge-io/rapidforge/config"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	_ "modernc.org/sqlite"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

// this could be map in future
// var DbConn *sql.DB

// for testing
// var GetConnection = func() Connection {
// 	return DbConn
// }

type DbCon struct {
	*sqlx.DB
}

var (
	once     sync.Once
	instance *sqlx.DB
	kbDB     *sqlx.DB
)

const (
	pragmas = "?_pragma=busy_timeout(10000)&_pragma=journal_mode(WAL)&_pragma=journal_size_limit(200000000)&_pragma=synchronous(NORMAL)&_pragma=foreign_keys(ON)&_pragma=temp_store(MEMORY)&_pragma=cache_size(-16000)"
	driver  = "sqlite"
)

func (db *DbCon) BeginImmediateTransaction() (*sqlx.Tx, error) {
	tx, err := db.Beginx()
	if err == nil {
		_, err = tx.Exec("ROLLBACK; BEGIN IMMEDIATE")
	}
	return tx, err
}

func GetKvDbConn() *DbCon {
	once.Do(func() {
		fileName := config.Get().KVUrl
		kbDB = LoadConnection(fileName)
	})

	return &DbCon{DB: kbDB}
}

func GetDbConn(fileName string) *DbCon {
	once.Do(func() {
		instance = LoadConnection(fileName)
	})

	return &DbCon{DB: instance}
}

type Connection interface {
	Exec(query string, args ...any) (sql.Result, error)
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
	Prepare(query string) (*sql.Stmt, error)
	PrepareContext(ctx context.Context, query string) (*sql.Stmt, error)
	Query(query string, args ...any) (*sql.Rows, error)
	QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error)
	QueryRow(query string, args ...any) *sql.Row
	QueryRowContext(ctx context.Context, query string, args ...any) *sql.Row
}

func CreateDbFile(fileName string) {
	var err error
	var path string

	if config.Get().Env == "test" {
		path = fmt.Sprintf("./%s", fileName)
	} else {
		path = fmt.Sprintf("./%s", config.Get().DatabaseUrl)
	}

	if _, err = os.Stat(path); os.IsNotExist(err) {
		_, err = os.Create(path)
		if err != nil {
			rflog.Error(err)
		}
	}
}

func RemoveDbFile(filePath string) {
	var err error

	if _, err = os.Stat(filePath); os.IsNotExist(err) {
		return
	}

	err = os.Remove(filePath)

	if err != nil {
		rflog.Error(err)
	}
}

func SetupKV() {
	cmd := exec.Command("sqlite3", "--version")
	err := cmd.Run()

	if err != nil {
		rflog.Info("SQLite3 is not installed on this machine, KV table won't be created", "err", err)
		return
	}

	databaseName := config.Get().KVUrl
	database, err := sqlx.Open(driver, databaseName+pragmas)
	if err != nil {
		rflog.Error("Failed to open database", "err:", err)
	}
	defer database.Close()

	// Create the KeyValueStore table
	createTableSQL := `CREATE TABLE IF NOT EXISTS KV (
	"id" INTEGER PRIMARY KEY AUTOINCREMENT,
	"key" TEXT NOT NULL UNIQUE,
	"value" TEXT
);`

	_, err = database.Exec(createTableSQL)
	if err != nil {
		rflog.Error("Failed to create table", "err:", err)
	}

	rflog.Info("KeyValueStore table created successfully.")
}

func LoadConnection(databaseName string) *sqlx.DB {

	if databaseName == "" {
		databaseName = config.Get().DatabaseUrl
	}

	CreateDbFile(databaseName)

	dbConnection, err := sqlx.Connect(driver, databaseName+pragmas)

	if err != nil {
		panic(err)
	}

	return dbConnection
}

func (db *DbCon) RunMigrations() {

	if err := goose.SetDialect("sqlite3"); err != nil {
		panic(err)
	}
	goose.SetBaseFS(embedMigrations)

	if err := goose.Up(db.DB.DB, "migrations"); err != nil {
		panic(err)
	}
}
