package database

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"os"
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
)

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

func LoadConnection(databaseName string) *sqlx.DB {

	if databaseName == "" {
		databaseName = config.Get().DatabaseUrl
	}

	rflog.Info("[LoadConnection]", "database_name", config.Get().DatabaseUrl)

	CreateDbFile(databaseName)

	dbConnection, err := sqlx.Connect("sqlite", databaseName)

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
