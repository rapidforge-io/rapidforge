package services

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/adhocore/gronx"
	rflog "github.com/rapidforge-io/rapidforge/logger"
	"github.com/rapidforge-io/rapidforge/models"
	"github.com/rapidforge-io/rapidforge/utils"
)

const (
	periodicTaskInterval = 30 * time.Second

	maxPeriodicWorkers = 10
)

var periodicTaskPool = make(chan struct{}, maxPeriodicWorkers)

func GetLoginService() *LoginService {
	return LService
}

func (s *Service) RunPeriodicPrograms() {
	details, err := s.store.GetAndLockDuePeriodicTasks()
	if err != nil {
		rflog.Error("Problems fetching periodic programs", "err=", err)
		return
	}

	for _, task := range details {
		periodicTaskPool <- struct{}{} // acquire slot
		go func(task models.DueTasksTaskDetail) {
			defer func() { <-periodicTaskPool }() // release slot

			// Panic recovery
			defer func() {
				if r := recover(); r != nil {
					rflog.Error("Panic in periodic task execution", "task_id=", task.PeriodicTask.ID, "panic=", r)
					// Optionally, mark as failure
					s.store.UnlockPeriodicTask(task.PeriodicTask.ID)
					s.store.RecordTaskFailure(task.PeriodicTask.ID)
				}
			}()

			blockEnv := task.Block.GetEnvVars()
			taskEnv := task.PeriodicTask.GetEnvVars()
			env := utils.MergeMaps(blockEnv, taskEnv)

			creds, err := s.store.ListCredentialsForEnv()
			if err == nil {
				env = utils.MergeMaps(env, creds)
			} else {
				rflog.Error("failed to get credentials", err)
			}

			runner := GetRunner(RunnerType(task.Program.ProgramType))
			res, err := runner.Run(task.File.Content, env)

			nextRunAt, err := gronx.NextTickAfter(task.PeriodicTask.Cron, time.Now().UTC(), false)
			if err != nil {
				rflog.Error("error calculating nextRunAt", "err=", err)
			}

			err = s.store.UpdatePeriodicTaskNextRunAt(task.PeriodicTask.ID, nextRunAt)
			if err != nil {
				rflog.Error("Problem occurred during update nextRunAt", "err=", err)
			}

			if res.ExitCode == 0 {
				s.store.RecordTaskSuccess(task.PeriodicTask.ID)
			} else {
				s.store.RecordTaskFailure(task.PeriodicTask.ID)

				if task.PeriodicTask.OnFailEnabled && task.PeriodicTask.OnFailScript.Valid && task.PeriodicTask.OnFailScript.String != "" {
					failScriptType := "bash"
					if task.PeriodicTask.OnFailScriptType.Valid && task.PeriodicTask.OnFailScriptType.String != "" {
						failScriptType = task.PeriodicTask.OnFailScriptType.String
					}
					// Add failure context to environment
					env["FAILURE_EXIT_CODE"] = fmt.Sprintf("%d", res.ExitCode)
					env["FAILURE_OUTPUT"] = res.Output
					env["FAILURE_ERROR"] = res.Error
					env["TASK_ID"] = fmt.Sprintf("%d", task.PeriodicTask.ID)
					failRunner := GetRunner(RunnerType(failScriptType))
					failRes, failErr := failRunner.Run(task.PeriodicTask.OnFailScript.String, env)
					if failErr != nil {
						rflog.Error("Failed to execute on-fail script", "task_id=", task.PeriodicTask.ID, "err=", failErr)
					} else if failRes.ExitCode != 0 {
						rflog.Error("On-fail script exited with non-zero status", "task_id=", task.PeriodicTask.ID, "exit_code=", failRes.ExitCode)
					}
				}
			}

			_, err = s.store.InsertEvent(models.Event{
				Status:         fmt.Sprint(res.ExitCode),
				EventType:      utils.PeriodicTaskEntity,
				Logs:           sql.NullString{String: string(res.Output), Valid: true},
				PeriodicTaskID: sql.NullInt64{Int64: task.PeriodicTask.ID, Valid: true},
				BlockID:        task.Block.ID,
			})
			if err != nil {
				rflog.Error("Problem occurred during insert event", "err=", err)
			}

			s.store.UnlockPeriodicTask(task.PeriodicTask.ID)
		}(task)
	}
}
