package models

import (
	"database/sql"
	"reflect"
	"testing"
)

func TestGetEnvVars(t *testing.T) {
	tests := []struct {
		name  string
		input sql.NullString
		want  map[string]string
	}{
		{"empty", sql.NullString{}, map[string]string{}},
		{"simple", sql.NullString{String: "A=1\nB=2", Valid: true}, map[string]string{"A": "1", "B": "2"}},
		{"value with equals", sql.NullString{String: "TOKEN=a=b=c", Valid: true}, map[string]string{"TOKEN": "a=b=c"}},
		{"line without equals is skipped", sql.NullString{String: "A=1\nBROKEN\nB=2", Valid: true}, map[string]string{"A": "1", "B": "2"}},
		{"empty value", sql.NullString{String: "A=", Valid: true}, map[string]string{"A": ""}},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			if got := getEnvVars(tc.input); !reflect.DeepEqual(got, tc.want) {
				t.Errorf("getEnvVars() = %v, want %v", got, tc.want)
			}
		})
	}
}

func TestGetResponseHeaders(t *testing.T) {
	w := &Webhook{ResponseHeaders: sql.NullString{String: "X-A=1\nBROKEN\nX-B=2", Valid: true}}

	want := map[string]string{"X-A": "1", "X-B": "2"}
	if got := w.GetResponseHeaders(); !reflect.DeepEqual(got, want) {
		t.Errorf("GetResponseHeaders() = %v, want %v", got, want)
	}
}

func TestGetExitHttpPair(t *testing.T) {
	w := &Webhook{ExitHttpPair: sql.NullString{String: "1=200;2=404;BROKEN", Valid: true}}

	want := map[int]int{1: 200, 2: 404}
	if got := w.GetExitHttpPair(); !reflect.DeepEqual(got, want) {
		t.Errorf("GetExitHttpPair() = %v, want %v", got, want)
	}
}

func TestGetCors(t *testing.T) {
	if got := (&Webhook{}).GetCors(); !reflect.DeepEqual(got, []string{"*"}) {
		t.Errorf("GetCors() = %v, want [*]", got)
	}

	w := &Webhook{Cors: sql.NullString{String: "https://a.test\nhttps://b.test", Valid: true}}
	want := []string{"https://a.test", "https://b.test"}
	if got := w.GetCors(); !reflect.DeepEqual(got, want) {
		t.Errorf("GetCors() = %v, want %v", got, want)
	}
}
