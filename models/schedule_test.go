package models

import (
	"testing"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/rapidforge-io/rapidforge/database"
	_ "modernc.org/sqlite"
)

func newScheduleTestStore(t *testing.T) *Store {
	t.Helper()

	db := sqlx.MustConnect("sqlite", ":memory:")
	t.Cleanup(func() {
		db.Close()
	})

	schema := []string{
		`CREATE TABLE blocks (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			env_variables TEXT
		)`,
		`CREATE TABLE programs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			type TEXT NOT NULL DEFAULT 'bash',
			created_at TIMESTAMP
		)`,
		`CREATE TABLE files (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			program_id INTEGER,
			filename TEXT,
			content TEXT,
			created_at TIMESTAMP
		)`,
		`CREATE TABLE periodic_tasks (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			description TEXT,
			active BOOLEAN DEFAULT 1,
			env_variables TEXT,
			block_id INTEGER,
			program_id INTEGER,
			timezone TEXT DEFAULT 'UTC',
			cron TEXT NOT NULL,
			next_run_at DATETIME,
			on_fail_script TEXT,
			on_fail_script_type TEXT DEFAULT 'bash',
			on_fail_enabled BOOLEAN DEFAULT 0,
			locked BOOLEAN DEFAULT 0,
			locked_at DATETIME,
			created_at TIMESTAMP,
			updated_at TIMESTAMP
		)`,
	}
	for _, stmt := range schema {
		db.MustExec(stmt)
	}

	return &Store{db: &database.DbCon{DB: db}}
}

func insertScheduleTestTask(t *testing.T, store *Store, active bool, nextRunAt time.Time) int64 {
	t.Helper()

	res, err := store.db.Exec(`INSERT INTO blocks (name) VALUES (?)`, "block")
	if err != nil {
		t.Fatalf("insert block: %v", err)
	}
	blockID, _ := res.LastInsertId()

	res, err = store.db.Exec(`INSERT INTO programs (name, type, created_at) VALUES (?, ?, ?)`, "program", "bash", time.Now().UTC())
	if err != nil {
		t.Fatalf("insert program: %v", err)
	}
	programID, _ := res.LastInsertId()

	if _, err := store.db.Exec(`INSERT INTO files (program_id, filename, content, created_at) VALUES (?, ?, ?, ?)`, programID, "main", "echo ok", time.Now().UTC()); err != nil {
		t.Fatalf("insert file: %v", err)
	}

	res, err = store.db.Exec(
		`INSERT INTO periodic_tasks (name, active, block_id, program_id, cron, next_run_at) VALUES (?, ?, ?, ?, ?, ?)`,
		"task",
		active,
		blockID,
		programID,
		"* * * * *",
		nextRunAt.UTC(),
	)
	if err != nil {
		t.Fatalf("insert periodic task: %v", err)
	}

	taskID, _ := res.LastInsertId()
	return taskID
}

func TestGetAndLockDuePeriodicTasksSkipsDisabledTasks(t *testing.T) {
	store := newScheduleTestStore(t)
	dueAt := time.Now().UTC().Add(-time.Minute)

	disabledID := insertScheduleTestTask(t, store, false, dueAt)
	activeID := insertScheduleTestTask(t, store, true, dueAt)

	tasks, err := store.GetAndLockDuePeriodicTasks()
	if err != nil {
		t.Fatalf("GetAndLockDuePeriodicTasks() error = %v", err)
	}
	if len(tasks) != 1 {
		t.Fatalf("GetAndLockDuePeriodicTasks() returned %d tasks, want 1", len(tasks))
	}
	if tasks[0].PeriodicTask.ID != activeID {
		t.Fatalf("GetAndLockDuePeriodicTasks() returned task %d, want active task %d", tasks[0].PeriodicTask.ID, activeID)
	}

	var disabledLocked bool
	if err := store.db.Get(&disabledLocked, `SELECT locked FROM periodic_tasks WHERE id = ?`, disabledID); err != nil {
		t.Fatalf("select disabled locked state: %v", err)
	}
	if disabledLocked {
		t.Fatal("disabled due task was locked for execution")
	}
}

func TestIsPeriodicTaskActive(t *testing.T) {
	store := newScheduleTestStore(t)
	taskID := insertScheduleTestTask(t, store, false, time.Now().UTC())

	active, err := store.IsPeriodicTaskActive(taskID)
	if err != nil {
		t.Fatalf("IsPeriodicTaskActive() error = %v", err)
	}
	if active {
		t.Fatal("IsPeriodicTaskActive() = true, want false")
	}
}
