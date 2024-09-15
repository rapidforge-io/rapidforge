package rflog

import (
	"log/slog"

	"github.com/fatih/color"
	"github.com/honeybadger-io/honeybadger-go"
	"github.com/rapidforge-io/rapidforge/config"
)

type RfLogger struct {
	*slog.Logger
}

var logger *RfLogger

func init() {
	if logger == nil {
		logger = New()
	}
}

// New creates a new CustomLogger with the specified error endpoint.
func New() *RfLogger {
	return &RfLogger{
		Logger: slog.New(slog.Default().Handler()),
	}
}

func Info(msg string, args ...any) {
	color.Set(color.FgGreen)
	logger.Info(msg, args...)
	color.Unset()
}

func Error(message any, args ...interface{}) {
	var msg string
	switch v := message.(type) {
	case string:
		msg = v
	case error:
		msg = v.Error()
	}
	color.Set(color.FgRed)

	if config.Get().Cloud {
		honeybadger.Notify(msg, args...)
	}

	logger.Error(msg, args...)
	color.Unset()
}
