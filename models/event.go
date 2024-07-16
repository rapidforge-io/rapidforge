package models

import (
	"database/sql"
	"fmt"
	"time"

	rflog "github.com/rapidforge-io/rapidforge/logger"
)

type Event struct {
	ID             int           `json:"id" db:"id"`
	Status         string        `json:"status" db:"status"`
	CreatedAt      time.Time     `json:"created_at" db:"created_at"`
	EventType      string        `json:"event_type" db:"event_type"`
	Args           string        `json:"args" db:"args"`
	Logs           string        `json:"logs" db:"logs"`
	WebhookID      sql.NullInt64 `json:"webhook_id" db:"webhook_id"`
	PeriodicTaskID sql.NullInt64 `json:"periodic_task_id" db:"periodic_task_id"`
	BlockID        int64         `json:"block_id" db:"block_id"`
}

func (s *Store) InsertEvent(event Event) (sql.Result, error) {
	query := `INSERT INTO events (status, created_at, event_type, args, webhook_id, periodic_task_id, block_id)
              VALUES (?, ?, ?, ?, ?, ?, ?)`

	rflog.Info("----> inserting event", "event", event.WebhookID.Int64)
	result, err := s.db.Exec(query, event.Status, event.CreatedAt, event.EventType, event.Args, event.WebhookID.Int64, event.PeriodicTaskID, event.BlockID)
	return result, err
}

func (s *Store) FetchEventByTypeAndID(eventType string, id int64, idColumn string) (*[]Event, error) {
	var events []Event
	query := fmt.Sprintf(`SELECT id, status, created_at, event_type, args, webhook_id, periodic_task_id, block_id
                         FROM events
                         WHERE event_type = ? AND %s = ?`, idColumn)

	err := s.db.Select(&events, query, eventType, id)
	if err != nil {
		return nil, err
	}
	return &events, nil
}
