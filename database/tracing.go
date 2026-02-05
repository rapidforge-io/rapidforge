package database

import (
	"context"
	"database/sql"

	"github.com/jmoiron/sqlx"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"
)

var tracer = otel.Tracer("rapidforge/database")

// TODO: use trace for db statements later on
type TracedDB struct {
	*sqlx.DB
}

func WrapDBWithTracing(db *sqlx.DB) *TracedDB {
	return &TracedDB{DB: db}
}

func (db *TracedDB) ExecContext(ctx context.Context, query string, args ...interface{}) (result sql.Result, err error) {
	ctx, span := tracer.Start(ctx, "db.exec",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			attribute.String("db.system", "sqlite"),
			attribute.String("db.statement", query),
		),
	)
	defer func() {
		if err != nil {
			span.RecordError(err)
			span.SetStatus(codes.Error, err.Error())
		} else {
			span.SetStatus(codes.Ok, "")
		}
		span.End()
	}()

	return db.DB.ExecContext(ctx, query, args...)
}

func (db *TracedDB) QueryContext(ctx context.Context, query string, args ...interface{}) (rows *sqlx.Rows, err error) {
	ctx, span := tracer.Start(ctx, "db.query",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			attribute.String("db.system", "sqlite"),
			attribute.String("db.statement", query),
		),
	)
	defer func() {
		if err != nil {
			span.RecordError(err)
			span.SetStatus(codes.Error, err.Error())
		} else {
			span.SetStatus(codes.Ok, "")
		}
		span.End()
	}()

	return db.DB.QueryxContext(ctx, query, args...)
}

func (db *TracedDB) QueryRowContext(ctx context.Context, query string, args ...interface{}) *sqlx.Row {
	ctx, span := tracer.Start(ctx, "db.query_row",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			attribute.String("db.system", "sqlite"),
			attribute.String("db.statement", query),
		),
	)
	defer span.End()

	return db.DB.QueryRowxContext(ctx, query, args...)
}

// SelectContext executes a select query with tracing
func (db *TracedDB) SelectContext(ctx context.Context, dest interface{}, query string, args ...interface{}) (err error) {
	ctx, span := tracer.Start(ctx, "db.select",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			attribute.String("db.system", "sqlite"),
			attribute.String("db.statement", query),
		),
	)
	defer func() {
		if err != nil {
			span.RecordError(err)
			span.SetStatus(codes.Error, err.Error())
		} else {
			span.SetStatus(codes.Ok, "")
		}
		span.End()
	}()

	return db.DB.SelectContext(ctx, dest, query, args...)
}

func (db *TracedDB) GetContext(ctx context.Context, dest interface{}, query string, args ...interface{}) (err error) {
	ctx, span := tracer.Start(ctx, "db.get",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			attribute.String("db.system", "sqlite"),
			attribute.String("db.statement", query),
		),
	)
	defer func() {
		if err != nil {
			span.RecordError(err)
			span.SetStatus(codes.Error, err.Error())
		} else {
			span.SetStatus(codes.Ok, "")
		}
		span.End()
	}()

	return db.DB.GetContext(ctx, dest, query, args...)
}

func (db *TracedDB) NamedExecContext(ctx context.Context, query string, arg interface{}) (result sql.Result, err error) {
	ctx, span := tracer.Start(ctx, "db.named_exec",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			attribute.String("db.system", "sqlite"),
			attribute.String("db.statement", query),
		),
	)
	defer func() {
		if err != nil {
			span.RecordError(err)
			span.SetStatus(codes.Error, err.Error())
		} else {
			span.SetStatus(codes.Ok, "")
		}
		span.End()
	}()

	return db.DB.NamedExecContext(ctx, query, arg)
}

func (db *TracedDB) BeginTxx(ctx context.Context, opts interface{}) (tx *sqlx.Tx, err error) {
	ctx, span := tracer.Start(ctx, "db.begin_transaction",
		trace.WithSpanKind(trace.SpanKindClient),
		trace.WithAttributes(
			attribute.String("db.system", "sqlite"),
		),
	)
	defer func() {
		if err != nil {
			span.RecordError(err)
			span.SetStatus(codes.Error, err.Error())
		} else {
			span.SetStatus(codes.Ok, "")
		}
		span.End()
	}()

	return db.DB.BeginTxx(ctx, nil)
}
