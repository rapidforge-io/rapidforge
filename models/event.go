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
	query := `INSERT INTO events (status, created_at, event_type, args, logs, webhook_id, periodic_task_id, block_id)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

	result, err := s.db.Exec(query, event.Status, event.CreatedAt, event.EventType, event.Args, event.Logs, event.WebhookID.Int64, event.PeriodicTaskID, event.BlockID)
	return result, err
}

func (s *Store) FetchEventByBlockID(blockID int64) (*[]Event, error) {
	var events []Event

	query := `SELECT id, status, created_at, event_type, args, webhook_id, periodic_task_id, logs, block_id
              FROM events
              WHERE block_id = ? ORDER BY created_at DESC`

	err := s.db.Select(&events, query, blockID)
	if err != nil {
		return nil, err
	}
	return &events, nil
}

func (s *Store) FetchEvents(eventType string, id int64, idColumn string) (*[]Event, error) {
	if eventType == utils.BlockEntity {
		return s.FetchEventByBlockID(id)
	}

	return s.FetchEventByTypeAndID(eventType, id, idColumn)
}

func (s *Store) FetchEventByTypeAndID(eventType string, id int64, idColumn string) (*[]Event, error) {
	var events []Event

	query := fmt.Sprintf(`SELECT id, status, created_at, event_type, args, webhook_id, periodic_task_id, block_id
                         FROM events
                         WHERE event_type = ? AND %s = ? ORDER BY created_at DESC`, idColumn)

	err := s.db.Select(&events, query, eventType, id)
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
