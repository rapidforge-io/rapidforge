package database

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"log"
	"os"

	"github.com/pressly/goose/v3"
	"github.com/rapidforge-io/rapidforge/config"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	_ "modernc.org/sqlite"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

// this could be map in future
var DbConn *sql.DB

// for testing
var GetConnection = func() Connection {
	return DbConn
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

func LoadConnection(databaseName string) {
	var err error

	if databaseName == "" {
		databaseName = config.Get().DatabaseUrl
	}

	rflog.Info("[LoadConnection]", "database_name", config.Get().DatabaseUrl)

	CreateDbFile(databaseName)

	DbConn, err = sql.Open("sqlite", databaseName)

	if err != nil {
		log.Fatal(err)
	}
}

func RunMigrations() {

	LoadConnection("")

	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("sqlite3"); err != nil {
		panic(err)
	}

	if err := goose.Up(DbConn, "migrations"); err != nil {
		panic(err)
	}
}
