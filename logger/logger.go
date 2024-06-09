package rflog

import (
	"log/slog"
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
	logger.Info(msg, args...)
}

func Error(message any, args ...interface{}) {
	var msg string
	switch v := message.(type) {
	case string:
		msg = v
	case error:
		msg = v.Error()
	}
	logger.Error(msg, args...)
}
