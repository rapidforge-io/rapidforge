package models

import (
	"time"

	rflog "github.com/rapidforge-io/rapidforge/logger"
)

type DueTasksTaskDetail struct {
	PeriodicTaskDetail
	Block Block `json:"block" db:"block"`
}

func (s *Store) GetDuePeriodicTasks() ([]DueTasksTaskDetail, error) {
	const query = `
    SELECT
        pt.id AS "periodic_task.id",
        f.content AS "file.content",
        pt.cron AS "periodic_task.cron",
        pt.next_run_at AS "periodic_task.next_run_at",
        pt.timezone AS "periodic_task.timezone",
        pt.env_variables AS "periodic_task.env_variables",
        pt.block_id AS "periodic_task.block_id",
        b.env_variables as "block.env_variables",
        b.id as "block.id"
    FROM
        periodic_tasks pt
        JOIN programs p ON pt.program_id = p.id
        JOIN files f ON f.program_id = p.id
		JOIN blocks b ON b.id = pt.block_id
    WHERE
        pt.active = 1
        AND pt.next_run_at < datetime('now', 'utc') LIMIT 10
    `

	var tasks []DueTasksTaskDetail
	if err := s.db.Select(&tasks, query); err != nil {
		rflog.Error("Error fetching active periodic task details:", "err=", err)
		return nil, err
	}
	return tasks, nil
}

func (s *Store) UpdatePeriodicTaskNextRunAt(id int64, nextRunAt time.Time) error {
	query := `UPDATE periodic_tasks SET next_run_at = ? WHERE id = ?`
	_, err := s.db.Exec(query, nextRunAt, id)
	return err
}
