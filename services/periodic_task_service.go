package services

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/adhocore/gronx"
	"github.com/rapidforge-io/rapidforge/bashrunner"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/models"
	"github.com/rapidforge-io/rapidforge/utils"
)

func (s *Service) RunPeriodicPrograms() {
	details, err := s.store.GetDuePeriodicTasks()

	if err != nil {
		rflog.Error("Problems fetching periodic programs", "err=", err)
	}

	for _, task := range details {
		blockEnv := task.Block.GetEnvVars()
		taskEnv := task.PeriodicTask.GetEnvVars()
		env := utils.MergeMaps(blockEnv, taskEnv)

		creds, err := s.store.ListCredentialsForEnv()
		if err == nil {
			env = utils.MergeMaps(env, creds)
		} else {
			rflog.Error("failed to get credentials", err)
		}

		go func() {
			res, err := bashrunner.Run(task.File.Content, env)

			if err != nil {
				rflog.Error("Problem occurred running periodic task", "err=", err)
			}

			nextRunAt, err := gronx.NextTickAfter(task.PeriodicTask.Cron, time.Now().UTC(), false)

			if err != nil {
				rflog.Error("error calculating nextRunAt", "err=", err)
			}

			err = s.store.UpdatePeriodicTaskNextRunAt(task.PeriodicTask.ID, nextRunAt)

			if err != nil {
				rflog.Error("Problem occurred during update nextRunAt", "err=", err)
			}

			insertEvent := func() {
				_, err := s.store.InsertEvent(models.Event{
					Status:         fmt.Sprint(res.ExitCode),
					EventType:      utils.PeriodicTaskEntity,
					Logs:           sql.NullString{String: string(res.Output), Valid: true},
					PeriodicTaskID: sql.NullInt64{Int64: task.PeriodicTask.ID, Valid: true},
					BlockID:        task.Block.ID,
				})

				if err != nil {
					rflog.Error("Problem occurred during insert event", "err=", err)
				}
			}

			defer insertEvent()
		}()
	}
}
