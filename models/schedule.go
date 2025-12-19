package models

import (
	"time"

	"github.com/jmoiron/sqlx"
)

type DueTasksTaskDetail struct {
	PeriodicTaskDetail
	Block Block `json:"block" db:"block"`
}

func (s *Store) UnlockStalePeriodicTasks() error {
	query := `UPDATE periodic_tasks SET locked = 0, locked_at = NULL WHERE locked = 1 AND locked_at < datetime('now', '-20 minutes')`
	_, err := s.db.Exec(query)
	return err
}

// func (s *Store) LockPeriodicTask(id int64) error {
// 	query := `UPDATE periodic_tasks SET locked = 1, locked_at = CURRENT_TIMESTAMP WHERE id = ? AND locked = 0`
// 	res, err := s.db.Exec(query, id)
// 	if err != nil {
// 		return err
// 	}
// 	rows, err := res.RowsAffected()
// 	if err != nil {
// 		return err
// 	}
// 	if rows == 0 {
// 		return fmt.Errorf("task %d is already locked", id)
// 	}
// 	return nil
// }

func (s *Store) UnlockPeriodicTask(id int64) error {
	query := `UPDATE periodic_tasks SET locked = 0, locked_at = NULL WHERE id = ?`
	_, err := s.db.Exec(query, id)
	return err
}

func (s *Store) RecordTaskSuccess(id int64) error {
	query := `UPDATE periodic_tasks SET last_success_at = CURRENT_TIMESTAMP WHERE id = ?`
	_, err := s.db.Exec(query, id)
	return err
}

func (s *Store) RecordTaskFailure(id int64) error {
	query := `UPDATE periodic_tasks SET last_failure_at = CURRENT_TIMESTAMP WHERE id = ?`
	_, err := s.db.Exec(query, id)
	return err
}

func (s *Store) GetAndLockDuePeriodicTasks() ([]DueTasksTaskDetail, error) {
	// TODO: think about this one
	// err := s.UnlockStalePeriodicTasks()
	// if err != nil {
	// 	return nil, err
	// }

	tx, err := s.db.Beginx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	const query = `
	SELECT
		pt.id AS "periodic_task.id",
		f.content AS "file.content",
		pt.cron AS "periodic_task.cron",
		pt.next_run_at AS "periodic_task.next_run_at",
		pt.timezone AS "periodic_task.timezone",
		pt.env_variables AS "periodic_task.env_variables",
		pt.on_fail_script AS "periodic_task.on_fail_script",
		pt.on_fail_script_type AS "periodic_task.on_fail_script_type",
		pt.on_fail_enabled AS "periodic_task.on_fail_enabled",
		pt.block_id AS "periodic_task.block_id",
		b.env_variables as "block.env_variables",
		b.id as "block.id", p.type as "program.type"
	FROM
		periodic_tasks pt
		JOIN programs p ON pt.program_id = p.id
		JOIN files f ON f.program_id = p.id
		JOIN blocks b ON b.id = pt.block_id
	WHERE
		pt.active = 1
		AND pt.next_run_at < datetime('now', 'utc')
		AND pt.locked = 0
	LIMIT 10
	`

	var tasks []DueTasksTaskDetail
	if err := tx.Select(&tasks, query); err != nil {
		return nil, err
	}

	if len(tasks) == 0 {
		tx.Commit()
		return tasks, nil
	}

	// Collect IDs
	ids := make([]any, len(tasks))
	for i, task := range tasks {
		ids[i] = task.PeriodicTask.ID
	}

	lockQuery, args, err := sqlx.In("UPDATE periodic_tasks SET locked = 1, locked_at = CURRENT_TIMESTAMP WHERE id IN (?)", ids...)
	if err != nil {
		return nil, err
	}
	lockQuery = tx.Rebind(lockQuery)

	_, err = tx.Exec(lockQuery, args...)
	if err != nil {
		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return tasks, nil
}

// func (s *Store) GetDuePeriodicTasks() ([]DueTasksTaskDetail, error) {
// 	const query = `
//     SELECT
//         pt.id AS "periodic_task.id",
//         f.content AS "file.content",
//         pt.cron AS "periodic_task.cron",
//         pt.next_run_at AS "periodic_task.next_run_at",
//         pt.timezone AS "periodic_task.timezone",
//         pt.env_variables AS "periodic_task.env_variables",
//         pt.block_id AS "periodic_task.block_id",
//         b.env_variables as "block.env_variables",
//         b.id as "block.id", p.type as "program.type"
//     FROM
//         periodic_tasks pt
//         JOIN programs p ON pt.program_id = p.id
//         JOIN files f ON f.program_id = p.id
// 		JOIN blocks b ON b.id = pt.block_id
//     WHERE
//         pt.active = 1
//         AND pt.next_run_at < datetime('now', 'utc') LIMIT 10
//     `

// 	var tasks []DueTasksTaskDetail
// 	if err := s.db.Select(&tasks, query); err != nil {
// 		rflog.Error("Error fetching active periodic task details:", "err=", err)
// 		return nil, err
// 	}
// 	return tasks, nil
// }

func (s *Store) UpdatePeriodicTaskNextRunAt(id int64, nextRunAt time.Time) error {
	query := `UPDATE periodic_tasks SET next_run_at = ? WHERE id = ?`
	_, err := s.db.Exec(query, nextRunAt, id)
	return err
}
