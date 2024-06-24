package utils

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"reflect"
	"strconv"

	rflog "github.com/rapidforge-io/rapidforge/logger"
)

// Define a custom type for restricted strings
type AlertType string

// Define constants for allowed values
const (
	Info    AlertType = "primary"
	Success AlertType = "success"
	Error   AlertType = "danger"
	Warning AlertType = "warning"
)

const (
	BlockEntity        string = "block"
	WebhookEntity      string = "webhook"
	PageEntity         string = "page"
	PeriodicTaskEntity string = "periodicTask"
)

func AlertBox(messageType AlertType, message string) string {
	alertTemplate := `
        <sl-alert variant={{.messageType}} open closable duration="2000">
        	{{.message}}
        </sl-alert>`
	t, err := template.New("alertBox").Parse(alertTemplate)

	if err != nil {
		rflog.Error("failed to parse template for alert", err)
	}

	data := map[string]any{
		"messageType": messageType,
		"message":     message,
	}

	var out bytes.Buffer

	t.Execute(&out, data)

	return out.String()
}

func ToastHeader(message string) (string, string) {
	t := map[string]any{"toastEvent": map[string]string{"message": message}}

	jsonMessage, _ := json.Marshal(t)

	return "HX-Trigger", string(jsonMessage)
}

// defaultString returns the default string if the input is empty.
func DefaultHtml(input any, defaultValue string) template.HTML {
	switch v := input.(type) {
	case string:
		return template.HTML(v)
	case sql.NullString:
		if v.Valid && v.String != "" {
			return template.HTML(v.String)
		} else {
			return template.HTML(defaultValue)
		}
	default:
		return template.HTML(defaultValue)
	}
}

func DefaultString(input any, defaultValue string) string {
	switch v := input.(type) {
	case string:
		return v
	case sql.NullString:
		if v.Valid && v.String != "" {
			return v.String
		} else {
			return defaultValue
		}
	default:
		return defaultValue
	}
}

func ParseInt(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return i
}

func ToMap(data any) map[string]any {
	result := make(map[string]any)
	val := reflect.ValueOf(data)

	// Handle pointer to struct
	if val.Kind() == reflect.Ptr {
		val = val.Elem()
	}

	if val.Kind() == reflect.Struct {
		typ := val.Type()
		for i := 0; i < val.NumField(); i++ {
			fieldName := typ.Field(i).Name
			fieldValue := val.Field(i).Interface()
			result[fieldName] = fieldValue
		}
	}

	return result
}

func GetFieldValue(input any, fieldName string) (any, error) {
	val := reflect.ValueOf(input)

	if val.Kind() != reflect.Struct {
		return nil, fmt.Errorf("input is not a struct")
	}

	// Get the field by name
	field := val.FieldByName(fieldName)

	if !field.IsValid() {
		return nil, fmt.Errorf("field '%s' not found in struct", fieldName)
	}

	return field.String(), nil
}

// transformToMaps is the generic function to transform any slice to []map[string]any
func TransformToMaps[T any](items []T, typeName string) []map[string]any {
	var mapBlocks []map[string]any

	for _, item := range items {
		mapBlock := ToMap(item)
		mapBlock["Badges"] = []string{}
		mapBlock["Type"] = typeName

		if typeName == WebhookEntity {
			httpMethod, err := GetFieldValue(item, "HttpMethod")
			if err != nil {
				rflog.Error("failed to get http method", err)
			} else {
				mapBlock["Badges"] = []string{"Hook", httpMethod.(string)}
			}
		}
		mapBlocks = append(mapBlocks, mapBlock)
	}

	return mapBlocks
}
