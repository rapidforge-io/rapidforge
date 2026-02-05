package observability

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"strings"
	"time"

	"github.com/sethvargo/go-envconfig"
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
	Enabled            bool    `env:"RF_OTEL_ENABLED,default=false"`
	Endpoint           string  `env:"RF_OTEL_ENDPOINT,default=localhost:4317"`
	Headers            string  `env:"RF_OTEL_HEADERS"`
	ServiceName        string  `env:"RF_OTEL_SERVICE_NAME,default=rapidforge"`
	ServiceVersion     string  `env:"RF_OTEL_SERVICE_VERSION"`
	Environment        string  `env:"RF_OTEL_ENVIRONMENT"`
	TracesSampler      string  `env:"RF_OTEL_TRACES_SAMPLER,default=parentbased_always_on"`
	TracesSamplerArg   float64 `env:"RF_OTEL_TRACES_SAMPLER_ARG,default=1.0"`
	MetricsEnabled     bool    `env:"RF_OTEL_METRICS_ENABLED,default=true"`
	ExporterType       string  `env:"RF_OTEL_EXPORTER_TYPE,default=otlp"`
	ExporterProtocol   string  `env:"RF_OTEL_EXPORTER_PROTOCOL,default=http"` // "grpc" or "http"
	InsecureConnection bool    `env:"RF_OTEL_INSECURE,default=false"`

	parsedHeaders map[string]string
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

	if len(cfg.parsedHeaders) > 0 {
		opts = append(opts, otlptracegrpc.WithHeaders(cfg.parsedHeaders))
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

	if len(cfg.parsedHeaders) > 0 {
		opts = append(opts, otlptracehttp.WithHeaders(cfg.parsedHeaders))
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

	if len(cfg.parsedHeaders) > 0 {
		opts = append(opts, otlpmetricgrpc.WithHeaders(cfg.parsedHeaders))
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

	if len(cfg.parsedHeaders) > 0 {
		opts = append(opts, otlpmetrichttp.WithHeaders(cfg.parsedHeaders))
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

func LoadConfigFromEnv(ctx context.Context, version string) (OTELConfig, error) {
	var cfg OTELConfig
	if err := envconfig.Process(ctx, &cfg); err != nil {
		return cfg, fmt.Errorf("failed to process OTEL config: %w", err)
	}

	if cfg.ServiceVersion == "" {
		cfg.ServiceVersion = version
	}

	if cfg.Environment == "" {
		if rfEnv := os.Getenv("RF_ENV"); rfEnv != "" {
			cfg.Environment = rfEnv
		} else {
			cfg.Environment = "production"
		}
	}

	if cfg.Headers != "" {
		cfg.parsedHeaders = parseHeaders(cfg.Headers)
	}

	// Clean up endpoint
	cfg.Endpoint = strings.TrimPrefix(cfg.Endpoint, "https://")
	cfg.Endpoint = strings.TrimPrefix(cfg.Endpoint, "http://")

	// Auto-detect exporter type based on environment if not explicitly set
	if os.Getenv("RF_OTEL_EXPORTER_TYPE") == "" && cfg.Environment == "development" {
		cfg.ExporterType = "stdout"
	}

	return cfg, nil
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
