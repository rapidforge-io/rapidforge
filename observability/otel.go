package observability

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"strconv"
	"strings"
	"time"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/exporters/stdout/stdoutmetric"
	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/propagation"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.24.0"
	"google.golang.org/grpc/credentials/insecure"
)

type OTELConfig struct {
	Enabled            bool
	Endpoint           string
	Headers            map[string]string
	ServiceName        string
	ServiceVersion     string
	Environment        string
	TracesSampler      string
	TracesSamplerArg   float64
	MetricsEnabled     bool
	ExporterType       string
	ExporterProtocol   string // "grpc" or "http"
	InsecureConnection bool
}

var (
	tracerProvider *sdktrace.TracerProvider
	meterProvider  *sdkmetric.MeterProvider
)

// InitOTEL initializes OpenTelemetry with the provided configuration
func InitOTEL(ctx context.Context, cfg OTELConfig) (func(context.Context) error, error) {
	if !cfg.Enabled {
		slog.Info("OpenTelemetry is disabled")
		return func(context.Context) error { return nil }, nil
	}

	res, err := resource.New(ctx,
		resource.WithAttributes(
			semconv.ServiceNameKey.String(cfg.ServiceName),
			semconv.ServiceVersionKey.String(cfg.ServiceVersion),
			semconv.DeploymentEnvironmentKey.String(cfg.Environment),
		),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create resource: %w", err)
	}

	shutdownTracer, err := initTraceProvider(ctx, res, cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize trace provider: %w", err)
	}

	var shutdownMeter func(context.Context) error
	if cfg.MetricsEnabled {
		shutdownMeter, err = initMeterProvider(ctx, res, cfg)
		if err != nil {
			shutdownTracer(ctx)
			return nil, fmt.Errorf("failed to initialize meter provider: %w", err)
		}
	}

	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))

	slog.Info("OpenTelemetry initialized successfully",
		"service", cfg.ServiceName,
		"environment", cfg.Environment,
		"exporter", cfg.ExporterType,
		"protocol", cfg.ExporterProtocol,
		"metrics_enabled", cfg.MetricsEnabled,
	)

	if cfg.MetricsEnabled {
		if err := InitMetrics(); err != nil {
			return nil, fmt.Errorf("failed to initialize metrics: %w", err)
		}
	}

	shutdown := func(ctx context.Context) error {
		var errs []error
		if shutdownTracer != nil {
			if err := shutdownTracer(ctx); err != nil {
				errs = append(errs, fmt.Errorf("failed to shutdown tracer: %w", err))
			}
		}
		if shutdownMeter != nil {
			if err := shutdownMeter(ctx); err != nil {
				errs = append(errs, fmt.Errorf("failed to shutdown meter: %w", err))
			}
		}
		if len(errs) > 0 {
			return fmt.Errorf("shutdown errors: %v", errs)
		}
		return nil
	}

	return shutdown, nil
}

func initTraceProvider(ctx context.Context, res *resource.Resource, cfg OTELConfig) (func(context.Context) error, error) {
	var exporter sdktrace.SpanExporter
	var err error

	switch cfg.ExporterType {
	case "otlp":
		if cfg.ExporterProtocol == "http" {
			exporter, err = createOTLPTraceExporterHTTP(ctx, cfg)
		} else {
			exporter, err = createOTLPTraceExporterGRPC(ctx, cfg)
		}
	case "stdout":
		exporter, err = stdouttrace.New(stdouttrace.WithPrettyPrint())
	case "none":
		tracerProvider = sdktrace.NewTracerProvider(
			sdktrace.WithResource(res),
		)
		otel.SetTracerProvider(tracerProvider)
		return tracerProvider.Shutdown, nil
	default:
		return nil, fmt.Errorf("unknown exporter type: %s", cfg.ExporterType)
	}

	if err != nil {
		return nil, err
	}

	sampler := getSampler(cfg.TracesSampler, cfg.TracesSamplerArg)

	tracerProvider = sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(res),
		sdktrace.WithSampler(sampler),
	)

	otel.SetTracerProvider(tracerProvider)
	return tracerProvider.Shutdown, nil
}

func initMeterProvider(ctx context.Context, res *resource.Resource, cfg OTELConfig) (func(context.Context) error, error) {
	var exporter sdkmetric.Exporter
	var err error

	switch cfg.ExporterType {
	case "otlp":
		if cfg.ExporterProtocol == "http" {
			exporter, err = createOTLPMetricExporterHTTP(ctx, cfg)
		} else {
			exporter, err = createOTLPMetricExporterGRPC(ctx, cfg)
		}
	case "stdout":
		exporter, err = stdoutmetric.New()
	case "none":
		meterProvider = sdkmetric.NewMeterProvider(
			sdkmetric.WithResource(res),
		)
		otel.SetMeterProvider(meterProvider)
		return meterProvider.Shutdown, nil
	default:
		return nil, fmt.Errorf("unknown exporter type: %s", cfg.ExporterType)
	}

	if err != nil {
		return nil, err
	}

	meterProvider = sdkmetric.NewMeterProvider(
		sdkmetric.WithReader(sdkmetric.NewPeriodicReader(exporter, sdkmetric.WithInterval(60*time.Second))),
		sdkmetric.WithResource(res),
	)

	otel.SetMeterProvider(meterProvider)
	return meterProvider.Shutdown, nil
}

func createOTLPTraceExporterGRPC(ctx context.Context, cfg OTELConfig) (sdktrace.SpanExporter, error) {
	opts := []otlptracegrpc.Option{
		otlptracegrpc.WithEndpoint(cfg.Endpoint),
	}

	if cfg.InsecureConnection {
		opts = append(opts, otlptracegrpc.WithTLSCredentials(insecure.NewCredentials()))
	}

	if len(cfg.Headers) > 0 {
		opts = append(opts, otlptracegrpc.WithHeaders(cfg.Headers))
	}

	return otlptracegrpc.New(ctx, opts...)
}

