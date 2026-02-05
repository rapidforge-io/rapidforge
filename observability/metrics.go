package observability

import (
	"context"
	"log/slog"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
)

var (
	meter = otel.Meter("rapidforge")

	// HTTP metrics
	httpRequestDuration metric.Float64Histogram
	httpRequestCount    metric.Int64Counter

	// Webhook metrics
	webhookExecutionDuration metric.Float64Histogram
	webhookExecutionCount    metric.Int64Counter
	webhookErrorCount        metric.Int64Counter

	// Periodic task metrics
	periodicTaskDuration     metric.Float64Histogram
	periodicTaskCount        metric.Int64Counter
	periodicTaskErrorCount   metric.Int64Counter
	periodicTaskWorkerActive metric.Int64UpDownCounter

	// Script execution metrics
	scriptExecutionDuration metric.Float64Histogram
	scriptExecutionCount    metric.Int64Counter
	scriptExecutionErrors   metric.Int64Counter
)

func InitMetrics() error {
	var err error

	httpRequestDuration, err = meter.Float64Histogram(
		"http.server.request.duration",
		metric.WithDescription("HTTP request duration in milliseconds"),
		metric.WithUnit("ms"),
	)
	if err != nil {
		return err
	}

	httpRequestCount, err = meter.Int64Counter(
		"http.server.request.count",
		metric.WithDescription("Total number of HTTP requests"),
	)
	if err != nil {
		return err
	}

	webhookExecutionDuration, err = meter.Float64Histogram(
		"rapidforge.webhook.execution.duration",
		metric.WithDescription("Webhook execution duration in seconds"),
		metric.WithUnit("s"),
	)
	if err != nil {
		return err
	}

	webhookExecutionCount, err = meter.Int64Counter(
		"rapidforge.webhook.execution.count",
		metric.WithDescription("Total number of webhook executions"),
	)
	if err != nil {
		return err
	}

	webhookErrorCount, err = meter.Int64Counter(
		"rapidforge.webhook.error.count",
		metric.WithDescription("Total number of webhook errors"),
	)
	if err != nil {
		return err
	}

	periodicTaskDuration, err = meter.Float64Histogram(
		"rapidforge.periodic_task.execution.duration",
		metric.WithDescription("Periodic task execution duration in seconds"),
		metric.WithUnit("s"),
	)
	if err != nil {
		return err
	}

	periodicTaskCount, err = meter.Int64Counter(
		"rapidforge.periodic_task.execution.count",
		metric.WithDescription("Total number of periodic task executions"),
	)
	if err != nil {
		return err
	}

	periodicTaskErrorCount, err = meter.Int64Counter(
		"rapidforge.periodic_task.error.count",
		metric.WithDescription("Total number of periodic task errors"),
	)
	if err != nil {
		return err
	}

	periodicTaskWorkerActive, err = meter.Int64UpDownCounter(
		"rapidforge.periodic_task.worker.active",
		metric.WithDescription("Number of active periodic task workers"),
	)
	if err != nil {
		return err
	}

	scriptExecutionDuration, err = meter.Float64Histogram(
		"rapidforge.script.execution.duration",
		metric.WithDescription("Script execution duration in seconds"),
		metric.WithUnit("s"),
	)
	if err != nil {
		return err
	}

	scriptExecutionCount, err = meter.Int64Counter(
		"rapidforge.script.execution.count",
		metric.WithDescription("Total number of script executions"),
	)
	if err != nil {
		return err
	}

	scriptExecutionErrors, err = meter.Int64Counter(
		"rapidforge.script.execution.error.count",
		metric.WithDescription("Total number of script execution errors"),
	)
	if err != nil {
		return err
	}

	slog.Info("OpenTelemetry metrics initialized successfully")
	return nil
}

func RecordWebhookExecution(ctx context.Context, duration time.Duration, path string, success bool) {
	attrs := []attribute.KeyValue{
		attribute.String("webhook.path", path),
		attribute.Bool("success", success),
	}

	webhookExecutionDuration.Record(ctx, duration.Seconds(), metric.WithAttributes(attrs...))
	webhookExecutionCount.Add(ctx, 1, metric.WithAttributes(attrs...))

	if !success {
		webhookErrorCount.Add(ctx, 1, metric.WithAttributes(attrs...))
	}
}

func RecordPeriodicTaskExecution(ctx context.Context, duration time.Duration, taskName string, success bool) {
	attrs := []attribute.KeyValue{
		attribute.String("task.name", taskName),
		attribute.Bool("success", success),
	}

	periodicTaskDuration.Record(ctx, duration.Seconds(), metric.WithAttributes(attrs...))
	periodicTaskCount.Add(ctx, 1, metric.WithAttributes(attrs...))

	if !success {
		periodicTaskErrorCount.Add(ctx, 1, metric.WithAttributes(attrs...))
	}
}

func RecordPeriodicTaskWorker(ctx context.Context, delta int64) {
	periodicTaskWorkerActive.Add(ctx, delta)
}

func RecordScriptExecution(ctx context.Context, duration time.Duration, scriptType string, success bool) {
	attrs := []attribute.KeyValue{
		attribute.String("script.type", scriptType),
		attribute.Bool("success", success),
	}

	scriptExecutionDuration.Record(ctx, duration.Seconds(), metric.WithAttributes(attrs...))
	scriptExecutionCount.Add(ctx, 1, metric.WithAttributes(attrs...))

	if !success {
		scriptExecutionErrors.Add(ctx, 1, metric.WithAttributes(attrs...))
	}
}
