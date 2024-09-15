package models

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/rapidforge-io/rapidforge/utils"
)

type Event struct {
	ID             int            `json:"id" db:"id"`
	Status         string         `json:"status" db:"status"`
	CreatedAt      time.Time      `json:"created_at" db:"created_at"`
	EventType      string         `json:"event_type" db:"event_type"`
	Args           sql.NullString `json:"args" db:"args"`
	Logs           sql.NullString `json:"logs" db:"logs"`
	WebhookID      sql.NullInt64  `json:"webhook_id" db:"webhook_id"`
	PeriodicTaskID sql.NullInt64  `json:"periodic_task_id" db:"periodic_task_id"`
	BlockID        int64          `json:"block_id" db:"block_id"`
}

func (s *Store) InsertEvent(event Event) (sql.Result, error) {
	query := ""
	var result sql.Result
	var err error
	if event.EventType == utils.PeriodicTaskEntity {
		query = `INSERT INTO events (status, event_type, args, logs, periodic_task_id, block_id)
                 VALUES (?, ?, ?, ?, ?, ?)`
		result, err = s.db.Exec(query, event.Status, event.EventType, event.Args, event.Logs, event.PeriodicTaskID.Int64, event.BlockID)
	} else {
		query = `INSERT INTO events (status, event_type, args, logs, webhook_id, block_id)
		         VALUES (?, ?, ?, ?, ?, ?)`
		result, err = s.db.Exec(query, event.Status, event.EventType, event.Args, event.Logs, event.WebhookID.Int64, event.BlockID)
	}

	return result, err
}

func (s *Store) FetchEventByBlockID(blockID int64, limit int, page int) (*[]Event, error) {
	var events []Event
	offset := page * limit

	// Update query to include LIMIT and OFFSET for pagination
	query := `SELECT id, status, created_at, event_type, args, webhook_id, periodic_task_id, logs, block_id
              FROM events
              WHERE block_id = ?
              ORDER BY created_at DESC
              LIMIT ? OFFSET ?`

	err := s.db.Select(&events, query, blockID, limit, offset)
	if err != nil {
		return nil, err
	}
	return &events, nil
}

func (s *Store) FetchEvents(eventType string, id int64, idColumn string, limit int, page int) (*[]Event, error) {
	if eventType == utils.BlockEntity {
		return s.FetchEventByBlockID(id, limit, page)
	}

	return s.FetchEventByTypeAndID(eventType, id, idColumn, limit, page)
}

func (s *Store) FetchEventByTypeAndID(eventType string, id int64, idColumn string, limit int, page int) (*[]Event, error) {
	var events []Event

	offset := page * limit

	query := fmt.Sprintf(`SELECT id, status, created_at, event_type, args, webhook_id, periodic_task_id, block_id
                         FROM events
                         WHERE event_type = ? AND %s = ?
                         ORDER BY created_at DESC
                         LIMIT ? OFFSET ?`, idColumn)

	err := s.db.Select(&events, query, eventType, id, limit, offset)
	if err != nil {
		return nil, err
	}
	return &events, nil
}

func (s *Store) FetchEventByID(id int64) (*Event, error) {
	var events Event
	query := `SELECT id,
	                 status,
	                 created_at,
					 event_type,
					 args,
					 webhook_id,
					 periodic_task_id,
					 logs,
					 block_id
                     FROM events
                     WHERE id = ?`

	err := s.db.Get(&events, query, id)
	if err != nil {
		return nil, err
	}
	return &events, nil
}

func (s *Store) RemoveEventsOlderThanAWeek() (sql.Result, error) {
	// Calculate the time threshold for one week ago
	oneWeekAgo := time.Now().AddDate(0, 0, -7)

	// Prepare the SQL query to delete events older than one week
	query := `DELETE FROM events WHERE created_at < ?`

	// Execute the query
	result, err := s.db.Exec(query, oneWeekAgo)
	if err != nil {
		return nil, err
	}

	return result, nil
}