func createOTLPTraceExporterHTTP(ctx context.Context, cfg OTELConfig) (sdktrace.SpanExporter, error) {
	opts := []otlptracehttp.Option{
		otlptracehttp.WithEndpoint(cfg.Endpoint),
	}

	if cfg.InsecureConnection {
		opts = append(opts, otlptracehttp.WithInsecure())
	}

	if len(cfg.Headers) > 0 {
		opts = append(opts, otlptracehttp.WithHeaders(cfg.Headers))
	}

	return otlptracehttp.New(ctx, opts...)
}

func createOTLPMetricExporterGRPC(ctx context.Context, cfg OTELConfig) (sdkmetric.Exporter, error) {
	opts := []otlpmetricgrpc.Option{
		otlpmetricgrpc.WithEndpoint(cfg.Endpoint),
	}

	if cfg.InsecureConnection {
		opts = append(opts, otlpmetricgrpc.WithTLSCredentials(insecure.NewCredentials()))
	}

	if len(cfg.Headers) > 0 {
		opts = append(opts, otlpmetricgrpc.WithHeaders(cfg.Headers))
	}

	return otlpmetricgrpc.New(ctx, opts...)
}

func createOTLPMetricExporterHTTP(ctx context.Context, cfg OTELConfig) (sdkmetric.Exporter, error) {
	opts := []otlpmetrichttp.Option{
		otlpmetrichttp.WithEndpoint(cfg.Endpoint),
	}

	if cfg.InsecureConnection {
		opts = append(opts, otlpmetrichttp.WithInsecure())
	}

	if len(cfg.Headers) > 0 {
		opts = append(opts, otlpmetrichttp.WithHeaders(cfg.Headers))
	}

	return otlpmetrichttp.New(ctx, opts...)
}

func getSampler(samplerType string, arg float64) sdktrace.Sampler {
	switch samplerType {
	case "always_on":
		return sdktrace.AlwaysSample()
	case "always_off":
		return sdktrace.NeverSample()
	case "traceidratio":
		return sdktrace.TraceIDRatioBased(arg)
	case "parentbased_always_on":
		return sdktrace.ParentBased(sdktrace.AlwaysSample())
	case "parentbased_always_off":
		return sdktrace.ParentBased(sdktrace.NeverSample())
	case "parentbased_traceidratio":
		return sdktrace.ParentBased(sdktrace.TraceIDRatioBased(arg))
	default:
		return sdktrace.ParentBased(sdktrace.AlwaysSample())
	}
}

// LoadConfigFromEnv loads OTEL configuration from environment variables with RF_ prefix
func LoadConfigFromEnv(version string) OTELConfig {
	cfg := OTELConfig{
		Enabled:            getEnvAsBool("RF_OTEL_ENABLED", false),
		Endpoint:           getEnv("RF_OTEL_ENDPOINT", "localhost:4317"),
		ServiceName:        getEnv("RF_OTEL_SERVICE_NAME", "rapidforge"),
		ServiceVersion:     getEnv("RF_OTEL_SERVICE_VERSION", version),
		Environment:        getEnv("RF_OTEL_ENVIRONMENT", getEnv("RF_ENV", "production")),
		TracesSampler:      getEnv("RF_OTEL_TRACES_SAMPLER", "parentbased_always_on"),
		MetricsEnabled:     getEnvAsBool("RF_OTEL_METRICS_ENABLED", true),
		ExporterType:       getEnv("RF_OTEL_EXPORTER_TYPE", "otlp"),
		ExporterProtocol:   getEnv("RF_OTEL_EXPORTER_PROTOCOL", "grpc"),
		InsecureConnection: getEnvAsBool("RF_OTEL_INSECURE", false),
	}

	samplerArgStr := getEnv("RF_OTEL_TRACES_SAMPLER_ARG", "1.0")
	samplerArg, err := strconv.ParseFloat(samplerArgStr, 64)
	if err != nil {
		slog.Warn("Invalid RF_OTEL_TRACES_SAMPLER_ARG, using default 1.0", "value", samplerArgStr)
		samplerArg = 1.0
	}
	cfg.TracesSamplerArg = samplerArg

	headersStr := getEnv("RF_OTEL_HEADERS", "")
	if headersStr != "" {
		cfg.Headers = parseHeaders(headersStr)
	}

	cfg.Endpoint = strings.TrimPrefix(cfg.Endpoint, "https://")
	cfg.Endpoint = strings.TrimPrefix(cfg.Endpoint, "http://")

	if os.Getenv("RF_OTEL_EXPORTER_TYPE") == "" {
		env := getEnv("RF_ENV", "production")
		if env == "development" {
			cfg.ExporterType = "stdout"
		}
	}

	return cfg
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsBool(key string, defaultValue bool) bool {
	valStr := os.Getenv(key)
	if valStr == "" {
		return defaultValue
	}
	val, err := strconv.ParseBool(valStr)
	if err != nil {
		return defaultValue
	}
	return val
}

func parseHeaders(headersStr string) map[string]string {
	headers := make(map[string]string)
	pairs := strings.Split(headersStr, ",")
	for _, pair := range pairs {
		parts := strings.SplitN(strings.TrimSpace(pair), "=", 2)
		if len(parts) == 2 {
			headers[strings.TrimSpace(parts[0])] = strings.TrimSpace(parts[1])
		}
	}
	return headers
}

func GetTracerProvider() *sdktrace.TracerProvider {
	return tracerProvider
}

func GetMeterProvider() *sdkmetric.MeterProvider {
	return meterProvider
}
